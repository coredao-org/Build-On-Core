import { Token } from "../constants/types";
import Tokencard from "./Tokencard";
import EmptyState from "./EmptyState";
import { motion } from "framer-motion";
// import { Element } from "react-scroll";

const listContainer = {
  initial: {
    opacity: 0,
  },
  inView: {
    opacity: 1,
    transition: {
      duration: 0.01,
      ease: "easeInOut",
      staggerChildren: 0.5,
      When: "beforeChildren",
    },
  },
};

const listItem = {
  initial: {
    y: 120,
    opacity: 0,
  },
  inView: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.75,
      ease: "easeInOut",
    },
  },
};
const Tokendisplay = ({ tokens }: { tokens: Token[] }) => {
  return (
    <div
      id="tokens"
      className="bg-[#191A1A] h-fit px-8 pt-40 w-full flex flex-col items-center mb-5 gap-10"
    >
      <div className="flex w-full gap-4 justify-between  ">
        <motion.div
          variants={listContainer}
          animate="initial"
          whileInView="inView"
          className="text-sm font-medium font-[chakra-petch] flex gap-5 w-full items-center "
        >
          <motion.div
            variants={listItem}
            className="border border-white rounded-lg flex justify-between items-center gap-2 px-3 max-w-[177px] w-full h-[40px] py-2 cursor-pointer "
          >
            <img src="../images/navsearch.png" alt="" />
            <input
              className="bg-transparent border-l border-white px-3  w-full outline-none  "
              placeholder="Search..."
              type="text"
              name=""
              id=""
            />
          </motion.div>
          <motion.div
            variants={listItem}
            className="border border-white rounded-lg flex justify-between items-center p-3 max-w-[120px] w-full h-[40px] cursor-pointer "
          >
            <p>Filter</p>
            <img src="../images/dropdown.png" alt="" />
          </motion.div>
        </motion.div>

        <motion.div className="flex gap-2 items-center mr-14">
          <img
            className="rotate-180 opacity-[0.4] "
            src="../images/nextarrow.png"
            alt=""
          />{" "}
          <span>1</span>
          <img src="../images/nextarrow.png" alt="" />
        </motion.div>
      </div>
      <div className="w-full flex justify-center items-center">
        <div className="flex flex-wrap w-full relative justify-between gap-y-14 gap-x-5">
          {(tokens?.length ?? 0 > 1) ? (
            tokens?.map((token) => <Tokencard token={token} key={token.id} />)
          ) : (
            <EmptyState text="No Token to Display" />
          )}
        </div>
      </div>
    </div>
  );
};

export default Tokendisplay;
