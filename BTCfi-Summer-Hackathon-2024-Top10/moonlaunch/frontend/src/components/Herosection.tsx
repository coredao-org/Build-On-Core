import { useNavigate } from "react-router-dom";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import { useAccount } from "wagmi";
import { motion } from "framer-motion";

const Herosection = () => {
  const { open } = useWeb3Modal();
  const { address } = useAccount();
  const navigate = useNavigate();
  const handleLaunchToken = () => {
    if (address) {
      navigate("/launch");
    } else {
      open();
      // navigate("/launch");
      address ? navigate("/launch") : null;
    }
  };

  const BtnHover = {
    animate: {
      scale: 1,
      transition: {
        duration: 0.75,

        type: "spring",
        ease: "easeInOut",
      },
    },
    hover: {
      scale: 1.1,
      transition: {
        duration: 0.75,

        type: "spring",
        ease: "easeInOut",
      },
    },
    onTap: {
      scale: 1,
      transition: {
        duration: 0.25,
        ease: "easeInOut",
      },
    },
  };

  const MaintextAnime = {
    initial: {
      y: -70,
      opacity: 0,
    },
    inView: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.75,
        delay: 0.5,
        ease: "easeInOut",
      },
    },
  };

  return (
    <div
      id="home"
      className=" heroBG w-full  md:pt-[20px] flex justify-center items-center pb-16 h-screen "
    >
      {" "}
      <div className="max-w-[1100px] w-full flex-col flex items-center gap-6 justify-between md:justify-center h-[85%] md:h-auto ">
        <motion.div
          variants={MaintextAnime}
          whileInView="inView"
          initial="initial"
          className="text-center font-bold text-5xl flex flex-col items-center gap-1 text-[#ffffff] uppercase  "
        >
          <h1>Lauch With confidence </h1>
          <h1>Build on core</h1>
        </motion.div>
        <div className="rocketBG w-[320px] h-[370px] flex justify-center items-center rounded-2xl border-2 border-[#00ECFF] ">
          <img src="./images/rocket.gif" alt="" />
        </div>
        <motion.button
          variants={BtnHover}
          whileTap="onTap"
          whileHover="hover"
          animate="animate"
          onClick={handleLaunchToken}
          className="uppercase heroBTN mt-2 p-[1px]  rounded-md h-[48px] "
        >
          <span className=" bg-[#353535] h-full rounded-md text-center flex justify-center items-center px-3 ">
            Launch new token
          </span>
        </motion.button>
      </div>
    </div>
  );
};

export default Herosection;
