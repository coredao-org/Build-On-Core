import React from "react";
import { Typography, Button, Spin } from "antd";
import styles from "./styles";

interface Step3Props {
  runeDetails: {
    spacedRune: string;
    runeId: string;
    amount: string;
  };
  address: string | null;
  onBridge: () => void;
  bridgeStatus: string;
  setCurrent: React.Dispatch<React.SetStateAction<number>>;
  prev: () => void;
}

const Step3: React.FC<Step3Props> = ({ runeDetails, address, onBridge, bridgeStatus, setCurrent, prev }) => {
  switch (bridgeStatus) {
    case 'in-progress':
      return (
        <div style={{ textAlign: 'center', fontSize: 18 }}>
          <Typography.Title level={3}>Bridging in Progress</Typography.Title>
          <Spin size="large" />
          <Typography.Paragraph>Please wait while we process your transaction...</Typography.Paragraph>
        </div>
      );
    case 'completed':
      return (
        <div style={{ textAlign: 'center', fontSize: 18 }}>
          <Typography.Title level={3}>Bridge Completed</Typography.Title>
          <Typography.Paragraph>Your transaction has been successfully processed!</Typography.Paragraph>
          <Button type="primary" onClick={() => setCurrent(0)}>Bridge other Runes</Button>
        </div>
      );
    default:
      return (
        <div style={{ textAlign: 'left', fontSize: 18 }}>
          <Typography.Title level={3}>Summary</Typography.Title>
          <Typography.Paragraph><strong>Rune Name:</strong> {runeDetails.spacedRune}</Typography.Paragraph>
          <Typography.Paragraph><strong>Rune ID:</strong> {runeDetails.runeId}</Typography.Paragraph>
          <Typography.Paragraph><strong>Amount:</strong> {runeDetails.amount}</Typography.Paragraph>
          <Typography.Paragraph><strong>Recipient Address:</strong> {address}</Typography.Paragraph>
          <Typography.Paragraph><strong>Fee:</strong> 0.5 CORE</Typography.Paragraph>
          <div style={styles.buttonsContainer}>
            <Button onClick={prev} style={styles.buttonMargin}>Go Back</Button>
            <Button type="primary" onClick={onBridge}>Bridge</Button>
          </div>
        </div>
      );
  }
};

export default Step3;
