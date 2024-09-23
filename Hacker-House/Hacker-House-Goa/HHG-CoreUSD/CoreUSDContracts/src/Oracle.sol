// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract Oracle is Ownable {
    //price will be in 18 decimals
    uint256 public coreInUSD;

    constructor() Ownable(msg.sender) {}

    function setPrice(uint256 _newPrice) external onlyOwner returns (bool) {
        coreInUSD = _newPrice;
        return true;
    }

    function getPrice() external view returns (uint256) {
        return coreInUSD;
    }
}
