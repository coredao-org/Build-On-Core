import React from "react";
import { Typography, Button } from "antd";
import startBridging from '../../assets/start-bridging.svg';
import bitcoinWallet from '../../assets/connect-bitcoin.svg';
import styles from "./styles";

interface Step1Props {
  address: string | null;
  connect: () => void;
  connectUnisat: () => void;
}

const Step1: React.FC<Step1Props> = ({ address, connect, connectUnisat }) => (
  <div style={styles.centeredContainer}>
    <img src={address ? bitcoinWallet : startBridging} style={styles.image} alt="wallet connection" />
    <Typography.Title level={4}>{address ? 'Connect your Unisat Wallet to start bridging' : 'Connect to Core chain'}</Typography.Title>
    <Typography.Paragraph>{address ? 'After connecting to Unisat Wallet, you will be able to choose your runes to bridge to Core' : 'In order to start the bridge journey, you need to connect to CORE Chain first'}</Typography.Paragraph>
    <Button type="primary" size="large" onClick={address ? connectUnisat : connect}>
      {address ? 'Connect Unisat' : 'Connect to Core Chain'}
    </Button>
  </div>
);

export default Step1;
