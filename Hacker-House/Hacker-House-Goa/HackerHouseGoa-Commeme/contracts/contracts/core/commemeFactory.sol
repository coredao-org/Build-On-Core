//SPDX-License-Identifier: MIT

pragma solidity ^0.8.19;

import "./commeme.sol";

contract CommemeFactory {
    address[] public allCommemes;

    event CommemeCreated(address indexed commemeAddress, address indexed creator);

    function createCommeme(
        address _sender,
        string memory _name,
        string memory _symbol,
        string memory _metadata,
        uint256 _totalSupply,
        uint256 _threshold,
        address _factoryContractAddress,
        address _router,
        address _wCoreAddress,
        address _legacy,
        uint256 _price
    ) external returns (address) {
        Commeme newCommeme = new Commeme(
            _sender,
            _name,
            _symbol,
            _metadata,
            _totalSupply,
            _threshold,
            _factoryContractAddress,
            _router,
            _wCoreAddress,
            _legacy,
            _price
        );

        allCommemes.push(address(newCommeme));
        emit CommemeCreated(address(newCommeme), msg.sender);
        return address(newCommeme);
    }

    function getAllCommemes() public view returns (address[] memory) {
        return allCommemes;
    }
}
