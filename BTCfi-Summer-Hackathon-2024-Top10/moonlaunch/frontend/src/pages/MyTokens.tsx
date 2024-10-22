import { useState } from "react";
import CreatorTablerow from "../components/CreatorTableRow";
import { useMyTokens } from "../hooks/useToken";
import { useAccount } from "wagmi";
import EmptyState from "../components/EmptyState";
import { motion } from "framer-motion";

const Pageanime = {
  initial: {
    x: 800,
    opacity: 0,
  },
  animate: {
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.75,
      ease: "easeInOut",
    },
  },
  exit: {
    x: 300,
    opacity: 0,
    transition: {
      duration: 0.75,
      ease: "easeInOut",
    },
  },
};
const MyTokens = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const { chainId } = useAccount();
  const { address } = useAccount();
  const { data: tokens } = useMyTokens(
    chainId ? chainId : 1115,
    "timestamp",
    10,
    address || "0x"
  );
  const totalPages = 1;

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  console.log(tokens);
  return (
    <motion.div
      variants={Pageanime}
      initial="initial"
      animate="animate"
      exit="exit"
      className="bg-[#191A1A] px-5 pt-[80px] flex justify-center w-full "
    >
      <div className="max-w-[1200px] pt-10  flex flex-col   mt-10 p-6 gap-5  w-full rounded-xl ">
        <div className="flex md:flex-row flex-col gap-5 w-full justify-between  ">
          <div className="flex gap-5 items-center w-full ">
            <h1 className="font-semibold text-[20px] ">My Tokens</h1>{" "}
            <div className="border border-white rounded-lg flex justify-between items-center p-3 max-w-[110px] w-full h-[37px] ">
              <p>All</p>
              <img src="../images/dropdown.png" alt="" />
            </div>
          </div>
          <div className="flex gap-2 items-center mr-14">
            <img
              onClick={handlePreviousPage}
              className={
                currentPage === 1 ? "rotate-180 opacity-[0.4] " : "rotate-180 "
              }
              src="../images/nextarrow.png"
              alt=""
            />{" "}
            <span>{currentPage}</span>
            <img
              onClick={handleNextPage}
              src="../images/nextarrow.png"
              alt=""
              className={currentPage === totalPages ? "opacity-[0.4] " : " "}
            />
          </div>
        </div>
        <table className="w-full relative border-separate border-spacing-x-0 border-spacing-y-6 ">
          <tr className=" bg-[#00ECFF05] rounded-2xl text-center ">
            <th className=" rounded-l-2xl pl-10 px-3 py-4 text-left ">Token</th>
            <th className="px-3 py-4 text-left">Created At</th>
            <th className="px-3 py-4 text-left">Target</th>
            <th className="px-3 py-4 text-left">Market Cap</th>
            <th className=" rounded-r-2xl px-3 py-4 text-left ">Date</th>
          </tr>
          {(tokens?.length ?? 0 > 1) ? (
            tokens?.map((token, index) => (
              <CreatorTablerow token={token} key={index} />
            ))
          ) : (
            <div className="absolute w-full">
              <EmptyState text="No Tokens to Display" />
            </div>
          )}
        </table>
      </div>
    </motion.div>
  );
};

export default MyTokens;
