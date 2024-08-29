import {
  ConnectButton,
  useActiveWallet,
  useActiveWalletChain,
  useConnectedWallets,
} from "thirdweb/react";
import { client, GameContract, thetaTestnet } from "./client";
import { createWallet, inAppWallet } from "thirdweb/wallets";
import {
  prepareContractCall,
  readContract,
  sendTransaction,
  waitForReceipt,
} from "thirdweb";
import { useEffect } from "react";
import { TransactionReceipt } from "thirdweb/dist/types/transaction/types";

const wallets = [
  inAppWallet(),
  createWallet("io.metamask"),
  createWallet("com.coinbase.wallet"),
];

export function App() {
  window.thirdwebClient = client;

  const wallet = useActiveWallet();
  const chainId = useActiveWalletChain();

  useEffect(() => {
    console.log("window.userAccount:", window.userAccount);
    if (wallet) {
      window.userAccount = wallet.getAccount()?.address;
    } else {
      window.userAccount = undefined;
    }
  }, [wallet]);

  useEffect(() => {
    if (chainId?.id == thetaTestnet.id) {
      window.isBaseSepoliaNetwork = true;
    } else {
      window.isBaseSepoliaNetwork = false;
    }
  }, [chainId]);

  /// ###########################################
  /// wallet connect
  /// ###########################################

  const onConnectButtonClick = () => {
    let button = document.getElementsByClassName("tw-connect-wallet")[0];
    if (button != null && button instanceof HTMLButtonElement) {
      button.click();
    }
  };

  const onConnectedButtonClick = () => {
    let button = document.getElementsByClassName("tw-connected-wallet")[0];
    if (button != null && button instanceof HTMLButtonElement) {
      button.click();
    }
  };

  window.onConnectButtonClick = onConnectButtonClick;
  window.onConnectedButtonClick = onConnectedButtonClick;

  /// ###########################################
  /// read contract function
  /// ###########################################

  const getTopListInfo = async (
    onSuccess?: (receipt: any) => void
  ) => {
    const data = await readContract({
      contract: GameContract,
      method: "function getTopListInfo() view returns (uint256[10], uint256[10], address[10], uint256)", 
      params: [],
    });
    onSuccess?.(data);
  };

  const getPlayerAllAssets = async (
    onSuccess?: (receipt: any) => void
  ) => {
    let account = wallet?.getAccount()?.address;
    if(account) {
      const data = await readContract({
        contract: GameContract,
        method: "function getPlayerAllAssets(address player) view returns (uint256 gold, uint256 diamond)", 
        params: [account],
      });
      onSuccess?.(data);
    }
  };

  const getPlayerLastLotteryResult = async (
    onSuccess?: (receipt: any) => void
  ) => {
    let account = wallet?.getAccount()?.address;
    if(account) {
      const data = await readContract({
        contract: GameContract,
        method: "function getPlayerLastLotteryResult(address player) view returns (uint256 itemType, uint256 num)", 
        params: [account],
      });
      onSuccess?.(data);
    }
  };

  const getPlayerAllWeaponInfo = async (
    onSuccess?: (receipt: any) => void
  ) => {
    let account = wallet?.getAccount()?.address;
    if(account) {
      const data = await readContract({
        contract: GameContract,
        method: "function getPlayerAllWeaponInfo(address player) view returns (uint256[] weaponIdList, uint256[] weaponLevelList)", 
        params: [account],
      });
      onSuccess?.(data);
    }
  };

  const getPlayerAllSkinInfo = async (
    onSuccess?: (receipt: any) => void
  ) => {
    let account = wallet?.getAccount()?.address;
    if(account) {
      const data = await readContract({
        contract: GameContract,
        method: "function getPlayerAllSkinInfo(address player) view returns (uint256[] skinIdList, uint256[] skinLevelList)", 
        params: [account],
      });
      onSuccess?.(data);
    }
  };

  window.getTopListInfo = getTopListInfo;
  window.getPlayerAllAssets = getPlayerAllAssets;
  window.getPlayerLastLotteryResult = getPlayerLastLotteryResult;
  window.getPlayerAllWeaponInfo = getPlayerAllWeaponInfo;
  window.getPlayerAllSkinInfo = getPlayerAllSkinInfo;

  /// ###########################################
  /// write contract function
  /// ###########################################

  const startGame = async (
    onSuccess?: (receipt: any) => void,
    onError?: (receipt: any) => void
  ) => {
    try {
      let account = wallet?.getAccount();
      if (account) {
        const transaction = prepareContractCall({
          contract: GameContract,
          method: "function startGame() payable", 
          params: [],
          value: BigInt(10**16), // gas token amount for payable function
        });
        const transactionResult = await sendTransaction({
          transaction: transaction,
          account: account,
        });
        const receipt: TransactionReceipt = await waitForReceipt(
          transactionResult
        );
        switch (receipt.status) {
          case "success":
            onSuccess?.(receipt);
            break;
          case "reverted":
            onError?.(receipt);
            break;
        }
      }
    } catch(e: any) {
      let message = e["message"];
      if(message != null && message != undefined && message !== "") {
        alert(message);
      }
    }
  };

  const gameOver = async (
    time: bigint,
    kills: bigint,
    onSuccess?: (receipt: any) => void,
    onError?: (receipt: any) => void
  ) => {
    try {
      let account = wallet?.getAccount();
      if (account) {
        const transaction = prepareContractCall({
          contract: GameContract,
          method: "function gameOver(uint256 time, uint256 kills)", 
          params: [time, kills] 
        });
        const transactionResult = await sendTransaction({
          transaction: transaction,
          account: account,
        });
        const receipt: TransactionReceipt = await waitForReceipt(
          transactionResult
        );
        switch (receipt.status) {
          case "success":
            onSuccess?.(receipt);
            break;
          case "reverted":
            onError?.(receipt);
            break;
        }
      }
    } catch(e: any) {
      let message = e["message"];
      if(message != null && message != undefined && message !== "") {
        alert(message);
      }
    }
  };

  const buyOrUpgradeSkin = async (
    id: bigint,
    onSuccess?: (receipt: any) => void,
    onError?: (receipt: any) => void
  ) => {
    try {
      let account = wallet?.getAccount();
      if (account) {
        const transaction = prepareContractCall({
          contract: GameContract,
          method: "function buyOrUpgradeSkin(uint256 id)", 
          params: [id] 
        });
        const transactionResult = await sendTransaction({
          transaction: transaction,
          account: account,
        });
        const receipt: TransactionReceipt = await waitForReceipt(
          transactionResult
        );
        switch (receipt.status) {
          case "success":
            onSuccess?.(receipt);
            break;
          case "reverted":
            onError?.(receipt);
            break;
        }
      }
    } catch(e: any) {
      let message = e["message"];
      if(message != null && message != undefined && message !== "") {
        alert(message);
      }
    }
  };

  const buyOrUpgradeWeapon = async (
    id: bigint,
    onSuccess?: (receipt: any) => void,
    onError?: (receipt: any) => void
  ) => {
    try {
      let account = wallet?.getAccount();
      if (account) {
        const transaction = prepareContractCall({
          contract: GameContract,
          method: "function buyOrUpgradeWeapon(uint256 id)", 
          params: [id] 
        });
        const transactionResult = await sendTransaction({
          transaction: transaction,
          account: account,
        });
        const receipt: TransactionReceipt = await waitForReceipt(
          transactionResult
        );
        switch (receipt.status) {
          case "success":
            onSuccess?.(receipt);
            break;
          case "reverted":
            onError?.(receipt);
            break;
        }
      }
    } catch(e: any) {
      let message = e["message"];
      if(message != null && message != undefined && message !== "") {
        alert(message);
      }
    }
  };

  const requestLottery = async (
    onSuccess?: (receipt: any) => void,
    onError?: (receipt: any) => void
  ) => {
    try {
      let account = wallet?.getAccount();
      if (account) {
        const transaction = await prepareContractCall({
          contract: GameContract,
          method: "function requestLottery() payable", 
          params: [] ,
          value: BigInt(4*(10**16)), // gas token amount for payable function
        });
        const transactionResult = await sendTransaction({
          transaction: transaction,
          account: account,
        });
        const receipt: TransactionReceipt = await waitForReceipt(
          transactionResult
        );
        switch (receipt.status) {
          case "success":
            onSuccess?.(receipt);
            break;
          case "reverted":
            onError?.(receipt);
            break;
        }
      }
    } catch(e: any) {
      let message = e["message"];
      if(message != null && message != undefined && message !== "") {
        alert(message);
      }
    }
  };

  const mintGold = async (
    onSuccess?: (receipt: any) => void,
    onError?: (receipt: any) => void
  ) => {
    try {
      let account = wallet?.getAccount();
      if (account) {
        const transaction = await prepareContractCall({
          contract: GameContract,
          method: "function mintGold() payable", 
          params: [],
          value: BigInt(10**16), // gas token amount for payable function
        });
        const transactionResult = await sendTransaction({
          transaction: transaction,
          account: account,
        });
        const receipt: TransactionReceipt = await waitForReceipt(
          transactionResult
        );
        switch (receipt.status) {
          case "success":
            onSuccess?.(receipt);
            break;
          case "reverted":
            onError?.(receipt);
            break;
        }
      }
    } catch(e: any) {
      let message = e["message"];
      if(message != null && message != undefined && message !== "") {
        alert(message);
      }
    }
  };

  const reLive = async (
    onSuccess?: (receipt: any) => void,
    onError?: (receipt: any) => void
  ) => {
    try {
      let account = wallet?.getAccount();
      if (account) {
        const transaction = await prepareContractCall({
          contract: GameContract,
          method: "function reLive() payable", 
          params: [],
          value: BigInt(5*(10**16)), // gas token amount for payable function
        });
        const transactionResult = await sendTransaction({
          transaction: transaction,
          account: account,
        });
        const receipt: TransactionReceipt = await waitForReceipt(
          transactionResult
        );
        switch (receipt.status) {
          case "success":
            onSuccess?.(receipt);
            break;
          case "reverted":
            onError?.(receipt);
            break;
        }
      }
    } catch(e: any) {
      let message = e["message"];
      if(message != null && message != undefined && message !== "") {
        alert(message);
      }
    }
  };

  window.startGame = startGame;
  window.gameOver = gameOver;
  window.buyOrUpgradeSkin = buyOrUpgradeSkin;
  window.buyOrUpgradeWeapon = buyOrUpgradeWeapon;
  window.requestLottery = requestLottery;
  window.mintGold = mintGold;
  window.reLive = reLive;

  // contract
  window.storageContract = GameContract;

  return (
    <main>
      <div style={{ display: "none" }}>
        <ConnectButton client={client} wallets={wallets} chain={thetaTestnet} />
      </div>
    </main>
  );
}
