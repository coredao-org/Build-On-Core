import * as React from "react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Context } from "../Context/ContextProvider";
import { DynamicWidget } from "@dynamic-labs/sdk-react-core";
import { CoolMode } from "@/components/magicui/cool-mode";
import Loader from "@/components/Loader";
import RegisterModal from "@/components/RegisterModal";
import DopamemeCarousel from "@/components/Carousel";
import Footer from "@/components/Footer";

export default function Dashboard() {
  const navigate = useNavigate();
  const {
    navActiveBar,
    setNavActiveBar,
    account,
    data,
    loader,
    setReload,
    read,
  } = React.useContext(Context);

  const [activeButton, setActiveButton] = useState("Home");

  const handleButtonClick = (buttonName) => {
    setActiveButton(buttonName);
    setNavActiveBar(buttonName);
  };
  return (
    <div className="flex overflow-hidden flex-col   pt-5 bg-slate-950 pb-[0px] max-md:pb-24">
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
      {/* Register Popup */}
      <div
        className={` top-0 left-0 w-full h-full z-40 backdrop-filter backdrop-blur-sm ${
          data?.get_user_profile == null && account && read > 0
            ? "fixed"
            : "hidden"
        } `}
      >
        <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center justify-center min-h-[70vh] ">
          <RegisterModal reload={setReload} />
        </div>
      </div>
      <div className="flex flex-col  ml-10 w-full  max-md:max-w-full">
        <div className="self-stretch w-full max-md:max-w-full">
          {/* navbar
           */}
          <div className="flex  max-md:flex-col">
            <div className="flex flex-col w-[17%] max-md:ml-0 max-md:w-full">
              <img
                draggable={`false`}
                loading="lazy"
                srcSet="https://cdn.builder.io/api/v1/image/assets/TEMP/33af5a984c84fc157cfdabe710ddf82e46a1115dd6e16902aa6e8fc0e20df9cf?apiKey=b93734ecdcb94378af862d5b2ec71620&&apiKey=b93734ecdcb94378af862d5b2ec71620&width=100 100w, https://cdn.builder.io/api/v1/image/assets/TEMP/33af5a984c84fc157cfdabe710ddf82e46a1115dd6e16902aa6e8fc0e20df9cf?apiKey=b93734ecdcb94378af862d5b2ec71620&&apiKey=b93734ecdcb94378af862d5b2ec71620&width=200 200w, https://cdn.builder.io/api/v1/image/assets/TEMP/33af5a984c84fc157cfdabe710ddf82e46a1115dd6e16902aa6e8fc0e20df9cf?apiKey=b93734ecdcb94378af862d5b2ec71620&&apiKey=b93734ecdcb94378af862d5b2ec71620&width=400 400w, https://cdn.builder.io/api/v1/image/assets/TEMP/33af5a984c84fc157cfdabe710ddf82e46a1115dd6e16902aa6e8fc0e20df9cf?apiKey=b93734ecdcb94378af862d5b2ec71620&&apiKey=b93734ecdcb94378af862d5b2ec71620&width=800 800w, https://cdn.builder.io/api/v1/image/assets/TEMP/33af5a984c84fc157cfdabe710ddf82e46a1115dd6e16902aa6e8fc0e20df9cf?apiKey=b93734ecdcb94378af862d5b2ec71620&&apiKey=b93734ecdcb94378af862d5b2ec71620&width=1200 1200w, https://cdn.builder.io/api/v1/image/assets/TEMP/33af5a984c84fc157cfdabe710ddf82e46a1115dd6e16902aa6e8fc0e20df9cf?apiKey=b93734ecdcb94378af862d5b2ec71620&&apiKey=b93734ecdcb94378af862d5b2ec71620&width=1600 1600w, https://cdn.builder.io/api/v1/image/assets/TEMP/33af5a984c84fc157cfdabe710ddf82e46a1115dd6e16902aa6e8fc0e20df9cf?apiKey=b93734ecdcb94378af862d5b2ec71620&&apiKey=b93734ecdcb94378af862d5b2ec71620&width=2000 2000w, https://cdn.builder.io/api/v1/image/assets/TEMP/33af5a984c84fc157cfdabe710ddf82e46a1115dd6e16902aa6e8fc0e20df9cf?apiKey=b93734ecdcb94378af862d5b2ec71620&&apiKey=b93734ecdcb94378af862d5b2ec71620"
                className="object-contain grow shrink-0 max-w-full aspect-[1.33] w-[162px] max-md:mt-10"
              />
            </div>
            <div className="flex flex-col ml-5 mx-auto w-full max-md:ml-0 max-md:w-full">
              <div className="flex  w-max  relative right-36 gap-10 justify-between items-center  m-auto  min-w-[320px] max-md:mt-10 max-md:max-w-full">
                {/* <div className="flex items-center  self-stretch my-auto min-w-[240px] w-[446px] max-md:max-w-full">
                  <div className="flex items-start gap-4 self-stretch my-auto min-w-[240px] w-[446px] max-md:max-w-full">
                    <div className="overflow-hidden cursor-pointer gap-2 self-stretch px-4 py-1.5 whitespace-nowrap  ">
                      Home
                    </div>
                    <div className="flex items-start min-w-[240px]">
                      <div className="overflow-hidden  cursor-pointer hover:scale-105   transition-all duration-200 gap-2 self-stretch px-4 py-1.5    backdrop-blur-[10px] rounded-[99px]">
                        Explore Memes
                      </div>
                      <div className="overflow-hidden  cursor-pointer hover:scale-105   transition-all duration-200 gap-2 self-stretch px-4 py-1.5    backdrop-blur-[10px] rounded-[99px]">
                        Generate Memes
                      </div>
                    </div>
                    <div className="overflow-hidden  cursor-pointer hover:scale-105   transition-all duration-200 gap-2 self-stretch px-4 py-1.5 whitespace-nowrap    backdrop-blur-[10px] rounded-[99px]">
                      Docs
                    </div>
                  </div>
                </div>
                <div className="flex  cursor-pointer hover:scale-105   transition-all duration-200 items-center self-stretch my-auto">
                  <DynamicWidget />
                </div> */}
                <div className="w-full py-5 flex gap-2 items-center justify-evenly relative border-white border-[1px] border-dashed box-border h-[2.838rem] overflow-hidden text-left text-[1.375rem] text-[#7b7b7b] font-bebas-neue">
                  <div
                    className={`w-max h-max capitalize ${
                      activeButton === "Home" ? "text-white" : ""
                    }`}
                    onClick={() => handleButtonClick("Home")}
                  >
                    {" "}
                    Home
                  </div>
                  <div
                    className={`w-max h-max capitalize   cursor-pointer hover:scale-105 hover:opacity-80 transition-all duration-200 ${
                      activeButton === "Explore" ? "text-white" : ""
                    }`}
                    onClick={() => {
                      handleButtonClick("Explore");
                      navigate("/explore");
                    }}
                  >
                    {" "}
                    Explore
                  </div>
                  <div
                    className={`w-max h-max capitalize  cursor-pointer hover:scale-105 hover:opacity-80 transition-all duration-200 ${
                      activeButton === "Gen Memes" ? "text-white" : ""
                    }`}
                    onClick={() => {
                      handleButtonClick("Gen Memes");
                      navigate("/gen-memes");
                    }}
                  >
                    {" "}
                    Gen Memes
                  </div>
                  <div
                    className={`w-max h-max capitalize  cursor-pointer hover:scale-105 hover:opacity-80 transition-all duration-200 ${
                      activeButton === "Games" ? "text-white" : ""
                    }`}
                    onClick={() => {
                      handleButtonClick("Games");
                      navigate("/games");
                    }}
                  >
                    {" "}
                    Games
                  </div>
                </div>
              </div>
              {/* wallet */}
              <div className="absolute right-24 top-14">
                {account ? (
                  <div>
                    {/* <div className=" relative  cursor-pointer hover:scale-105 hover:opacity-80 transition-all duration-200  border-white border-[1px] px-6 py-[6px] border-dashed box-border h-[2.838rem]  overflow-hidden text-left text-[1.375rem]  font-bebas-neue"> */}
                    {/* <div
                      onClick={() => {
                        handleButtonClick("profile");
                        navigate("/profile");
                      }}
                      className={`w-max h-max  cursor-pointer hover:scale-105 hover:opacity-80 transition-all duration-200 capitalize ${
                        navActiveBar === "profile"
                          ? "text-white"
                          : "text-[#7b7b7b]"
                      }`}
                    >
                      profile
                    </div> */}
                    <div className="">
                      <DynamicWidget />
                    </div>
                  </div>
                ) : (
                  <div>
                    <DynamicWidget />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="mt-[9.0625rem]  text-2xl text-white max-md:mt-10 max-md:mr-2.5 max-md:max-w-full max-md:text-4xl">
          <div className="">
            <img
              draggable={`false`}
              className=" h-[532px] top-7 left-0  absolute"
              src="https://i.imgur.com/EUO1etj.png"
              alt=""
            />
            <img
              draggable={`false`}
              className=" h-[532px] top-[290px] right-0  absolute"
              src="https://i.imgur.com/uwBYLKk.png"
              alt=""
            />
          </div>
          <img
            draggable={`false`}
            className=" w-[751px] mx-auto"
            src="https://i.imgur.com/C7FYmRJ.png"
            alt=""
          />
        </div>
        {/* laugh button */}
        <div className="relative cursor-pointer max-w-[324px] mx-auto flex mt-20 justify-center rounded-xl border-[#F9E000] border-[0.7px] border-dashed box-border">
          <CoolMode
            options={{
              particle: "https://i.imgur.com/yQ6d6MG.png",
            }}
          >
            {/* <Button>Click Me!</Button> */}
            <div
              style={{ userSelect: "none" }}
              className="flex relative overflow-hidden flex-col justify-center self-center px-2 py-1.5  w-full text-2xl tracking-tighter text-black rounded-xl max-w-[338px]"
            >
              <div
                onKeyUpCapture={() => {
                  navigate("/explore");
                }}
                onClick={() => {
                  navigate("/explore");
                }}
                style={{ userSelect: "none" }}
                className="flex relative  items-center justify-center overflow-hidden gap-2.5 px-16 py-4 bg-yellow-400 rounded-lg"
              >
                <div className="absolute left-0 top-0  w-[95px]">
                  <img
                    draggable={`false`}
                    className=" object-contain top-0 left-0"
                    src="https://i.imgur.com/sx6NRfa.png"
                    alt=""
                  />
                </div>
                <div
                  style={{ userSelect: "none" }}
                  className="pl-3 w-max"
                >{`Let's Laugh`}</div>
                <img
                  draggable={`false`}
                  style={{ userSelect: "none" }}
                  loading="lazy"
                  src="https://cdn.builder.io/api/v1/image/assets/TEMP/2663d4c751120756e37a02d0711d2d720d0214396bfb9736f2d2a285bf2860dc?apiKey=b93734ecdcb94378af862d5b2ec71620&&apiKey=b93734ecdcb94378af862d5b2ec71620"
                  className="object-contain shrink-0 my-auto aspect-[2.14] w-[30px]"
                  alt="Laugh Icon"
                />
              </div>
            </div>
          </CoolMode>
        </div>
        {/* laugh button end */}

        {/* hhg goa */}
        <div className="flex flex-wrap gap-5 mt-32 mx-auto  text-2xl font-medium text-orange-600 uppercase max-md:mt-10 max-md:mr-2.5">
          <img
            loading="lazy"
            srcSet="https://cdn.builder.io/api/v1/image/assets/TEMP/35bda0b5921a70c2e31b14ba5736ac795176abb53fbe4eeb7309e90c0f6c71c9?apiKey=b93734ecdcb94378af862d5b2ec71620&&apiKey=b93734ecdcb94378af862d5b2ec71620&width=100 100w, https://cdn.builder.io/api/v1/image/assets/TEMP/35bda0b5921a70c2e31b14ba5736ac795176abb53fbe4eeb7309e90c0f6c71c9?apiKey=b93734ecdcb94378af862d5b2ec71620&&apiKey=b93734ecdcb94378af862d5b2ec71620&width=200 200w, https://cdn.builder.io/api/v1/image/assets/TEMP/35bda0b5921a70c2e31b14ba5736ac795176abb53fbe4eeb7309e90c0f6c71c9?apiKey=b93734ecdcb94378af862d5b2ec71620&&apiKey=b93734ecdcb94378af862d5b2ec71620&width=400 400w, https://cdn.builder.io/api/v1/image/assets/TEMP/35bda0b5921a70c2e31b14ba5736ac795176abb53fbe4eeb7309e90c0f6c71c9?apiKey=b93734ecdcb94378af862d5b2ec71620&&apiKey=b93734ecdcb94378af862d5b2ec71620&width=800 800w, https://cdn.builder.io/api/v1/image/assets/TEMP/35bda0b5921a70c2e31b14ba5736ac795176abb53fbe4eeb7309e90c0f6c71c9?apiKey=b93734ecdcb94378af862d5b2ec71620&&apiKey=b93734ecdcb94378af862d5b2ec71620&width=1200 1200w, https://cdn.builder.io/api/v1/image/assets/TEMP/35bda0b5921a70c2e31b14ba5736ac795176abb53fbe4eeb7309e90c0f6c71c9?apiKey=b93734ecdcb94378af862d5b2ec71620&&apiKey=b93734ecdcb94378af862d5b2ec71620&width=1600 1600w, https://cdn.builder.io/api/v1/image/assets/TEMP/35bda0b5921a70c2e31b14ba5736ac795176abb53fbe4eeb7309e90c0f6c71c9?apiKey=b93734ecdcb94378af862d5b2ec71620&&apiKey=b93734ecdcb94378af862d5b2ec71620&width=2000 2000w, https://cdn.builder.io/api/v1/image/assets/TEMP/35bda0b5921a70c2e31b14ba5736ac795176abb53fbe4eeb7309e90c0f6c71c9?apiKey=b93734ecdcb94378af862d5b2ec71620&&apiKey=b93734ecdcb94378af862d5b2ec71620"
            className="object-contain shrink-0 aspect-square rounded-[667px] w-[60px]"
          />
          <div className="flex-auto my-auto max-md:max-w-full">
            <span className="font-semibold text-white">memes created in </span>
            <span className="font-semibold">HACKER HOUSE GOA </span>
            <span className="font-semibold text-white">BY DOPAMEME</span>
          </div>
        </div>
        {/* hhg goa */}
      </div>
      <div className="flex flex-col px-10 mt-8 w-full max-md:px-5 max-md:max-w-full">
        <div className="flex flex-wrap gap-4">
          {/* <img
            draggable={`false`}
            loading="lazy"
            src="https://i.imgur.com/sRW5hpm.jpeg"
            className="object-cover rounded-xl  max-w-full   w-[263px]"
          />
          <img
            draggable={`false`}
            loading="lazy"
            srcSet="https://cdn.builder.io/api/v1/image/assets/TEMP/4d2114a46c06a74ccb24e710a970e4ae19c4081b9cdb5dca66428405ce08b3d1?apiKey=b93734ecdcb94378af862d5b2ec71620&&apiKey=b93734ecdcb94378af862d5b2ec71620&width=100 100w, https://cdn.builder.io/api/v1/image/assets/TEMP/4d2114a46c06a74ccb24e710a970e4ae19c4081b9cdb5dca66428405ce08b3d1?apiKey=b93734ecdcb94378af862d5b2ec71620&&apiKey=b93734ecdcb94378af862d5b2ec71620&width=200 200w, https://cdn.builder.io/api/v1/image/assets/TEMP/4d2114a46c06a74ccb24e710a970e4ae19c4081b9cdb5dca66428405ce08b3d1?apiKey=b93734ecdcb94378af862d5b2ec71620&&apiKey=b93734ecdcb94378af862d5b2ec71620&width=400 400w, https://cdn.builder.io/api/v1/image/assets/TEMP/4d2114a46c06a74ccb24e710a970e4ae19c4081b9cdb5dca66428405ce08b3d1?apiKey=b93734ecdcb94378af862d5b2ec71620&&apiKey=b93734ecdcb94378af862d5b2ec71620&width=800 800w, https://cdn.builder.io/api/v1/image/assets/TEMP/4d2114a46c06a74ccb24e710a970e4ae19c4081b9cdb5dca66428405ce08b3d1?apiKey=b93734ecdcb94378af862d5b2ec71620&&apiKey=b93734ecdcb94378af862d5b2ec71620&width=1200 1200w, https://cdn.builder.io/api/v1/image/assets/TEMP/4d2114a46c06a74ccb24e710a970e4ae19c4081b9cdb5dca66428405ce08b3d1?apiKey=b93734ecdcb94378af862d5b2ec71620&&apiKey=b93734ecdcb94378af862d5b2ec71620&width=1600 1600w, https://cdn.builder.io/api/v1/image/assets/TEMP/4d2114a46c06a74ccb24e710a970e4ae19c4081b9cdb5dca66428405ce08b3d1?apiKey=b93734ecdcb94378af862d5b2ec71620&&apiKey=b93734ecdcb94378af862d5b2ec71620&width=2000 2000w, https://cdn.builder.io/api/v1/image/assets/TEMP/4d2114a46c06a74ccb24e710a970e4ae19c4081b9cdb5dca66428405ce08b3d1?apiKey=b93734ecdcb94378af862d5b2ec71620&&apiKey=b93734ecdcb94378af862d5b2ec71620"
            className="object-contain shrink-0 max-w-full aspect-[0.69] w-[263px]"
          />
          <img
            draggable={`false`}
            loading="lazy"
            srcSet="https://cdn.builder.io/api/v1/image/assets/TEMP/4d2114a46c06a74ccb24e710a970e4ae19c4081b9cdb5dca66428405ce08b3d1?apiKey=b93734ecdcb94378af862d5b2ec71620&&apiKey=b93734ecdcb94378af862d5b2ec71620&width=100 100w, https://cdn.builder.io/api/v1/image/assets/TEMP/4d2114a46c06a74ccb24e710a970e4ae19c4081b9cdb5dca66428405ce08b3d1?apiKey=b93734ecdcb94378af862d5b2ec71620&&apiKey=b93734ecdcb94378af862d5b2ec71620&width=200 200w, https://cdn.builder.io/api/v1/image/assets/TEMP/4d2114a46c06a74ccb24e710a970e4ae19c4081b9cdb5dca66428405ce08b3d1?apiKey=b93734ecdcb94378af862d5b2ec71620&&apiKey=b93734ecdcb94378af862d5b2ec71620&width=400 400w, https://cdn.builder.io/api/v1/image/assets/TEMP/4d2114a46c06a74ccb24e710a970e4ae19c4081b9cdb5dca66428405ce08b3d1?apiKey=b93734ecdcb94378af862d5b2ec71620&&apiKey=b93734ecdcb94378af862d5b2ec71620&width=800 800w, https://cdn.builder.io/api/v1/image/assets/TEMP/4d2114a46c06a74ccb24e710a970e4ae19c4081b9cdb5dca66428405ce08b3d1?apiKey=b93734ecdcb94378af862d5b2ec71620&&apiKey=b93734ecdcb94378af862d5b2ec71620&width=1200 1200w, https://cdn.builder.io/api/v1/image/assets/TEMP/4d2114a46c06a74ccb24e710a970e4ae19c4081b9cdb5dca66428405ce08b3d1?apiKey=b93734ecdcb94378af862d5b2ec71620&&apiKey=b93734ecdcb94378af862d5b2ec71620&width=1600 1600w, https://cdn.builder.io/api/v1/image/assets/TEMP/4d2114a46c06a74ccb24e710a970e4ae19c4081b9cdb5dca66428405ce08b3d1?apiKey=b93734ecdcb94378af862d5b2ec71620&&apiKey=b93734ecdcb94378af862d5b2ec71620&width=2000 2000w, https://cdn.builder.io/api/v1/image/assets/TEMP/4d2114a46c06a74ccb24e710a970e4ae19c4081b9cdb5dca66428405ce08b3d1?apiKey=b93734ecdcb94378af862d5b2ec71620&&apiKey=b93734ecdcb94378af862d5b2ec71620"
            className="object-contain shrink-0 max-w-full aspect-[0.69] w-[263px]"
          />
          <img
            draggable={`false`}
            loading="lazy"
            srcSet="https://cdn.builder.io/api/v1/image/assets/TEMP/9ba6e460903880512952217a3061afa04dcce43804ec0512c2f5e20e863e9425?apiKey=b93734ecdcb94378af862d5b2ec71620&&apiKey=b93734ecdcb94378af862d5b2ec71620&width=100 100w, https://cdn.builder.io/api/v1/image/assets/TEMP/9ba6e460903880512952217a3061afa04dcce43804ec0512c2f5e20e863e9425?apiKey=b93734ecdcb94378af862d5b2ec71620&&apiKey=b93734ecdcb94378af862d5b2ec71620&width=200 200w, https://cdn.builder.io/api/v1/image/assets/TEMP/9ba6e460903880512952217a3061afa04dcce43804ec0512c2f5e20e863e9425?apiKey=b93734ecdcb94378af862d5b2ec71620&&apiKey=b93734ecdcb94378af862d5b2ec71620&width=400 400w, https://cdn.builder.io/api/v1/image/assets/TEMP/9ba6e460903880512952217a3061afa04dcce43804ec0512c2f5e20e863e9425?apiKey=b93734ecdcb94378af862d5b2ec71620&&apiKey=b93734ecdcb94378af862d5b2ec71620&width=800 800w, https://cdn.builder.io/api/v1/image/assets/TEMP/9ba6e460903880512952217a3061afa04dcce43804ec0512c2f5e20e863e9425?apiKey=b93734ecdcb94378af862d5b2ec71620&&apiKey=b93734ecdcb94378af862d5b2ec71620&width=1200 1200w, https://cdn.builder.io/api/v1/image/assets/TEMP/9ba6e460903880512952217a3061afa04dcce43804ec0512c2f5e20e863e9425?apiKey=b93734ecdcb94378af862d5b2ec71620&&apiKey=b93734ecdcb94378af862d5b2ec71620&width=1600 1600w, https://cdn.builder.io/api/v1/image/assets/TEMP/9ba6e460903880512952217a3061afa04dcce43804ec0512c2f5e20e863e9425?apiKey=b93734ecdcb94378af862d5b2ec71620&&apiKey=b93734ecdcb94378af862d5b2ec71620&width=2000 2000w, https://cdn.builder.io/api/v1/image/assets/TEMP/9ba6e460903880512952217a3061afa04dcce43804ec0512c2f5e20e863e9425?apiKey=b93734ecdcb94378af862d5b2ec71620&&apiKey=b93734ecdcb94378af862d5b2ec71620"
            className="object-contain shrink-0 max-w-full rounded-lg aspect-[0.66] w-[251px]"
          />
          <img
            draggable={`false`}
            loading="lazy"
            srcSet="https://cdn.builder.io/api/v1/image/assets/TEMP/4d2114a46c06a74ccb24e710a970e4ae19c4081b9cdb5dca66428405ce08b3d1?apiKey=b93734ecdcb94378af862d5b2ec71620&&apiKey=b93734ecdcb94378af862d5b2ec71620&width=100 100w, https://cdn.builder.io/api/v1/image/assets/TEMP/4d2114a46c06a74ccb24e710a970e4ae19c4081b9cdb5dca66428405ce08b3d1?apiKey=b93734ecdcb94378af862d5b2ec71620&&apiKey=b93734ecdcb94378af862d5b2ec71620&width=200 200w, https://cdn.builder.io/api/v1/image/assets/TEMP/4d2114a46c06a74ccb24e710a970e4ae19c4081b9cdb5dca66428405ce08b3d1?apiKey=b93734ecdcb94378af862d5b2ec71620&&apiKey=b93734ecdcb94378af862d5b2ec71620&width=400 400w, https://cdn.builder.io/api/v1/image/assets/TEMP/4d2114a46c06a74ccb24e710a970e4ae19c4081b9cdb5dca66428405ce08b3d1?apiKey=b93734ecdcb94378af862d5b2ec71620&&apiKey=b93734ecdcb94378af862d5b2ec71620&width=800 800w, https://cdn.builder.io/api/v1/image/assets/TEMP/4d2114a46c06a74ccb24e710a970e4ae19c4081b9cdb5dca66428405ce08b3d1?apiKey=b93734ecdcb94378af862d5b2ec71620&&apiKey=b93734ecdcb94378af862d5b2ec71620&width=1200 1200w, https://cdn.builder.io/api/v1/image/assets/TEMP/4d2114a46c06a74ccb24e710a970e4ae19c4081b9cdb5dca66428405ce08b3d1?apiKey=b93734ecdcb94378af862d5b2ec71620&&apiKey=b93734ecdcb94378af862d5b2ec71620&width=1600 1600w, https://cdn.builder.io/api/v1/image/assets/TEMP/4d2114a46c06a74ccb24e710a970e4ae19c4081b9cdb5dca66428405ce08b3d1?apiKey=b93734ecdcb94378af862d5b2ec71620&&apiKey=b93734ecdcb94378af862d5b2ec71620&width=2000 2000w, https://cdn.builder.io/api/v1/image/assets/TEMP/4d2114a46c06a74ccb24e710a970e4ae19c4081b9cdb5dca66428405ce08b3d1?apiKey=b93734ecdcb94378af862d5b2ec71620&&apiKey=b93734ecdcb94378af862d5b2ec71620"
            className="object-contain shrink-0 max-w-full aspect-[0.69] w-[263px]"
          />
          <img
            draggable={`false`}
            loading="lazy"
            srcSet="https://cdn.builder.io/api/v1/image/assets/TEMP/9ba6e460903880512952217a3061afa04dcce43804ec0512c2f5e20e863e9425?apiKey=b93734ecdcb94378af862d5b2ec71620&&apiKey=b93734ecdcb94378af862d5b2ec71620&width=100 100w, https://cdn.builder.io/api/v1/image/assets/TEMP/9ba6e460903880512952217a3061afa04dcce43804ec0512c2f5e20e863e9425?apiKey=b93734ecdcb94378af862d5b2ec71620&&apiKey=b93734ecdcb94378af862d5b2ec71620&width=200 200w, https://cdn.builder.io/api/v1/image/assets/TEMP/9ba6e460903880512952217a3061afa04dcce43804ec0512c2f5e20e863e9425?apiKey=b93734ecdcb94378af862d5b2ec71620&&apiKey=b93734ecdcb94378af862d5b2ec71620&width=400 400w, https://cdn.builder.io/api/v1/image/assets/TEMP/9ba6e460903880512952217a3061afa04dcce43804ec0512c2f5e20e863e9425?apiKey=b93734ecdcb94378af862d5b2ec71620&&apiKey=b93734ecdcb94378af862d5b2ec71620&width=800 800w, https://cdn.builder.io/api/v1/image/assets/TEMP/9ba6e460903880512952217a3061afa04dcce43804ec0512c2f5e20e863e9425?apiKey=b93734ecdcb94378af862d5b2ec71620&&apiKey=b93734ecdcb94378af862d5b2ec71620&width=1200 1200w, https://cdn.builder.io/api/v1/image/assets/TEMP/9ba6e460903880512952217a3061afa04dcce43804ec0512c2f5e20e863e9425?apiKey=b93734ecdcb94378af862d5b2ec71620&&apiKey=b93734ecdcb94378af862d5b2ec71620&width=1600 1600w, https://cdn.builder.io/api/v1/image/assets/TEMP/9ba6e460903880512952217a3061afa04dcce43804ec0512c2f5e20e863e9425?apiKey=b93734ecdcb94378af862d5b2ec71620&&apiKey=b93734ecdcb94378af862d5b2ec71620&width=2000 2000w, https://cdn.builder.io/api/v1/image/assets/TEMP/9ba6e460903880512952217a3061afa04dcce43804ec0512c2f5e20e863e9425?apiKey=b93734ecdcb94378af862d5b2ec71620&&apiKey=b93734ecdcb94378af862d5b2ec71620"
            className="object-contain shrink-0 max-w-full rounded-lg aspect-[0.66] w-[251px]"
          />
          <img
            draggable={`false`}
            loading="lazy"
            srcSet="https://cdn.builder.io/api/v1/image/assets/TEMP/4d2114a46c06a74ccb24e710a970e4ae19c4081b9cdb5dca66428405ce08b3d1?apiKey=b93734ecdcb94378af862d5b2ec71620&&apiKey=b93734ecdcb94378af862d5b2ec71620&width=100 100w, https://cdn.builder.io/api/v1/image/assets/TEMP/4d2114a46c06a74ccb24e710a970e4ae19c4081b9cdb5dca66428405ce08b3d1?apiKey=b93734ecdcb94378af862d5b2ec71620&&apiKey=b93734ecdcb94378af862d5b2ec71620&width=200 200w, https://cdn.builder.io/api/v1/image/assets/TEMP/4d2114a46c06a74ccb24e710a970e4ae19c4081b9cdb5dca66428405ce08b3d1?apiKey=b93734ecdcb94378af862d5b2ec71620&&apiKey=b93734ecdcb94378af862d5b2ec71620&width=400 400w, https://cdn.builder.io/api/v1/image/assets/TEMP/4d2114a46c06a74ccb24e710a970e4ae19c4081b9cdb5dca66428405ce08b3d1?apiKey=b93734ecdcb94378af862d5b2ec71620&&apiKey=b93734ecdcb94378af862d5b2ec71620&width=800 800w, https://cdn.builder.io/api/v1/image/assets/TEMP/4d2114a46c06a74ccb24e710a970e4ae19c4081b9cdb5dca66428405ce08b3d1?apiKey=b93734ecdcb94378af862d5b2ec71620&&apiKey=b93734ecdcb94378af862d5b2ec71620&width=1200 1200w, https://cdn.builder.io/api/v1/image/assets/TEMP/4d2114a46c06a74ccb24e710a970e4ae19c4081b9cdb5dca66428405ce08b3d1?apiKey=b93734ecdcb94378af862d5b2ec71620&&apiKey=b93734ecdcb94378af862d5b2ec71620&width=1600 1600w, https://cdn.builder.io/api/v1/image/assets/TEMP/4d2114a46c06a74ccb24e710a970e4ae19c4081b9cdb5dca66428405ce08b3d1?apiKey=b93734ecdcb94378af862d5b2ec71620&&apiKey=b93734ecdcb94378af862d5b2ec71620&width=2000 2000w, https://cdn.builder.io/api/v1/image/assets/TEMP/4d2114a46c06a74ccb24e710a970e4ae19c4081b9cdb5dca66428405ce08b3d1?apiKey=b93734ecdcb94378af862d5b2ec71620&&apiKey=b93734ecdcb94378af862d5b2ec71620"
            className="object-contain shrink-0 max-w-full aspect-[0.69] w-[263px]"
          /> */}
          <div className="flex relative items-center justify-center gap-5 w-full self-start mt-4">
            {/* <img
                    loading="lazy"
                    src="https://cdn.builder.io/api/v1/image/assets/TEMP/a2b1ca037d608a23629c1c679a818baf696ea82a49e45aeb5a3b71c070fbd09e?apiKey=b93734ecdcb94378af862d5b2ec71620&&apiKey=b93734ecdcb94378af862d5b2ec71620"
                    className="object-contain shrink-0 max-w-full aspect-[0.53] w-[183px]"
                    alt="Image 1"
                  />
                  <img
                    loading="lazy"
                    src="https://cdn.builder.io/api/v1/image/assets/TEMP/1ea71f84516bd62c814b9d21aa86273bfc1d10a5178dc7274c4a49ca16144691?apiKey=b93734ecdcb94378af862d5b2ec71620&&apiKey=b93734ecdcb94378af862d5b2ec71620"
                    className="object-contain shrink-0 max-w-full rounded-lg aspect-[0.55] w-[189px]"
                    alt="Image 2"
                  /> */}
            <DopamemeCarousel />
            {/* <MarqueeDemo /> */}
          </div>
        </div>
        <div className="flex bg-black overflow-hidden flex-col mt-36 font-semibold rounded-xl max-md:mt-10 max-md:max-w-full">
          <div className="flex bg-black relative flex-col w-full bg-blend-overlay min-h-[208px] max-h-[399px] max-md:max-w-full">
            <img
              draggable={`false`}
              loading="lazy"
              srcSet="https://i.imgur.com/O7bCesY.png"
              className="object-fill absolute inset-0 size-full"
            />
            <div className="flex relative flex-col items-center bottom-16 px-20 pt-9 pb-16 w-full bg-blend-overlay min-h-[408px] max-md:px-5 max-md:max-w-full">
              {/* laugh button */}
              <div className="relative cursor-pointer max-w-[324px] mx-auto flex mt-80 justify-center rounded-xl border-[#F9E000] border-[0.7px] border-dashed box-border">
                <CoolMode
                  options={{
                    particle: "https://i.imgur.com/yQ6d6MG.png",
                  }}
                >
                  <div
                    style={{ userSelect: "none" }}
                    className="flex relative overflow-hidden flex-col justify-center self-center px-2 py-1.5  w-full text-2xl tracking-tighter text-black rounded-xl max-w-[338px]"
                  >
                    <div
                      onKeyUpCapture={() => {
                        navigate("/explore");
                      }}
                      onClick={() => {
                        navigate("/explore");
                      }}
                      style={{ userSelect: "none" }}
                      className="flex relative  items-center  justify-center overflow-hidden gap-2.5 px-16 py-4 bg-yellow-400 rounded-lg"
                    >
                      <div className="absolute left-0 top-0  w-[95px]">
                        <img
                          draggable={`false`}
                          className=" object-contain top-0 left-0"
                          src="https://i.imgur.com/sx6NRfa.png"
                          alt=""
                        />
                      </div>
                      <div
                        style={{ userSelect: "none" }}
                        className="pl-3 w-max"
                      >{`Let's Laugh`}</div>
                      <img
                        draggable={`false`}
                        style={{ userSelect: "none" }}
                        loading="lazy"
                        src="https://cdn.builder.io/api/v1/image/assets/TEMP/2663d4c751120756e37a02d0711d2d720d0214396bfb9736f2d2a285bf2860dc?apiKey=b93734ecdcb94378af862d5b2ec71620&&apiKey=b93734ecdcb94378af862d5b2ec71620"
                        className="object-contain shrink-0 my-auto aspect-[2.14] w-[30px]"
                        alt="Laugh Icon"
                      />
                    </div>
                  </div>
                </CoolMode>
              </div>
              {/* laugh button end */}
            </div>
          </div>
        </div>
        <div className="self-start pr-[70px] pl-[41px]  uppercase font-bebas-neue mt-28 text-7xl tracking-tighter text-[#D8D8D8] max-md:mt-10 max-md:max-w-full max-md:text-4xl">
          explore our features
        </div>
        <div className="mt-6 w-full pr-[70px] pl-[41px]   max-md:max-w-full">
          <div className="flex gap-5 max-md:flex-col">
            <div className="flex flex-col relative w-[33%] max-md:ml-0 max-md:w-full">
              <img
                className="   cursor-pointer hover:scale-105 hover:opacity-80 transition-all duration-200 z-10 h-10 absolute bottom-3 right-3 "
                src="https://i.imgur.com/Egw1FNh.png"
                alt=""
              />
              <div className="flex relative flex-col grow px-4 py-4 text-lg font-semibold text-black rounded-2xl min-h-[312px] max-md:mt-7 max-md:max-w-full">
                <img
                  draggable={`false`}
                  loading="lazy"
                  srcSet="https://cdn.builder.io/api/v1/image/assets/TEMP/3ba4b94eb5b8c5ee478bbb26776e80b7e072fc129bbdf642e4b753ca8e10bd5d?apiKey=b93734ecdcb94378af862d5b2ec71620&&apiKey=b93734ecdcb94378af862d5b2ec71620&width=100 100w, https://cdn.builder.io/api/v1/image/assets/TEMP/3ba4b94eb5b8c5ee478bbb26776e80b7e072fc129bbdf642e4b753ca8e10bd5d?apiKey=b93734ecdcb94378af862d5b2ec71620&&apiKey=b93734ecdcb94378af862d5b2ec71620&width=200 200w, https://cdn.builder.io/api/v1/image/assets/TEMP/3ba4b94eb5b8c5ee478bbb26776e80b7e072fc129bbdf642e4b753ca8e10bd5d?apiKey=b93734ecdcb94378af862d5b2ec71620&&apiKey=b93734ecdcb94378af862d5b2ec71620&width=400 400w, https://cdn.builder.io/api/v1/image/assets/TEMP/3ba4b94eb5b8c5ee478bbb26776e80b7e072fc129bbdf642e4b753ca8e10bd5d?apiKey=b93734ecdcb94378af862d5b2ec71620&&apiKey=b93734ecdcb94378af862d5b2ec71620&width=800 800w, https://cdn.builder.io/api/v1/image/assets/TEMP/3ba4b94eb5b8c5ee478bbb26776e80b7e072fc129bbdf642e4b753ca8e10bd5d?apiKey=b93734ecdcb94378af862d5b2ec71620&&apiKey=b93734ecdcb94378af862d5b2ec71620&width=1200 1200w, https://cdn.builder.io/api/v1/image/assets/TEMP/3ba4b94eb5b8c5ee478bbb26776e80b7e072fc129bbdf642e4b753ca8e10bd5d?apiKey=b93734ecdcb94378af862d5b2ec71620&&apiKey=b93734ecdcb94378af862d5b2ec71620&width=1600 1600w, https://cdn.builder.io/api/v1/image/assets/TEMP/3ba4b94eb5b8c5ee478bbb26776e80b7e072fc129bbdf642e4b753ca8e10bd5d?apiKey=b93734ecdcb94378af862d5b2ec71620&&apiKey=b93734ecdcb94378af862d5b2ec71620&width=2000 2000w, https://cdn.builder.io/api/v1/image/assets/TEMP/3ba4b94eb5b8c5ee478bbb26776e80b7e072fc129bbdf642e4b753ca8e10bd5d?apiKey=b93734ecdcb94378af862d5b2ec71620&&apiKey=b93734ecdcb94378af862d5b2ec71620"
                  className="object-cover rounded-[14px] absolute inset-0 size-full"
                />
                <div className="overflow-hidden relative self-start px-3.5 py-2 bg-white rounded-md">
                  Img to Meme
                </div>
                <img
                  draggable={`false`}
                  loading="lazy"
                  src="https://cdn.builder.io/api/v1/image/assets/TEMP/eb72ff1fd6400d2c6ed2c7edf3cad98b46f32149e76193f61f6f7aee24439e41?apiKey=b93734ecdcb94378af862d5b2ec71620&&apiKey=b93734ecdcb94378af862d5b2ec71620"
                  className="object-contain self-end mt-52 rounded-3xl aspect-[2.27] w-[91px] max-md:mt-10"
                />
              </div>
            </div>
            <div className="flex relative flex-col ml-5 w-[41%] max-md:ml-0 max-md:w-full">
              <img
                className="   cursor-pointer hover:scale-105 hover:opacity-80 transition-all duration-200 z-10 h-10 absolute bottom-3 right-3 "
                src="https://i.imgur.com/Egw1FNh.png"
                alt=""
              />
              <div className="flex relative flex-col grow px-6 py-4 text-lg font-semibold text-black rounded-2xl min-h-[312px] max-md:pl-5 max-md:mt-7 max-md:max-w-full">
                <img
                  draggable={`false`}
                  loading="lazy"
                  srcSet="https://cdn.builder.io/api/v1/image/assets/TEMP/36581598a024e309c8feec29b7f6b28415fb3b3a85831528f6d55cd5ea8ee034?apiKey=b93734ecdcb94378af862d5b2ec71620&&apiKey=b93734ecdcb94378af862d5b2ec71620&width=100 100w, https://cdn.builder.io/api/v1/image/assets/TEMP/36581598a024e309c8feec29b7f6b28415fb3b3a85831528f6d55cd5ea8ee034?apiKey=b93734ecdcb94378af862d5b2ec71620&&apiKey=b93734ecdcb94378af862d5b2ec71620&width=200 200w, https://cdn.builder.io/api/v1/image/assets/TEMP/36581598a024e309c8feec29b7f6b28415fb3b3a85831528f6d55cd5ea8ee034?apiKey=b93734ecdcb94378af862d5b2ec71620&&apiKey=b93734ecdcb94378af862d5b2ec71620&width=400 400w, https://cdn.builder.io/api/v1/image/assets/TEMP/36581598a024e309c8feec29b7f6b28415fb3b3a85831528f6d55cd5ea8ee034?apiKey=b93734ecdcb94378af862d5b2ec71620&&apiKey=b93734ecdcb94378af862d5b2ec71620&width=800 800w, https://cdn.builder.io/api/v1/image/assets/TEMP/36581598a024e309c8feec29b7f6b28415fb3b3a85831528f6d55cd5ea8ee034?apiKey=b93734ecdcb94378af862d5b2ec71620&&apiKey=b93734ecdcb94378af862d5b2ec71620&width=1200 1200w, https://cdn.builder.io/api/v1/image/assets/TEMP/36581598a024e309c8feec29b7f6b28415fb3b3a85831528f6d55cd5ea8ee034?apiKey=b93734ecdcb94378af862d5b2ec71620&&apiKey=b93734ecdcb94378af862d5b2ec71620&width=1600 1600w, https://cdn.builder.io/api/v1/image/assets/TEMP/36581598a024e309c8feec29b7f6b28415fb3b3a85831528f6d55cd5ea8ee034?apiKey=b93734ecdcb94378af862d5b2ec71620&&apiKey=b93734ecdcb94378af862d5b2ec71620&width=2000 2000w, https://cdn.builder.io/api/v1/image/assets/TEMP/36581598a024e309c8feec29b7f6b28415fb3b3a85831528f6d55cd5ea8ee034?apiKey=b93734ecdcb94378af862d5b2ec71620&&apiKey=b93734ecdcb94378af862d5b2ec71620"
                  className="object-cover rounded-[14px] absolute inset-0 size-full"
                />
                <div className="overflow-hidden relative self-start px-3 py-2 bg-white rounded-md">
                  Prompt to Meme
                </div>
                <img
                  draggable={`false`}
                  loading="lazy"
                  src="https://cdn.builder.io/api/v1/image/assets/TEMP/eb72ff1fd6400d2c6ed2c7edf3cad98b46f32149e76193f61f6f7aee24439e41?apiKey=b93734ecdcb94378af862d5b2ec71620&&apiKey=b93734ecdcb94378af862d5b2ec71620"
                  className="object-contain self-end mt-52 rounded-3xl aspect-[2.27] w-[91px] max-md:mt-10"
                />
              </div>
            </div>
            <div className="flex relative flex-col ml-5 w-[26%] max-md:ml-0 max-md:w-full">
              <img
                className="   cursor-pointer hover:scale-105 hover:opacity-80  transition-all duration-200 z-10 h-10 absolute bottom-3 right-3 "
                src="https://i.imgur.com/Egw1FNh.png"
                alt=""
              />
              <div className="flex overflow-hidden   flex-col grow pt-5 text-lg font-semibold text-black rounded-2xl max-md:mt-7">
                <div className="flex relative flex-col  px-5 pb-3 w-full aspect-[1.147]">
                  <img
                    draggable={`false`}
                    loading="lazy"
                    srcSet="https://i.imgur.com/LoZIgBP.png"
                    className="object-cover absolute  rounded-[14px] inset-0 size-full"
                  />
                  <div className="overflow-hidden relative self-start px-3 py-2 bg-white rounded-md">
                    Video Meme
                  </div>
                  <img
                    draggable={`false`}
                    loading="lazy"
                    src="https://cdn.builder.io/api/v1/image/assets/TEMP/eb9fa78b2bb60d63d78875912876b6df0240c4bb182538c729b4241d4f8eecfe?apiKey=b93734ecdcb94378af862d5b2ec71620&&apiKey=b93734ecdcb94378af862d5b2ec71620"
                    className="object-contain  self-end mt-52 rounded-3xl aspect-[2.27] w-[91px] max-md:mt-10"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-9 w-full pr-[70px] pl-[41px] max-md:max-w-full">
          <div className="flex gap-5 max-md:flex-col">
            <div className="flex relative flex-col w-6/12 max-md:ml-0 max-md:w-full">
              <img
                className="   cursor-pointer hover:scale-105 hover:opacity-80 transition-all duration-200 z-10 h-10 absolute bottom-3 right-3 "
                src="https://i.imgur.com/Egw1FNh.png"
                alt=""
              />
              <div className="flex relative flex-col grow px-6 pt-6 pb-3.5 text-lg font-semibold text-black rounded-xl min-h-[313px] max-md:pl-5 max-md:mt-8 max-md:max-w-full">
                <img
                  draggable={`false`}
                  loading="lazy"
                  srcSet="https://cdn.builder.io/api/v1/image/assets/TEMP/663719848f93111fc73af3eb948ba9909182a066a4c333ac158ab8e94bd0391a?apiKey=b93734ecdcb94378af862d5b2ec71620&&apiKey=b93734ecdcb94378af862d5b2ec71620&width=100 100w, https://cdn.builder.io/api/v1/image/assets/TEMP/663719848f93111fc73af3eb948ba9909182a066a4c333ac158ab8e94bd0391a?apiKey=b93734ecdcb94378af862d5b2ec71620&&apiKey=b93734ecdcb94378af862d5b2ec71620&width=200 200w, https://cdn.builder.io/api/v1/image/assets/TEMP/663719848f93111fc73af3eb948ba9909182a066a4c333ac158ab8e94bd0391a?apiKey=b93734ecdcb94378af862d5b2ec71620&&apiKey=b93734ecdcb94378af862d5b2ec71620&width=400 400w, https://cdn.builder.io/api/v1/image/assets/TEMP/663719848f93111fc73af3eb948ba9909182a066a4c333ac158ab8e94bd0391a?apiKey=b93734ecdcb94378af862d5b2ec71620&&apiKey=b93734ecdcb94378af862d5b2ec71620&width=800 800w, https://cdn.builder.io/api/v1/image/assets/TEMP/663719848f93111fc73af3eb948ba9909182a066a4c333ac158ab8e94bd0391a?apiKey=b93734ecdcb94378af862d5b2ec71620&&apiKey=b93734ecdcb94378af862d5b2ec71620&width=1200 1200w, https://cdn.builder.io/api/v1/image/assets/TEMP/663719848f93111fc73af3eb948ba9909182a066a4c333ac158ab8e94bd0391a?apiKey=b93734ecdcb94378af862d5b2ec71620&&apiKey=b93734ecdcb94378af862d5b2ec71620&width=1600 1600w, https://cdn.builder.io/api/v1/image/assets/TEMP/663719848f93111fc73af3eb948ba9909182a066a4c333ac158ab8e94bd0391a?apiKey=b93734ecdcb94378af862d5b2ec71620&&apiKey=b93734ecdcb94378af862d5b2ec71620&width=2000 2000w, https://cdn.builder.io/api/v1/image/assets/TEMP/663719848f93111fc73af3eb948ba9909182a066a4c333ac158ab8e94bd0391a?apiKey=b93734ecdcb94378af862d5b2ec71620&&apiKey=b93734ecdcb94378af862d5b2ec71620"
                  className="object-cover rounded-[14px] absolute inset-0 size-full"
                />
                <div className="overflow-hidden relative self-start px-3 py-2 bg-white rounded-md">
                  Anime meme
                </div>
                <img
                  draggable={`false`}
                  loading="lazy"
                  src="https://cdn.builder.io/api/v1/image/assets/TEMP/71fa550b6a4f448bec53e80751969026751b53ea91c1a765379c5931ed7a745e?apiKey=b93734ecdcb94378af862d5b2ec71620&&apiKey=b93734ecdcb94378af862d5b2ec71620"
                  className="object-contain self-end mt-52 rounded-3xl aspect-[2.27] w-[91px] max-md:mt-10"
                />
              </div>
            </div>
            <div className="flex relative flex-col ml-5 w-6/12 max-md:ml-0 max-md:w-full">
              <img
                className="   cursor-pointer hover:scale-105 hover:opacity-80 transition-all duration-200 z-10 h-10 absolute bottom-3 right-3 "
                src="https://i.imgur.com/Egw1FNh.png"
                alt=""
              />
              <div className="flex relative flex-col grow px-6 pt-6 pb-3.5 text-lg font-semibold text-black rounded-2xl min-h-[313px] max-md:pl-5 max-md:mt-8 max-md:max-w-full">
                <img
                  draggable={`false`}
                  loading="lazy"
                  srcSet="https://cdn.builder.io/api/v1/image/assets/TEMP/25c96297009d3b9ce1f8898deec05abfb8e858365ab218fb9c53307765c7c41a?apiKey=b93734ecdcb94378af862d5b2ec71620&&apiKey=b93734ecdcb94378af862d5b2ec71620&width=100 100w, https://cdn.builder.io/api/v1/image/assets/TEMP/25c96297009d3b9ce1f8898deec05abfb8e858365ab218fb9c53307765c7c41a?apiKey=b93734ecdcb94378af862d5b2ec71620&&apiKey=b93734ecdcb94378af862d5b2ec71620&width=200 200w, https://cdn.builder.io/api/v1/image/assets/TEMP/25c96297009d3b9ce1f8898deec05abfb8e858365ab218fb9c53307765c7c41a?apiKey=b93734ecdcb94378af862d5b2ec71620&&apiKey=b93734ecdcb94378af862d5b2ec71620&width=400 400w, https://cdn.builder.io/api/v1/image/assets/TEMP/25c96297009d3b9ce1f8898deec05abfb8e858365ab218fb9c53307765c7c41a?apiKey=b93734ecdcb94378af862d5b2ec71620&&apiKey=b93734ecdcb94378af862d5b2ec71620&width=800 800w, https://cdn.builder.io/api/v1/image/assets/TEMP/25c96297009d3b9ce1f8898deec05abfb8e858365ab218fb9c53307765c7c41a?apiKey=b93734ecdcb94378af862d5b2ec71620&&apiKey=b93734ecdcb94378af862d5b2ec71620&width=1200 1200w, https://cdn.builder.io/api/v1/image/assets/TEMP/25c96297009d3b9ce1f8898deec05abfb8e858365ab218fb9c53307765c7c41a?apiKey=b93734ecdcb94378af862d5b2ec71620&&apiKey=b93734ecdcb94378af862d5b2ec71620&width=1600 1600w, https://cdn.builder.io/api/v1/image/assets/TEMP/25c96297009d3b9ce1f8898deec05abfb8e858365ab218fb9c53307765c7c41a?apiKey=b93734ecdcb94378af862d5b2ec71620&&apiKey=b93734ecdcb94378af862d5b2ec71620&width=2000 2000w, https://cdn.builder.io/api/v1/image/assets/TEMP/25c96297009d3b9ce1f8898deec05abfb8e858365ab218fb9c53307765c7c41a?apiKey=b93734ecdcb94378af862d5b2ec71620&&apiKey=b93734ecdcb94378af862d5b2ec71620"
                  className="object-cover rounded-[14px] absolute inset-0 size-full"
                />
                <div className="overflow-hidden relative self-start px-2.5 py-2 bg-white rounded-md">
                  Template Meme
                </div>
                <img
                  draggable={`false`}
                  loading="lazy"
                  src="https://cdn.builder.io/api/v1/image/assets/TEMP/eb72ff1fd6400d2c6ed2c7edf3cad98b46f32149e76193f61f6f7aee24439e41?apiKey=b93734ecdcb94378af862d5b2ec71620&&apiKey=b93734ecdcb94378af862d5b2ec71620"
                  className="object-contain self-end mt-52 rounded-3xl aspect-[2.27] w-[91px] max-md:mt-10"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="self-start uppercase mt-32 ml-11 text-7xl tracking-tighter text-zinc-300 max-md:mt-10 max-md:ml-2.5 font-bebas-neue max-md:text-4xl">
          explore memes
        </div>
        {/* <div className="self-center mt-14 w-full pr-[70px] pl-[41px]  max-md:mt-10 max-md:max-w-full">
          <div className="flex gap-5 max-md:flex-col">
            <div className="flex flex-col w-3/12 max-md:ml-0 max-md:w-full">
              <div className="flex flex-col grow max-md:mt-4">
                <div className="flex shrink-0 rounded-2xl bg-white bg-opacity-10 h-[410px]" />
                <div className="flex shrink-0 mt-5 rounded-2xl bg-white bg-opacity-10 h-[257px]" />
              </div>
            </div>
            <div className="flex flex-col ml-5 w-3/12 max-md:ml-0 max-md:w-full">
              <div className="flex flex-col grow max-md:mt-4">
                <div className="flex shrink-0 rounded-2xl bg-white bg-opacity-10 h-[299px]" />
                <div className="flex shrink-0 mt-5 rounded-2xl bg-white bg-opacity-10 h-[367px]" />
              </div>
            </div>
            <div className="flex flex-col ml-5 w-3/12 max-md:ml-0 max-md:w-full">
              <div className="flex flex-col grow max-md:mt-4">
                <div className="flex shrink-0 rounded-2xl bg-white bg-opacity-10 h-[381px]" />
                <div className="flex shrink-0 mt-4 rounded-2xl bg-white bg-opacity-10 h-[287px]" />
              </div>
            </div>
            <div className="flex flex-col ml-5 w-3/12 max-md:ml-0 max-md:w-full">
              <div className="flex flex-col grow max-md:mt-4">
                <div className="flex shrink-0 rounded-2xl bg-white bg-opacity-10 h-[242px]" />
                <div className="flex shrink-0 mt-3 rounded-2xl bg-white bg-opacity-10 h-[431px]" />
              </div>
            </div>
          </div>
        </div>
         */}
        {/* special grid 667*/}
        <div className="grid mt-20 grid-cols-12 pr-[70px] pl-[41px] h-[466.66px]  gap-5">
          <div className=" col-span-3 overflow-hidden rounded-2xl bg-white  row-span-7">
            <img
              className=" object-cover size-full object-center"
              src="https://i.imgur.com/y3IsIT2.jpg"
              alt=""
            />
          </div>
          <div className=" col-span-3 overflow-hidden rounded-2xl bg-black  row-span-7">
            <img
              className=" object-cover size-full object-center"
              src="https://i.imgur.com/iQmXABr.jpg"
              alt=""
            />
          </div>
          <div className=" col-span-3 overflow-hidden  rounded-2xl bg-black  row-span-7">
            <img
              className=" object-cover size-full object-center"
              src="https://i.imgur.com/VuTf6bE.jpg"
              alt=""
            />
          </div>
          {/* <div className=" col-span-3 overflow-hidden rounded-2xl bg-black  row-span-4">
            <img
              className=" object-cover size-full object-center"
              src="https://i.imgur.com/M4Xav4U.png"
              alt=""
            />
          </div>

          <div className=" col-span-3 overflow-hidden rounded-2xl bg-white row-span-8">
            <img
              className=" object-cover size-full object-center"
              src="https://i.imgur.com/M4Xav4U.png"
              alt=""
            />
          </div>
          <div className=" col-span-3 overflow-hidden rounded-2xl bg-white  row-span-7">
            <img
              className="  object-cover size-full object-center"
              src="https://i.imgur.com/M4Xav4U.png"
              alt=""
            />
          </div>
          <div className=" col-span-3 overflow-hidden rounded-2xl bg-white  row-span-5">
            <img
              className=" object-cover size-full object-center"
              src="https://i.imgur.com/M4Xav4U.png"
              alt=""
            />
          </div> */}
          <div className=" col-span-3 overflow-hidden rounded-2xl bg-white  row-span-7">
            <img
              className=" object-cover size-full object-center"
              src="https://i.imgur.com/VRfVVsa.jpg"
              alt=""
            />
          </div>
        </div>
        {/* explore meme button */}
        <div className="flex  cursor-pointer hover:scale-105 hover:opacity-80 transition-all duration-200  gap-6 self-center px-9 py-4 mt-11 max-w-full text-xl font-semibold  rounded-md bg-[#79410073] bg-opacity-50 w-max max-md:px-5 max-md:mt-10 border-[#e07900] border-[1px] border-solid box-border h-[3.5rem] overflow-hidden text-left text-[1.25rem] text-white font-inter">
          <div className="grow shrink w-max">Explore Memes</div>
          <img
            draggable={`false`}
            loading="lazy"
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/a27f8e2060af3262aa59fdd3ca05f69444c4fd4ccbe5e32bae04ce9a6b1f8b3b?apiKey=b93734ecdcb94378af862d5b2ec71620&&apiKey=b93734ecdcb94378af862d5b2ec71620"
            className="object-contain shrink-0 my-auto aspect-[1.21] w-[17px]"
          />
        </div>
        {/* explore meme button */}
      </div>
      <div className="flex overflow-hidden  flex-col self-center mt-48 w-full rounded-xl  max-w-[1759px] max-md:mt-10 max-md:max-w-full">
        <div className="flex relative flex-col w-[90%] mx-auto  min-h-[408px] max-md:max-w-full">
          <img
            draggable={`false`}
            loading="lazy"
            src="https://i.imgur.com/24EE2Nu.png"
            className="object-fill   absolute inset-0 size-full"
          />
          <div className="flex relative flex-col items-start px-11 pt-9 pb-14 w-full  min-h-[408px] max-md:px-5 max-md:max-w-full">
            {/* <img
              draggable={`false`}
              loading="lazy"
              srcSet="https://cdn.builder.io/api/v1/image/assets/TEMP/4b3d3981452a93893b22d7620ecdd3118ecf5403f743bad460a0676292f819b7?apiKey=b93734ecdcb94378af862d5b2ec71620&&apiKey=b93734ecdcb94378af862d5b2ec71620&width=100 100w, https://cdn.builder.io/api/v1/image/assets/TEMP/4b3d3981452a93893b22d7620ecdd3118ecf5403f743bad460a0676292f819b7?apiKey=b93734ecdcb94378af862d5b2ec71620&&apiKey=b93734ecdcb94378af862d5b2ec71620&width=200 200w, https://cdn.builder.io/api/v1/image/assets/TEMP/4b3d3981452a93893b22d7620ecdd3118ecf5403f743bad460a0676292f819b7?apiKey=b93734ecdcb94378af862d5b2ec71620&&apiKey=b93734ecdcb94378af862d5b2ec71620&width=400 400w, https://cdn.builder.io/api/v1/image/assets/TEMP/4b3d3981452a93893b22d7620ecdd3118ecf5403f743bad460a0676292f819b7?apiKey=b93734ecdcb94378af862d5b2ec71620&&apiKey=b93734ecdcb94378af862d5b2ec71620&width=800 800w, https://cdn.builder.io/api/v1/image/assets/TEMP/4b3d3981452a93893b22d7620ecdd3118ecf5403f743bad460a0676292f819b7?apiKey=b93734ecdcb94378af862d5b2ec71620&&apiKey=b93734ecdcb94378af862d5b2ec71620&width=1200 1200w, https://cdn.builder.io/api/v1/image/assets/TEMP/4b3d3981452a93893b22d7620ecdd3118ecf5403f743bad460a0676292f819b7?apiKey=b93734ecdcb94378af862d5b2ec71620&&apiKey=b93734ecdcb94378af862d5b2ec71620&width=1600 1600w, https://cdn.builder.io/api/v1/image/assets/TEMP/4b3d3981452a93893b22d7620ecdd3118ecf5403f743bad460a0676292f819b7?apiKey=b93734ecdcb94378af862d5b2ec71620&&apiKey=b93734ecdcb94378af862d5b2ec71620&width=2000 2000w, https://cdn.builder.io/api/v1/image/assets/TEMP/4b3d3981452a93893b22d7620ecdd3118ecf5403f743bad460a0676292f819b7?apiKey=b93734ecdcb94378af862d5b2ec71620&&apiKey=b93734ecdcb94378af862d5b2ec71620"
              className="object-cover absolute inset-0 size-full"
            /> */}

            <div className="flex  relative flex-col justify-center px-2 py-1.5 mt-36 max-w-full text-2xl font-semibold tracking-tighter text-black rounded-xl w-[338px] max-md:mt-10">
              <div className="w-[338px]  cursor-pointer hover:scale-105 hover:opacity-80 transition-all duration-200 relative rounded-xl border-[#ff8a00] border-[0.7px] border-dashed box-border h-[4.625rem] overflow-hidden text-left text-[1.625rem] text-black font-inter">
                <div className="absolute flex items-center justify-center gap-5 top-[0.395rem] left-[0.538rem] rounded-[9px] bg-[#ff8a00] w-[20rem] h-[3.675rem] overflow-hidden">
                  <div className="flex items-center justify-center tracking-[-0.04em] font-semibold [text-shadow:0px_30px_60px_rgba(0,_0,_0,_0.5)]">
                    Let’s Earn
                  </div>
                  <img
                    className="max-h-full w-[1.75rem]"
                    alt=""
                    src="https://i.imgur.com/zuRUVEV.png"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col px-[125px] mt-28">
        <div className="w-max relative text-[5rem] tracking-[-0.04em] font-bebas-neue text-[#D8D8D8] text-left inline-block [text-shadow:0px_30px_60px_rgba(0,_0,_0,_0.5)]">
          explore games
        </div>
        <div className="w-max relative text-[1.063rem] uppercase font-medium font-inter text-white text-left inline-block">
          trending games
        </div>

        <div className="grid grid-cols-12 gap-7  w-full">
          <div className=" col-span-3">
            <div className=" flex flex-col gap-8 mt-[60px] ">
              <div className="   ">
                <img
                  className="w-full   rounded-[26px] max-w-full overflow-hidden h-[33.163rem] object-cover object-center "
                  src="https://i.imgur.com/vPnghUo.png"
                  alt=""
                />
              </div>

              <div>
                <img
                  className="rounded-[67px]  cursor-pointer hover:scale-105 hover:opacity-80 transition-all duration-200 mx-auto max-w-full overflow-hidden h-[3.188rem] object-cover"
                  src="https://i.imgur.com/HO3Alwn.png"
                  alt=""
                />
              </div>
            </div>
          </div>
          <div className=" col-span-3">
            {" "}
            <div className=" flex flex-col gap-8 mt-[60px] ">
              <div className="   ">
                <img
                  className="w-full   rounded-[26px] max-w-full overflow-hidden h-[33.163rem] object-cover object-center "
                  src="https://i.imgur.com/vPnghUo.png"
                  alt=""
                />
              </div>

              <div>
                <img
                  className="rounded-[67px]  cursor-pointer hover:scale-105 hover:opacity-80 transition-all duration-200 mx-auto max-w-full overflow-hidden h-[3.188rem] object-cover"
                  src="https://i.imgur.com/HO3Alwn.png"
                  alt=""
                />
              </div>
            </div>
          </div>
          <div className=" col-span-3">
            {" "}
            <div className=" flex flex-col gap-8 mt-[60px] ">
              <div className="   ">
                <img
                  className="w-full   rounded-[26px] max-w-full overflow-hidden h-[33.163rem] object-cover object-center "
                  src="https://i.imgur.com/vPnghUo.png"
                  alt=""
                />
              </div>

              <div>
                <img
                  className="rounded-[67px]  cursor-pointer hover:scale-105 hover:opacity-80 transition-all duration-200 mx-auto max-w-full overflow-hidden h-[3.188rem] object-cover"
                  src="https://i.imgur.com/HO3Alwn.png"
                  alt=""
                />
              </div>
            </div>
          </div>
          <div className=" col-span-3">
            {" "}
            <div className=" flex flex-col gap-8 mt-[60px] ">
              <div className="   ">
                <img
                  className="w-full   rounded-[26px] max-w-full overflow-hidden h-[33.163rem] object-cover object-center "
                  src="https://i.imgur.com/vPnghUo.png"
                  alt=""
                />
              </div>

              <div>
                <img
                  className="rounded-[67px]  cursor-pointer hover:scale-105 hover:opacity-80 transition-all duration-200 mx-auto max-w-full overflow-hidden h-[3.188rem] object-cover"
                  src="https://i.imgur.com/HO3Alwn.png"
                  alt=""
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className=" mt-20">

      <Footer/>
      </div>
    </div>
  );
}
