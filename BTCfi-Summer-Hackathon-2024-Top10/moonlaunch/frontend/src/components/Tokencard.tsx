import { Link } from "react-router-dom";
import { Token } from "../constants/types";
import { truncate } from "../utils/helper";
import { formatEther } from "viem";
import { motion } from "framer-motion";

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
    scale: 1.05,
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
const Tokencard = ({ token }: { token: Token }) => {
  return (
    <Link
      to={`/token/${token.id}`}
      className="max-w-[390px] w-full h-[200px] rounded-lg "
    >
      <motion.div
        variants={BtnHover}
        whileTap="onTap"
        whileHover="hover"
        animate="animate"
        className="rounded-lg w-full h-full "
      >
        <div
          className="h-full rounded-t-lg"
          style={{
            backgroundImage: `linear-gradient(to bottom, #191a1a99, #191a1a35),
          url("${token.logoUrl.slice(0, 5) == "https" ? token.logoUrl : "../images/chart.png"}")`,
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            backgroundSize: "cover",
          }}
        >
          <div className="flex items-center w-full justify-start px-3 py-5 gap-5">
            <img src="./images/tokenImg.png" alt="" />
            <div className="flex flex-col gap-2">
              <p className="text-sm font-semibold ">
                {token.name} <span>[${token.symbol}]</span>
              </p>
              <p className=" text-[10px] flex items-center gap-1 font-semibold ">
                {truncate(token.address)}{" "}
                <span>
                  <img src="./images/copy.png" alt="" />
                </span>
              </p>
            </div>
          </div>
        </div>
        <div className="flex w-full justify-between items-center px-3 py-2 bg-[#2C2C2C] font-semibold text-[7px] rounded-b-lg ">
          <p>
            Market cap:{" "}
            <span className="text-[#00ECFF] ml-1 ">
              {parseFloat(formatEther(BigInt(token.marketCap))).toFixed(5)} CORE
            </span>
          </p>
          <p>
            Target:{" "}
            <span className="text-[#00ECFF] ml-1 ">
              {parseFloat(formatEther(BigInt(token.targetMcap || 0))).toFixed(
                5
              )}{" "}
              CORE
            </span>
          </p>
          <p>
            Created on:{" "}
            <span className="text-[#00ECFF] ml-1 ">{token.timestamp}</span>
          </p>
          <img src={"./images/share.png"} alt="" />
        </div>
      </motion.div>
    </Link>
  );
};

export default Tokencard;
