import React from "react";
import NavbarLB from "../LendingBorrowing/NavbarLB";
import Stake from "./Stake";

const LayoutStake = () => {
  return (
    <div className="h-full flex flex-col text-white">
      <div className="bg-black h-[93px]">
        <NavbarLB />
      </div>
      <Stake />
    </div>
  );
};

export default LayoutStake;
