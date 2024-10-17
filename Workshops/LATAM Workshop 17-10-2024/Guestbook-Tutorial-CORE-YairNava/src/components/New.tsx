import { useMemo } from 'react';
import { ItemBackground, ItemContainer, ItemHeader, ItemTitle, ItemBody, ItemAddMessageButton } from "../style/NewPageStyle";
import React, { useCallback, useEffect, useState } from "react";
import { ethers } from 'ethers'
import Guestbook from '../contractABI/Guestbook.json'

const contractAddress = '0x0831AbEe2901F94001e9bfc247b89A7d753f78CD'
const abi = Guestbook.abi

export default function New() {

  const [message, setMessage] = useState("");
  const [registering, setRegistering] = useState(false);
  const [currentAccount, setCurrentAccount] = useState<string | null>(null);

  const checkWalletIsConnected = async () => {
    const { ethereum } = window;

    console.log(ethereum);

    if (!ethereum) {
      console.log('Make sure you have Metamask installed!');
      return;
    } else {
      console.log("Wallet exists! We're ready to go!");
    }

    const accounts = await ethereum.request({ method: 'eth_accounts' });

    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log('Found an authorized account: ', account);
      setCurrentAccount(account);
    } else {
      console.log('No authorized account found');
    }
  };


  const addMessage = async () => {
    try {
      const { ethereum } = window

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum)
        const signer = provider.getSigner()
        const guestbookContract = new ethers.Contract(
          contractAddress,
          abi,
          signer
        )

        console.log(guestbookContract);

        console.log('Write to contract')
        const tx = await guestbookContract.addEntry(message)
        setRegistering(true);

        console.log('Wait for the transaction to be confirmed')
        await tx.wait()

        setRegistering(false);

        setMessage("");

        console.log(
          `Transaction confirmed: https://scan.test.btcs.network/tx/${tx.hash}`
        )
      } else {
        console.log('Ethereum object does not exist')
      }
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    checkWalletIsConnected();
  }, []);

  return (
    <div>
      <ItemBackground>
        <ItemContainer>
          <ItemHeader>
            <ItemTitle>
              <label
                style={{
                  "textShadow":
                    "1px 0px 0px black, 0px 1px 0px black, -1px 0px 0px black, 0px -1px 0px black",
                }}
              >
                New Message
              </label>
            </ItemTitle>
          </ItemHeader>
          <ItemBody>
            {currentAccount ? (
              <div className="container text-center">
                {!registering ? (
                  <div>
                    <div>
                      <input
                        style={{ background: "white" }}
                        placeholder="Message"
                        value={message}
                        onChange={(e) =>
                          setMessage(e.target.value)
                        }
                      />
                    </div><br/>
                    <br />
                    <div>
                      <ItemAddMessageButton
                        onClick={async () => {
                          addMessage();
                        }}
                      >
                        Add Message
                      </ItemAddMessageButton>
                    </div>
                  </div>
                ) : (
                  <div style={{ display: "grid", justifyContent: "center" }}>
                    <br />
                    <label style={{ "fontSize": "20px", "fontWeight": "400" }}>
                      Adding Message...
                    </label>
                  </div>
                )}
                <br />
              </div>
            ) : (
              <div style={{ "textAlign": "center" }}>
                <span>Please login to add new message</span>
              </div>
            )}
          </ItemBody>
        </ItemContainer>
      </ItemBackground>
    </div>
  );
}
