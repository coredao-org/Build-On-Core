// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "./Library/Error.sol";

contract BlumaToken {
    string private _name;
    string private _symbol;
    uint256 private _totalSupply;
    address private owner;

    uint256 private constant MAX_TOTAL_SUPPLY = 10000000000 * 10**18; // Maximum total supply with decimals
    uint256 private totalMinted; // Tracks the total minted tokens
    uint256 private constant MINT_AMOUNT = 2000 * 10**18; // Max amount a user can mint with decimals
    mapping(address => bool) private _hasMinted;
    mapping(address => uint256) private _balances;
    mapping(address => mapping(address => uint256)) private _allowances;

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);

    constructor() {
        _name = "Bluma Token";
        _symbol = "BLUM";
        owner = msg.sender;
        _totalSupply = MAX_TOTAL_SUPPLY;
        totalMinted = 0; // Initialize to 0 since tokens are not pre-minted
    }

    modifier onlyOwner() {
        if (msg.sender != owner) revert NOT_OWNER();
        _;
    }

    function name() external view returns (string memory) {
        return _name;
    }

    function symbol() external view returns (string memory) {
        return _symbol;
    }

    function decimals() external pure returns (uint8) {
        return 18;
    }

    function totalSupply() external view returns (uint256) {
        return _totalSupply;
    }

    function balanceOf(address _user) external view returns (uint256) {
        return _balances[_user];
    }

    function mint(address _user, uint256 _amount) public {
        if (_hasMinted[_user]) revert USER_ALREADY_EXCEED_LIMIT();

        uint256 _userAmount = _balances[_user] + _amount;

        if (_userAmount > MINT_AMOUNT) {
            revert USER_ALREADY_EXCEED_LIMIT();
        }

        if (totalMinted + _amount > MAX_TOTAL_SUPPLY) {
            revert EXCEED_TOTAL_SUPPLY_CAP();
        }

        _balances[_user] += _amount;
        totalMinted += _amount;

        if (_userAmount >= MINT_AMOUNT) {
            _hasMinted[_user] = true;
        }

        emit Transfer(address(0), _user, _amount); // Emit Transfer event from address(0) for minting
    }

    function transfer(address _to, uint256 _amount) public returns (bool) {
        if (_amount > _balances[msg.sender]) revert INSUFFICIENT_BALANCE();

        _balances[msg.sender] -= _amount;
        _balances[_to] += _amount;
        emit Transfer(msg.sender, _to, _amount);
        return true;
    }

    function approve(address spender, uint256 _value) external returns (bool) {
        _allowances[msg.sender][spender] = _value;
        emit Approval(msg.sender, spender, _value);
        return true;
    }

    function allowance(address _owner, address _spender) external view returns (uint256) {
        return _allowances[_owner][_spender];
    }

    function transferFrom(address _owner, address _recipient, uint256 _amount) external returns (bool) {
        if (_amount > _balances[_owner]) revert INSUFFICIENT_BALANCE();
        if (_amount > _allowances[_owner][msg.sender]) revert INSUFFICIENT_ALLOWANCE();

        _allowances[_owner][msg.sender] -= _amount;
        _balances[_owner] -= _amount;
        _balances[_recipient] += _amount;

        emit Transfer(_owner, _recipient, _amount);
        return true;
    }

    function remainingSupply() external view returns (uint256) {
        return MAX_TOTAL_SUPPLY - totalMinted;
    }

    function getUserBalance(address _user) external view returns (uint256) {
        return _balances[_user];
    }

    function adminMint(address to, uint256 amount) public onlyOwner {
        if (totalMinted + amount > MAX_TOTAL_SUPPLY) revert EXCEED_TOTAL_SUPPLY_CAP();

        _balances[to] += amount;
        totalMinted += amount;

        emit Transfer(address(0), to, amount);
    }

    function hasMinted(address _user) external view returns (bool) {
        return _hasMinted[_user];
    }
}
