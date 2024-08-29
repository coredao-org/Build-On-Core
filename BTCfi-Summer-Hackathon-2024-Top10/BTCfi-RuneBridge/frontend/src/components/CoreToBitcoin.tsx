import { Steps, Typography, theme, List, Spin, Input, Button, Form, notification } from "antd";
import { useContext, useEffect, useState } from "react";
import { ClientContext } from "../providers/ClientProvider";
import { useWeb3 } from "../providers/Web3Provider";
import { ethers } from "ethers";

const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS || '0xCe8a22f1A03812200C68f49F47a998699130cEa2';
const ABI = [
    "function allowance(address owner, address spender) view returns (uint256)",
    "function approve(address spender, uint256 amount) returns (bool)",
    "function unwrap(uint256 amount, address runeContract, string targetAddress)"
];

const CoreToBitcoin = () => {
    const { address, signer, addToken } = useWeb3();
    const [balances, setBalances] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [current, setCurrent] = useState(0);
    const [selectedRune, setSelectedRune] = useState<any>(null);
    const [amount, setAmount] = useState("");
    const [destinationAddress, setDestinationAddress] = useState("");
    const [pending, setPending] = useState(false); // New state for handling pending transactions
    const { client } = useContext(ClientContext);
    const { token } = theme.useToken();

    const styles: any = {
        contentStyle: {
            lineHeight: '260px',
            textAlign: 'center',
            color: token.colorTextTertiary,
            backgroundColor: token.colorFillAlter,
            borderRadius: token.borderRadiusLG,
            border: `1px dashed ${token.colorBorder}`,
            marginTop: 16,
        },
        input: {
            marginBottom: 16,
            lineHeight: '40px',
        },
    };

    const handleAddToken = async (rune: any) => {
        try {
            await addToken(rune.contractAddress, rune.symbol, 18); // Assuming 18 decimals for ERC20 tokens
            notification.success({
                message: "Token Added",
                description: `${rune.symbol} has been added to your MetaMask wallet.`,
            });
        } catch (error) {
            console.error("Add token error:", error);
            notification.error({
                message: "Failed to Add Token",
                description: error.message || "An error occurred while adding the token to MetaMask.",
            });
        }
    };


    const fetchRunes = async () => {
        setLoading(true);
        try {
            const data = await client.getRuneExtendedList();

            const balancePromises = data.map(async (rune) => {
                const contract = new ethers.Contract(
                    rune.contractAddress,
                    ["function balanceOf(address) view returns (uint256)"],
                    signer
                );
                const balance = await contract.balanceOf(address);
                return {
                    ...rune,
                    balance: ethers.formatEther(balance)
                };
            });

            const fetchedBalances = await Promise.all(balancePromises);
            setBalances(fetchedBalances);
        } catch (error) {
            console.error("Error fetching balances:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (address) {
            fetchRunes();
        }
    }, [address, signer, client]);

    const handleSelectRune = (rune: any) => {
        setSelectedRune(rune);
        setCurrent(1);
    };

    const handleUnwrap = async () => {
        const maxAmount = parseFloat(selectedRune.balance);
        const inputAmount = parseFloat(amount);

        if (inputAmount > maxAmount) {
            notification.error({
                message: "Invalid Amount",
                description: "You cannot input more than your balance.",
            });
            return;
        }

        try {
            setPending(true); // Set pending state to true
            const tokenContract = new ethers.Contract(selectedRune.contractAddress, ABI, signer);
            const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);

            // Check current allowance
            const allowance = await tokenContract.allowance(address, CONTRACT_ADDRESS);

            // If allowance is less than the amount, set the allowance
            if (allowance < ethers.parseEther(amount)) {
                const txApprove = await tokenContract.approve(CONTRACT_ADDRESS, ethers.parseEther(amount));
                notification.info({
                    message: "Setting Allowance",
                    description: "Please wait while the token allowance is being set.",
                });
                await txApprove.wait();
                notification.success({
                    message: "Allowance Set",
                    description: "Token allowance has been successfully set.",
                });
            }

            // Call the unwrap method on the contract
            notification.info({
                message: "Unwrapping Tokens",
                description: "Please wait while your tokens are being unwrapped.",
            });
            const txUnwrap = await contract.unwrap(
                ethers.parseEther(amount),
                selectedRune.contractAddress,
                destinationAddress
            );
            await txUnwrap.wait();

            notification.success({
                message: "Unwrap Successful",
                description: "Your tokens have been successfully unwrapped.",
            });

            // Reset state after successful transaction
            setAmount("");
            setDestinationAddress("");
            setCurrent(0);
            await fetchRunes(); // Reload the list of tokens

        } catch (error) {
            console.error("Unwrap error:", error);
            notification.error({
                message: "Unwrap Failed",
                description: error.message || "An error occurred during the unwrap process.",
            });
        } finally {
            setPending(false); // Reset pending state
        }
    };

    const handleGoBack = () => {
        setCurrent(current - 1);
    };

    const steps = [
        {
            title: 'Select wrapped Rune',
            content: loading ? <Spin /> : (
                <List
                    itemLayout="horizontal"
                    dataSource={balances}
                    renderItem={(item) => (
                        <List.Item
                            style={{ textAlign: 'left', padding: 15 }}
                            actions={[
                                <Button onClick={() => handleSelectRune(item)}>Select</Button>,
                                <Button onClick={() => handleAddToken(item)}>Add to MetaMask</Button>
                            ]}
                        >
                            <List.Item.Meta
                                title={`${item.name} (${item.symbol})`}
                                description={`Balance: ${item.balance}`}
                            />
                        </List.Item>
                    )}
                />
            ),
        },
        {
            title: 'Unwrap',
            content: (
                <Form layout="vertical" onFinish={handleUnwrap}>
                    <Typography.Title level={3}>{selectedRune?.name} ({selectedRune?.symbol})</Typography.Title>
                    <div style={{ padding: '20px 150px'}}>
                        <Form.Item
                            label="Amount"
                            validateStatus={parseFloat(amount) > parseFloat(selectedRune?.balance) ? "error" : ""}
                            help={parseFloat(amount) > parseFloat(selectedRune?.balance) ? "Amount exceeds balance" : ""}
                        >
                            <Input
                                type="number"
                                value={amount}
                                style={styles.input}
                                onChange={(e) => setAmount(e.target.value)}
                                placeholder={`Max: ${selectedRune?.balance}`}
                                disabled={pending} // Disable input during pending state
                            />
                        </Form.Item>
                        <Form.Item label="Destination Bitcoin Address">
                            <Input
                                value={destinationAddress}
                                style={styles.input}
                                onChange={(e) => setDestinationAddress(e.target.value)}
                                placeholder="Enter your Bitcoin address"
                                disabled={pending} // Disable input during pending state
                            />
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit" disabled={!amount || !destinationAddress || pending}>
                                {pending ? <Spin /> : 'Unwrap'} {/* Show spinner if pending */}
                            </Button>
                            <Button style={{ marginLeft: 8 }} onClick={handleGoBack} disabled={pending}>
                                Go Back
                            </Button>
                        </Form.Item>
                    </div>
                </Form>
            ),
        },
    ];

    const items = steps.map((item) => ({ key: item.title, title: item.title }));

    return (
        <>
            <Steps current={current} items={items} style={{ marginTop: 20 }}/>
            <div style={styles.contentStyle}>{steps[current].content}</div>
        </>
    );
};

export default CoreToBitcoin;
