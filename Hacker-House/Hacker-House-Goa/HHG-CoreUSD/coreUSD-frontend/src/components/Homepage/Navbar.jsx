import { useNavigate } from "react-router-dom";
import { arrow, logo } from "../../assets";

const Navbar = ({ onScrollToInfo, onScrollToPartner }) => {
  const navigate = useNavigate();

  return (
    <div className="relative">
      <div className="flex absolute w-full justify-evenly z-10 p-10">
        <div className="flex w-56 justify-between">
          <img
            src={logo}
            className="w-10 h-10"
            onClick={() => {
              navigate("/");
            }}
          />
          <h1
            className="text-4xl font-bold text-white font-josefin flex justify-center mt-1 cursor-pointer"
            onClick={() => {
              navigate("/");
            }}
          >
            StableOG
          </h1>
        </div>
        <div className="border-2 w-72 h-10 border-gray-700/30 rounded-lg text-white">
          <div className="flex justify-between items-center px-7 h-full font-medium cursor-pointer">
            <span
              onClick={() => {
                navigate("/about");
              }}
            >
              About us
            </span>
            <span onClick={onScrollToInfo}>TL;DR</span>
            <span onClick={onScrollToPartner}>Partners</span>
          </div>
        </div>
        <button className="flex cursor-pointer">
          <div className="h-full w-10 bg-[#CBF48F] rounded-[10px] flex justify-center items-center ">
            <img src={arrow} className="w-8" />
          </div>
          <div
            className="bg-[#CBF48F] h-full rounded-[10px] w-28 flex justify-center items-center font-josefin font-semibold"
            onClick={() => {
              navigate("/product");
            }}
          >
            Get Started
          </div>
        </button>
      </div>
    </div>
  );
};

export default Navbar;
