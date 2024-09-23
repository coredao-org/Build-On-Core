import React from "react";
import COP from "../LendingBorrowing/COP";
import { ShootingStars } from "../ui/shooting-stars";
import { StarsBackground } from "../ui/starsBG";
import NavbarLB from "./NavbarLB";

const LayoutLB = () => {
  return (
    <div className="h-screen bg-neutral-900 flex flex-col items-center justify-center relative w-full text-white overflow-auto no-scrollbar">
      <div className="relative z-10 flex flex-col gap-20 h-screen">
        <NavbarLB />
        <COP />
      </div>
      <ShootingStars />
      <StarsBackground />
    </div>
  );
};

export default LayoutLB;
