import { motion, useAnimation, useInView } from "framer-motion";
import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const Footer = () => {
  const controls = useAnimation();
  const ref = useRef();
  const inView = useInView(ref, { once: true });

  const navigate = useNavigate();

  useEffect(() => {
    if (inView) {
      controls.start({ scale: 1 });
    } else {
      controls.start({ scale: 0.75 });
    }
  }, [controls, inView]);
  return (
    <div className="bg-[#101010]">
      <div className="flex items-center justify-between gap-2 pb-6 pt-12 lg:pb-5 lg:pt-[98px] px-12 lg:px-[125px]">
        <div className="flex w-full flex-col">
          <div className="mb-6 flex justify-between md:justify-start md:gap-[128px] lg:mb-[78px]">
            <div className="flex flex-col gap-2">
              <p className="pb-2 text-base font-medium uppercase leading-[20px] text-[#888888] lg:text-lg lg:leading-[21px]">
                products
              </p>
              <p className="cursor-not-allowed text-base font-medium text-[#FFFFFF] opacity-50 transition-colors duration-300 ease-in-out">
                CUSD
              </p>
              <p className="cursor-not-allowed text-base font-medium text-[#FFFFFF] opacity-50 transition-colors duration-300 ease-in-out">
                API
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <p className="pb-2 text-base font-medium uppercase leading-[20px] text-[#888888] lg:text-lg lg:leading-[21px]">
                company
              </p>
              <a
                className="text-base font-medium text-[#FFFFFF] transition-colors duration-300 ease-in-out hover:text-[#A0A0A0] cursor-pointer"
                onClick={() => {
                  navigate("/about");
                }}
              >
                About us
              </a>
              <p className="cursor-not-allowed text-base font-medium text-[#FFFFFF] opacity-50 transition-colors duration-300 ease-in-out">
                Legal
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <p className="pb-2 text-base font-medium uppercase leading-[20px] text-[#888888] lg:text-lg lg:leading-[21px]">
                resources
              </p>
              <p className="cursor-not-allowed text-base font-medium text-[#FFFFFF] opacity-50 transition-colors duration-300 ease-in-out">
                Docs
              </p>
              <p className="cursor-not-allowed text-base font-medium text-[#FFFFFF] opacity-50 transition-colors duration-300 ease-in-out">
                Security
              </p>
              <p className="cursor-not-allowed text-base font-medium text-[#FFFFFF] opacity-50 transition-colors duration-300 ease-in-out">
                FAQ
              </p>
            </div>
          </div>
          <div className="flex justify-between">
            <div className="flex flex-col justify-end">
              <div className="mb-6 flex gap-4 lg:mb-12">
                <a
                  href="https://twitter.com/stable0x"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg
                    viewBox="0 0 27 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="size-6 fill-[#FFFFFF] transition-colors duration-300 ease-in-out hover:fill-[#CBF48F]"
                  >
                    <g clipPath="url(#clip0_2650_21461)">
                      <path d="M20.9067 0H24.96L16.1067 10.1867L26.56 24H18.3467L11.9467 15.6267L4.58667 24H0.533333L10.0267 13.12L0 0H8.42667L14.24 7.68L20.9067 0ZM19.4667 21.5467H21.7067L7.2 2.29333H4.74667L19.4667 21.5467Z"></path>
                    </g>
                    <defs>
                      <clipPath id="clip0_2650_21461">
                        <rect width="26.56" height="24"></rect>
                      </clipPath>
                    </defs>
                  </svg>
                </a>
                <a
                  href="https://www.linkedin.com/company/stable0x/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg
                    viewBox="0 0 25 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="size-6 fill-[#FFFFFF] transition-colors duration-300 ease-in-out hover:fill-[#CBF48F]"
                  >
                    <g id="LinkedIn_logo 1" clipPath="url(#clip0_2650_21464)">
                      <path
                        id="Path 2520"
                        d="M20.9429 20.3829H17.3983V14.8319C17.3983 13.5082 17.3747 11.8042 15.5548 11.8042C13.7086 11.8042 13.4261 13.2464 13.4261 14.7355V20.3826H9.88152V8.96742H13.2844V10.5274H13.332C13.6725 9.94515 14.1646 9.46616 14.7559 9.14144C15.3471 8.81673 16.0153 8.65846 16.6894 8.68348C20.282 8.68348 20.9444 11.0466 20.9444 14.1208L20.9429 20.3829ZM5.88202 7.40705C5.47519 7.40712 5.07746 7.28655 4.73915 7.06059C4.40084 6.83463 4.13716 6.51341 3.9814 6.13758C3.82564 5.76174 3.78482 5.34816 3.86412 4.94913C3.94342 4.5501 4.13927 4.18354 4.42689 3.89582C4.71452 3.60809 5.081 3.41212 5.48 3.33267C5.879 3.25323 6.29259 3.29389 6.66849 3.44952C7.04438 3.60514 7.36568 3.86873 7.59177 4.20695C7.81785 4.54518 7.93857 4.94286 7.93864 5.34969C7.93869 5.61982 7.88552 5.88731 7.7822 6.1369C7.67887 6.38648 7.52741 6.61327 7.33643 6.80431C7.14546 6.99535 6.91871 7.14691 6.66916 7.25033C6.41962 7.35374 6.15215 7.407 5.88202 7.40705ZM7.65433 20.3829H4.10602V8.96742H7.65433V20.3829ZM22.7101 0.0013857H2.32486C1.86218 -0.00383572 1.41632 0.174849 1.08531 0.498173C0.754304 0.821498 0.565217 1.26301 0.55957 1.72569V22.1955C0.565024 22.6584 0.754 23.1002 1.085 23.4239C1.416 23.7475 1.86195 23.9266 2.32486 23.9216H22.7101C23.1739 23.9275 23.6211 23.7489 23.9534 23.4253C24.2857 23.1016 24.476 22.6593 24.4824 22.1955V1.72422C24.4758 1.26062 24.2854 0.818602 23.9531 0.495285C23.6208 0.171968 23.1737 -0.00620614 22.7101 -9.18154e-05"
                      ></path>
                    </g>
                    <defs>
                      <clipPath id="clip0_2650_21464">
                        <rect
                          width="24"
                          height="24"
                          transform="translate(0.560059)"
                        ></rect>
                      </clipPath>
                    </defs>
                  </svg>
                </a>
              </div>
              <p className="max-w-[108px] text-sm font-normal leading-[18px] text-[rgba(255,255,255,0.55)] md:max-w-full lg:text-base lg:leading-5">
                © Copyright 2024. All rights reserved
              </p>
            </div>
            <svg
              viewBox="0 0 387 395"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="block h-[126px] w-[124px] lg:hidden "
            >
              <path
                d="M235.461 254.018V330.759C235.461 334.795 238.75 338.066 242.809 338.066H319.973C324.032 338.066 327.32 334.795 327.32 330.759V254.018C327.32 249.982 324.032 246.711 319.973 246.711H242.809C238.75 246.711 235.461 249.982 235.461 254.018ZM292.186 320.469L283.76 306.485C282.664 304.665 280.009 304.647 278.886 306.449L270.152 320.514C269.427 321.676 268.149 322.388 266.772 322.388H253.971C252.702 322.388 251.95 320.982 252.648 319.937L270.088 293.844C270.994 292.492 271.003 290.735 270.106 289.374L253.998 264.849C253.309 263.794 254.07 262.407 255.33 262.407H268.602C269.998 262.407 271.284 263.128 272 264.317L278.985 275.832C280.072 277.634 282.691 277.67 283.832 275.895L291.343 264.227C292.077 263.092 293.336 262.407 294.686 262.407H307.479C308.756 262.407 309.508 263.83 308.793 264.885L292.503 288.464C291.56 289.825 291.542 291.609 292.448 292.988L310.188 319.955C310.876 321.009 310.124 322.397 308.856 322.397H295.601C294.206 322.397 292.91 321.667 292.195 320.478L292.186 320.469Z"
                fill="#1C1C1C"
              ></path>
              <path
                d="M318.078 394.721H68.6385C30.7949 394.721 0 364.104 0 326.459V68.5317C0 30.8869 30.7858 0.27002 68.6385 0.27002H318.087C355.931 0.27002 386.726 30.8869 386.726 68.5317V326.468C386.726 364.104 355.94 394.73 318.087 394.73L318.078 394.721ZM68.6385 28.1387C46.2422 28.1387 28.0225 46.2584 28.0225 68.5317V326.468C28.0225 348.742 46.2422 366.861 68.6385 366.861H318.087C340.483 366.861 358.703 348.742 358.703 326.468V68.5317C358.703 46.2584 340.483 28.1387 318.087 28.1387H68.6385Z"
                fill="#1C1C1C"
              ></path>
              <path
                d="M145.185 338.063H67.3597C61.0449 338.063 57.2487 331.08 60.7187 325.827L161.094 173.68L234.942 61.7543C236.41 59.5288 238.911 58.1863 241.583 58.1863H319.354C325.669 58.1863 329.465 65.1692 325.995 70.4222L151.817 334.495C150.349 336.72 147.849 338.063 145.176 338.063H145.185Z"
                fill="#1C1C1C"
              ></path>
            </svg>
          </div>
        </div>
        <motion.div
          ref={ref}
          animate={controls}
          initial={{ scale: 0.5 }}
          transition={{ duration: 0.5 }}
        >
          <svg
            viewBox="0 0 387 395"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="hidden h-[394px] w-[386px] lg:block "
          >
            <path
              d="M235.461 254.018V330.759C235.461 334.795 238.75 338.066 242.809 338.066H319.973C324.032 338.066 327.32 334.795 327.32 330.759V254.018C327.32 249.982 324.032 246.711 319.973 246.711H242.809C238.75 246.711 235.461 249.982 235.461 254.018ZM292.186 320.469L283.76 306.485C282.664 304.665 280.009 304.647 278.886 306.449L270.152 320.514C269.427 321.676 268.149 322.388 266.772 322.388H253.971C252.702 322.388 251.95 320.982 252.648 319.937L270.088 293.844C270.994 292.492 271.003 290.735 270.106 289.374L253.998 264.849C253.309 263.794 254.07 262.407 255.33 262.407H268.602C269.998 262.407 271.284 263.128 272 264.317L278.985 275.832C280.072 277.634 282.691 277.67 283.832 275.895L291.343 264.227C292.077 263.092 293.336 262.407 294.686 262.407H307.479C308.756 262.407 309.508 263.83 308.793 264.885L292.503 288.464C291.56 289.825 291.542 291.609 292.448 292.988L310.188 319.955C310.876 321.009 310.124 322.397 308.856 322.397H295.601C294.206 322.397 292.91 321.667 292.195 320.478L292.186 320.469Z"
              fill="#1C1C1C"
            ></path>
            <path
              d="M318.078 394.721H68.6385C30.7949 394.721 0 364.104 0 326.459V68.5317C0 30.8869 30.7858 0.27002 68.6385 0.27002H318.087C355.931 0.27002 386.726 30.8869 386.726 68.5317V326.468C386.726 364.104 355.94 394.73 318.087 394.73L318.078 394.721ZM68.6385 28.1387C46.2422 28.1387 28.0225 46.2584 28.0225 68.5317V326.468C28.0225 348.742 46.2422 366.861 68.6385 366.861H318.087C340.483 366.861 358.703 348.742 358.703 326.468V68.5317C358.703 46.2584 340.483 28.1387 318.087 28.1387H68.6385Z"
              fill="#1C1C1C"
            ></path>
            <path
              d="M145.185 338.063H67.3597C61.0449 338.063 57.2487 331.08 60.7187 325.827L161.094 173.68L234.942 61.7543C236.41 59.5288 238.911 58.1863 241.583 58.1863H319.354C325.669 58.1863 329.465 65.1692 325.995 70.4222L151.817 334.495C150.349 336.72 147.849 338.063 145.176 338.063H145.185Z"
              fill="#1C1C1C"
            ></path>
          </svg>
        </motion.div>
      </div>
    </div>
  );
};

export default Footer;
