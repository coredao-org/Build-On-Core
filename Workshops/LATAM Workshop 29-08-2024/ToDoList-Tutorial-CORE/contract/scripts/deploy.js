async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploy contract with the account:", deployer.address);

  const TodoList = await ethers.getContractFactory("TodoList");

  const todoList = await TodoList.deploy();

  console.log("Contract Address:", todoList.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });