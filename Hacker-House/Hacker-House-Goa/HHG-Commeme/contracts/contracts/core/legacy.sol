//SPDX-License-Identifier: MIT

pragma solidity ^0.8.19;


contract Legacy {
    event PaymentReceipt(address from, uint256 value);

    function getBack(address payable _to) public {
        _to.transfer(address(this).balance);
    }

    receive() external payable {
        emit PaymentReceipt(msg.sender, msg.value);
    }
}