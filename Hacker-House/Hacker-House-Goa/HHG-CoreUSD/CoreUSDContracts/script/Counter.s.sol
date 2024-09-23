// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import "../src/Oracle.sol";
import "../src/CoreUSD.sol";
import "../src/CoreLogic.sol";

contract CounterScript is Script {
    address public protocol = 0x1Ea2e5647DBdE465d31c4a2092c10Db97c9a0C84;
    address public coreUsd = 0xc6CbA17D6Ea2eb68092e2D63a387303f0c8e7666;
    address public oracle = 0x8d2620d9F8801D61317069D10A0a5Cd0Eb47dE9c;

    function setUp() public {}

    function run() public {
        uint256 privateKey = privateKey;
        address deployer = vm.addr(privateKey);
        vm.startBroadcast(privateKey);
        Oracle _oracle = new Oracle();
        oracle = address(_oracle);
        console.log("oracle address is", oracle);
        Oracle(oracle).setPrice(103e16);
        StableToken _coreUsd = new StableToken();
        coreUsd = address(_coreUsd);
        console.log("coreUsd address is", coreUsd);
        CoreLogic _coreLogic = new CoreLogic(coreUsd, 130, 1, oracle);
        protocol = address(_coreLogic);
        console.log("protocol address is", protocol);
        StableToken(coreUsd).transferOwnership(protocol);

        CoreLogic(protocol).deposiCollateral{value: 1e15}();
        uint256 deposited = CoreLogic(protocol).collateralDeposited(deployer);
        console.log("deposit is", deposited);
        CoreLogic(protocol).deposiCollateralandMint{value: 1e15}(1e15);
        uint256 tokenMinted = CoreLogic(protocol).totalDebt(deployer);
        uint256 hf = CoreLogic(protocol).getHealthFactor(deployer);
        uint256 maxBorrow = CoreLogic(protocol).maxBorrow(deployer);
        console.log("tokenMinted is ", tokenMinted);
        console.log("hf is ", hf);
        console.log("maxBorrow is ", maxBorrow);
    }
}
//0x991f4bf07ec670BF19Ee6BDF5AA9F6b39d5c6B83
//https://rpc.test.btcs.network
//https://alfajores-forno.celo-testnet.org
// forge script script/counter.s.sol --rpc-url https://rpc.test.btcs.network --broadcast -vvv --legacy --slow
