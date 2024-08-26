// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Test, console} from "forge-std/Test.sol";
import {BlumaProtocol} from "../src/BlumaProtocol.sol";
import {BlumaToken} from "../src/BlumaToken.sol";
import "../src/Library/Error.sol";
import {BlumaNFT} from "../src/BlumaNfts.sol";
// import {IERC20} from "../src/interface/IERC20.sol";
// import {IBlumaProtocol} from "../test/IBlumaProtocol.sol";

contract BlumaProtocolTest is Test {

    BlumaProtocol blumaProtocol;
    BlumaToken blumaToken;
    BlumaNFT blumaNft;
    address owner = address(0xa);
    address B = address(0xb);
    address C = address(0xc);


    function setUp() public {
            owner = mkaddr("owner");
        // switchSigner(owner);
        B = mkaddr("B address");
        C = mkaddr("C address");
        switchSigner(owner);


        blumaProtocol = new BlumaProtocol();
        blumaToken = new BlumaToken();
        blumaNft = new BlumaNFT();
        blumaProtocol.initialize(owner, address(blumaToken), address(blumaNft));
        // IERC20(address(blumaToken)).transfer(B, 200000000);
    }

      function testCreateAccount() public {
        switchSigner(owner);
        blumaProtocol.createAccount("ebukizy1@gmail.com", owner, "image.png");
       
        assertEq(  blumaProtocol.getUser(owner).email, "ebukizy1@gmail.com");
    }


    function testCreateEvent() public{
        testCreateAccount();
        switchSigner(owner);
        string memory _title = "MY STARKNET CLASS";
        string memory _imageUrl = "starknet.png";
        string memory _description = "the next generation of starknet event";
        string memory _location = "no 7 tarjudeen";
        uint32 _capacity = 50;

        // Set the times based on the current block timestamp
        uint256 _currentTime = currentTime();
        uint256 _regStartTime = _currentTime; // Registration starts in 1 day
        uint256 _regEndTime = _currentTime + 7 days;   // Registration ends in 7 days
        uint256 _eventStartTime = _currentTime + 8 days; // Event starts in 8 days
        uint256 _eventEndTime = _currentTime + 9 days;   // Event ends in 9 days
        uint96 _ticketPrice = 100; // Example ticket price
        bool _eventStatus = true;
        // string memory _nftUrl = "pinata_ape_monkeys";


        // Create the event
        blumaProtocol.createEvent(
            _title,
            _imageUrl,
            _description,
            _location,
            _capacity,
            _regStartTime,
            _regEndTime,
            _eventStartTime,
            _eventEndTime,
            _ticketPrice,
            _eventStatus
            
        );

        uint256 eventCount_ =  blumaProtocol.getAllEvents().length;
        assertEq(eventCount_, 1);
        assertEq(blumaProtocol.getEventById(1).ticketPrice, 100);

        //note check group is created
        uint256 groupCount_ = blumaProtocol.getAllEventGroups().length;
        assertEq(groupCount_ , 0);
    }

    function testJoinGroup() public {
        testCreateEvent();
        switchSigner(B);

        blumaProtocol.joinGroup(1);
       uint256 membersCount =  blumaProtocol.getGroupMembers(1).length;
        assertEq(membersCount, 1);
        testCreateEvent2();

       //NOTE join Room 2
        switchSigner(C);
        blumaProtocol.joinGroup(2);
       uint256 group2member =  blumaProtocol.getGroupMembers(2).length;
        assertEq(group2member, 1);

        //NOTE USER 1 CAN JOIN ROOM 2
        switchSigner(B);
        blumaProtocol.joinGroup(2);
       uint256 group3member =  blumaProtocol.getGroupMembers(2).length;
        assertEq(group3member, 2);
        
        //NOTE USER C CAN JOIN GROUP1
        switchSigner(C);
        blumaProtocol.joinGroup(1);
       uint256 group1member =  blumaProtocol.getGroupMembers(1).length;
        assertEq(group1member, 2);
    }


    function testUserCanChatInGroup() public{
        //NOTE JOIN GROUP 

        testJoinGroup();      

        //NOTE FIRST MESSAGE SEND IN GROUP 1
        switchSigner(B);
        blumaProtocol.groupChat(1, "my love is real");

        //NOTE SECOND MESSAGE SEND IN GROUP 1
        switchSigner(C);
        blumaProtocol.groupChat(1, "LOL bloody ass liar");
        //NOTE OWNER CAN SEND MESSAGE
        // switchSigner(owner);
        // blumaProtocol.groupChat(1, "I will this group");

        uint256 groupMessageCount = blumaProtocol.getAllGroupMessages(1).length;
        assertEq(groupMessageCount, 2);

        //NOTE CHAT IN GROUP TWO 

        //NOTE FIRST MESSAGE SEND IN GROUP 1
        switchSigner(B);
        blumaProtocol.groupChat(2, "who is going for stark event");

        //NOTE SECOND MESSAGE SEND IN GROUP 1
        switchSigner(C);
        blumaProtocol.groupChat(2, "i am going to look for love");
        //NOTE OWNER CAN SEND MESSAGE
        // switchSigner(owner);
        // blumaProtocol.groupChat(2, "I am available");

        uint256 group2MessageCount = blumaProtocol.getAllGroupMessages(2).length;
        assertEq(group2MessageCount, 2);

    }

    function testCreateEvent2() public {
          testCreateAccount();
        switchSigner(owner);
        string memory _title = "MY STARKNET CLASS";
        string memory _imageUrl = "LAGOSBLOCKCHAINWEEK.png";
        string memory _description = "the next generation of starknet event";
        string memory _location = "no 7 tarjudeen";
        uint32 _capacity = 50;

        // Set the times based on the current block timestamp
        uint256 _currentTime = currentTime();
        uint256 _regStartTime = _currentTime; // Registration starts in 1 day
        uint256 _regEndTime = _currentTime + 7 days;   // Registration ends in 7 days
        uint256 _eventStartTime = _currentTime + 8 days; // Event starts in 8 days
        uint256 _eventEndTime = _currentTime + 9 days;   // Event ends in 9 days
        uint96 _ticketPrice = 100; // Example ticket price
        bool _eventStatus = true;
        // string memory _nftUrl = "pinata_ape_monkeys";


        // Create the event
        blumaProtocol.createEvent(
            _title,
            _imageUrl,
            _description,
            _location,
            _capacity,
            _regStartTime,
            _regEndTime,
            _eventStartTime,
            _eventEndTime,
            _ticketPrice,
            _eventStatus
            // _nftUrl
        );

    }

    function testPurchaseTicket() external {
        testCreateEvent();
        switchSigner(B);
        blumaToken.mint( B, 2000);
        blumaToken.approve(address(blumaProtocol), 2000);
        blumaProtocol.purchaseFreeTicket(1, 5);
        uint ticketCount = blumaProtocol.getAllTickets().length;
        assertEq(ticketCount, 1);
    }

    function testUserCannotMintAboveTheBaseFee() external{
          testCreateEvent();
        switchSigner(B);
           vm.expectRevert(
            abi.encodeWithSelector(USER_ALREADY_EXCEED_LIMIT.selector)
        );
        blumaToken.mint( B, 20000 ether);
    }

    function testTwoUserCanPurchaseTicket() public{
         testCreateEvent();
        switchSigner(B);
        blumaToken.mint( B, 2000);
        blumaToken.approve(address(blumaProtocol), 2000);
        blumaProtocol.purchasePaidTicket(1, 5);
        uint ticketCount = blumaProtocol.getAllTickets().length;
        assertEq(ticketCount, 1);

        switchSigner(C);
        blumaToken.mint( C, 2000);
        blumaToken.approve(address(blumaProtocol), 2000);
        blumaProtocol.purchasePaidTicket(1, 1);
        uint ticketCount2 = blumaProtocol.getAllTickets().length;
        assertEq(ticketCount2, 2);

    }

    function testRefundTicketFee() external {
        testTwoUserCanPurchaseTicket();
        switchSigner(B);

        uint256 _amountBeforeRefund = blumaToken.balanceOf(B);
        assertEq(_amountBeforeRefund, 1500);
        blumaProtocol.refundFee(1);

        uint256 _amountAfterRefund = blumaToken.balanceOf(B);
        assertEq(_amountAfterRefund, 2000);
    }

    function testMintNft() external {
        testCreateEvent();
        switchSigner(owner);
        blumaProtocol.mintNft(1, "image url");
        uint nftNumber =  blumaNft.balanceOf(owner);
        assertEq(nftNumber, 1);


    }
    
    function testWithdrawFee() external {
        testTwoUserCanPurchaseTicket();
        switchSigner(owner);
          // Move to the end of the event using Foundry's warp cheat code
        uint256 endTime = currentTime() + 10 days;
        vm.warp(endTime);
        blumaProtocol.withdrawEventFee(1);

        assertTrue(blumaProtocol.getEventById(1).isCreatorPaid);
        assertEq(blumaProtocol.getEventById(1).totalSales, 0);
        uint256 _balance = blumaProtocol.checkUserBalance(owner);
        assertEq(_balance , 600);
        


        
    }


     function currentTime() internal view returns (uint256) {
        return (block.timestamp * 1000) + 1000;
    }

   function mkaddr(string memory name) public returns (address) {
        address addr = address(
            uint160(uint256(keccak256(abi.encodePacked(name))))
        );
        vm.label(addr, name);
        return addr;
    }

    function switchSigner(address _newSigner) public {
        address foundrySigner = 0x1804c8AB1F12E6bbf3894d4083f33e07309d1f38;
        if (msg.sender == foundrySigner) {
            vm.startPrank(_newSigner);
        } else {
            vm.stopPrank();
            vm.startPrank(_newSigner);
        }
    }


}

