// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Test, console} from "forge-std/Test.sol";
import "../src/CoreLogic.sol";
import "../src/CoreUSD.sol";
import "../src/Oracle.sol";

contract CounterTest is Test {
    address public protocol;
    address public coreUsd;
    address public oracle;

    function setUp() public {
        Oracle _oracle = new Oracle();
        oracle = address(_oracle);
        Oracle(oracle).setPrice(103e16);

        StableToken _coreUsd = new StableToken();
        coreUsd = address(_coreUsd);

        CoreLogic _coreLogic = new CoreLogic(coreUsd, 130, 1, oracle);
        protocol = address(_coreLogic);
        StableToken(coreUsd).transferOwnership(protocol);
    }

    function testSetUp() public {
        console.log("oracle address is", oracle);
        console.log("oracle price is ", Oracle(oracle).getPrice());
        console.log("coreUsd address is", coreUsd);
        console.log("protocol address is", protocol);
    }

    function testDeposit() public {
        CoreLogic(protocol).deposiCollateral{value: 10e18}();
        uint256 deposited = CoreLogic(protocol).collateralDeposited(
            address(this)
        );
        uint256 tokenMinted = CoreLogic(protocol).totalDebt(address(this));
        uint256 hf = CoreLogic(protocol).getHealthFactor(address(this));
        uint256 maxBorrow = CoreLogic(protocol).maxBorrow(address(this));
        console.log("deposit is ", deposited);
        console.log("tokenMinted is ", tokenMinted);
        console.log("hf is ", hf);
        console.log("maxBorrow is ", maxBorrow);
    }

    function testDepositAndMint() public {
        CoreLogic(protocol).deposiCollateralandMint{value: 10e18}(746e16);
        uint256 deposited = CoreLogic(protocol).collateralDeposited(
            address(this)
        );
    }

    function testborrowTokens() public {
        testDeposit();
        CoreLogic(protocol).borrowTokens(792e16);
        uint256 tokenMinted = CoreLogic(protocol).totalDebt(address(this));
        uint256 hf = CoreLogic(protocol).getHealthFactor(address(this));
        uint256 maxBorrow = CoreLogic(protocol).maxBorrow(address(this));
        console.log("tokenMinted is ", tokenMinted);
        console.log("hf is ", hf);
        console.log("maxBorrow is ", maxBorrow);
    }

    function testredeemCollateral() public {
        CoreLogic(protocol).deposiCollateral{value: 10e18}();
        uint256 deposited = CoreLogic(protocol).collateralDeposited(
            address(this)
        );
        console.log("balance in  is", protocol.balance);
        console.log("deposit is", deposited);
        CoreLogic(protocol).redeemCollateral(deposited);
        console.log("balance after  is", protocol.balance);
    }

    function testredeemCollateralandBurn() public {
        CoreLogic(protocol).deposiCollateralandMint{value: 10e18}(2e18);
        uint256 deposited = CoreLogic(protocol).collateralDeposited(
            address(this)
        );
        console.log("balance in  is", protocol.balance);
        console.log("deposit is", deposited);
        StableToken(coreUsd).approve(protocol, 100e18);
        CoreLogic(protocol).redeemCollateralandBurn(5e18, 1e18);
        console.log("balance after  is", protocol.balance);
    }

    function testrepay() public {
        CoreLogic(protocol).deposiCollateralandMint{value: 10e18}(2e18);
        uint256 deposited = CoreLogic(protocol).collateralDeposited(
            address(this)
        );
        uint256 tokenMinted = CoreLogic(protocol).totalDebt(address(this));
        uint256 hf = CoreLogic(protocol).getHealthFactor(address(this));
        uint256 maxBorrow = CoreLogic(protocol).maxBorrow(address(this));
        console.log("tokenMinted is ", tokenMinted);
        console.log("hf is ", hf);
        console.log("maxBorrow is ", maxBorrow);
        StableToken(coreUsd).approve(protocol, 100e18);
        CoreLogic(protocol).repay(1e18);
        tokenMinted = CoreLogic(protocol).totalDebt(address(this));
        hf = CoreLogic(protocol).getHealthFactor(address(this));
        maxBorrow = CoreLogic(protocol).maxBorrow(address(this));
        console.log("tokenMinted is ", tokenMinted);
        console.log("hf is ", hf);
        console.log("maxBorrow is ", maxBorrow);
    }

    function testSwap() public {
        testDepositAndMint();
        console.log(
            "stable balance before is",
            StableToken(coreUsd).balanceOf(address(this))
        );
        console.log("balance before  is", address(this).balance);
        StableToken(coreUsd).approve(protocol, 100e18);
        CoreLogic(protocol).swap(1e18);
        console.log("balance after  is", address(this).balance);
        console.log(
            "stavle balance after is",
            StableToken(coreUsd).balanceOf(address(this))
        );
    }

    receive() external payable {}
}
