async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploy contract with the account:", deployer.address);

  const NFTCollection = await ethers.getContractFactory("NFTCollection");

  const nftCollection = await NFTCollection.deploy();

  console.log("Contract Address:", nftCollection.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });