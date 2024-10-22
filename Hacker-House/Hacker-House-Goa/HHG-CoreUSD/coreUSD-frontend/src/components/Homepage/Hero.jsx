import { useEffect, useRef } from "react";
import { hero } from "../../assets";
import { useInView } from "framer-motion";

const Hero = () => {
  const ref = useRef(null);
  const isInView = useInView(ref);

  return (
    <div className="relative text-white w-full h-full">
      <h1 className="text-center text-[44px] font-medium leading-[52px] lg:text-5xl lg:leading-[86px] absolute top-[10%] left-[35%] animate-fadeInUp">
        Introducing CoreUSD,
      </h1>
      <h1 className="text-center text-[44px] font-medium leading-[52px] lg:text-4xl lg:leading-[86px] absolute top-[14%] left-[15%] animate-fadeInUp">
        The Stablecoin backed by Core Token and Secured by Restaked LSD&apos;s
      </h1>
      <div>
        <h2 className="text-center text-4xl font-medium leading-[44px] text-[#FFFFFF] lg:text-[64px] lg:leading-[76px] absolute bottom-[14%] left-[35%]">
          Horizontal Scaling
        </h2>
        <p className="mt-5 absolute text-center text-sm font-normal leading-[27px] text-[#CFCFCF] lg:mt-6 lg:max-w-[580px] lg:text-lg lg:leading-[30px] bottom-[7%] left-[33%] max-w-[508px]">
          The native cross-chain functionality diminishes dependence on bridges,
          seamlessly integrating CUSD into the united growing L1/L2 blockchains
          ecosystem, thus improving liquidity flow for each network.
        </p>
      </div>
      <img src={hero} alt="Hero" className="w-full h-auto" />
    </div>
  );
};

export default Hero;
