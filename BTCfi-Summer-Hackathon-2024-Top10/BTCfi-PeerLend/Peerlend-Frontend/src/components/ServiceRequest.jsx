import { useState } from "react";
import { isSupportedChain } from "../utility";
import {
  useWeb3ModalAccount,
  useWeb3ModalProvider,
} from "@web3modal/ethers/react";
import { getProtocolContract, getErc20TokenContract } from "../constants/contract";
import { getProvider } from "../constants/providers";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';

import { ethers } from "ethers";

import TokenList from '../constants/tokenList';
const style = {
  position: 'absolute',
  top: '50% ',
  left: '50%',
  color: 'white',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  borderRadius: 8,
  border: '1px solid #e0bb8395',
  boxShadow: 24,
  backgroundColor: '#1E1D34',
  p: 4,
};

const ServiceRequest = (request) => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const { walletProvider } = useWeb3ModalProvider();

  const requestId = request.id;
  const requestDetails = request.request;
  const lender = requestDetails?.lender;
  const tokenDecimals = TokenList[requestDetails?.loanReq].decimals;
  const borrower = requestDetails?.address;
  const amount = ethers.formatUnits(requestDetails?.amount.toString(), tokenDecimals).toString();
  const interest = requestDetails?.interest.toString();
  const totalRepayment = ethers.formatUnits(requestDetails?.repayment.toString(), tokenDecimals).toString();
  const returnDate = new Date(Number(requestDetails?.rDate) * 1000).toDateString();
  const loanCurrency = TokenList[requestDetails?.loanReq].name;
  const tokenAdd = TokenList[requestDetails?.loanReq].address;
  const loanStatus = requestDetails?.loanStatus.toString();

  async function handleRequest() {
    const readWriteProvider = getProvider(walletProvider);
    const signer = await readWriteProvider.getSigner();

    const contract = getProtocolContract(signer);
    const erc20contract = getErc20TokenContract(signer, tokenAdd);

    const _amount = ethers.parseUnits(amount, TokenList[tokenAdd].decimals).toString();

    try {
      const approveTx = await erc20contract.approve(contract.getAddress(), _amount);
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

      const serviceTx = await contract.serviceRequest(borrower, requestId, tokenAdd);
      const serviceReceipt = await serviceTx.wait();

      if (serviceReceipt.status) {
        return toast.success("Service request successful!", {
          position: "top-center",
        });
      } else {
        toast.error("Service request failed!", {
          position: "top-center",
        });
        throw new Error("Service request failed");
      }
    } catch (error) {
      console.log(contract.interface.parseError("0x06115b56"))
      toast.error("Transaction failed", {
        position: "top-center",
      });
      console.log(error);
    }

  };

  return (
    <div className="lg:w-[48%] md:w-[48%] w-[100%]">
      <div>
        {loanStatus === "0" && <button
          onClick={handleOpen}
          // {...(loanStatus !== "0" ? { disabled: true } : {})}
          className="bg-[#E0BB83] text-[#2a2a2a] my-2 hover:bg-[#2a2a2a] hover:text-[white] hover:font-bold px-4 py-2  font-playfair w-[95%] mx-auto text-center lg:text-[18px] md:text-[18px] text-[16px] font-bold rounded-lg"
        >Service</button>}
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            {/* <input type="text" placeholder='Request ID' className="rounded-lg w-[100%] p-4 bg-[#ffffff23] backdrop-blur-lg mb-4 outline-none" value={requestId} onChange={(e) => handleChange(e)} /> */}
            <input type="text" placeholder='Lender' className="rounded-lg w-[100%] p-4 bg-[#ffffff23] backdrop-blur-lg mb-4 outline-none" value={lender} disabled />
            <input type="text" placeholder='Loan Currency' className="rounded-lg w-[100%] p-4 bg-[#ffffff23] backdrop-blur-lg mb-4 outline-none" value={loanCurrency} disabled />
            <input type="text" placeholder='Amount' className="rounded-lg w-[100%] p-4 bg-[#ffffff23] backdrop-blur-lg mb-4 outline-none" value={amount} disabled />
            <input type="text" placeholder='Interest' className="rounded-lg w-[100%] p-4 bg-[#ffffff23] backdrop-blur-lg mb-4 outline-none" value={interest} disabled />
            <input type="text" placeholder='Total Repayment' className="rounded-lg w-[100%] p-4 bg-[#ffffff23] backdrop-blur-lg mb-4 outline-none" value={totalRepayment} disabled />
            <input type="text" placeholder='Return date' className="rounded-lg w-[100%] p-4 bg-[#ffffff23] backdrop-blur-lg mb-4 outline-none" value={returnDate} disabled />
            <button className="bg-[#E0BB83] text-[#2a2a2a] my-2 hover:bg-[#2a2a2a] hover:text-[white] hover:font-bold px-4 py-2  font-playfair w-[95%] mx-auto text-center text-[16px] font-bold rounded-lg" onClick={handleRequest}>Service Request &rarr;</button>
          </Box>
        </Modal>
      </div>
    </div>
  )
}

export default ServiceRequest