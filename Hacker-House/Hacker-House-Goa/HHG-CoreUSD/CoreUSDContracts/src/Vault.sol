// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./CoreLogic.sol";

contract Vault {
    IERC20 public immutable token;

    address public owner;
    address public protocol;

    uint public totalSupply;
    mapping(address => uint) public balanceOf;

    constructor(address _token, address _protocol) {
        token = IERC20(_token);
        owner = msg.sender;
        protocol = _protocol;
    }

    function _mint(address _to, uint _shares) private {
        totalSupply += _shares;
        balanceOf[_to] += _shares;
    }

    function _burn(address _from, uint _shares) private {
        totalSupply -= _shares;
        balanceOf[_from] -= _shares;
    }

    function deposit(uint _amount) external {
        /*
        a = amount
        B = balance of token before deposit
        T = total supply
        s = shares to mint

        (T + s) / T = (a + B) / B 

        s = aT / B
        */
        uint shares;
        if (totalSupply == 0) {
            shares = _amount;
        } else {
            shares = (_amount * totalSupply) / token.balanceOf(address(this));
        }

        _mint(msg.sender, shares);
        token.transferFrom(msg.sender, address(this), _amount);
    }

    function withdraw(uint _shares) external {
        /*
        a = amount
        B = balance of token before withdraw
        T = total supply
        s = shares to burn

        (T - s) / T = (B - a) / B 

        a = sB / T
        */
        uint amount = (_shares * token.balanceOf(address(this))) / totalSupply;
        _burn(msg.sender, _shares);
        token.transfer(msg.sender, amount);
    }

    function earnLiquidation(address _user, uint256 _amount) public {
        require(msg.sender == owner, "Only Owner is allowed");
        // here we will swap amount to CUSD ,cannot write the code because i need dex integration
        // _amount = dex.swap(_token , coreUSD, _amounnt);
        CoreLogic(protocol).liquidate(_user, _amount);
        //swap back amount to coreUSD
        //dex.swao(coreUSD , _token , _amount)
    }
}
