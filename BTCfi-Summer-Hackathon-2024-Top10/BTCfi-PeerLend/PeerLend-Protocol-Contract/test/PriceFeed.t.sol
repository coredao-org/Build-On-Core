// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import {Test, console} from "forge-std/Test.sol";
import {Protocol} from "../src/Protocol.sol";

contract PriceFeedTest is Test {
    Protocol priceFeed;
      address public DAI = 0x57a8f8b6eD04e92f053C19EFbF1ab8C0314Fe7b0;
    address public LINK = 0x1Fb9EEe6DF9cf79968D2b558AeDE454384498e2a;
    address public WBTC = 0x45d341D33624Cc53B1E61f73C076f8A545DA191D;
    address public USDC = 0x1Fb9EEe6DF9cf79968D2b558AeDE454384498e2a;
    address public USDT = 0x1Fb9EEe6DF9cf79968D2b558AeDE454384498e2a;


    function setUp() public {
        vm.startBroadcast();
        priceFeed = Protocol(0x8c453Aad3B6F4610260326ce3F78Bd869a25Ad69);
        vm.stopBroadcast();
    }

    function test_getUsdValueDai() public {
        vm.prank(0x3fEAD690Dc1CaF95AB9f6cC724cDb005F89A2626);
    
        uint256 total = priceFeed.getUsdValue(DAI, 10);
        console.log("10 DAI = ", total);
        assert(total > 0);
    }

    function test_getUsdValueUSDC() public {
        vm.prank(0x3fEAD690Dc1CaF95AB9f6cC724cDb005F89A2626);
     
        uint256 total = priceFeed.getUsdValue(
            USDC,
            10
        );
        console.log("10 USDC = ", total);
        assert(total > 0);
    }

    function test_getUsdValueWBTC() public {
        vm.prank(0x3fEAD690Dc1CaF95AB9f6cC724cDb005F89A2626);

        uint256 total = priceFeed.getUsdValue(
            WBTC,
            10
        );
        console.log("10 WBTC = ", total);
        assert(total > 0);
    }

    function test_getUsdValueLINK() public {
        vm.prank(0x3fEAD690Dc1CaF95AB9f6cC724cDb005F89A2626);
   
        uint256 total = priceFeed.getUsdValue(
            LINK,
            10
        );
        console.log("10 LINK = ", total);
        assert(total > 0);
    }

     function test_getUsdValueUSDT() public {
        vm.prank(0x3fEAD690Dc1CaF95AB9f6cC724cDb005F89A2626);
   
        uint256 total = priceFeed.getUsdValue(
            USDT,
            10
        );
        console.log("10 LINK = ", total);
        assert(total > 0);
    }
}