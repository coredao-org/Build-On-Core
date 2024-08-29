import React, { useContext, useEffect, useState } from "react";
import { Spin, Typography, Input, Button, List } from "antd";
import styles from "./styles";
import { ClientContext } from "../../providers/ClientProvider";

interface Step2Props {
  connectedBitcoinAddress: string | null;
  setSendDetails: React.Dispatch<React.SetStateAction<any>>;
  next: () => void;
  prev: () => void;
}

interface Rune {
  runeid: string;
  spacedRune: string;
  amount: number;
  divisibility: number;
}

const Step2: React.FC<Step2Props> = ({ connectedBitcoinAddress, setSendDetails, next, prev }) => {
  const [selectedRune, setSelectedRune] = useState<Rune | null>(null);
  const [runes, setRunes] = useState<Rune[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [amount, setAmount] = useState<string>('');
  const { client } = useContext(ClientContext);

  useEffect(() => {
    if (connectedBitcoinAddress) {
      client.getBalances(connectedBitcoinAddress).then((data: Rune[]) => {
        setLoading(false);
        setRunes(data);
      });
    }
  }, [connectedBitcoinAddress, client]);

  const showModal = (rune: Rune) => setSelectedRune(rune);

  const handleOk = () => {
    if (selectedRune) {
      setSendDetails({
        amount,
        runeId: selectedRune.runeid,
        spacedRune: selectedRune.spacedRune,
        divisibility: selectedRune.divisibility,
      });
      next();
    }
  };

  const handleCancel = () => {
    setAmount('');
    setSelectedRune(null);
  };

  if (loading) {
    return (
      <div style={{ width: '100%', padding: '20px 40px' }}>
        <Spin />
      </div>
    );
  }

  return (
    <div style={{ width: '100%', padding: '20px 40px' }}>
      {selectedRune ? (
        <div style={{ maxWidth: 400, margin: '0 auto' }}>
          <Typography.Title level={4}>Enter amount to bridge for {selectedRune.spacedRune}</Typography.Title>
          <Input
            placeholder="Enter amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            style={styles.input}
          />
          <div style={styles.buttonsContainer}>
            <Button type="primary" onClick={handleOk}>Continue</Button>
            <Button onClick={handleCancel} style={styles.buttonMargin}>Cancel</Button>
          </div>
        </div>
      ) : (
        <div>
          <List
            header="Select Runes to bridge"
            itemLayout="horizontal"
            dataSource={runes}
            renderItem={(rune: Rune) => (
              <List.Item actions={[<Button onClick={() => showModal(rune)}>Select</Button>]}>
                <List.Item.Meta
                  style={{ textAlign: 'left' }}
                  title={rune.spacedRune}
                  description={`Available: ${rune.amount / 10 ** rune.divisibility}`}
                />
              </List.Item>
            )}
            style={styles.list}
          />
          <div style={styles.buttonsContainer}>
            <Button onClick={prev} style={styles.buttonMargin}>Go Back</Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Step2;
