import axios from 'axios';

// Function to get the market code from the cryptocurrency name
const getMarketCode = (cryptoName) => {
    const marketPairs = {
        BTC: 'BTCUSDT',
        ETH: 'ETHUSDT',
        CORE: 'COREUSDT',
        POL: 'MATICUSDT',
        GRT: 'GRTUSDT',
        // Add more market pairs as needed
    };

    return marketPairs[cryptoName.toUpperCase()];
};

const getTickerData = async (market) => {
    try {
        const url = `https://api.coinex.com/v1/market/ticker?market=${market}`;
        const response = await axios.get(url);
        const data = response.data;

        if (data.code === 0) {
            const ticker = data.data.ticker;
            const lastPrice = parseFloat(ticker.last);
            const openPrice = parseFloat(ticker.open);
            return { lastPrice, openPrice };
        } else {
            console.error(`Error: ${data.message}`);
            return null;
        }
    } catch (error) {
        console.error(`Error fetching data: ${error.message}`);
        return null;
    }
};

const calculatePercentageIncrease = (lastPrice, openPrice) => {
    return ((lastPrice - openPrice) / openPrice) * 100;
};

const getPercentageIncrease = async (cryptoName) => {
    const market = getMarketCode(cryptoName);

    if (!market) {
        console.error(`Market code for ${cryptoName} not found`);
        return null;
    }

    const tickerData = await getTickerData(market);

    if (tickerData) {
        const { lastPrice, openPrice } = tickerData;
        const percentageIncrease = calculatePercentageIncrease(lastPrice, openPrice);

        return { market, lastPrice, openPrice, percentageIncrease: percentageIncrease.toFixed(2) };
    } else {
        console.log('Failed to fetch ticker data');
        return null;
    }
};

export { getPercentageIncrease };
