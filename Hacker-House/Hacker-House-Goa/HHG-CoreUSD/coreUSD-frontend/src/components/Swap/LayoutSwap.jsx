import React from "react";
import NavbarLB from "../LendingBorrowing/NavbarLB";
import Swap from "./Swap";

const LayoutSwap = () => {
  return (
    <div className="h-screen flex flex-col text-white">
      <div className="bg-black/90 h-[93px]">
        <NavbarLB />
      </div>
      <Swap />
    </div>
  );
};

export default LayoutSwap;
