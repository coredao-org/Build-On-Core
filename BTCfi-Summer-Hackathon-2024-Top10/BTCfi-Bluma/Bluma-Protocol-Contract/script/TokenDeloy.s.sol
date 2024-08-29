
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;
import {Script, console} from "forge-std/Script.sol";

import {BlumaToken} from "../src/BlumaToken.sol";



contract DeployScript is Script {

    BlumaToken blumaToken;

    function setUp() public {}

    function run() public {

        vm.startBroadcast();

        blumaToken = new BlumaToken();

        // Log the addresses of the proxy and the implementation contract
        
        console.log("BLUMA TOKEN Implementation Address:", address(blumaToken));


        vm.stopBroadcast();
    }
}


