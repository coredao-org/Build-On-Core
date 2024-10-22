import styles from "../Swap/styles";

export const Card = ({ token, liquidity, volume, balance, img, onClick }) => {
  return (
    <div className="w-full sm:w-1/2 lg:w-1/4 p-4 h-[100px]">
      <div
        className="bg-gray-800 p-4 rounded-lg h-48 w-full cursor-pointer"
        onClick={onClick}
      >
        <div>
          <img src={img} alt="eth" className="w-6 mb-2" />
        </div>
        <div className="flex justify-between">
          <div className="flex flex-col items-start">
            <span className="text-gray-400  text-[10px]">Token</span>
            <h2 className="text-white text-lg font-medium mb-2">{token}</h2>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-gray-400 text-[10px]">Liquidity</span>
            <p className="text-white text-lg font-medium mb-2">{liquidity}</p>
          </div>
        </div>
        <div className="flex justify-between">
          <div className="flex flex-col items-start">
            <span className="text-gray-400 text-[10px]">Wallet Balance</span>
            <p className="text-white text-lg font-medium mb-2">{balance}</p>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-gray-400 text-[10px]">Yield</span>
            <p className="text-white text-lg font-semibold mb-2">{volume}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
