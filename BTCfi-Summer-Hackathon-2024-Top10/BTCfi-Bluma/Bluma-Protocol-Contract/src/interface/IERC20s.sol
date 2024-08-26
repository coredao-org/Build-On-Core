// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.9;

interface IERC20s {

    
     event Transfer(address indexed from, address indexed to, uint256 value);   
    event Approval(address indexed owner, address indexed spender, uint256 value);

           /**
     * @dev Returns the name of the token.
     */
    function name() external view returns (string memory);

    /**
     * @dev Returns the symbol of the token, usually a shorter version of the
     * name.
     */
    function symbol() external view returns (string memory);

  
    function decimals() external view  returns (uint8);
    /**
     * @dev See {IERC20-totalSupply}.
     */
    function totalSupply() external view  returns (uint256);
 

  
    function balanceOf(address account) external view returns (uint256);


    function transfer(address to, uint256 value) external returns (bool);

 
    function allowance(address owner, address spender) external view returns (uint256);


    function approve(address spender, uint256 value) external returns (bool);


    function transferFrom(address from, address to, uint256 value) external returns (bool);
 }
    
    
