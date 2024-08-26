interface Window {
  ethereum?: any;
  web3?: any;
  thirdwebClient: thirdwebClient;
  isBaseSepoliaNetwork: boolean;
  userAccount?: String;
  onConnectButtonClick: Function;
  onConnectedButtonClick: Function;
  storageContract: Readonly<ContractOptions<[]>>;
  // read function
  getTopListInfo: (onSuccess?: (receipt: any) => void) => Promise<void>;
  getPlayerAllAssets: (onSuccess?: (receipt: any) => void) => Promise<void>;
  getPlayerLastLotteryResult: (onSuccess?: (receipt: any) => void) => Promise<void>;
  getPlayerAllWeaponInfo: (onSuccess?: (receipt: any) => void) => Promise<void>;
  getPlayerAllSkinInfo: (onSuccess?: (receipt: any) => void) => Promise<void>;
  // write function
  startGame: (onSuccess?: (receipt: any) => void, onError?: (receipt: any) => void) => Promise<void>;
  gameOver: (time: bigint, kills: bigint, onSuccess?: (receipt: any) => void, onError?: (receipt: any) => void) => Promise<void>;
  buyOrUpgradeSkin: (id: bigint, onSuccess?: (receipt: any) => void, onError?: (receipt: any) => void) => Promise<void>;
  buyOrUpgradeWeapon: (id: bigint, onSuccess?: (receipt: any) => void, onError?: (receipt: any) => void) => Promise<void>;
  requestLottery: (onSuccess?: (receipt: any) => void, onError?: (receipt: any) => void) => Promise<void>;
  mintGold: (onSuccess?: (receipt: any) => void, onError?: (receipt: any) => void) => Promise<void>;
  reLive: (onSuccess?: (receipt: any) => void, onError?: (receipt: any) => void) => Promise<void>;
}
