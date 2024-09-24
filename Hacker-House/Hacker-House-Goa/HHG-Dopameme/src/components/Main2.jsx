import React, { useContext,useState } from "react";
import { Context } from "../Context/ContextProvider";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Main2 = () => {
  const navigate = useNavigate();
  const {
    image,
    setImage,
    setLoader,
    imgView,
    setImgView,
    genAi,
    setResult,
    downloadLink,
    context,
    setContext,
    setDownloadLink,
    setRegenerate,
  } = useContext(Context);
  const handleImageToMeme = async () => {
    setLoader(true);

    try {
      const formData = new FormData();
      console.log(context);
      formData.append("image", image);
      formData.append("prompt", context);

      const response = await axios.post(
        "https://memish.onrender.com/uploadphoto",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("response", response.data);

    //   setResult('lvda');
      setResult(response.data.link_preview);

    //   setDownloadLink('lvda');
      setDownloadLink(response.data.link_download);
      setRegenerate('uploadphoto');

      // handleUpload();
      setLoader(false);
      return response.data.link_preview;
    } catch (error) {
      setLoader(false);

      console.error("Error sending POST request:", error);
    }
    };
    
    const [activeButton, setActiveButton] = useState("aiMagic");

    const handleButtonClick = (buttonName) => {
      setActiveButton(buttonName);
    };
  return (
    <div className=" w-full  flex flex-col items-center justify-center ">
      <div className="w-[328px]  flex items-center justify-start p-1 gap-2 mx-auto relative rounded-md bg-black border-white border-[1px] border-solid box-border h-[3.188rem] overflow-hidden text-center text-[1.25rem] text-black font-inter">
        <button
          className={`flex items-center justify-center rounded-[3px] w-[50%] h-[2.563rem] overflow-hidden ${
            activeButton === "aiMagic" ? "bg-white text-black" : "text-white"
          }`}
          onClick={() => handleButtonClick("aiMagic")}
        >
          <div className="w-full h-full flex items-center justify-center leading-[1.25rem] font-medium">
            AI Magic
          </div>
        </button>

        <button
          className={`flex items-center justify-center rounded-[3px] w-[50%] h-[2.563rem] overflow-hidden ${
            activeButton === "prompt" ? "bg-white text-black" : "text-white"
          }`}
          onClick={() => handleButtonClick("prompt")}
        >
          <div className="w-full h-full flex items-center justify-center leading-[1.25rem] font-medium">
            Prompt
          </div>
        </button>
      </div>
      <div className={`${activeButton == "prompt" ? "flex" : "hidden"}`}>
        <input
          value={context}
          onChange={(e) => {
            setContext(e.target.value);
          }}
          placeholder="Describe Your Image"
          className="mt-[45px] w-[328px] leading-[1.25rem] font-medium relative rounded-md bg-[#444] box-border h-[61px] overflow-hidden px-4 text-center text-[1.238rem] text-white placeholder:text-[#606060] font-inter border-[1px] border-solid border-[#828282]"
          type="text"
        />
      </div>

      <div className=" w-full max-w-[819px] flex items-center justify-center relative mt-12  rounded-[18px] bg-[#26262696] h-[27.75rem] overflow-hidden">
        <img
          onClick={() => {
            setImage(null);
            setImgView(null)
            setContext('')
          }}
          className="absolute z-30  right-5 cursor-pointer w-7 h-7 object-cover top-[1rem]"
          src="https://i.imgur.com/nL1U5kH.png"
          alt=""
        />

        <img
          className="w-[90%] mx-auto relative rounded-xl max-w-full overflow-hidden h-[21.813rem] object-cover"
          alt=""
          src={imgView}
        />
      </div>

      <div className="mt-[40px] cursor-pointer">
        <div
          onClick={async () => {
            setLoader(true);
            if (activeButton != "prompt") {
              setContext("");
            }
            let cc = await genAi();
            if (cc) {
              let c = await handleImageToMeme();
              console.log("c", c);
              
              navigate("/output");
            }
            setLoader(false);
          }}
          className="w-[163px] flex items-center justify-center relative rounded-md bg-white box-border h-[3.75rem] overflow-hidden text-center text-[1rem] text-black font-inter border-[1px] border-solid border-white"
        >
          <div className=" leading-[1.25rem] font-semibold">Generate Meme</div>
        </div>
      </div>
    </div>
  );
};

export default Main2;
