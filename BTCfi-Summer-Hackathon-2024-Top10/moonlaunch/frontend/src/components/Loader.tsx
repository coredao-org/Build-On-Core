import React from "react";
import { motion } from "framer-motion";

interface TextProps {
  text: string;
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

const ImgAnime = {
  animate: {
    scale: [1, 1.2, 1],
    opacity: [0.3, 1, 0.3],
    transition: {
      duration: 1,
      repeat: Infinity,
    },
  },
};
const Loader: React.FC<TextProps> = ({ text }) => {
  return (
    <motion.div
      variants={Pageanime}
      initial="initial"
      animate="animate"
      exit="exit"
      className="fixed top-0 left-0 h-full w-full pt-[80px] grid place-items-center bg-[#191A1AF2] "
    >
      <div className="flex flex-col gap-2 items-center ">
        <motion.img
          variants={ImgAnime}
          animate="animate"
          src="../images/loading.png"
          alt=""
        />
        <p className="text-lg">{text}</p>
      </div>
    </motion.div>
  );
};

export default Loader;
