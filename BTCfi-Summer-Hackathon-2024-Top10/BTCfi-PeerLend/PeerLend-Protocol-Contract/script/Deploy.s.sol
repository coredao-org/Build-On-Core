// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol";

import {PeerToken} from "../src/PeerToken.sol";
import {Protocol} from "../src/Protocol.sol";
import {Governance} from "../src/Governance.sol";
// import {IProtocolTest} from "../IProtocolTest.sol";
import "../src/Libraries/Errors.sol";


contract DeployScript is Script {
    PeerToken peerToken;
    Protocol protocol;
    Governance governance;

    ERC1967Proxy proxy;


    address benjamineAddr = 0xb2b2130b4B83Af141cFc4C5E3dEB1897eB336D79;

    bytes32[] priceFeeds;
    address[] tokens;

    bytes32 public DAIUSD =
        bytes32(
            0xb0948a5e5313200c632b51bb5ca32f6de0d36e9950a942d19751e833f70dabfd
        );
    bytes32 public LINKUSD =
        bytes32(
            0x8ac0c70fff57e9aefdf5edf44b51d62c2d433653cbb2cf5cc06bb115af04d221
        );
    bytes32 public WBTCUSD =
        bytes32(
            0xc9d8b075a5c69303365ae23633d4e085199bf5c520a3b90fed1322a0342ffc33
        );
    bytes32 public USDCUSD =
        bytes32(
            0xeaa020c61cc479712813461ce153894a96a6c00b21ed0cfc2798d1f9a9e9c94a
        );

      bytes32 public USDTUSD =
        bytes32(
            0x2b89b9dc8fdf9f34709a5b106b472f0f39bb6ca9ce04b0fd7f2e971688e2e53b
        );


    address public DAI = 0x57a8f8b6eD04e92f053C19EFbF1ab8C0314Fe7b0;
    address public LINK = 0x1Fb9EEe6DF9cf79968D2b558AeDE454384498e2a;
    address public WBTC = 0x45d341D33624Cc53B1E61f73C076f8A545DA191D;
    address public USDC = 0x1Fb9EEe6DF9cf79968D2b558AeDE454384498e2a;
    address public USDT = 0x3786495F5d8a83B7bacD78E2A0c61ca20722Cce3;


    function setUp() public {
        priceFeeds.push(DAIUSD);
        priceFeeds.push(LINKUSD);
        priceFeeds.push(WBTCUSD);
        priceFeeds.push(USDCUSD);
        priceFeeds.push(USDTUSD);
        
        tokens.push(DAI);
        tokens.push(LINK);
        tokens.push(WBTC);
        tokens.push(USDC);
        tokens.push(USDT);

    }

    function run() public {
        vm.startBroadcast();
        peerToken = new PeerToken(msg.sender);

        governance = new Governance(address(peerToken));

        Protocol implementation = new Protocol();
        // Deploy the proxy and initialize the contract through the proxy
        proxy = new ERC1967Proxy(
            address(implementation),
            abi.encodeCall(
                implementation.initialize,
                (
                    msg.sender,
                    tokens,
                    priceFeeds,
                    address(peerToken), 
                    0x8D254a21b3C86D32F7179855531CE99164721933
                )
            )
        );
        // Attach the MyToken interface to the deployed proxy
        console.log("$PEER address", address(peerToken));
        console.log("Governance address", address(governance));
        console.log("Proxy Address", address(proxy));
        console.log("Protocol address", address(implementation));

        Protocol(address(proxy)).addLoanableToken(
            address(peerToken),
            USDCUSD
        );
         

        console.log("Loanable Token Added");

        peerToken.mint(benjamineAddr, 10000 * 10 ** 18);

        console.log("MINTED SUCCESSFUL");


        vm.stopBroadcast();
    }

}

