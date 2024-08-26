// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

interface IBlumaProtocol {
    struct User {
        string email;
        address userAddr;
        bool isRegistered;
        string avatar;
        uint256 balance;
    }


}
