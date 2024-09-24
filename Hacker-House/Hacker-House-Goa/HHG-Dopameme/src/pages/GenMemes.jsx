import Navbar from "@/components/Navbar";
import RegisterModal from "@/components/RegisterModal";
import React from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../Context/ContextProvider";
import Loader from "@/components/Loader";
import Footer from "@/components/Footer";

const GenMemes = () => {
  const { memeType, setMemeType, setReload, account, read, data, loader } =
    React.useContext(Context);
  const navigate = useNavigate();
  return (
    <div className=" bg-[#030214] ">
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
      <div>
        <Navbar />
      </div>

      <div className="my-10 px-[10%]">
        <img
          draggable={`false`}
          className=" object-cover"
          src="https://i.imgur.com/03Yv5w0.png"
          alt=""
        />
      </div>

      <div className="grid px-[10%] grid-cols-12 gap-x-6 gap-y-11 ">
        {/* card1 */}
        <div
          onClick={() => {
            setMemeType(0);
            navigate("/meme-input");
          }}
          className=" col-span-4 "
        >
          <div className="relative">
            <img
              draggable={`false`}
              className="object-cover"
              src="https://i.imgur.com/CX83Ivp.png"
              alt=""
            />
            <div className=" absolute  bottom-5 left-5">
              <div className="w-[186px]  cursor-pointer hover:scale-105 hover:opacity-80 transition-all duration-200 flex items-center justify-around px-2 relative rounded-3xl bg-[#00000054] border-white border-[1px] border-solid box-border h-[2.5rem] overflow-hidden text-left text-[1.125rem] text-white font-inter">
                <div className="font-semibold w-max">Generate Memes</div>
                <img
                  draggable={`false`}
                  className="w-[0.938rem] h-[1.875rem] overflow-hidden"
                  alt=""
                  src="https://i.imgur.com/fxdnvk3.png"
                />
              </div>
            </div>
          </div>
        </div>
        {/* card2 */}
        <div
          onClick={() => {
            setMemeType(1);
            navigate("/meme-input");
          }}
          className=" col-span-4 "
        >
          <div className="relative">
            <img
              draggable={`false`}
              className="object-cover"
              src="https://i.imgur.com/0eL82gS.png"
              alt=""
            />
            <div className=" absolute  bottom-5 left-5">
              <div className="w-[186px]  cursor-pointer hover:scale-105 hover:opacity-80 transition-all duration-200 flex items-center justify-around px-2 relative rounded-3xl bg-[#00000054] border-white border-[1px] border-solid box-border h-[2.5rem] overflow-hidden text-left text-[1.125rem] text-white font-inter">
                <div className="font-semibold w-max">Generate Memes</div>
                <img
                  draggable={`false`}
                  className="w-[0.938rem] h-[1.875rem] overflow-hidden"
                  alt=""
                  src="https://i.imgur.com/fxdnvk3.png"
                />
              </div>
            </div>
          </div>
        </div>
        {/* card3 */}
        <div
          onClick={() => {
            setMemeType(2);
            navigate("/meme-input");
          }}
          className=" col-span-4 "
        >
          <div className="relative">
            <img
              draggable={`false`}
              className="object-cover"
              src="https://i.imgur.com/7liDqXc.png"
              alt=""
            />
            <div className=" absolute  bottom-5 left-5">
              <div className="w-[186px]  cursor-pointer hover:scale-105 hover:opacity-80 transition-all duration-200 flex items-center justify-around px-2 relative rounded-3xl bg-[#00000054] border-white border-[1px] border-solid box-border h-[2.5rem] overflow-hidden text-left text-[1.125rem] text-white font-inter">
                <div className="font-semibold w-max">Generate Memes</div>
                <img
                  draggable={`false`}
                  className="w-[0.938rem] h-[1.875rem] overflow-hidden"
                  alt=""
                  src="https://i.imgur.com/fxdnvk3.png"
                />
              </div>
            </div>
          </div>
        </div>
        {/* card4 */}
        <div
          onClick={() => {
            setMemeType(3);
            navigate("/meme-input");
          }}
          className=" col-span-4 "
        >
          <div className="relative">
            <img
              draggable={`false`}
              className="object-cover"
              src="https://i.imgur.com/2zjbSHN.png"
              alt=""
            />
            <div className=" absolute  bottom-5 left-5">
              <div className="w-[186px]  cursor-pointer hover:scale-105 hover:opacity-80 transition-all duration-200 flex items-center justify-around px-2 relative rounded-3xl bg-[#00000054] border-white border-[1px] border-solid box-border h-[2.5rem] overflow-hidden text-left text-[1.125rem] text-white font-inter">
                <div className="font-semibold w-max">Generate Memes</div>
                <img
                  draggable={`false`}
                  className="w-[0.938rem] h-[1.875rem] overflow-hidden"
                  alt=""
                  src="https://i.imgur.com/fxdnvk3.png"
                />
              </div>
            </div>
          </div>
        </div>
        {/* card5 */}
        <div
          onClick={() => {
            setMemeType(4);
            navigate("/meme-input");
          }}
          className=" col-span-4 "
        >
          <div className="relative">
            <img
              draggable={`false`}
              className="object-cover"
              src="https://i.imgur.com/Ne0WR56.png"
              alt=""
            />
            <div className=" absolute  bottom-5 left-5">
              <div className="w-[186px]  cursor-pointer hover:scale-105 hover:opacity-80 transition-all duration-200 flex items-center justify-around px-2 relative rounded-3xl bg-[#00000054] border-white border-[1px] border-solid box-border h-[2.5rem] overflow-hidden text-left text-[1.125rem] text-white font-inter">
                <div className="font-semibold w-max">Generate Memes</div>
                <img
                  draggable={`false`}
                  className="w-[0.938rem] h-[1.875rem] overflow-hidden"
                  alt=""
                  src="https://i.imgur.com/fxdnvk3.png"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-28">
        <Footer />
      </div>
    </div>
  );
};

export default GenMemes;
