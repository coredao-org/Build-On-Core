import React from "react";
import Navbar from "../Homepage/Navbar";
import Footer from "../Homepage/Footer";

const AboutUs = () => {
  return (
    <div className="h-screen w-screen bg-[#101010] flex flex-col">
      <Navbar />
      <div className="flex justify-evenly items-center h-screen mt-56">
        <div className="text-white">
          <h3 className="text-7xl text-center font-semibold">
            About CoreUSD, <br /> {"(CUSD)"}
          </h3>
          <h2 className="mt-20 text-xl text-center">
            We&apos;re more than just a stablecoin; we&apos;re a platform built
            on <br /> innovation, trust, and accessibility.
          </h2>
        </div>
        <img
          src="https://stable0x.com/_next/image?url=%2Fabout.webp&w=640&q=75"
          alt="logo"
          className="w-1/3"
        />
      </div>
      <div className="h-screen w-screen text-white bg-[#101010]">
        <div className="flex justify-evenly items-center mt-36 mb-36">
          <h3 className="text-6xl font-medium">Our Focus</h3>
          <h3 className="w-[50%] font-normal text-lg">
            As a small, globally distributed, experienced team, we dedicate
            ourselves to driving technological breakthroughs, fostering seamless
            integration, and ensuring the security and efficiency of digital
            currencies for businesses and individuals alike. <br /> <br /> We
            develop technology products focused on reducing the barriers to
            adoption, designed to further the use cases for digital assets while
            taking advantage of ground-breaking technology. We don&apos;t bridge
            traditional finance with distributed technologies, we combine them.
          </h3>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AboutUs;
