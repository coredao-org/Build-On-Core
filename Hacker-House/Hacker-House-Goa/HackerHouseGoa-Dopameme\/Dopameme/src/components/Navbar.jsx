import React from "react";
import { Context } from "../Context/ContextProvider";
import { useNavigate } from "react-router-dom";
import { DynamicWidget } from "@dynamic-labs/sdk-react-core";

const Navbar = () => {
  const { navActiveBar, setNavActiveBar,account } = React.useContext(Context);
  const handleButtonClick = (buttonName) => {
    setNavActiveBar(buttonName);
    };
    const navigate = useNavigate();

  return (
    <div className="">
      <div className="flex bg-[#030214]   max-md:flex-col">
        <div className="flex flex-col w-[20%] max-md:ml-0 max-md:w-full">
          <img
            draggable={`false`}
            loading="lazy"
            srcSet="https://cdn.builder.io/api/v1/image/assets/TEMP/33af5a984c84fc157cfdabe710ddf82e46a1115dd6e16902aa6e8fc0e20df9cf?apiKey=b93734ecdcb94378af862d5b2ec71620&&apiKey=b93734ecdcb94378af862d5b2ec71620&width=100 100w, https://cdn.builder.io/api/v1/image/assets/TEMP/33af5a984c84fc157cfdabe710ddf82e46a1115dd6e16902aa6e8fc0e20df9cf?apiKey=b93734ecdcb94378af862d5b2ec71620&&apiKey=b93734ecdcb94378af862d5b2ec71620&width=200 200w, https://cdn.builder.io/api/v1/image/assets/TEMP/33af5a984c84fc157cfdabe710ddf82e46a1115dd6e16902aa6e8fc0e20df9cf?apiKey=b93734ecdcb94378af862d5b2ec71620&&apiKey=b93734ecdcb94378af862d5b2ec71620&width=400 400w, https://cdn.builder.io/api/v1/image/assets/TEMP/33af5a984c84fc157cfdabe710ddf82e46a1115dd6e16902aa6e8fc0e20df9cf?apiKey=b93734ecdcb94378af862d5b2ec71620&&apiKey=b93734ecdcb94378af862d5b2ec71620&width=800 800w, https://cdn.builder.io/api/v1/image/assets/TEMP/33af5a984c84fc157cfdabe710ddf82e46a1115dd6e16902aa6e8fc0e20df9cf?apiKey=b93734ecdcb94378af862d5b2ec71620&&apiKey=b93734ecdcb94378af862d5b2ec71620&width=1200 1200w, https://cdn.builder.io/api/v1/image/assets/TEMP/33af5a984c84fc157cfdabe710ddf82e46a1115dd6e16902aa6e8fc0e20df9cf?apiKey=b93734ecdcb94378af862d5b2ec71620&&apiKey=b93734ecdcb94378af862d5b2ec71620&width=1600 1600w, https://cdn.builder.io/api/v1/image/assets/TEMP/33af5a984c84fc157cfdabe710ddf82e46a1115dd6e16902aa6e8fc0e20df9cf?apiKey=b93734ecdcb94378af862d5b2ec71620&&apiKey=b93734ecdcb94378af862d5b2ec71620&width=2000 2000w, https://cdn.builder.io/api/v1/image/assets/TEMP/33af5a984c84fc157cfdabe710ddf82e46a1115dd6e16902aa6e8fc0e20df9cf?apiKey=b93734ecdcb94378af862d5b2ec71620&&apiKey=b93734ecdcb94378af862d5b2ec71620"
            className="object-contain grow shrink-0 max-w-full aspect-[1.33] w-[162px] max-md:mt-10"
          />
        </div>
        <div className="flex flex-col items-end ml-5 mx-auto w-[60%] max-md:ml-0 max-md:w-full">
          <div className="flex  w-max  relative  gap-10 justify-between items-center  m-auto  min-w-[320px] max-md:mt-10 max-md:max-w-full">
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
                className={`w-max h-max  cursor-pointer hover:scale-105 hover:opacity-80 transition-all duration-200 capitalize ${
                  navActiveBar === "Home" ? "text-white" : ""
                }`}
                onClick={() => {
                  handleButtonClick("Home");
                  navigate("/");
                }}
              >
                {" "}
                Home
              </div>
              <div
                className={`w-max h-max capitalize   cursor-pointer hover:scale-105 hover:opacity-80 transition-all duration-200 ${
                  navActiveBar === "Explore" ? "text-white" : ""
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
                  navActiveBar === "Gen Memes" ? "text-white" : ""
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
                  navActiveBar === "Games" ? "text-white" : ""
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
        </div>
        <div className="w-[20%]  flex items-center justify-center">
          {account?<div className=" relative  cursor-pointer hover:scale-105 hover:opacity-80 transition-all duration-200  border-white border-[1px] px-6 py-[6px] border-dashed box-border h-[2.838rem]  overflow-hidden text-left text-[1.375rem]  font-bebas-neue">
            <div
              onClick={() => {
                handleButtonClick("profile");
                navigate("/profile");
              }}
              className={`w-max h-max  cursor-pointer hover:scale-105 hover:opacity-80 transition-all duration-200 capitalize ${
                navActiveBar === "profile" ? "text-white" : "text-[#7b7b7b]"
              }`}
            >
              profile
            </div>
          </div> :
            <div>
              <DynamicWidget/>
          </div>
          }
        </div>
      </div>
    </div>
  );
};

export default Navbar;
