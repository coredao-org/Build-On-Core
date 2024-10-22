import { Link } from "react-router-dom";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import { useAccount } from "wagmi";
import { truncate } from "../utils/helper";

const Navbar = () => {
  const { open } = useWeb3Modal();
  const { address } = useAccount();

  return (
    <div className="w-full z-10 fixed top-0 left-0 flex justify-center items-center px-7 bg-[#161616] border-b border-[#ffffff] h-[80px] ">
      <div className="max-w-[1200px] w-full flex justify-between items-center ">
        <div className="flex gap-6 items-center">
          <Link to={"/"}>
            <img src="../images/navlogo.png" alt="" />{" "}
          </Link>
          <div className="md:flex gap-2 hidden uppercase">
            {" "}
            <Link
              to="/"
              className="hover:text-[#00ECFF] active:text-[#00ECFF] "
            >
              Home
            </Link>{" "}
            {address && (
              <Link
                to="/mytokens"
                className="hover:text-[#00ECFF] active:text-[#00ECFF]  "
              >
                MyTokens
              </Link>
            )}{" "}
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => open()}
            className="px-5 py-1 border-r border-[#ffffff"
          >
            {address ? truncate(address) : "Connect Wallet"}
          </button>
          <div className="flex justify-center items-center">
            <input
              className=" hidden "
              placeholder="Search Token"
              type="text"
              name=""
              id=""
            />
            <img src="../images/navsearch.png" alt="" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
