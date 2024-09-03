async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploy contract with the account:", deployer.address);

  const Guestbook = await ethers.getContractFactory("Guestbook");

  const guestbook = await Guestbook.deploy();

  console.log("Contract Address:", guestbook.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });