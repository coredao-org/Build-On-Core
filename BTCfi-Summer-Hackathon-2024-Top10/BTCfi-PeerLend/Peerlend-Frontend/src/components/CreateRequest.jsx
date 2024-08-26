import { useState } from "react";
// import { isSupportedChain } from "../utility";
// import { isAddress } from "ethers";
import {
  // useWeb3ModalAccount,
  useWeb3ModalProvider,
} from "@web3modal/ethers/react";
import { getProtocolContract } from "../constants/contract";
import { getProvider } from "../constants/providers";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
// import Select from '@mui/material/Select';
import Modal from '@mui/material/Modal';
// import InputLabel from '@mui/material/InputLabel';
// import MenuItem from '@mui/material/MenuItem';
import { ethers } from "ethers";
import TokenList from '../constants/tokenList';
import { tokens } from "../constants/OnchainTokenList";
import { TokenSelectDropdown } from '@coinbase/onchainkit/token';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  color: 'white',
  transform: 'translate(-50%, -50%)',
  width: 400,
  // borderRadius: 8,
  border: '1px solid #e0bb8395',
  boxShadow: 24,
  backgroundColor: '#1E1D34',
  borderRadius: 10,
  p: 4,
};

const CreateRequest = () => {

  const [amount, setAmount] = useState(0);
  const [interest, setInterest] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [loanCurrency, setLoanCurrency] = useState("");
  const [selectLoanCurrency, setSelectLoanCurrency] = useState("");
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // const { chainId } = useWeb3ModalAccount();
  const { walletProvider } = useWeb3ModalProvider();

  async function handleRequest() {
    // if (!isSupportedChain(chainId)) return console.error("Wrong network");
    // if (!isAddress(address)) return console.error("Invalid address");
    const readWriteProvider = getProvider(walletProvider);
    const signer = await readWriteProvider.getSigner();

    const contract = getProtocolContract(signer);

    try {
      const _returnDate = new Date(returnDate).getTime() / 1000;
      // const _amount = ethers.parseUnits(amount, TokenList[loanCurrency]?.decimals);

      const transaction = await contract.createLendingRequest(amount, interest, _returnDate, loanCurrency);
      console.log("transaction: ", transaction);
      const receipt = await transaction.wait();

      console.log("receipt: ", receipt);

      if (receipt.status) {
        return toast.success("Request successful!", {
          position: "top-center",
        });
      }

      toast.error("Request failed, Verify email first!", {
        position: "top-center",
      });
    } catch (error) {
      console.error(error);
      toast.error("Request failed!", {
        position: "top-center",
      });
    } finally {
      setAmount(0);
      setInterest("");
      setReturnDate("");
      setLoanCurrency("");

      handleClose();
    }
  }

  const handleTokenChange = (e) => {
    console.log(e);
    setSelectLoanCurrency(e);
    setLoanCurrency(e.address);
  }

  return (
    <div>
      <div>
        <button className="bg-[#E0BB83] text-[#2a2a2a] my-2 hover:bg-[#2a2a2a] hover:text-[white] hover:font-bold px-4 py-2  font-playfair w-[95%] mx-auto text-center lg:text-[18px] md:text-[18px] text-[16px] font-bold rounded-lg" onClick={handleOpen}>Create Request</button>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <input type="text" placeholder='Amount' className="rounded-lg w-[100%] p-4 bg-[#ffffff23] backdrop-blur-lg mb-4 outline-none" onChange={(e) => setAmount(e.target.value)} />
            <input type="text" placeholder='Interest' className="rounded-lg w-[100%] p-4 bg-[#ffffff23] backdrop-blur-lg mb-4 outline-none" onChange={(e) => setInterest(e.target.value)} />
            <input type="Date" placeholder='Return date' className="rounded-lg w-[100%] p-4 bg-[#ffffff23] backdrop-blur-lg mb-4 outline-none" onChange={(e) => setReturnDate(e.target.value)} />
            <TokenSelectDropdown sx={{ backgroundColor: "#ffffff23", outline: "none", color: "gray", marginBottom: "20px" }} token={selectLoanCurrency} setToken={handleTokenChange} options={tokens} />
            <FormControl fullWidth>
              {/* <InputLabel id="demo-simple-select-label" sx={{ color: "white" }}>Loan Currency</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={loanCurrency}
                label="loan currency"
                onChange={(e) => setLoanCurrency(e.target.value)}
                sx={{ backgroundColor: "#ffffff23", outline: "none", color: "gray", marginBottom: "20px" }}
              >
                {Object.keys(TokenList).map((address) => {
                  const token = TokenList[address];
                  return (<MenuItem key={token.address} value={token.address}>{token.symbol}</MenuItem>)
                })}
              </Select> */}
            </FormControl>
            <button className="bg-[#E0BB83] text-[#2a2a2a] my-2 hover:bg-[#2a2a2a] hover:text-[white] hover:font-bold px-4 py-2  font-playfair w-[95%] mx-auto text-center text-[16px] font-bold rounded-lg" onClick={handleRequest}>Create &rarr;</button>
          </Box>
        </Modal>
      </div>
    </div>
  )
};

export default CreateRequest