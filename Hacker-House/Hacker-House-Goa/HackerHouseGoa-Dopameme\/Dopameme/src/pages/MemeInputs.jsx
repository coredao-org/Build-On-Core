import Navbar from '@/components/Navbar'
import React, { useState, useEffect } from 'react'
import { Context } from "../Context/ContextProvider";
import Main2 from '@/components/Main2';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Loader from '@/components/Loader';


const MemeInputs = () => {
  const {
    setNavActiveBar,
    image,
    setImage,
    setImgView,
    setLoader,
    loader,
    setResultVideo,
    context,
    setContext,
    setDownloadLink,
    setResult,
    memeType,
    genAi,
    setMemeType,
    regenerate,
    setRegenerate,
  } = React.useContext(Context);
  const cameraRef = React.useRef(null);
  const [video, setVideo] = useState(null)

  const navigate = useNavigate();

 const handleImageToMeme = async () => {
   setLoader(true);
   let _link;

   try {
     const formData = new FormData();
     console.log(context);
     // formData.append("image", image);
     formData.append("prompt", context);
     if (activeButton == "prompt") {
       const response = await axios.post(
         "https://memish.onrender.com/video",
         formData,
         {
           headers: {
             "Content-Type": "application/json",
           },
         }
       );
       console.log("response", response.data);

       //   setResult('lvda');
       setResultVideo(response.data.link_preview);

       //   setDownloadLink('lvda');
       setDownloadLink(response.data.link_download);
       _link = response.data.link_preview;
       setResultVideo(_link);
       setRegenerate("video");

       // handleUpload();
     } else {
       //   const _formData = new FormData();
       formData.append("video", video);
       console.log("cl", formData);
       const response = await axios.post(
         "https://memish.onrender.com/uploadvideo_meme",
         formData,
         {
           headers: {
             "Content-Type": "multipart/form-data",
           },
         }
       );
       console.log("response", response.data);

       //   setResult('lvda');
      //  setResultVideo(response.data.link_preview);

       //   setDownloadLink('lvda');
       setDownloadLink(response.data.link_download);
       _link = response.data.link_preview;
       setResultVideo(_link);
       setRegenerate("uploadvideo_meme");

       // handleUpload();
     }

     setLoader(false);
     return _link;
   } catch (error) {
     setLoader(false);

     console.error("Error sending POST request:", error);
   }
  };
  useEffect(() => {
    if (memeType == 1) {
      setActiveMeme("promptToMeme");
    }
    else if (memeType == 3) {
      setActiveMeme("animeOp");
      
    }
    else if (memeType == 2) {
      setActiveMeme("videoMeme");
    }
    else if (memeType == 4) {
      setActiveMeme("templateMeme");
    }
   }, []);
  const [activeButton, setActiveButton] = useState("video");
  const [activeButton1, setActiveButton1] = useState("prompt");
  // const [activeButton2, setActiveButton2] = useState("video");
  const [activeMeme, setActiveMeme] = useState('imgToImg');

  const handleCameraClick = () => {
    cameraRef.current.click();
  };

    const handlePromptToMeme = async () => {
      setLoader(true);
      let _link;

      try {
        const formData = { prompt: context };
        console.log(context);
        // formData.append("image", image);
        // formData.append("prompt", context);
        if (activeButton == "template") {
          const response = await axios.post(
            "https://memish.onrender.com/template",
            formData,
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          console.log("response", response.data);

          //   setResult('lvda');
          setResult(response.data.link_preview);

          //   setDownloadLink('lvda');
          setDownloadLink(response.data.link_download);
          _link = response.data.link_preview;
                 setRegenerate("template");

          // handleUpload();
        } else {
          const response = await axios.post(
            "https://memish.onrender.com/imgen1",
            formData,
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          console.log("response", response.data);

          //   setResult('lvda');
          setResult(response.data.link_preview);

          //   setDownloadLink('lvda');
          setDownloadLink(response.data.link_download);
          _link = response.data.link_preview;

          // handleUpload();
                 setRegenerate("imgen1");

        }

        setLoader(false);
        return _link;
      } catch (error) {
        setLoader(false);

        console.error("Error sending POST request:", error);
      }
    };

   const handleImageChange = (event) => {
     const file = event.target.files[0];
     setImage(file);
     if (file) {
       const reader = new FileReader();
       reader.onloadend = () => {
         // setImage(reader.result);
         setImgView(reader.result);
       };
       reader.readAsDataURL(file);
     }
   };

  useEffect(() => {
    
  setNavActiveBar("Gen Memes");
   
  }, [])
  
  return (
    <div className=" bg-[#030214] pb-20 flex flex-col">
      {/* loader */}
      <div
        className={` top-0 left-0 w-full h-full z-40 backdrop-filter backdrop-blur-sm ${
          loader ? "fixed" : "hidden"
        } `}
      >
        <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 flex flex-col items-center justify-center min-h-[70vh] ">
          <Loader run={loader} />
        </div>
      </div>
      {/* loader end*/}
      <div>
        <Navbar />
      </div>

      {/* main section gap-[79px] px-[81px] */}
      <div className="flex relative w-full  py-10">
        <div className="w-[20%] flex flex-col gap-[51px]">
          <div className="flex items-start justify-center gap-[51px]">
            <div
              onClick={() => {
                setContext("");
                setImage("");
                setResult('')
                // setResultVideo('')
                setActiveMeme("imgToImg");
              }}
              className={` w-[147px] relative flex items-start justify-center   border-solid box-border p-3 ${
                activeMeme == "imgToImg"
                  ? "text-[#081e20] border-[#396600] bg-[#acff43]"
                  : "text-[#fff] border-[#396600] bg-[#081e20]"
              }  cursor-pointer hover:scale-105 hover:opacity-80 transition-all duration-200  border-[5px] `}
            >
              <b className=" text-[0.875rem]">IMG TO IMG</b>
            </div>
          </div>
          <div className="flex items-start justify-center gap-[51px]">
            <div
              onClick={() => {
                setContext("");
                    setResult("");
                    // setResultVideo("");
                setActiveMeme("promptToMeme");
              }}
              className={` w-[147px] relative flex items-start justify-center   border-solid box-border p-3 ${
                activeMeme == "promptToMeme"
                  ? "text-[#081e20] border-[#396600] bg-[#acff43]"
                  : "text-[#fff] border-[#396600] bg-[#081e20]"
              }  cursor-pointer hover:scale-105 hover:opacity-80 transition-all duration-200  border-[5px] `}
            >
              <b className="text-[0.875rem]">Prompt to Ai </b>
            </div>
          </div>
          <div className="flex items-start justify-center gap-[51px]">
            <div
              onClick={() => {
                setContext("");
                    setResult("");
                    // setResultVideo("");
                setActiveMeme("animeOp");
              }}
              className={` w-[147px] relative flex items-start justify-center   border-solid box-border p-3 ${
                activeMeme == "animeOp"
                  ? "text-[#081e20] border-[#396600] bg-[#acff43]"
                  : "text-[#fff] border-[#396600] bg-[#081e20]"
              }  cursor-pointer hover:scale-105 hover:opacity-80 transition-all duration-200  border-[5px] `}
            >
              <b className="text-[0.875rem]">Anime Op</b>
            </div>
          </div>
          <div className="flex items-start justify-center gap-[51px]">
            <div
              onClick={() => {
                setVideo(null);
                setContext("");
                    setResult("");
                    // setResultVideo("");
                setActiveMeme("videoMeme");
              }}
              className={` w-[147px] relative flex items-start justify-center   border-solid box-border p-3 ${
                activeMeme == "videoMeme"
                  ? "text-[#081e20] border-[#396600] bg-[#acff43]"
                  : "text-[#fff] border-[#396600] bg-[#081e20]"
              }  cursor-pointer hover:scale-105 hover:opacity-80 transition-all duration-200  border-[5px] `}
            >
              <b className="text-[0.875rem]">Video Meme</b>
            </div>
          </div>

          <div className="flex items-start justify-center gap-[51px]">
            <div
              onClick={() => {
                setContext("");
                    setResult("");
                    // setResultVideo("");
                setActiveMeme("templateMeme");
              }}
              className={` w-[147px] relative flex items-start justify-center   border-solid box-border p-3 ${
                activeMeme == "templateMeme"
                  ? "text-[#081e20] border-[#396600] bg-[#acff43]"
                  : "text-[#fff] border-[#396600] bg-[#081e20]"
              }  cursor-pointer hover:scale-105 hover:opacity-80 transition-all duration-200  border-[5px] `}
            >
              <b className="text-[0.875rem]">Template Meme</b>
            </div>
          </div>
        </div>
        <div className="w-[60%] flex flex-col items-center">
          {/* for img to img */}
          {activeMeme === "imgToImg" &&
            (image ? (
              <Main2 />
            ) : (
              <div className="w-full max-w-[819px] flex items-center justify-center relative rounded-[18px] bg-[#26262696] h-[27.75rem] overflow-hidden text-center text-[1.438rem] text-black font-inter">
                <div className="w-[90%] mx-auto bg-[#82828285] relative rounded-[15px] box-border h-[17.563rem] overflow-hidden text-center text-[1.438rem] text-black font-inter border-[1px] border-dashed border-white">
                  <div className="flex flex-col h-full w-full items-center justify-evenly">
                    <div id="fromDevice" onClick={handleCameraClick}>
                      <img
                        className="w-[190px] h-[60px] object-cover bg-none"
                        alt=""
                        src="https://i.imgur.com/y47Uf9w.png"
                      />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                        ref={cameraRef}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          {/* for prompt to meme */}
          {(activeMeme == "promptToMeme" ||
            activeMeme == "animeOp" ||
            activeMeme == "templateMeme") && (
            <div className="w-full flex flex-col py-5 gap-8 items-center justify-center max-w-[816px] relative rounded-[18px] bg-[#26262696] h-[23.563rem] overflow-hidden text-center text-[1.25rem] text-black font-inter">
              <div className="w-[328px]  flex  items-center justify-start p-1 gap-2 mx-auto relative rounded-md bg-black border-white border-[1px] border-solid box-border h-[3.188rem] overflow-hidden text-center text-[1.25rem] text-black font-inter">
                <button
                  className={`flex items-center justify-center rounded-[3px] w-[50%] h-[2.563rem] overflow-hidden ${
                    activeButton1 === "prompt"
                      ? "bg-white text-black"
                      : "text-white"
                  }`}
                  onClick={() => setActiveButton1("prompt")}
                >
                  <div className="w-full h-full flex items-center justify-center leading-[1.25rem] font-medium">
                    Prompt
                  </div>
                </button>

                <button
                  className={`flex items-center justify-center rounded-[3px] w-[50%] h-[2.563rem] overflow-hidden ${
                    activeButton1 === "template"
                      ? "bg-white text-black"
                      : "text-white"
                  }`}
                  onClick={() => setActiveButton1("template")}
                >
                  <div className="w-full h-full flex items-center justify-center leading-[1.25rem] font-medium">
                    Select Temp
                  </div>
                </button>
              </div>

              <div className=" leading-[1.25rem] text-white   w-[80%] max-w-[768px]  relative rounded-md bg-[#444] border-[#828282] border-[1px] border-solid box-border h-[10rem] overflow-hidden text-left text-[1.125rem] placeholder:text-[#606060] font-inter">
                <textarea
                  value={context}
                  onChange={(e) => {
                    setContext(e.target.value);
                  }}
                  placeholder="I entering my 20th hackathon be like"
                  className=" w-full h-full bg-transparent p-2 outline-none"
                  type="text"
                  name=""
                  id=""
                />
              </div>
              <div className="mt-[10px]  cursor-pointer hover:scale-105 hover:opacity-80 transition-all duration-200">
                <div
                  onClick={async () => {
                    setLoader(true);
                    if (activeButton1 != "prompt") {
                      setContext("");
                    }
                   
                      let cc = await genAi();
                      if (cc) {
                        let c = await handlePromptToMeme();
                        console.log("c", c);
                        navigate("/output");
                      }
                      setLoader(false);
                    
                  }}
                  className="w-[163px] flex items-center justify-center relative rounded-md bg-white box-border h-[3.75rem] overflow-hidden text-center text-[1rem] text-black font-inter border-[1px] border-solid border-white"
                >
                  <div className=" leading-[1.25rem] font-semibold">
                    Generate Meme
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeMeme == "videoMeme" &&
            (activeButton == "video" ? (
              <>
                {/* dual toggle button */}
                <div>
                  {activeMeme == "videoMeme" && (
                    <div className="w-[328px]  flex items-center justify-start p-1 gap-2 mx-auto relative rounded-md bg-black border-white border-[1px] border-solid box-border h-[3.188rem] overflow-hidden text-center text-[1.25rem] text-black font-inter">
                      <button
                        className={`flex items-center justify-center rounded-[3px] w-[50%] h-[2.563rem] overflow-hidden ${
                          activeButton === "video"
                            ? "bg-white text-black"
                            : "text-white"
                        }`}
                        onClick={() => setActiveButton("video")}
                      >
                        <div className="w-full h-full flex items-center justify-center leading-[1.25rem] font-medium">
                          Video
                        </div>
                      </button>

                      <button
                        className={`flex items-center justify-center rounded-[3px] w-[50%] h-[2.563rem] overflow-hidden ${
                          activeButton === "prompt"
                            ? "bg-white text-black"
                            : "text-white"
                        }`}
                        onClick={() => setActiveButton("prompt")}
                      >
                        <div className="w-full h-full flex items-center justify-center leading-[1.25rem] font-medium">
                          Prompt
                        </div>
                      </button>
                    </div>
                  )}
                  {activeMeme == "promptToAi" && (
                    <div className="w-[328px]  flex items-center justify-start p-1 gap-2 mx-auto relative rounded-md bg-black border-white border-[1px] border-solid box-border h-[3.188rem] overflow-hidden text-center text-[1.25rem] text-black font-inter">
                      <button
                        className={`flex items-center justify-center rounded-[3px] w-[50%] h-[2.563rem] overflow-hidden ${
                          activeButton === "aiMagic"
                            ? "bg-white text-black"
                            : "text-white"
                        }`}
                        onClick={() => setActiveButton("aiMagic")}
                      >
                        <div className="w-full h-full flex items-center justify-center leading-[1.25rem] font-medium">
                          AI Magic
                        </div>
                      </button>

                      <button
                        className={`flex items-center justify-center rounded-[3px] w-[50%] h-[2.563rem] overflow-hidden ${
                          activeButton === "prompt"
                            ? "bg-white text-black"
                            : "text-white"
                        }`}
                        onClick={() => setActiveButton("prompt")}
                      >
                        <div className="w-full h-full flex items-center justify-center leading-[1.25rem] font-medium">
                          Prompt
                        </div>
                      </button>
                    </div>
                  )}
                </div>
                {/* dual toggle button end*/}
                <div
                  className={`${activeButton == "prompt" ? "flex" : "flex"}`}
                >
                  <input
                    value={context}
                    onChange={(e) => {
                      setContext(e.target.value);
                    }}
                    placeholder="Describe Your Meme"
                    className="mt-[50px] w-[328px] leading-[1.25rem] font-medium relative rounded-md bg-[#444] box-border h-[61px] overflow-hidden px-1 text-center text-[1.238rem] text-white placeholder:text-[#606060] font-inter border-[1px] border-solid border-[#828282]"
                    type="text"
                  />
                </div>

                <div
                  className={`${
                    activeButton != "prompt" ? "flex" : "hidden"
                  } flex items-center justify-center `}
                >
                  <input
                    type="file"
                    accept="video/*"
                    onChange={(e) => setVideo(e.target.files[0])}
                    className="my-[50px] w-[328px] leading-[1.25rem] font-medium relative rounded-md p-7  bg-[#444] box-border h-[101px] overflow-hidden px-4 text-center text-[1.238rem] text-white placeholder:text-[#606060] font-inter border-[1px] border-solid border-[#828282]"
                  />
                </div>

                <div className="mt-[73px] cursor-pointer">
                  <div
                    onClick={async () => {
                      setLoader(true);
 let cc = await genAi();
 if (cc) {
   
   let c = await handleImageToMeme();
   console.log("c", c);
   
   navigate("/vid-output");
  }
  setLoader(false);
                    }}
                    className="w-[225px] flex items-center justify-center relative rounded-md bg-white box-border h-[3.75rem] overflow-hidden text-center text-[1.438rem] text-black font-inter border-[1px] border-solid border-white"
                  >
                    <div className=" leading-[1.25rem] font-medium">
                      Generate Meme
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* dual toggle button */}
                <div>
                  {activeMeme == "videoMeme" && (
                    <div className="w-[328px]  flex items-center justify-start p-1 gap-2 mx-auto relative rounded-md bg-black border-white border-[1px] border-solid box-border h-[3.188rem] overflow-hidden text-center text-[1.25rem] text-black font-inter">
                      <button
                        className={`flex items-center justify-center rounded-[3px] w-[50%] h-[2.563rem] overflow-hidden ${
                          activeButton === "video"
                            ? "bg-white text-black"
                            : "text-white"
                        }`}
                        onClick={() => setActiveButton("video")}
                      >
                        <div className="w-full h-full flex items-center justify-center leading-[1.25rem] font-medium">
                          Video
                        </div>
                      </button>

                      <button
                        className={`flex items-center justify-center rounded-[3px] w-[50%] h-[2.563rem] overflow-hidden ${
                          activeButton === "prompt"
                            ? "bg-white text-black"
                            : "text-white"
                        }`}
                        onClick={() => setActiveButton("prompt")}
                      >
                        <div className="w-full h-full flex items-center justify-center leading-[1.25rem] font-medium">
                          Prompt
                        </div>
                      </button>
                    </div>
                  )}
                  {activeMeme == "promptToAi" && (
                    <div className="w-[328px]  flex items-center justify-start p-1 gap-2 mx-auto relative rounded-md bg-black border-white border-[1px] border-solid box-border h-[3.188rem] overflow-hidden text-center text-[1.25rem] text-black font-inter">
                      <button
                        className={`flex items-center justify-center rounded-[3px] w-[50%] h-[2.563rem] overflow-hidden ${
                          activeButton === "aiMagic"
                            ? "bg-white text-black"
                            : "text-white"
                        }`}
                        onClick={() => setActiveButton("aiMagic")}
                      >
                        <div className="w-full h-full flex items-center justify-center leading-[1.25rem] font-medium">
                          AI Magic
                        </div>
                      </button>

                      <button
                        className={`flex items-center justify-center rounded-[3px] w-[50%] h-[2.563rem] overflow-hidden ${
                          activeButton === "prompt"
                            ? "bg-white text-black"
                            : "text-white"
                        }`}
                        onClick={() => setActiveButton("prompt")}
                      >
                        <div className="w-full h-full flex items-center justify-center leading-[1.25rem] font-medium">
                          Prompt
                        </div>
                      </button>
                    </div>
                  )}
                </div>
                {/* dual toggle button end*/}{" "}
                <div
                  className={`${activeButton == "prompt" ? "flex" : "flex"}`}
                >
                  <input
                    value={context}
                    onChange={(e) => {
                      setContext(e.target.value);
                    }}
                    placeholder="Describe Your Meme"
                    className="mt-[50px] w-[328px] leading-[1.25rem] font-medium relative rounded-md bg-[#444] box-border h-[61px] overflow-hidden px-1 text-center text-[1.238rem] text-white placeholder:text-[#606060] font-inter border-[1px] border-solid border-[#828282]"
                    type="text"
                  />
                </div>
                <div
                  className={`${
                    activeButton != "prompt" ? "flex" : "hidden"
                  } flex items-center justify-center `}
                >
                  <input
                    type="file"
                    accept="video/*"
                    onChange={(e) => setVideo(e.target.files[0])}
                    className="my-[50px] w-[328px] leading-[1.25rem] font-medium relative rounded-md p-7  bg-[#444] box-border h-[101px] overflow-hidden px-4 text-center text-[1.238rem] text-white placeholder:text-[#606060] font-inter border-[1px] border-solid border-[#828282]"
                  />
                </div>
                <div className="mt-[73px] cursor-pointer">
                  <div
                    onClick={async () => {
                      setLoader(true);
 let cc = await genAi();
 if (cc) {
   let c = await handleImageToMeme();
   console.log("c", c);
   
   navigate("/vid-output");
  }
  setLoader(false);
                    }}
                    className="w-[225px] flex items-center justify-center relative rounded-md bg-white box-border h-[3.75rem] overflow-hidden text-center text-[1.438rem] text-black font-inter border-[1px] border-solid border-white"
                  >
                    <div className=" leading-[1.25rem] font-medium">
                      Generate Meme
                    </div>
                  </div>
                </div>
              </>
            ))}
        </div>
        <div className="w-[20%]"></div>
      </div>
    </div>
  );
}

export default MemeInputs
