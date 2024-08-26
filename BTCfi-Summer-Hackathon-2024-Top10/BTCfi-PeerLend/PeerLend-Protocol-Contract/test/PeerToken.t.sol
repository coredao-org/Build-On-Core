// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

// import {Test, console} from "forge-std/Test.sol";
// import {PeerToken} from "../src/PeerToken.sol";

// contract PeerTokenTest is Test {
//     PeerToken public token;

//     address A = address(0xa);
//     address B = address(0xb);

//     function setUp() public {
//         A = mkaddr("receiver a");
//         B = mkaddr("receiver b");
//         token = new PeerToken(A);
//     }

//     //This test the mint function, once minted, check the balance
//     //of the address minted to. In this case, address A
//     function test_Mint() public {
//         switchSigner(A);
//         token.mint(A, 1000000e18);
//         uint256 bal = token.balanceOf(A);
//         assertEq(bal, 1000000e18);
//     }

//     function test_totalSupplyEqMint() public {
//         switchSigner(A);
//         token.mint(A, 800000000e18);
//         uint256 supply = token.totalSupply();
//         assertEq(supply, 800000000e18);
//     }

//     /**presence of access crontrol to prevent unauthorized users
//      * from calling this function, in this case preventin address B
//      * from calling the mint function, only Address A
//      */
//     function test_UnathorisedMint() public {
//         switchSigner(B);
//         vm.expectRevert();
//         token.mint(A, 1000000e18);
//     }

//     function test_Name() public {
//         switchSigner(A);
//         string memory tokenName = token.name();
//         assertEq(tokenName, "$PEER");
//     }

//     function test_decimal() public {
//         uint8 expectedDecimals = 18;
//         uint8 decimals = token.decimals();
//         assertEq(decimals, expectedDecimals);
//     }

//     function test_Symbol() public {
//         string memory expectedSymbol = "PEER";
//         string memory symbol = token.symbol();
//         assertEq(symbol, expectedSymbol);
//     }

//     function mkaddr(string memory name) public returns (address) {
//         address addr = address(
//             uint160(uint256(keccak256(abi.encodePacked(name))))
//         );
//         vm.label(addr, name);
//         return addr;
//     }

//     function switchSigner(address _newSigner) public {
//         address foundrySigner = 0x1804c8AB1F12E6bbf3894d4083f33e07309d1f38;
//         if (msg.sender == foundrySigner) {
//             vm.startPrank(_newSigner);
//         } else {
//             vm.stopPrank();
//             vm.startPrank(_newSigner);
//         }
//     }
// }
