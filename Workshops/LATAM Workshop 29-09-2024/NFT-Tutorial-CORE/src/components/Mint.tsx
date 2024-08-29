import { useMemo } from 'react';
import { ItemBackground, ItemContainer, ItemHeader, ItemTitle, ItemImage, ItemBody, ItemMintNumber, ItemMintButton } from "../style/MintPageStyle";
import React, { useCallback, useEffect, useState } from "react";
import { ethers } from 'ethers'
import NFTCollection from '../contractABI/NFTCollection.json'

const contractAddress = '0x761302F278B847FB933C4F28ea5c108F21942c48'
const abi = NFTCollection.abi

export default function Mint() {

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [minting, setMinting] = useState(false);
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


  const mint = async () => {
    try {
      const { ethereum } = window

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum)
        const signer = provider.getSigner()
        const nftContract = new ethers.Contract(
          contractAddress,
          abi,
          signer
        )

        console.log('Write to contract')
        const tx = await nftContract.mintNFT(name,description,image)
        setMinting(true);

        console.log('Wait for the transaction to be confirmed')
        await tx.wait()

        setMinting(false);

        setName("");
        setDescription("");
        setImage("");

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
                Mint NFT
              </label>
            </ItemTitle>
          </ItemHeader>
          <ItemBody>
            {currentAccount ? (
              <div className="container text-center">
                {!minting ? (
                  <div>
                    <div>
                      <input
                        style={{ background: "white" }}
                        placeholder="Name"
                        value={name}
                        onChange={(e) =>
                          setName(e.target.value)
                        }
                      />
                    </div><br/>
                    <div>
                      <input
                        style={{ background: "white" }}
                        placeholder="Description"
                        value={description}
                        onChange={(e) =>
                          setDescription(e.target.value)
                        }
                      />
                    </div>
                    <br />
                    <div>
                      <input
                        style={{ background: "white" }}
                        placeholder="Image URI"
                        value={image}
                        onChange={(e) =>
                          setImage(e.target.value)
                        }
                      />
                    </div>
                    <br />
                    <div>
                      <ItemMintButton
                        onClick={async () => {
                          mint();
                        }}
                      >
                        Mint
                      </ItemMintButton>
                    </div>
                  </div>
                ) : (
                  <div style={{ display: "grid", justifyContent: "center" }}>
                    <br />
                    <label style={{ "fontSize": "20px", "fontWeight": "400" }}>
                      Minting...
                    </label>
                  </div>
                )}
                <br />
              </div>
            ) : (
              <div style={{ "textAlign": "center" }}>
                <span>Please login to Mint</span>
              </div>
            )}
          </ItemBody>
        </ItemContainer>
      </ItemBackground>
    </div>
  );
}
