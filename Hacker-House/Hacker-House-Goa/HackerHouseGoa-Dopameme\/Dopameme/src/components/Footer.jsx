import React from "react";

const Footer = () => {
  return (
    <footer className="w-full flex flex-col items-center gap-3 py-4 bg-black text-white text-sm font-semibold font-inter">
      <div className="w-4/5 text-center text-[0.85rem] tracking-tight">
        Built by #Builders at HH Goa
      </div>
      <div className="w-4/5 text-center text-[0.85rem]">
        Designed and Developed by Swayam, Shreyash, and Vivek
      </div>
      <div className="w-11/12 text-center text-[0.85rem]">
        © 2024 Dopameme | All rights reserved
      </div>
    </footer>
  );
};

export default Footer;
