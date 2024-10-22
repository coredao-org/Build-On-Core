import { formatEther } from "viem";
import { Trade } from "../constants/types";
import { formatDate, formatTime, numberWithCommas, truncate } from "../utils/helper";

const Tablerow = ({ item, explorerUrl }: { item: Trade, explorerUrl: string }) => {
  return (
    <tr className="bg-[#191E1E] text-start text-sm font-semibold ">
      <td className="rounded-l-2xl pl-10 py-5 px-2 text-center ">
        <div className="flex gap-2 items-center">
          <div
            className={
              item.action == "BUY"
                ? "p-2 rounded-full flex justify-center items-center bg-[#00565D99] "
                : "p-2 rounded-full flex justify-center items-center bg-[#68102199]"
            }
          >
            <img className="max-w-5 w-full" src="../images/cart.png" alt="" />{" "}
          </div>
          <div className="flex flex-col items-start gap-[1px]">
            <p>{item.action}</p>
            <p className="text-[#A7A7A7] text-[10px] ">{formatTime(item.timestamp)}</p>
          </div>
        </div>
      </td>
      <td className="px-3">
        <a
          target="_blank"
          href={`${explorerUrl}/address/${item.actor}`}
          className=""
        >
          {truncate(item.actor)}
        </a>
      </td>
      <td className="px-3">{item.action == "BUY" ? parseFloat(formatEther(BigInt(item.amountIn))).toFixed(5) : parseFloat(formatEther(BigInt(item.amountOut))).toFixed(5)}</td>
      <td className="px-3">{item.action == "SELL" ? numberWithCommas(parseFloat(formatEther(BigInt(item.amountIn))).toFixed(2)) : numberWithCommas(parseFloat(formatEther(BigInt(item.amountOut))).toFixed(2))}</td>
      <td className="px-3">{parseFloat(formatEther(BigInt(item.fee))).toFixed(4)}</td>
      <td className="border-radius2 px-3 ">{formatDate(item.timestamp)}</td>
    </tr>
  );
};

export default Tablerow;
