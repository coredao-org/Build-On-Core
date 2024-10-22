// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.25;

import {Test, console, Vm} from "forge-std/Test.sol";
import { MoonLaunchToken } from "../src/Token.sol";
import { FixedPointMathLib } from "@solmate/utils/FixedPointMathLib.sol";
import "../src/Curve.sol";
import "@uniswap/v2-core/contracts/interfaces/IUniswapV2Pair.sol";
import "@uniswap/v2-core/contracts/interfaces/IUniswapV2Factory.sol";
import "@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router02.sol";

contract MainnetForkTest is Test {
    using FixedPointMathLib for uint256;

    BondingCurveAMM public curve;
    MoonLaunchToken public testToken;
    address public feeCollector;
    address public trader;
    address public admin;
    address public swapRouter;
    address public uniswapV2Factory;
    uint256 tradingFeeRate = 100; // 1%
    uint256 migrationFeeRate = 700; // 1.5%
    uint256 creationFee = 10**15; // 0.001 ether
    uint256 minimumLaunchPrice = 0.0001 ether;
    uint256 minimumTargetMCap = 100 ether;

    function setRouterAndFactory() public virtual {
        swapRouter = 0x74F56a7560eF0C72Cf6D677e3f5f51C2D579fF15;
        uniswapV2Factory = IUniswapV2Router02(swapRouter).factory();
    }

    function runSetUp() internal {
        (feeCollector, ) = makeAddrAndKey("feeCollector");
        (trader, ) = makeAddrAndKey("trader");
        (admin, ) = makeAddrAndKey("admin");
        vm.prank(admin);
        curve = new BondingCurveAMM(
            tradingFeeRate, 
            migrationFeeRate, 
            creationFee, 
            minimumTargetMCap,
            feeCollector,
            swapRouter,
            uniswapV2Factory
        );
        TokenLaunchParam memory param = TokenLaunchParam({
            name: "Test Token",
            symbol: "TTK",
            description: "Token launch for testing purpose",
            image: "image.jpg",
            twitterLink: "x.com/test",
            telegramLink: "t.me/test",
            website: "test.com"
        });
        address token = curve.launchToken{value: creationFee}(param, 100 ether);
        testToken = MoonLaunchToken(token);
    }
    
    function setUp() public {
        setRouterAndFactory();
        runSetUp();
    }

    function test_contract_variables() public view {
        assertEq(curve.admin(), admin);
        assertEq(curve.tradingFeeRate(), tradingFeeRate);
        assertEq(curve.migrationFeeRate(), migrationFeeRate);
        assertEq(curve.creationFee(), creationFee);
        assertEq(address(curve.swapRouter()), swapRouter);
        assertEq(curve.paused(), false);
        assertEq(curve.protocolFeeRecipient(), feeCollector);
        assertEq(curve.FEE_DENOMINATOR(), 100_00);
        assertEq(curve.MAX_FEE(), 10_00);
        assertEq(curve.TOTAL_SUPPLY(), 1_000_000_000 ether);
        assertEq(curve.INIT_VIRTUAL_TOKEN_RESERVE(), 1073000000 ether);
        assertEq(curve.INIT_REAL_TOKEN_RESERVE(), 793100000 ether);
    }

    function test_launch_token() public {
        TokenLaunchParam memory param = TokenLaunchParam({
            name: "Test Token 2",
            symbol: "TTK2",
            description: "Token launch for testing purpose",
            image: "image.jpg",
            twitterLink: "x.com/test2",
            telegramLink: "t.me/test2",
            website: "test2.com"
        });
        vm.startPrank(msg.sender);
        vm.recordLogs();
        uint256 beforeLaunchFeeCollectorBal = feeCollector.balance;
        uint256 beforeLaunchCreatorBal = msg.sender.balance;
        address token = curve.launchToken{value: creationFee}(param, 100 ether);
        uint256 afterLaunchFeeCollectorBal = feeCollector.balance;
        uint256 afterLaunchCreatorBal = msg.sender.balance;
        vm.stopPrank();
        Vm.Log[] memory logs = vm.getRecordedLogs();
        Vm.Log memory transferEvent = logs[0];
        Vm.Log memory launchEvent = logs[1];
        Vm.Log memory priceUpdateEvent = logs[2];

        // ---- TRANSFER EVENT TOPICS & DATA
        assertEq(transferEvent.topics.length, 3);
        assertEq(transferEvent.topics[0], keccak256("Transfer(address,address,uint256)"));
        assertEq(abi.decode(abi.encodePacked(transferEvent.topics[1]), (address)), address(0));
        assertEq(abi.decode(abi.encodePacked(transferEvent.topics[2]), (address)), address(curve));
        assertEq(abi.decode(transferEvent.data, (uint256)), curve.TOTAL_SUPPLY());
        
        // ---- LAUNCH EVENT TOPICS & DATA
        (
            address _token, uint256 targetMCapCore, string memory name, string memory symbol, 
            string memory description, string memory image, string memory twitterLink, 
            string memory telegramLink, string memory website, uint256 timestamp
        ) = abi.decode(launchEvent.data, (address,uint256,string,string,string,string,string,string,string,uint256));
        assertEq(launchEvent.topics.length, 2);
        assertEq(launchEvent.topics[0], keccak256("TokenLaunch(address,address,uint256,string,string,string,string,string,string,string,uint256)"));
        assertEq(abi.decode(abi.encodePacked(launchEvent.topics[1]), (address)), msg.sender);
        assertEq(_token, token);
        assertEq(targetMCapCore, 100 ether);
        assertEq(name, param.name);
        assertEq(symbol, param.symbol);
        assertEq(description, param.description);
        assertEq(image, param.image);
        assertEq(twitterLink, param.twitterLink);
        assertEq(telegramLink, param.telegramLink);
        assertEq(website, param.website);
        assertEq(timestamp, block.timestamp);

        // ---- PRICE UPDATE EVENT TOPICS & DATA
        assertEq(priceUpdateEvent.topics.length, 3);
        assertEq(priceUpdateEvent.topics[0], keccak256("PriceUpdate(address,address,uint256,uint256,uint256)"));
        assertEq(abi.decode(abi.encodePacked(priceUpdateEvent.topics[1]), (address)), token);
        assertEq(abi.decode(abi.encodePacked(priceUpdateEvent.topics[2]), (address)), msg.sender);
        
        // ---- POOL VERIFICATION ----
        (
            MoonLaunchToken token_, uint256 tokenReserve, , uint256 ethReserve,,,, uint256 lastPrice, uint256 lastMcapInEth,
            uint256 lastTs, uint256 lastBlock, address creator, bool migrated
        ) = curve.tokenPool(token);
        assertEq(migrated, false);
        //assertEq(virtualEthReserve, initVirtualEthReserve);
        assertEq(ethReserve, 0);
        assertEq(lastTs, block.timestamp);
        assertEq(lastBlock, block.number);
        assertEq(creator, msg.sender);
        assertEq(tokenReserve, curve.INIT_REAL_TOKEN_RESERVE());
        //assertEq(virtualTokenReserve, curve.INIT_VIRTUAL_TOKEN_RESERVE());
        //assertEq(lastPrice, initVirtualEthReserve.divWadDown(virtualTokenReserve));
        assertEq(lastMcapInEth, curve.TOTAL_SUPPLY().mulWadUp(lastPrice));


        // ---- TOKEN CHECKS ----
        assertEq(address(token_), token);
        assertEq(token_.curve(), address(curve));
        assertEq(token_.creator(), msg.sender);
        assertEq(token_.isApprovable(), false);

        // ---- CREATION FEE CHECKS ----
        assertEq(afterLaunchFeeCollectorBal - beforeLaunchFeeCollectorBal, creationFee);
        assertEq(beforeLaunchCreatorBal - afterLaunchCreatorBal, creationFee);
    }

    function test_migrate_liquidity() public {
        // Buy enough tokens to trigger liquidity migration
        vm.recordLogs();
        uint256 amountIn = 140 ether;
        uint256 fee = amountIn * tradingFeeRate / curve.FEE_DENOMINATOR();
        uint256 beforeFeeCollectorBal = feeCollector.balance;
        // Buy tokens enough to exceed threshold
        curve.swapEthForTokens{value: amountIn}(address(testToken), amountIn, 0, block.timestamp + 1 minutes);
        uint256 afterFeeCollectorBal = feeCollector.balance;
        ( 
            ,uint256 tokenReserve, uint256 virtualTokenReserve, uint256 ethReserve, 
            uint256 virtualEthReserve,,,,,,
            ,, bool migrated 
        ) = curve.tokenPool(address(testToken));
        IUniswapV2Router02 router = IUniswapV2Router02(swapRouter);
        IUniswapV2Factory uniswapFactory = IUniswapV2Factory(uniswapV2Factory);
        address pairAddr = uniswapFactory.getPair(address(testToken), router.WETH());
        IUniswapV2Pair pair = IUniswapV2Pair(pairAddr);
        ( uint112 ethReservePool, uint112 tokenReservePool, ) = pair.getReserves();
        uint256 expectedMigrationFee = (amountIn - fee) * migrationFeeRate / curve.FEE_DENOMINATOR();
        
        // Assertions
        assertEq(tokenReserve, 0);
        assertEq(virtualTokenReserve, 0);
        assertEq(ethReserve, 0);
        assertEq(virtualEthReserve, 0);
        assertEq(migrated, true);
        assertEq(testToken.isApprovable(), true);
        assertEq(afterFeeCollectorBal - beforeFeeCollectorBal, expectedMigrationFee + fee);
        assertEq(tokenReservePool, curve.TOTAL_SUPPLY() - curve.INIT_REAL_TOKEN_RESERVE());
        assertEq(ethReservePool, amountIn - fee - expectedMigrationFee);
        assertEq(testToken.balanceOf(address(curve)), 0);

        // Logs
        Vm.Log[] memory logs = vm.getRecordedLogs();
        // Vm.Log memory addLiqEvent = logs[11];
        Vm.Log memory migrateLiqEvent = logs[logs.length - 2];
        
        // Migrate Liquidity Event Test
        ( uint256 ethAmount, uint256 tokenAmount, uint256 migFee, ) = abi.decode(migrateLiqEvent.data, (uint256, uint256, uint256, uint256));
        assertEq(migrateLiqEvent.topics.length, 3);
        assertEq(migrateLiqEvent.topics[0], keccak256("MigrateLiquidity(address,address,uint256,uint256,uint256,uint256)"));
        assertEq(abi.decode(abi.encodePacked(migrateLiqEvent.topics[1]), (address)), address(testToken));
        assertEq(abi.decode(abi.encodePacked(migrateLiqEvent.topics[2]), (address)), pairAddr);
        assertEq(ethAmount, ethReservePool);
        assertEq(tokenAmount, tokenReservePool);
        assertEq(migFee, expectedMigrationFee);
    }

    function test_swap_eth_for_tokens_on_router() public {
        vm.recordLogs();
        vm.startPrank(trader);
        vm.deal(trader, 150 ether);
        uint256 amountIn = 110 ether;
        //uint256 fee = amountIn * tradingFeeRate / curve.FEE_DENOMINATOR();

        // Buy tokens enough to exceed threshold and migrate liquidity to fraxswap
        curve.swapEthForTokens{value: amountIn}(address(testToken), amountIn, 0, block.timestamp + 1 minutes);

        IUniswapV2Router02 router = IUniswapV2Router02(swapRouter);
        IUniswapV2Factory uniswapFactory = IUniswapV2Factory(uniswapV2Factory);
        address pairAddr = uniswapFactory.getPair(address(testToken), router.WETH());
        IUniswapV2Pair pair = IUniswapV2Pair(pairAddr);
        uint256 beforeTokenBal = testToken.balanceOf(trader);
        ( uint112 beforeEthReserve, uint112 beforeTokenReserve, ) = pair.getReserves();
        // Buy Tokens on FraxSwap router
        uint256 amountOut = curve.swapEthForTokens{value: 1 ether}(address(testToken), 1 ether, 0, block.timestamp + 1 minutes);
        uint256 afterTokenBal = testToken.balanceOf(trader);
        ( uint112 afterEthReserve, uint112 afterTokenReserve, ) = pair.getReserves();
        vm.stopPrank();

        assertEq(beforeTokenReserve - afterTokenReserve, amountOut);
        assertEq(afterEthReserve > beforeEthReserve, true);
        assertEq(afterTokenBal - beforeTokenBal, amountOut);
    }

    function test_swap_tokens_for_eth_on_router() public {
        vm.recordLogs();
        vm.startPrank(trader);
        vm.deal(trader, 200 ether);
        uint256 amountIn = 110 ether;
        //uint256 fee = amountIn * tradingFeeRate / curve.FEE_DENOMINATOR();

        // Buy tokens enough to exceed threshold and migrate liquidity to fraxswap
        uint256 tokenAmount = curve.swapEthForTokens{value: amountIn}(address(testToken), amountIn, 0, block.timestamp + 1 minutes);

        IUniswapV2Router02 router = IUniswapV2Router02(swapRouter);
        IUniswapV2Factory uniswapFactory = IUniswapV2Factory(uniswapV2Factory);
        address pairAddr = uniswapFactory.getPair(address(testToken), router.WETH());
        IUniswapV2Pair pair = IUniswapV2Pair(pairAddr);
        uint256 beforeTokenBal = testToken.balanceOf(trader);
        ( uint112 beforeEthReserve, uint112 beforeTokenReserve, ) = pair.getReserves();
        // Sell Tokens on FraxSwap router
        testToken.approve(address(curve), tokenAmount/2);
        curve.swapTokensForEth(address(testToken), tokenAmount/2, 0, block.timestamp + 1 minutes);
        uint256 afterTokenBal = testToken.balanceOf(trader);
        ( uint112 afterEthReserve, uint112 afterTokenReserve, ) = pair.getReserves();
        vm.stopPrank();

        assertEq(afterTokenReserve - beforeTokenReserve, tokenAmount/2);
        assertEq(beforeEthReserve > afterEthReserve, true);
        assertEq(beforeTokenBal - afterTokenBal, tokenAmount/2);
    }
}