// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./Oracle.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import "./CoreUSD.sol";

contract CoreLogic is Ownable {
    address public coreUSD;
    mapping(address => uint256) public collateralDeposited;
    mapping(address => uint256) public totalDebt;
    uint256 public liquidityThreashold;
    uint256 public minThreashold;
    address public priceOracle;

    error CollateralValueZero();
    error ValueZero();
    error HealthFactorBelowMIN(uint256);
    error HealthFactorSafe(uint256);

    constructor(
        address _coreUSD,
        uint256 _liquidityThreashold,
        uint256 _minThreashold,
        address _oracle
    ) Ownable(msg.sender) {
        coreUSD = _coreUSD;
        liquidityThreashold = _liquidityThreashold;
        minThreashold = _minThreashold;
        priceOracle = _oracle;
    }

    function deposiCollateral() external payable {
        if (msg.value == 0) {
            revert CollateralValueZero();
        }
        collateralDeposited[msg.sender] += msg.value;
    }

    function deposiCollateralandMint(uint256 _amount) external payable {
        if (msg.value == 0) {
            revert CollateralValueZero();
        }

        totalDebt[msg.sender] += _amount;
        collateralDeposited[msg.sender] += msg.value;

        uint256 userhealthFactor = getHealthFactor(msg.sender);
        revertIfHealthFactorIsBroken(userhealthFactor);
        StableToken(coreUSD).mint(msg.sender, _amount);
    }

    function borrowTokens(uint256 _amount) external returns (bool) {
        if (_amount == 0) {
            revert ValueZero();
        }
        totalDebt[msg.sender] += _amount;
        uint256 userhealthFactor = getHealthFactor(msg.sender);
        revertIfHealthFactorIsBroken(userhealthFactor);
        StableToken(coreUSD).mint(msg.sender, _amount);
        return true;
    }

    function redeemCollateral(uint256 _amount) external {
        if (_amount == 0) {
            revert CollateralValueZero();
        }
        collateralDeposited[msg.sender] -= _amount;
        uint256 userhealthFactor = getHealthFactor(msg.sender);
        revertIfHealthFactorIsBroken(userhealthFactor);
        (bool sent, bytes memory data) = payable(msg.sender).call{
            value: _amount
        }("");
        require(sent, "Failed to send ");
    }

    function redeemCollateralandBurn(
        uint256 _redeemAmount,
        uint256 _burnAmount
    ) external {
        if (_redeemAmount == 0 || _burnAmount == 0) {
            revert ValueZero();
        }

        collateralDeposited[msg.sender] -= _redeemAmount;
        totalDebt[msg.sender] -= _burnAmount;
        uint256 userhealthFactor = getHealthFactor(msg.sender);
        revertIfHealthFactorIsBroken(userhealthFactor);
        StableToken(coreUSD).transferFrom(
            msg.sender,
            address(this),
            _burnAmount
        );

        StableToken(coreUSD).burn(_burnAmount);
        (bool sent, ) = payable(msg.sender).call{value: _redeemAmount}("");
        require(sent, "Failed to send ");
    }

    function repay(uint256 _amount) external {
        if (_amount == 0) {
            revert ValueZero();
        }
        totalDebt[msg.sender] -= _amount;

        StableToken(coreUSD).transferFrom(msg.sender, address(this), _amount);

        StableToken(coreUSD).burn(_amount);
    }

    function swap(uint256 _amount) external {
        uint256 amountInCore = usdToCore(_amount);

        StableToken(coreUSD).transferFrom(msg.sender, address(this), _amount);

        StableToken(coreUSD).burn(_amount);

        (bool sent, ) = payable(msg.sender).call{value: amountInCore}("");
        require(sent, "Failed to send ");
    }

    function liquidate(address _user, uint256 _amount) external {
        uint256 userhealthFactor = getHealthFactor(_user);
        revertIfHealthFactorIsSafe(userhealthFactor);
        totalDebt[_user] -= _amount;
        uint256 amountInCore = usdToCore(_amount);
        uint256 amountBonus = ((amountInCore * 10) / 100) + amountInCore;
        uint256 userCollateral = collateralDeposited[_user];
        if (amountBonus > userCollateral) {
            collateralDeposited[_user] = 0;
        }
        collateralDeposited[_user] -= amountBonus;

        StableToken(coreUSD).transferFrom(msg.sender, address(this), _amount);
        StableToken(coreUSD).burn(_amount);
        (bool sent, ) = payable(msg.sender).call{value: amountInCore}("");
        require(sent, "Failed to send ");
    }

    function maxBorrow(address _user) public view returns (uint256) {
        uint256 deposit = collateralDeposited[_user];
        uint256 depoistInUsd = coreToUSD(deposit);
        uint256 debt = totalDebt[_user];

        return ((depoistInUsd * 100) / 130) - debt;
    }

    // function config() public view {}

    function getHealthFactor(address user) public view returns (uint256) {
        uint256 collateralInUSD = coreToUSD(collateralDeposited[user]);
        uint256 userDebt = totalDebt[user];
        if (userDebt == 0) return type(uint256).max;
        return (collateralInUSD * 100) / (userDebt * liquidityThreashold);
    }

    function coreToUSD(uint256 _amount) public view returns (uint256) {
        uint256 price = Oracle(priceOracle).getPrice();
        return (_amount * price) / 1e18;
    }

    function usdToCore(uint256 _amount) public view returns (uint256) {
        uint256 price = Oracle(priceOracle).getPrice();
        return (_amount * 1e18) / price;
    }

    // function mintStable() internal {}

    // function burnStable() internal {}

    function revertIfHealthFactorIsBroken(
        uint256 userHealthFactor
    ) internal view {
        if (userHealthFactor < minThreashold) {
            revert HealthFactorBelowMIN(userHealthFactor);
        }
    }

    function revertIfHealthFactorIsSafe(
        uint256 userHealthFactor
    ) internal view {
        if (userHealthFactor >= minThreashold) {
            revert HealthFactorSafe(userHealthFactor);
        }
    }
}
