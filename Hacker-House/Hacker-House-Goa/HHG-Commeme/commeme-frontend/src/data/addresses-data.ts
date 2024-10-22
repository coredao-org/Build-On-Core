import { coreDao, polygon } from "viem/chains";



export const CONSTANT_ADDRESSES = {
    137:{
        factoryAddress: "0xc35DADB65012eC5796536bD9864eD8773aBc74C4",
        routerAddress: "0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506",
        wrapAddress: "0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270",
        commemeFactory: "0x3c287EBA998789a4a8C88ec0b251bb08978bb980",
        scanner: "https://polygonscan.com",
        graphql: "https://api.studio.thegraph.com/query/85941/commeme/version/latest",
        legacyAddress: "0x58860B7A392A124206AD76EFf160FF448B7cd46c",
        tokenName: "MATIC",
        chain:polygon,
      
    },
    1116:{
        factoryAddress: "0xB45e53277a7e0F1D35f2a77160e91e25507f1763",
        routerAddress: "0x9B3336186a38E1b6c21955d112dbb0343Ee061eE",
        wrapAddress: "0x191e94fa59739e188dce837f7f6978d84727ad01",
        commemeFactory: "0xb8F55945296407B8f9a7095F0c71b221a257b2F2",
        legacyAddress:"0xF81ADed2420c373e34F40D33a01189AdDFe2644D",
        scanner:"https://scan.coredao.org",
        graphql: "https://commeme-1.onrender.com",
        tokenName: "CORE",

        chain:coreDao,
     
    }
} as const;

export const LEGACY_ABI = [
	{
		"inputs": [
			{
				"internalType": "address payable",
				"name": "_to",
				"type": "address"
			}
		],
		"name": "getBack",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "value",
				"type": "uint256"
			}
		],
		"name": "PaymentReceipt",
		"type": "event"
	},
	{
		"stateMutability": "payable",
		"type": "receive"
	}
] as const;