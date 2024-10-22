import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

interface ModalProps {
  data: {
    mainText: string;
    subText: string;
    subText2: string;
    link?: string;
    myTokens: boolean;
  };
  setShowModal: (value: boolean) => void;
}

const Pageanime = {
  initial: {
    scale: 0,
    opacity: 0,
  },
  animate: {
    scale: 1,
    opacity: 1,
    transition: {
      duration: 0.35,
      ease: "easeInOut",
    },
  },
  exit: {
    scale: 0,
    opacity: 0,
    transition: {
      duration: 0.75,
      ease: "easeInOut",
    },
  },
};

const Modal: React.FC<ModalProps> = ({ data, setShowModal }) => {
  return (
    <motion.div
      variants={Pageanime}
      initial="initial"
      animate="animate"
      exit="exit"
      className="fixed top-0 left-0 w-full flex justify-center items-center pt-[90px] bg-[#00000033] h-full backdrop-blur-sm "
    >
      <div className="p-[1px] rounded-xl heroBTN ">
        <div className="h-[450px] px-5 py-7 rounded-xl launchBG flex items-end relative ">
          <button
            onClick={() => setShowModal(false)}
            className="absolute top-3 right-3 p-2 rounded-full bg-[#fff] "
          >
            <img src="../images/close.png" alt="" />
          </button>
          <div className="h-max flex flex-col gap-14 items-center ">
            <div className="flex flex-col items-center gap-4 text-center ">
              <img className="w-[60px]" src="../images/modalTick.png" alt="" />
              <h1 className=" text-xl font-semibold  ">{data.mainText}</h1>
              <p className="max-w-[300px] text-sm font-semibold w-full ">
                {data.subText}
              </p>
              <button className="flex text-sm items-center gap-1 ">
                {data.myTokens && <Link to={data.link!}>{data.subText2}</Link>}
                {!data.myTokens && (
                  <a href={data.link} target="_blank">
                    {data.subText2}
                  </a>
                )}
              </button>
            </div>
            <div className="flex items-center gap-2">
              <img className="w-[50px]" src="../images/Core 2.png" alt="" />{" "}
              <h1 className="uppercase font-bold text-2xl ">MOONLAUNCH</h1>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Modal;
