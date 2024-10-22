// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import {Script, console} from "forge-std/Script.sol";

import {BlumaNFT} from "../src/BlumaNfts.sol";

contract DeployScript is Script {

    BlumaNFT blumaNft;

    function setUp() public {}

    function run() public {

        vm.startBroadcast();

        blumaNft = new BlumaNFT();

        // Log the addresses of the proxy and the implementation contract
      
        console.log("BLUMA NFT Implementation Address:", address(blumaNft));

        vm.stopBroadcast();
    }
}
