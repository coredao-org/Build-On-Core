import { useState } from "react";
// import { isSupportedChain } from "../utility";
import {
  // useWeb3ModalAccount,
  useWeb3ModalProvider,
} from "@web3modal/ethers/react";
import {
  getProtocolContract,
  getErc20TokenContract,
} from "../constants/contract";
import { getProvider } from "../constants/providers";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
// import Select from "@mui/material/Select";
import Modal from "@mui/material/Modal";
// import InputLabel from "@mui/material/InputLabel";
// import MenuItem from "@mui/material/MenuItem";
import { ethers } from "ethers";
import TokenList from "../constants/tokenList";
import { TokenSelectDropdown } from '@coinbase/onchainkit/token';
import { tokens } from "../constants/OnchainTokenList";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  color: "white",
  transform: "translate(-50%, -50%)",
  width: 400,
  borderRadius: 8,
  border: '1px solid #e0bb8395',
  boxShadow: 24,
  backgroundColor: "#1E1D34",
  p: 4,
};

const DepositCollateral = () => {
  // const { chainId } = useWeb3ModalAccount();
  const { walletProvider } = useWeb3ModalProvider();
  const [tokenAdd, setTokenAdd] = useState("");
  const [selectTokenAdd, setSelectTokenAdd] = useState("");
  const [depositAmount, setDepositAmount] = useState(0);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  async function handleRequest() {
    // if (!isSupportedChain(chainId)) return console.error("Wrong network");
    const readWriteProvider = getProvider(walletProvider);
    const signer = await readWriteProvider.getSigner();

    const contract = getProtocolContract(signer);
    const erc20contract = getErc20TokenContract(signer, tokenAdd);

    try {
      console.log(depositAmount, tokenAdd);
      const approveTx = await erc20contract.approve(
        import.meta.env.VITE_CONTRACT_ADDRESS,
        ethers.parseUnits(depositAmount, TokenList[tokenAdd]?.decimals)
      );
      const approveReceipt = await approveTx.wait();

      if (approveReceipt.status) {
        toast.success("Approval successful!", {
          position: "top-center",
        });
      } else {
        toast.error("Approval failed!", {
          position: "top-center",
        });
        throw new Error("Approval failed");
      }

      const transaction = await contract.depositCollateral(
        tokenAdd,
        ethers.parseUnits(depositAmount, TokenList[tokenAdd]?.decimals)
      );
      console.log("transaction: ", transaction);
      const receipt = await transaction.wait();

      console.log("receipt: ", receipt);

      if (receipt.status) {
        return toast.success("Collateral deposit successful!", {
          position: "top-center",
        });
      } else {
        toast.error("Collateral deposit failed!", {
          position: "top-center",
        });
      }
    } catch (error) {
      toast.error("Collateral deposit failed", {
        position: "top-center",
      });
      console.log(error);
    } finally {
      setDepositAmount(0);
      setTokenAdd("");
      handleClose()
    }
  }

  const handleTokenChange = (e) => {
    console.log(e);
    setSelectTokenAdd(e);
    setTokenAdd(e.address);
  }

  return (
    <div className="w-[100%]">
      <button
        onClick={handleOpen}
        className="bg-[#E0BB83] text-[#2a2a2a] my-2 hover:bg-[#2a2a2a] hover:text-[white] hover:font-bold px-4 py-2  font-playfair w-[95%] mx-auto text-center lg:text-[18px] md:text-[18px] text-[16px] font-bold rounded-lg"
      >Deposit</button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <p className='lg:text-[20px] md:text-[20px] text-[18px] my-6 text-[#E0BB83] font-playfair font-bold'>Deposit collateral</p>
          <TokenSelectDropdown sx={{ backgroundColor: "#ffffff23", outline: "none", color: "gray", marginBottom: "20px" }} token={selectTokenAdd} setToken={handleTokenChange} options={tokens} />
          <FormControl fullWidth>
            {/* <InputLabel id="demo-simple-select-label" sx={{ color: "white" }}>Token Address</InputLabel> */}
            {/* <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={tokenAdd}
              label="Token address"
              onChange={(e) => setTokenAdd(e.target.value)}
              sx={{ backgroundColor: "#ffffff23", outline: "none", color: "gray", marginBottom: "20px" }}
            >
              {Object.keys(TokenList).map((address) => {
                const token = TokenList[address];
                return (<MenuItem key={token.address} value={token.address}>{token.symbol}</MenuItem>)
              })}
            </Select> */}
          </FormControl>
          <input
            type="text"
            placeholder="amount of collateral"
            className="rounded-lg w-[100%] p-4 bg-[#ffffff23] backdrop-blur-lg mb-4 outline-none"
            onChange={(e) => setDepositAmount(e.target.value)}
          />
          <button
            className="bg-[#E0BB83] text-[#2a2a2a] my-2 hover:bg-[#2a2a2a] hover:text-[white] hover:font-bold px-4 py-2  font-playfair w-[95%] mx-auto text-center text-[16px] font-bold rounded-lg"
            onClick={handleRequest}
          >Deposit</button>
        </Box>
      </Modal>
    </div>
  )
};

export default DepositCollateral;