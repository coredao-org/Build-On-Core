// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.9;
import "../Libraries/Errors.sol";

library Validator {


    function _moreThanZero(uint256 _amount) internal pure {
        if (_amount <= 0) {
            revert Protocol__MustBeMoreThanZero();
        }
    }

    function _isTokenAllowed(address _token, mapping(address => bytes32) storage s_priceFeeds) internal view {
        if (s_priceFeeds[_token] == bytes32(0)) {
            revert Protocol__TokenNotAllowed();
        }
    }
}



