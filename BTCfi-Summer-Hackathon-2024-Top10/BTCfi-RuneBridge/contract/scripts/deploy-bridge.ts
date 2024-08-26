import { ethers } from "hardhat";
import { ContractFactory } from "ethers";

async function main() {
    const ChainIdentityFactory: ContractFactory = await ethers.getContractFactory("RuneBridge");
    const chainIdentity = await ChainIdentityFactory.deploy({
        gasLimit: 0x1000000
    });
    const contractAddress = await chainIdentity.getAddress();
    console.log("Contract deployed to:", contractAddress);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
