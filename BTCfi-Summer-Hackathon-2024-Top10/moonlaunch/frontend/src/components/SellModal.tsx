const SellModal = ({
  tokenBalance,
  tokenName,
  ethAmountOut,
  handleChangeTokenAmountIn
}: {
  tokenBalance: string;
  tokenName: string;
  tokenAmountIn: string;
  ethAmountOut: string;
  handleChangeTokenAmountIn: (val: string) => Promise<void>;
}) => {
  return (
    <div className="bg-[#00ECFF05] tokenInfoShdw rounded-xl px-6 py-5 flex flex-col gap-1 w-full ">
      <div className="flex justify-between gap-5 items-center w-full ">
        <div className="bg-[#424242] p-2 flex gap-3 rounded-md items-center ">
          <img src="../images/Core 3.png" alt="" />{" "}
          <img src="../images/dropdown.png" alt="" />
        </div>
        <div className="flex gap-2 items-center ">
          <img src="../images/wallet.png" alt="" />
          <p>{parseFloat(tokenBalance).toFixed(4)}</p>
        </div>
      </div>
      <div className="flex font-medium justify-between gap-5 items-center w-full ">
        <input
          className="bg-transparent no-arrows w-[60%] text-[28px] md:text-[36px] outline-none"
          type="number"
          onChange={(e) => handleChangeTokenAmountIn(e.target.value)}
          placeholder="0.00"
          name=""
          id=""
        />{" "}
        <div className="flex text-2xl md:text-3xl gap-2 items-center">
          <p className="uppercase">{tokenName}</p>{" "}
        </div>
      </div>
      {/* <div className="w-full flex justify-between gap-3 items-center">
        <button className="border border-[#ffffff] rounded-md px-4 w-full py-1 ">
          25%
        </button>
        <button className="border border-[#ffffff] rounded-md px-4 w-full py-1 ">
          50%
        </button>
        <button className="border border-[#ffffff] rounded-md px-4 w-full py-1 ">
          75%
        </button>
        <button className="border border-[#ffffff] rounded-md px-4 w-full py-1 ">
          100%
        </button>
      </div> */}
      <div className="flex justify-between gap-3 items-center w-full mt-2 ">
        <p>You will receive </p>
        <p className="uppercase">{parseFloat(ethAmountOut).toFixed(5)} CORE</p>
      </div>
    </div>
  );
};

export default SellModal;
