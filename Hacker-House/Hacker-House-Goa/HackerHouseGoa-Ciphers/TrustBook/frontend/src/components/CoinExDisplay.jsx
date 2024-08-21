import React, { useEffect, useState } from "react";
import { getPercentageIncrease } from "@/lib/CoinEx";

const CoinExDisplay = () => {
  const [cryptoData, setCryptoData] = useState([]);
  const [error, setError] = useState(null);

  const cryptos = ["BTC", "ETH", "POL", "CORE", "GRT"];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const dataPromises = cryptos.map(async (crypto) => {
          const data = await getPercentageIncrease(crypto);
          return data;
        });

        const data = await Promise.all(dataPromises);
        setCryptoData(data.filter((item) => item !== null));
      } catch (error) {
        setError(error);
      }
    };

    fetchData();

    const intervalId = setInterval(fetchData, 1000);

    return () => clearInterval(intervalId); // Cleanup interval on unmount
  }, []);

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!cryptoData.length) {
    return <div>Loading...</div>;
  }

  return (
    <>
      {cryptoData.map(({ market, lastPrice, percentageIncrease }) => (
        <div key={market} className="flex gap-2  w-full flex-col my-2">
          <div className="flex justify-between">
            <span>{market}</span>
            <span
              className={`text-${
                percentageIncrease > 0 ? "green-500" : "red-500"
              }`}
            >
              {percentageIncrease}%
            </span>
          </div>
          <h1 className="text-xl font-bold">{lastPrice} USD</h1>
          <hr />
        </div>
      ))}
    </>
  );
};

export default CoinExDisplay;
