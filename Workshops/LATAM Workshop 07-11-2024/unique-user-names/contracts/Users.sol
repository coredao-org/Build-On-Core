// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.7;

contract Users {

    mapping(string userName => address owner) private _userNames;

    function store(string calldata proposedName) public {
        require(retrieve(proposedName) == address(0), "Nombre de usuario no disponible");
        _userNames[proposedName] = msg.sender;
    }

    function retrieve(string calldata userName) public view returns (address){
        return _userNames[userName];
    }
}