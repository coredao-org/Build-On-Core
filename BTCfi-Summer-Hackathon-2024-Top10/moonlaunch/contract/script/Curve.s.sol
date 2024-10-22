// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import { Script, console } from "forge-std/Script.sol";
import "../src/Curve.sol";

contract TestnetDeploymentScript is Script {

    address feeCollector = 0xF65330dC75e32B20Be62f503a337cD1a072f898f;
    address swapRouter;
    address swapFactory;
    uint256 tradingFeeRate = 100; // 1%
    uint256 migrationFeeRate = 200; // 2%
    uint256 creationFee = 10**15; // 0.001 ether
    uint256 minimumTargetMCap = 10_000 ether;

    function setRouterAndFactory() public virtual {
        swapRouter = 0x74F56a7560eF0C72Cf6D677e3f5f51C2D579fF15;
        swapFactory = 0xe0b8838e8d73ff1CA193E8cc2bC0Ebf7Cf86F620;
    }

    function run() public {
        setRouterAndFactory();
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);
        BondingCurveAMM curve = new BondingCurveAMM(
            tradingFeeRate, migrationFeeRate, 
            creationFee, minimumTargetMCap,
            feeCollector, swapRouter, swapFactory
        );
        console.log("Curve Address: ", address(curve));
        vm.stopBroadcast();
    }
}

contract MainnetDeploymentScript is TestnetDeploymentScript {
    function setRouterAndFactory() public override {
        swapRouter = 0x74F56a7560eF0C72Cf6D677e3f5f51C2D579fF15;
        swapFactory = 0xe0b8838e8d73ff1CA193E8cc2bC0Ebf7Cf86F620;
    }
}

contract TestnetTransactionScript is Script {
    BondingCurveAMM curve;
    uint256 threshold;
    uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");

    function setCurve() public virtual {
        curve = BondingCurveAMM(payable(0xFcA69B9033C414cBCfa24b30228376fd040b70B2));
    }

    function setThreshold() public virtual {
        threshold = 0.0003 ether;
    }

    function runTokenLaunch() public returns (MoonLaunchToken) {
        TokenLaunchParam memory param = TokenLaunchParam({
            name: "Moon Launch Token",
            symbol: "MLT",
            description: "Community token for moonlaunch",
            image: "mlaunch.jpg",
            twitterLink: "x.com/mlaunch.com",
            telegramLink: "t.me/mlaunch",
            website: "https://mlaunch.vercel.app"
        });
        uint256 targetMCap = 70_000 ether;
        address token = curve.launchToken(param, targetMCap);
        return MoonLaunchToken(token);
    }

    function runSwapEthForTokens(MoonLaunchToken token, uint256 amountIn) public returns (uint256 amountOut) {
        uint256 amountOutMin = curve.calcAmountOutFromEth(address(token), amountIn);
        amountOut = curve.swapEthForTokens{ value: amountIn }(address(token), amountIn, amountOutMin, block.timestamp + 2 minutes);
    }

    function runSwapTokensForEth(MoonLaunchToken token, uint256 amountIn) public returns (uint256 amountOut) {
        uint256 amountOutMin = curve.calcAmountOutFromToken(address(token), amountIn);
        token.approve(address(curve), amountIn);
        amountOut = curve.swapTokensForEth(address(token), amountIn, amountOutMin, block.timestamp + 2 minutes);
    }

    function runMigrateLiquidity(MoonLaunchToken token) public {
        uint256 amountOutMin = curve.calcAmountOutFromEth(address(token), threshold);
        curve.swapEthForTokens{ value: threshold }(address(token), threshold, amountOutMin, block.timestamp + 2 minutes);
    }

    function run() public {
        setCurve();
        setThreshold();
        vm.startBroadcast(deployerPrivateKey);
        curve.setCreationFee(0);
        MoonLaunchToken token = runTokenLaunch();
        uint256 tokenAmountOut = runSwapEthForTokens(token, 0.0001 ether);
        runSwapTokensForEth(token, tokenAmountOut/2);
        //runMigrateLiquidity(token);
        vm.stopBroadcast();
    }
}

contract MainnetTransactionScript is TestnetTransactionScript {
    function setCurve() public override {
        curve = BondingCurveAMM(payable(0xD62BfbF2050e8fEAD90e32558329D43A6efce4C8));
    }
    function setThreshold() public override {
        threshold = 0.0003 ether;
    }
}
