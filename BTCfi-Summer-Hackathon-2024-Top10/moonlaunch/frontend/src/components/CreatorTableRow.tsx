import { formatEther } from "viem";
import { Link } from "react-router-dom";
import { Token } from "../constants/types";
import { formatDate, formatTime, numberWithCommas } from "../utils/helper";

const CreatorTablerow = ({ token }: { token: Token }) => {
  return (
    <tr className="bg-[#191E1E] text-start text-sm font-semibold ">
      <td className="rounded-l-2xl pl-10 py-5 px-2 text-center ">
        <Link to={`/token/${token.id}`}>
          <div className="flex gap-2 items-center">
            <div className="p-2 rounded-full flex justify-center items-center ">
              <img className="max-w-5 w-full" src={token.logoUrl.slice(0, 5) == "https" ? token.logoUrl : "../images/chart.png"} alt="" />{" "}
            </div>
            <div className="flex flex-col items-start gap-[1px]">
              <p className="uppercase">${token.symbol}</p>
              <p className="text-[#A7A7A7] text-[10px] ">{token.name}</p>
            </div>
          </div>
        </Link>
      </td>
      <td className="px-3">{formatTime(token.timestamp)}</td>
      <td className="px-3">{numberWithCommas(formatEther(BigInt(token.targetMcap)))}</td>
      <td className="px-3">{numberWithCommas(parseFloat(formatEther(BigInt(token.marketCap))).toFixed(0))}</td>
      <td className="border-radius2 px-3 ">{formatDate(token.timestamp)}</td>
    </tr>
  );
};

export default CreatorTablerow;
