import React, { useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import Modal from "../components/Modal";
import Loader from "../components/Loader";
import Axios from "axios";
import { Address, parseEther } from "viem";
import { useClient, useWriteContract } from "wagmi";
import { readContract, waitForTransactionReceipt } from "viem/actions";
import { getCurveConfig } from "../utils/helper";
import { motion } from "framer-motion";

interface tokenDetails {
  tokenName: string;
  tokenTicker: string;
  tokenDescription: string;
  target: string;
  twitterLink: string;
  telegramLink: string;
  websiteLink: string;
}
interface HTMLInputEvent extends Event {
  target: HTMLInputElement & EventTarget;
}
const defaultTokenDetails = {
  tokenName: "",
  tokenTicker: "",
  tokenDescription: "",
  target: "",
  twitterLink: "",
  telegramLink: "",
  websiteLink: "",
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
const LaunchToken = () => {
  const [showModal, setShowModal] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const [tokenDetail, setTokenDetails] =
    useState<tokenDetails>(defaultTokenDetails);

  const { writeContractAsync } = useWriteContract();
  const client = useClient();

  const imageRef = useRef<HTMLInputElement | null>(null);
  const [preview, setPreview] = useState<string | undefined>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const onSelectFile = (e: HTMLInputEvent) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setSelectedFile(e.target.files[0]);
  };

  const handleImageUpload = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append(
        "upload_preset",
        import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET_NAME
      );
      const data = await Axios.post(
        `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_NAME}/image/upload`,
        formData
      );
      if (data.status != 200) {
        return null;
      }
      return data.data["secure_url"];
    } catch (e) {
      console.log(e);
      return null;
    }
  };

  const handleError = (error: unknown) => {
    console.log(error);
    setShowLoader(false);
    setShowLoader(false);
    toast.error("An error occured while creating a new token", {
      // @ts-expect-error it works
      description: error,
    });
  };

  const handleSuccess = async (hash: Address) => {
    try {
      // @ts-expect-error it works
      await waitForTransactionReceipt(client, {
        hash,
      });
      setShowLoader(false);
      setShowModal(true);
    } catch (e) {
      // @ts-expect-error it works lad
      handleError(e.message);
    } finally {
      setTokenDetails(defaultTokenDetails);
    }
  };

  const handleCreateToken = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedFile) return handleError("Please upload an image...");
    if (!client) return;
    if (!tokenDetail) return;
    setShowLoader(true);
    try {
      const curveConfig = getCurveConfig(client.chain.id);
      const creationFee = await readContract(client, {
        ...curveConfig,
        functionName: "creationFee",
      });
      const imageUrl = await handleImageUpload(selectedFile);
      if (!imageUrl) {
        handleError("unable to upload image");
        return;
      }
      await writeContractAsync(
        {
          ...curveConfig,
          functionName: "launchToken",
          value: creationFee,
          args: [
            {
              name: tokenDetail.tokenName,
              description: tokenDetail.tokenDescription,
              twitterLink: tokenDetail.twitterLink,
              telegramLink: tokenDetail.telegramLink,
              symbol: tokenDetail.tokenTicker,
              website: tokenDetail.websiteLink,
              image: imageUrl,
            },
            parseEther(tokenDetail.target),
          ],
        },
        {
          onSuccess: async (hash: Address) => {
            await handleSuccess(hash);
          },
          onError: (error) => {
            console.log(error.message);
            handleError("Error occurred while sending transaction...");
          },
        }
      );
    } catch (error) {
      handleError("Please try again...");
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    detail: string
  ) => {
    setTokenDetails((prev) => ({
      ...prev,
      [detail]: e.target.value,
    }));
  };

  useEffect(() => {
    // create the preview
    if (!selectedFile) return;
    const objectUrl = URL.createObjectURL(selectedFile as Blob);
    setPreview(objectUrl);

    // free memory when ever this component is unmounted
    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);

  const ModalText = {
    mainText: ` ${tokenDetail.tokenName} Token Successfully Created`,
    subText: `Congratulations! Your token ${tokenDetail.tokenTicker} has been successfully created.`,
    subText2: "View your tokens",
    link: "/mytokens",
    myTokens: true,
  };
  return (
    <motion.div
      variants={Pageanime}
      initial="initial"
      animate="animate"
      exit="exit"
      className=" md:h-screen pt-[120px] flex flex-col md:flex-row gap-5 launchBG relative"
    >
      <img
        className="absolute bottom-0 left-0 "
        src="./images/launchbottom.png"
        alt=""
      />
      <div className="md:h-full md:w-[50%] p-4 md:flex justify-center items-center ">
        <div className="w-full flex flex-col gap-5 items-center justify-center">
          <h1 className="text-4xl font-bold text-center w-full ">Dear Dev,</h1>{" "}
          <div className="flex flex-col gap-1 text-sm text-center items-center justify-center ">
            <p>Provide the necessary details to launch your token.</p>
            <p>
              Enhance its visibility by adding your social media and website.
            </p>
          </div>
        </div>
      </div>
      <div className="md:w-[50%] p-3 md:overflow-y-auto ">
        <form
          onSubmit={handleCreateToken}
          className="border formShdw bg-[#191A1A] border-[#00ECFF] rounded-3xl max-w-[550px]   w-full  px-[70px] py-[50px] flex flex-col gap-5  "
        >
          <h1>Create New Token</h1>
          <div
            className="w-full flex flex-col items-center border border-[#F8F8F8] border-dashed gap-4  py-5 px-2 rounded-3xl "
            onClick={() => {
              if (imageRef.current) {
                imageRef.current.click();
              }
            }}
          >
            <img
              src={preview || "./images/uploadImg1.png"}
              alt="preview"
              style={{ height: 70 }}
            />
            <input
              type="file"
              ref={imageRef}
              accept="image/*"
              multiple={false}
              required
              name=""
              // @ts-expect-error it works lad
              onChange={onSelectFile}
              className="image-file-input"
              style={{ display: "none" }}
            />
            <p className="text-sm font-medium">Click to upload image</p>
          </div>
          <input
            className=" border border-[#F8F8F8] rounded-xl text-lg font-medium bg-transparent px-4 w-full py-3 outline-none "
            placeholder="Token name"
            required
            value={tokenDetail.tokenName}
            type="text"
            onChange={(e) => handleChange(e, "tokenName")}
            name=""
            id=""
          />
          <input
            className=" border border-[#F8F8F8] rounded-xl text-lg font-medium bg-transparent px-4 w-full py-3 outline-none "
            placeholder="Token ticker"
            value={tokenDetail.tokenTicker}
            type="text"
            required
            onChange={(e) => handleChange(e, "tokenTicker")}
            name=""
            id=""
          />
          <input
            className=" border border-[#F8F8F8] rounded-xl text-lg font-medium bg-transparent px-4 w-full py-3 outline-none "
            placeholder="Token description"
            value={tokenDetail.tokenDescription}
            type="text"
            required
            onChange={(e) => handleChange(e, "tokenDescription")}
            name=""
            id=""
          />
          <input
            className=" border border-[#F8F8F8] rounded-xl text-lg font-medium bg-transparent px-4 w-full py-3 outline-none "
            placeholder="Target (in core)"
            value={tokenDetail.target}
            type="number"
            min={10000}
            required
            onChange={(e) => handleChange(e, "target")}
            name=""
            id=""
          />
          <div className="flex justify-center gap-2 items-center">
            <span className="h-[2px] lineBG w-20 rounded-sm "></span>
            <p className="text-lg font-medium text-center ">Connect Socials</p>
            <span className="h-[2px] lineBG2 w-20 rounded-sm "></span>
          </div>
          <div className=" border border-[#F8F8F8] rounded-xl text-lg font-medium bg-transparent pr-4 w-full  overflow-clip flex gap-2 ">
            <img
              className="py-4 imgShdw rounded-l-xl w-[50px] px-3 "
              src="./images/twitter2.png"
              alt=""
            />

            <input
              className="outline-none px-3 w-full py-3 bg-transparent"
              type="url"
              onChange={(e) => handleChange(e, "twitterLink")}
              placeholder="Twitter link"
              value={tokenDetail.twitterLink}
              name=""
              id=""
            />
          </div>
          <div className=" border border-[#F8F8F8] rounded-xl text-lg font-medium bg-transparent pr-4 w-full  overflow-clip flex gap-2 ">
            <img
              className="py-4 imgShdw rounded-l-xl w-[50px] px-3 "
              src="./images/telegram2.png"
              alt=""
            />

            <input
              className="outline-none px-3 w-full py-3 bg-transparent"
              type="url"
              onChange={(e) => handleChange(e, "telegramLink")}
              placeholder="Telegram link"
              value={tokenDetail.telegramLink}
              name=""
              id=""
            />
          </div>
          <div className=" border border-[#F8F8F8] rounded-xl text-lg font-medium bg-transparent pr-4 w-full  overflow-clip flex gap-2 ">
            <img
              className="py-4 imgShdw rounded-l-xl w-[50px] px-3 "
              src="./images/web.png"
              alt=""
            />

            <input
              className="outline-none px-3 w-full py-3 bg-transparent"
              type="url"
              onChange={(e) => handleChange(e, "websiteLink")}
              placeholder="Website link"
              value={tokenDetail.websiteLink}
              name=""
              id=""
            />
          </div>
          <motion.button
            variants={BtnHover}
            whileTap="onTap"
            whileHover="hover"
            animate="animate"
            type="submit"
            className="w-full bg-[#353535] border border-[#00ecff] uploadShdw text-lg font-medium rounded-xl py-4 px-4 mt-2 "
          >
            Create Token
          </motion.button>
        </form>
      </div>
      {showModal && <Modal data={ModalText} setShowModal={setShowModal} />}
      {showLoader && <Loader text="Creating Token..." />}
    </motion.div>
  );
};

export default LaunchToken;
