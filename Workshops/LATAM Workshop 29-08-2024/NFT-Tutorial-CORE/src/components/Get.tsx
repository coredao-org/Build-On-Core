import { useCallback, useEffect, useState } from 'react';
import { ItemBackground, ItemContainer, ItemHeader, ItemTitle, ItemImage, ItemBody, ItemMintNumber, ItemMintButton } from "../style/MintPageStyle";
import React from "react";
import { ethers } from 'ethers'
import NFTCollection from '../contractABI/NFTCollection.json'

const contractAddress = '0x761302F278B847FB933C4F28ea5c108F21942c48'
const abi = NFTCollection.abi

export default function Get() {

  const [dataNFT, setDataNFT] = useState<any | null>(null);
  const [currentNFT, setcurrentNFT] = useState(0);
  const [numberNFTs, setNumberNFTs] = useState(0);

  const getNFTsNumber = useCallback(async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const nftContract = new ethers.Contract(contractAddress, abi, signer);

        const res = await nftContract.totalSupply();
        setNumberNFTs(res.toNumber());

        if (res.toNumber() > 0) {
          getNFTData(0);
        }
      } else {
        console.log('Ethereum object does not exist');
      }
    } catch (err) {
      console.log(err);
    }
  }, []);

  const getNFTData = useCallback(async (nftId: any) => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const nftContract = new ethers.Contract(contractAddress, abi, signer);

        const res = await nftContract.getTokenDetails(nftId);
        setDataNFT(res);
      } else {
        console.log('Ethereum object does not exist');
      }
    } catch (err) {
      console.log(err);
    }
  }, []);

  const next = useCallback(async () => {
    if (numberNFTs > 0) {
      const newNFT = (currentNFT + 1) % numberNFTs;
      setcurrentNFT(newNFT);
      getNFTData(newNFT);
    } else {
      console.log("No NFTs available");
    }
  }, [currentNFT, numberNFTs, getNFTData]);

  const prev = useCallback(async () => {
    if (numberNFTs > 0) {
      const newNFT = (currentNFT - 1 + numberNFTs) % numberNFTs;
      setcurrentNFT(newNFT);
      getNFTData(newNFT);
    } else {
      console.log("No NFTs available");
    }
  }, [currentNFT, numberNFTs, getNFTData]);
  useEffect(() => {
    getNFTsNumber();
  }, [getNFTsNumber]);

  return (
    <div>
      <ItemBackground>
        <ItemContainer>
          <ItemHeader>
            <ItemTitle>
              <label
                style={{
                  textShadow:
                    "1px 0px 0px black, 0px 1px 0px black, -1px 0px 0px black, 0px -1px 0px black",
                }}
              >
                All NFT's Minted
              </label>
            </ItemTitle>
          </ItemHeader>
          <ItemBody>
            <div className="container text-center">
              {numberNFTs > 0 ? (
                <div>
                  <br />
                  <div style={{display:"flex", justifyContent:"center"}}>
                    <img src={dataNFT && dataNFT.imageURI} alt="NFT" />
                  </div>
                  <br />
                  <div>
                    <b>Name:</b> {dataNFT && dataNFT.name}
                  </div>
                  <br />
                  <div>
                    <b>Description:</b> {dataNFT && dataNFT.description}
                  </div>
                  <br />
                  <div>
                    <ItemMintButton
                      onClick={prev}
                    >
                      Prev
                    </ItemMintButton>
                    <span><b>{currentNFT + 1}/{numberNFTs}</b></span>
                    <ItemMintButton
                      onClick={next}
                    >
                      Next
                    </ItemMintButton>
                  </div>
                </div>
              ) : (
                <div style={{ display: "grid", justifyContent: "center" }}>
                  <br />
                  <label style={{ fontSize: "20px", fontWeight: "400" }}>
                    There are no minted nfts
                  </label>
                </div>
              )}
              <br />
            </div>
          </ItemBody>
        </ItemContainer>
      </ItemBackground>
    </div>
  );
}
