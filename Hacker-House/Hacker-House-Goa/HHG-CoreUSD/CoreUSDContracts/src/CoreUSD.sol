// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {ERC20Burnable, ERC20} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract StableToken is ERC20Burnable, Ownable {
    error AmountZero();
    error BurnMoreThanBalance();

    constructor() ERC20("CoreUSD", "cUSD") Ownable(msg.sender) {}

    function burn(uint256 _amount) public override onlyOwner {
        uint256 balance = balanceOf(msg.sender);
        if (_amount <= 0) {
            revert AmountZero();
        }
        if (balance < _amount) {
            revert BurnMoreThanBalance();
        }
        super.burn(_amount);
    }

    function mint(
        address _to,
        uint256 _amount
    ) external onlyOwner returns (bool) {
        if (_amount <= 0) {
            revert AmountZero();
        }
        _mint(_to, _amount);
        return true;
    }
}
