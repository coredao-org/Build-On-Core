// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.9;
import "../Library/Error.sol";

library Validator {



    function _validateString(string memory _text) internal pure{
        if(bytes(_text).length < 1) revert EMPTY_INPUT_FIELD();
    }

      function _validateBytes32(bytes32 _value) internal pure{
        if(_value.length < 1) revert EMPTY_INPUT_FIELD();
    }



    function _validateNumbers(uint256 _number) internal pure{
        if(_number < 1) revert EMPTY_INPUT_FIELD();
    }

    function _validateNumber(uint96 _number) internal pure {
        if(_number < 1) revert EMPTY_INPUT_FIELD();

    }

    function _validateTime( uint256 _startDate,uint256 _endDate) internal pure{
        if(_startDate >= _endDate) revert INVALID_TIME_SET();
    }

   
    
}

