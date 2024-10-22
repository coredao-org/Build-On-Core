import { Steps, Typography, Table, Spin } from "antd";
import { useContext, useEffect, useState } from "react";
import { useWeb3 } from "../../providers/Web3Provider";
import { ClientContext } from "../../providers/ClientProvider";
import { ethers } from "ethers";
import Step1 from "./Step1";
import Step2 from "./Step2";
import Step3 from "./Step3";
import styles from "./styles";
import { Link } from "react-router-dom";

const ABI = [
  "function receiveTransaction(string runeId, uint256 amount, address sourceAddress, string txIdentifier) payable",
  "function getTransactionsBySourceAddress(address sourceAddress) view returns (tuple(string runeId, uint256 amount, address sourceAddress, address destinationAddress, string txIdentifier, string sourceTxId, string targetTxId)[])"
];

const BitcoinToCore = () => {
  const { address, connect, signer } = useWeb3();
  const { client } = useContext(ClientContext);
  const [current, setCurrent] = useState(0);
  const [runes, setRunes] = useState<any[]>([]);
  const [transactions, setTransactions] = useState([]);
  const [sendDetails, setSendDetails] = useState<any>({});
  const [bridgeStatus, setBridgeStatus] = useState('');
  const [connectedBitcoinAddress, setConnectedBitcoinAddress] = useState<string | null>(null);
  const [loadingTransactions, setLoadingTransactions] = useState(false);

  const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS || '0xCe8a22f1A03812200C68f49F47a998699130cEa2';

  const next = () => setCurrent(current + 1);
  const prev = () => setCurrent(current - 1);

  useEffect(() => {
    if (address) {
      loadTransactions();
    }
  }, [address]);

  const loadTransactions = async () => {
    if (!signer || !address) return;

    setLoadingTransactions(true);

    try {
      const provider = signer.provider;
      const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider);
      const runeList = await client.getRuneList();
      setRunes(runeList);
      console.log(runeList);
      const txs = await contract.getTransactionsBySourceAddress(address);
      setTransactions(txs);
    } catch (error) {
      console.error("Failed to load transactions:", error);
    } finally {
      setLoadingTransactions(false);
    }
  };

  const connectUnisat = async () => {
    try {
      await window.unisat.requestAccounts();
      const connectedAccount = await window.unisat.getAccounts();
      setConnectedBitcoinAddress(connectedAccount);
      next();
    } catch (error) {
      console.log('Connection failed:', error);
    }
  };

  const generateRandomString = (length = 5) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    return Array.from({ length }, () => characters.charAt(Math.floor(Math.random() * characters.length))).join('');
  };

  const startBridge = async () => {
    setBridgeStatus('in-progress');
    if (!signer || !address) return;

    const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
    const randomTxId = generateRandomString();
    
    try {
      const tx = await contract.receiveTransaction(sendDetails.runeId, sendDetails.amount, address, randomTxId, {
        value: ethers.parseEther("0.5"),
        gasLimit: 0x100000,
      });
      console.log("Transaction sent:", tx);
      await tx.wait();
      const result = await window.unisat.sendRunes('bc1q2fh4s7p5r8qgmm7f430dzyrravd8hgh5atjtfk', sendDetails.runeId, (sendDetails.amount * 10 ** sendDetails.divisibility).toString());
      await client.reportTx(result, randomTxId);
      setBridgeStatus('completed');
      await loadTransactions();
      console.log("Transaction confirmed:", tx);
    } catch (error) {
      console.error("Transaction failed:", error);
    } finally {
      setBridgeStatus('');
    }
  };

  const steps = [
    {
      title: 'Connect BTC Wallet',
      content: <Step1 address={address} connect={connect} connectUnisat={connectUnisat} />,
    },
    {
      title: 'Choose Runes',
      content: (
        <Step2
          connectedBitcoinAddress={connectedBitcoinAddress}
          setSendDetails={setSendDetails}
          next={next}
          prev={prev}
        />
      ),
    },
    {
      title: 'Bridge',
      content: (
        <Step3
          runeDetails={sendDetails}
          address={address}
          onBridge={startBridge}
          bridgeStatus={bridgeStatus}
          setCurrent={setCurrent}
          prev={prev}
        />
      ),
    },
  ];

  const getRuneName = (id: string) => {
    return runes.find(item => item.identifier == id) ? runes.find(item => item.identifier == id).name : id;
  }

  const columns = [
    { title: 'Rune', dataIndex: 'runeId', key: 'runeId', render: (val) => {
      return getRuneName(val);
    }},
    { title: 'Amount', dataIndex: 'amount', key: 'amount', render: (amount) => amount.toString() },
    { title: 'Bitcoin Transaction', dataIndex: 'sourceTxId', key: 'sourceTxId', render: (val) => val == '-' ? 'Pending': <Link to={`https://mempool.space/tx/${val}`} target="_blank">View TX</Link> },
    { title: 'Core Transaction', dataIndex: 'targetTxId', key: 'targetTxId', render: (val) => val == '-' ? 'Pending': <Link to={`https://scan.coredao.org/tx/${val}`} target="_blank">View TX</Link> },
  ];

  return (
    <>
      <Steps current={current} items={steps.map(item => ({ key: item.title, title: item.title }))} style={styles.stepsContainer} />
      <div style={styles.contentStyle}>{steps[current].content}</div>
      <div>
        {address && (
          <>
            <Typography.Title level={4} style={{ marginTop: 40 }}>Transactions for {address}</Typography.Title>
            {loadingTransactions ? (
              <Spin size="large" />
            ) : transactions.length > 0 ? (
              <Table dataSource={transactions} columns={columns} rowKey={(record) => record.txIdentifier} />
            ) : (
              <Typography.Paragraph>No transactions found for this address.</Typography.Paragraph>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default BitcoinToCore;
