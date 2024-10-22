import React from "react";
import { useNavigate } from "react-router-dom";
import { logo } from "../../assets";
import { ConnectButton } from "@rainbow-me/rainbowkit";

const NavbarLB = () => {
  const navigate = useNavigate();
  return (
    <div className="relative flex justify-center mb-10">
      <div className="flex absolute w-full justify-between h-10 bg-opacity-10 border-b-2 border-gray-500 items-center z-10 p-10 bg-black">
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
        <div className="flex w-[30%] justify-between text-2xl font-semibold h-10 rounded-lg text-white">
          <div
            className="cursor-pointer hover:text-purple-400"
            onClick={() => {
              navigate("/product");
            }}
          >
            Borrow & Repay
          </div>
          <div
            className="cursor-pointer hover:text-purple-400"
            onClick={() => {
              navigate("/swap");
            }}
          >
            Swap
          </div>
          <div
            className="cursor-pointer hover:text-purple-400"
            onClick={() => {
              navigate("/restake");
            }}
          >
            Restake
          </div>
        </div>
        <div>
          <ConnectButton />
        </div>
      </div>
    </div>
  );
};

export default NavbarLB;
