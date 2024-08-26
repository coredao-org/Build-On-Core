import { useState } from "react";
import {
    useWeb3ModalAccount,
    useWeb3ModalProvider,
} from "@web3modal/ethers/react";
import { getProtocolContract, getErc20TokenContract } from "../constants/contract";
import { getProvider } from "../constants/providers";
import { toast } from "react-toastify";
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';

import { ethers } from "ethers";

import TokenList from '../constants/tokenList';
const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    color: 'white',
    transform: 'translate(-50%, -50%)',
    width: 500,
    bgcolor: 'background.paper',
    borderRadius: 8,
    border: '1px solid #e0bb8395',
    boxShadow: 24,
    backgroundColor: '#1E1D34',
    p: 3,
};

const RespondToOffer = () => {
    const { walletProvider } = useWeb3ModalProvider();
    const { address } = useWeb3ModalAccount();
    const [requestId, setRequestId] = useState("");
    const [offerId, setOfferId] = useState("");
    const [offers, setOffers] = useState([]);
    const [lenderAddress, setlenderAddress] = useState("");
    const [amount, setAmount] = useState(0);
    const [interest, setInterest] = useState(0);
    const [returnDate, setReturnDate] = useState(1767139200 * 1000);
    const [collateralCurrencyAddress, setCollateralCurrencyAddress] = useState("");
    const [requestStatus, setRequestStatus] = useState("");
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);


    async function handleChange(event) {
        if (event.target.value === "" || event.target.value === undefined) {
            setRequestId("");
            return console.log("No request id found");
        }

        const _requestId = event.target.value;
        setRequestId(event.target.value);

        try {
            const provider = getProvider(walletProvider);

            const contract = await getProtocolContract(provider);
            const request = await contract.getRequestById(_requestId);

            console.log(request);

            setlenderAddress(request["1"]);
            setAmount(request["2"].toString());
            setInterest(request["3"].toString());
            setReturnDate(Number(request["6"]) * 1000);
            setCollateralCurrencyAddress(request["8"]);

            setOffers([...request["5"]]);

            console.log("Offers", offers);

            switch (request["9"].toString()) {
                case "0":
                    setRequestStatus("Open");
                    break;
                case "1":
                    setRequestStatus("Serviced");
                    break;
                case "2":
                    setRequestStatus("Closed");
                    break;
            }

        } catch (error) {
            console.log(error);
            toast.error("Request not found", {
                position: "top-center",
            });
            console.log("Request not found");

            setlenderAddress("");
            setAmount(0);
            setInterest(0);
            setReturnDate(1767139200 * 1000);
            setRequestId("");
            setCollateralCurrencyAddress("");
            setRequestStatus("");
        }
    }

    async function handleOfferId(event) {
        if (requestId == "" || requestId == undefined) {
            setOfferId("");
            toast.error("No request id found")
            return console.log("No request id found");
        }
        if (event.target.value === "" || event.target.value === undefined) {
            setOfferId("");
            return console.log("No offer id found");
        }

        const _id = Number(event.target.value)

        if (_id >= offers.length) {
            toast.error("Offer not found")
            return console.log("Offer not found")
        }

        setOfferId(event.target.value);

        const _offer = offers[_id];

        setlenderAddress(_offer["2"]);
        setAmount(_offer["3"]);
        setInterest(_offer["4"]);
        setReturnDate(_offer["5"]);

        console.log(_offer)
    }

    async function handleRespondToOffer(status) {
        if (requestId === "" || requestId === "0" || requestId === undefined) {
            return toast.error("Request Id is required", {
                position: "top-center",
            });
        }

        if (offerId === "" || offerId === undefined) {
            return toast.error("Offer Id is required", {
                position: "top-center",
            });
        }

        if (status !== "1" && status !== "2") {
            return toast.error("Invalid status", {
                position: "top-center",
            });
        }

        const provider = getProvider(walletProvider);
        const signer = await provider.getSigner();

        const contract = await getProtocolContract(signer);

        try {
            const transaction = await contract.respondToLendingOffer(requestId, offerId, status);
            const receipt = await transaction.wait();
            console.log(receipt);

            if (status === "1") {
                toast.success("Offer rejected", {
                    position: "top-center",
                });
            } else if (status === "2") {
                toast.success("Offer accepted", {
                    position: "top-center",
                });
            }
        } catch (error) {
            toast.error("Offer transaction failed", {
                position: "top-center",
            });
            console.log(error);
        } finally {
            setCollateralAmount(0);
            setCollateralCurrencyAddress("");
            setAmount(0);
            setInterest(0);
            setReturnDate(0);
            setRequestId("");
            setCollateralCurrencyAddress("");
            setRequestStatus("");
            handleClose();
        }
    }

    return (
        <div>
            <button
                onClick={handleOpen}
                className="bg-[#E0BB83] text-[#2a2a2a] my-2 hover:bg-[#2a2a2a] hover:text-[white] hover:font-bold px-4 py-2  font-playfair w-[95%] mx-auto text-center lg:text-[18px] md:text-[18px] text-[16px] font-bold rounded-lg"
            >Respond</button>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <input type="text" placeholder='Request Id' className="rounded-lg w-[100%] p-4 bg-[#ffffff23] backdrop-blur-lg mb-4 outline-none" value={requestId} onChange={handleChange} />
                    <input type="text" placeholder='Offer Id' className="rounded-lg w-[100%] p-4 bg-[#ffffff23] backdrop-blur-lg mb-4 outline-none" value={offerId} onChange={handleOfferId} />
                    <p className='lg:text-[24px] md:text-[24px] text-[18px] mb-4'>Offer {offerId}</p>
                    <p className='lg:text-[20px] md:text-[20px] text-[15px] mb-4'>Total offers: {offers.length}</p>
                    <p>Lender: {lenderAddress}</p>
                    <p>Amount: {ethers.formatUnits(amount, TokenList[collateralCurrencyAddress]?.decimals)}</p>
                    <p>Interest: {interest.toString()}</p>

                    <button
                        onClick={() => handleRespondToOffer("2")}
                        className="bg-purple py-2 px-4 rounded-lg lg:text-[18px] md:text-[18px] text-[16px] w-[100%] my-4">Accept</button>
                    <button
                        onClick={() => handleRespondToOffer("1")}
                        className="bg-[#E0BB83] text-[#2a2a2a] my-2 hover:bg-[#2a2a2a] hover:text-[white] hover:font-bold px-4 py-2  font-playfair w-[95%] mx-auto text-center text-[16px] font-bold rounded-lg">Reject</button>
                </Box>
            </Modal>
        </div>
    )
}

export default RespondToOffer