// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.25;
import { ERC20Permit, ERC20 } from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";

error NotApprovable();
error NotBondingCurve();

contract MoonLaunchToken is ERC20Permit {
    
    address public immutable curve;
    address public immutable creator;

    /// @notice Prevent trading on AMMs until liquidity migration
    bool public isApprovable = false;

    constructor(
        string memory name,
        string memory symbol,
        address _curve,
        address _creator,
        uint256 _supply
    ) ERC20(name, symbol) ERC20Permit(name) {
        curve = _curve;
        creator = _creator;
        _mint(msg.sender, _supply);
    }

    function approve(address spender, uint256 amount) public override returns (bool) {
        if (spender == curve || isApprovable) return super.approve(spender, amount);
        revert NotApprovable();
    }

    function permit(address owner, address spender, uint256 value, uint256 deadline, uint8 v, bytes32 r, bytes32 s) public override {
        if (!isApprovable) revert NotApprovable();
        super.permit(owner, spender, value, deadline, v, r, s);
    }

    function setIsApprovable(bool _val) public {
        if (msg.sender != curve) revert NotBondingCurve();
        isApprovable = _val;
    }
}