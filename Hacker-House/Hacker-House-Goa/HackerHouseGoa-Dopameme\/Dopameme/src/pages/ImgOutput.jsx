import Loader from "@/components/Loader";
import Navbar from "@/components/Navbar";
import React, { useState, useEffect, useRef } from "react";
import { Context } from "../Context/ContextProvider";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import watermarkSrc from "@/assets/watermark.png";

const ImgOutput = () => {
  const navigate = useNavigate();
  const [change, setChange] = useState(0);
  const canvasRef = useRef(null);
  const {
    //   navActiveBar,
    setNavActiveBar,
    account,
    image,
    setImage,
    PostMeme,
    imgView,
    setImgView,
    setLoader,
    loader,
    //   setResultVideo,
    context,
    setContext,
    setDownloadLink,
    result,
    setResult,
    regenerate,
  } = React.useContext(Context);

  const handleImageToMeme = async () => {
    console.log("regenerate",regenerate,context,image)
    setLoader(true);

   
      if (regenerate == 'imgen1') {
        // let _link;
      const formData = { prompt: context };

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
        // _link = response.data.link_preview;

      }
      else if (regenerate=='template') {
        const formData = { prompt: context };
      console.log(context);
      // formData.append("image", image);
      // formData.append("prompt", context);
      
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
      
      

      // handleUpload();
      setLoader(false);
    } 

      else if (regenerate == 'uploadphoto') {
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

           // handleUpload();
           setLoader(false);
         } catch (error) {
           setLoader(false);

           console.error("Error sending POST request:", error);
         }
    }
      setLoader(false);

      
    
  };
  const tweetText =
    "This meme has been built by Dopameme platform developed by #Builders";
  React.useEffect(() => {
    if (!result) {
      // navigate("/home");
      navigate("/meme-input");

    }
  }, [context, result]);

  React.useEffect(() => {
    if (!result) {
      navigate("/meme-input");
    } else {
      setChange((prev) => prev + 1);
    }
  }, [context, result]);

  const loadImage = (src) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "Anonymous";
      img.src = src;
      img.onload = () => resolve(img);
      img.onerror = reject;
    });
  };

  useEffect(() => {
    if (result) {
      console.log("Result is available:", result);

      const drawCanvas = async () => {
        try {
          const canvas = canvasRef.current;
          const ctx = canvas.getContext("2d");

          const mainImg = await loadImage(result);
          const watermarkImg = await loadImage(watermarkSrc);

          console.log("Main image and watermark loaded");

          canvas.width = mainImg.width + 250;
          canvas.height = mainImg.height + 676;

          ctx.fillStyle = "white";
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(mainImg, 125, 128);

          const watermarkWidth = canvas.width;
          const watermarkHeight = 540;
          const watermarkX = 0;
          const watermarkY = canvas.height - watermarkHeight;

          ctx.drawImage(
            watermarkImg,
            watermarkX,
            watermarkY,
            watermarkWidth,
            watermarkHeight
          );
          console.log("Watermark drawn at", watermarkX, watermarkY);
        } catch (error) {
          console.error("Failed to load images:", error);
        }
      };

      drawCanvas();
    }
  }, [result]);

  const downloadCanvas = () => {
    const canvas = canvasRef.current;
    const dataURL = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = dataURL;
    link.download = "canvas-image.png";
    link.click();
  };

  useEffect(() => {
    setNavActiveBar("Gen Memes");
  }, []);
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

      <div>
        <div className="w-full py-10 mx-auto flex items-center justify-center max-w-[819px] relative rounded-[18px] bg-[#26262696]  overflow-hidden">
          {/* <img
            className=" rounded-xl h-[21.813rem] object-cover"
            alt=""
            src="https://i.imgur.com/xvbQcXq.png"
          /> */}
          <canvas
            ref={canvasRef}
            // className="w-[500px] object-cover"
            className="w-[60%]  mx-auto relative rounded-xl max-w-full   object-contain"
            style={{
              // width: "300px",
              // objectFit: "cover",
              border: "1px solid black",
            }}
          />
        </div>
      </div>
      {context && (
        <div className={` col-span-12 mt-10`}>
          <div
            className="w-[60%] mx-auto relative flex items-center justify-center rounded-md bg-darkslategray border-gray border-[1px] border-solid box-border p-4
         overflow-hidden text-left text-[1.125rem] text-white font-inter"
          >
            <div className=" leading-[1.25rem] flex items-center w-[95%]">
              {context}
            </div>
          </div>
        </div>
      )}

      <div className=" mt-7  gap-[18px] flex items-center justify-center ">
        <div
          onClick={handleImageToMeme}
          className="w-[150px]  cursor-pointer hover:scale-105 hover:opacity-80 transition-all duration-200 flex items-center justify-center text-black relative rounded-[7px] bg-[#fff] border-[#819963] border-t-[2px]  border-r-[2px] border-l-[2px] border-solid box-border h-[3.063rem] overflow-hidden text-center text-[0.875rem]  font-inter"
        >
          <b className=" leading-[1.25rem]">{`Regenerate`}</b>
        </div>
        <div
          onClick={downloadCanvas}
          className="w-[150px]  cursor-pointer hover:scale-105 hover:opacity-80 transition-all duration-200 flex items-center justify-center text-black relative rounded-[7px] bg-[#fff] border-[#819963] border-t-[2px]  border-r-[2px] border-l-[2px] border-solid box-border h-[3.063rem] overflow-hidden text-center text-[0.875rem]  font-inter"
        >
          <b className=" leading-[1.25rem]">{`Download`}</b>
        </div>
        <a
          target="_blank"
          href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
            tweetText
          )}&url=${encodeURIComponent(result)}`}
        >
          <div className="w-[150px]  cursor-pointer hover:scale-105 hover:opacity-80 transition-all duration-200 flex items-center justify-center relative rounded-[7px] bg-[#1d9bf0] border-[#a1c2ff] border-t-[1px]  border-r-[1px]  border-l-[1px] border-solid box-border h-[3.063rem] overflow-hidden text-center text-[0.875rem] text-white font-inter">
            <b className=" leading-[1.25rem]">{`Share it on X `}</b>
          </div>
        </a>
        <div
          onClick={async () => {
            await PostMeme(`*generated by Dopameme*`, result, setLoader);
            // navigate('/explore')
          }}
          className="w-[150px]  cursor-pointer hover:scale-105 hover:opacity-80 transition-all duration-200 flex items-center justify-center relative rounded-[7px] bg-[#1d9bf0] border-[#a1c2ff] border-t-[1px]  border-r-[1px]  border-l-[1px] border-solid box-border h-[3.063rem] overflow-hidden text-center text-[0.875rem] text-white font-inter"
        >
          <b className=" leading-[1.25rem]">{`Post `}</b>
        </div>
      </div>
    </div>
  );
};

export default ImgOutput;
