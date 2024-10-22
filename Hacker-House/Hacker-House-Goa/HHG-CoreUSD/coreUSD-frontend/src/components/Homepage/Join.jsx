import { useAnimation, useInView, motion } from "framer-motion";
import React, { useEffect, useRef } from "react";

const Join = () => {
  const controls = useAnimation();
  const ref = useRef();
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (inView) {
      controls.start({ scale: 1 });
    } else {
      controls.start({ scale: 0.5 });
    }
  }, [controls, inView]);

  return (
    <div className="container py-12 lg:py-[125px] px-12 lg:px-[125px]">
      <div className="relative flex flex-col gap-5 rounded-[24px] bg-[#FFCF52] px-6 pb-[272px] pt-8 lg:h-[486px] lg:gap-6 lg:rounded-[32px] lg:px-[70px] lg:py-[109px]">
        <h3 className="z-10 text-[32px] font-medium leading-[38px] text-[#101010] lg:text-5xl lg:leading-[58px]">
          Join StableOG Ecosystem
        </h3>
        <p className="z-10 pb-3 text-lg font-normal text-[#282828] lg:max-w-[415px] lg:pb-6 lg:text-xl lg:leading-[30px]">
          Tap into our liquidity contribution program tailored for blockchain
          networks and DeFi protocols unlocking exclusive yield opportunities.
        </p>
        <form className="z-10 flex flex-col gap-2 lg:flex-row">
          <input
            className="flex h-12 w-full rounded-[12px] border border-[#E7E7E7] bg-background px-4 py-3 text-base font-normal text-[#101010] placeholder:text-base placeholder:font-normal placeholder:text-[#A0A0A0] focus:border-[#888888] focus:placeholder:opacity-0 focus-visible:outline-none focus-visible:ring-0 lg:w-[304px]"
            placeholder="Enter your email"
          />
          <a
            href="https://docs.google.com/forms/d/e/1FAIpQLSe55F-AHgIiVyR01icWbH6W2iNwBwtYEFnYWPp2g6CFdbXknw/viewform"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-12 w-full items-center justify-center rounded-[10px] bg-[#101010] text-base font-medium text-[#FFFFFF] transition-colors duration-300 ease-in-out hover:bg-[#585858] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 lg:w-[116px]"
          >
            Join waitlist
          </a>
        </form>
        <motion.img
          ref={ref}
          animate={controls}
          initial={{ scale: 0.5 }}
          transition={{ duration: 0.5 }}
          alt=""
          loading="lazy"
          className="absolute bottom-0 right-0 hidden rounded-br-[32px] lg:block w-[644px] h-[416px]"
          src="https://stable0x.com/_next/image?url=%2Fjoin.webp&w=750&q=75"
        />
      </div>
    </div>
  );
};

export default Join;
