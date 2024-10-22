import React from "react";
import { infoLogo } from "../../assets";
import { motion } from "framer-motion";

const Info = () => {
  const animationVariants = {
    hidden: { opacity: 0, y: 100 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div>
      <div>
        <motion.h2
          className="text-center text-[32px] font-medium leading-[44px] text-[#101010] lg:text-[64px] lg:leading-[76px] mt-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ duration: 1.25 }}
          variants={animationVariants}
        >
          New Stablecoin Paradigm
        </motion.h2>
      </div>
      <div className="grid w-full grid-cols-10 gap-3 lg:gap-6 p-20">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ duration: 1.25 }}
          variants={animationVariants}
          className="col-span-10 col-start-1 grid w-full gap-3 lg:col-span-4 lg:grid-rows-5 lg:gap-6"
        >
          <div className="flex flex-col justify-between gap-10 rounded-[24px] p-6 lg:gap-0 lg:rounded-[32px] lg:p-8 col-span-10 col-start-1 bg-[#101010] lg:col-span-4 lg:row-span-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 40 40"
              fill="none"
              className="size-10 text-[#FFFFFF]"
            >
              <rect
                x="6"
                y="23"
                width="9"
                height="9"
                rx="1.66667"
                stroke="white"
                strokeWidth="2"
              ></rect>
              <rect
                x="25"
                y="23"
                width="10"
                height="9"
                rx="1.66667"
                stroke="white"
                strokeWidth="2"
              ></rect>
              <rect
                x="15"
                y="7"
                width="10"
                height="9"
                rx="1.66667"
                stroke="white"
                strokeWidth="2"
              ></rect>
              <path
                d="M16 16L11 23"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>
              <path
                d="M24 16L29 23"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>
            </svg>
            <div className="flex flex-col gap-3">
              <h5 className="text-xl font-medium leading-6 lg:text-2xl lg:leading-7 text-[#FFFFFF]">
                What We Do?
              </h5>
              <p className="text-sm font-normal lg:text-base text-[#CFCFCF]">
                StableOG is establishing the most extensive stablecoin network.
                It caters to billions of individuals, millions of businesses,
                and developers globally.
              </p>
            </div>
          </div>
          <div className="flex flex-col justify-between gap-10 rounded-[24px] p-6 lg:rounded-[32px] lg:p-8 col-span-10 col-start-1 bg-[#FFCF52] lg:col-span-4 lg:row-span-2 lg:gap-[22px]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 40 40"
              fill="none"
              className="size-10 text-[#101010]"
            >
              <g clipPath="url(#clip0_2650_21326)">
                <path
                  d="M6.6665 13.3332V9.9999C6.6665 9.11584 7.01769 8.268 7.64281 7.64288C8.26794 7.01775 9.11578 6.66656 9.99984 6.66656H13.3332"
                  stroke="#101010"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
                <path
                  d="M6.6665 26.6666V29.9999C6.6665 30.884 7.01769 31.7318 7.64281 32.3569C8.26794 32.982 9.11578 33.3332 9.99984 33.3332H13.3332"
                  stroke="#101010"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
                <path
                  d="M26.6665 6.66656H29.9998C30.8839 6.66656 31.7317 7.01775 32.3569 7.64288C32.982 8.268 33.3332 9.11584 33.3332 9.9999V13.3332"
                  stroke="#101010"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
                <path
                  d="M26.6665 33.3332H29.9998C30.8839 33.3332 31.7317 32.982 32.3569 32.3569C32.982 31.7318 33.3332 30.884 33.3332 29.9999V26.6666"
                  stroke="#101010"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
                <path
                  d="M13.3335 19.9999C13.3335 19.5579 13.5091 19.134 13.8217 18.8214C14.1342 18.5089 14.5581 18.3333 15.0002 18.3333H25.0002C25.4422 18.3333 25.8661 18.5089 26.1787 18.8214C26.4912 19.134 26.6668 19.5579 26.6668 19.9999V24.9999C26.6668 25.442 26.4912 25.8659 26.1787 26.1785C25.8661 26.491 25.4422 26.6666 25.0002 26.6666H15.0002C14.5581 26.6666 14.1342 26.491 13.8217 26.1785C13.5091 25.8659 13.3335 25.442 13.3335 24.9999V19.9999Z"
                  stroke="#101010"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
                <path
                  d="M16.6665 18.3332V14.9999C16.6665 14.1158 17.0177 13.268 17.6428 12.6429C18.2679 12.0178 19.1158 11.6666 19.9998 11.6666C20.8839 11.6666 21.7317 12.0178 22.3569 12.6429C22.982 13.268 23.3332 14.1158 23.3332 14.9999V18.3332"
                  stroke="#101010"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
              </g>
              <defs>
                <clipPath id="clip0_2650_21326">
                  <rect width="40" height="40" fill="white"></rect>
                </clipPath>
              </defs>
            </svg>
            <div className="flex flex-col gap-3">
              <h5 className="text-xl font-medium leading-6 lg:text-2xl lg:leading-7 text-[#101010]">
                Fully Programmable
              </h5>
              <p className="text-sm font-normal lg:text-base text-[#282828]">
                Take advantage of CUSD full programmability to explore
                opportunities in crypto capital markets, including trading,
                borrowing, lending, and fundraising, accessible on a global
                scale.
              </p>
            </div>
          </div>
        </motion.div>
        <motion.div
          className="col-span-10 col-start-1 grid gap-3 lg:col-span-6 lg:col-start-5 lg:col-end-11 lg:grid-rows-5 lg:gap-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ duration: 1.25 }}
          variants={animationVariants}
        >
          <div className="flex flex-col justify-between gap-10 rounded-[24px] p-6 lg:gap-0 lg:rounded-[32px] lg:p-8 col-start-1 col-end-11 bg-[#CBF48F] lg:row-span-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 40 40"
              fill="none"
              className="size-10 text-[#101010]"
            >
              <g clipPath="url(#clip0_2650_21315)">
                <path
                  d="M6.66675 26.6666L16.6667 15L25.0001 23.3333L33.3334 13.3333"
                  stroke="#101010"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
                <path
                  d="M23.3333 23.3333C23.3333 23.7754 23.5088 24.1993 23.8214 24.5118C24.134 24.8244 24.5579 25 24.9999 25C25.4419 25 25.8659 24.8244 26.1784 24.5118C26.491 24.1993 26.6666 23.7754 26.6666 23.3333C26.6666 22.8913 26.491 22.4674 26.1784 22.1548C25.8659 21.8423 25.4419 21.6666 24.9999 21.6666C24.5579 21.6666 24.134 21.8423 23.8214 22.1548C23.5088 22.4674 23.3333 22.8913 23.3333 23.3333Z"
                  fill="#101010"
                ></path>
              </g>
              <defs>
                <clipPath id="clip0_2650_21315">
                  <rect width="40" height="40" fill="white"></rect>
                </clipPath>
              </defs>
            </svg>
            <div className="flex flex-col gap-3">
              <h5 className="text-xl font-medium leading-6 lg:text-2xl lg:leading-7 text-[#101010]">
                Secure
              </h5>
              <p className="text-sm font-normal lg:text-base text-[#282828]">
                StableOG leverages advanced cryptographic techniques and secure
                protocols to guarantee the safety of all transactions and data.
              </p>
            </div>
          </div>
          <div className="justify-between gap-10 rounded-[24px] p-6 lg:gap-0 lg:rounded-[32px] lg:p-8 col-start-1 col-end-11 flex flex-col bg-[#F5F6FB] lg:col-end-5 lg:row-span-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 40 40"
              fill="none"
              className="size-10 text-[#101010]"
            >
              <g clipPath="url(#clip0_2650_21338)">
                <path
                  d="M6.66675 6.66667H16.6667V16.6667H6.66675V6.66667Z"
                  stroke="#101010"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
                <path
                  d="M23.3333 6.66667H33.3333V16.6667H23.3333V6.66667Z"
                  stroke="#101010"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
                <path
                  d="M6.66675 23.3333H16.6667V33.3333H6.66675V23.3333Z"
                  stroke="#101010"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
                <path
                  d="M23.3333 28.3333C23.3333 29.6594 23.86 30.9312 24.7977 31.8689C25.7354 32.8065 27.0072 33.3333 28.3333 33.3333C29.6593 33.3333 30.9311 32.8065 31.8688 31.8689C32.8065 30.9312 33.3333 29.6594 33.3333 28.3333C33.3333 27.0072 32.8065 25.7355 31.8688 24.7978C30.9311 23.8601 29.6593 23.3333 28.3333 23.3333C27.0072 23.3333 25.7354 23.8601 24.7977 24.7978C23.86 25.7355 23.3333 27.0072 23.3333 28.3333Z"
                  stroke="#101010"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
              </g>
              <defs>
                <clipPath id="clip0_2650_21338">
                  <rect width="40" height="40" fill="white"></rect>
                </clipPath>
              </defs>
            </svg>
            <div className="flex flex-col gap-3">
              <h5 className="text-xl font-medium leading-6 lg:text-2xl lg:leading-7 text-[#101010]">
                Near Zero-cost
              </h5>
              <p className="text-sm font-normal lg:text-base text-[#404040]">
                Eliminate concerns about gas fees by paying transfer fees in
                CUSD, the same currency used for gas. No need to hold Ethereum
                or other volatile digital assets.
              </p>
            </div>
          </div>

          <div className="col-start-1 col-end-11 flex flex-col items-center justify-center rounded-[24px] bg-[#F5F6FB] px-[56px] py-[46px] lg:col-start-5 lg:row-span-3 lg:rounded-[32px] lg:px-[75px] lg:py-[62px]">
            <img
              alt="info Logo"
              loading="lazy"
              src={infoLogo}
              className="w-[224px]"
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Info;
