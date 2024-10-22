// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.9;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import {Validator} from "../src/Library/Validator.sol";
import "./Library/Error.sol";
import "./BlumaToken.sol";
import "./BlumaNfts.sol";
// import "./interface/IERC20s.sol";
// import "./interface/IERC721s.sol";


/// @title The Proxy Contract for the protocol
/// @notice This uses the EIP1822 UUPS standard from the OpenZeppelin library
/// @dev This contract manages events, tickets, users, event groups and chatting
contract BlumaProtocol is Initializable, OwnableUpgradeable, UUPSUpgradeable {

    ///////////////////////////
    ///                     ///
    /// STATE VARIABLES    ///
    ///                   ///
    ////////////////////////

    /// @notice Tracks the total number of events created
    uint32 private _totalEventsId;

    /// @notice Tracks the total number of tickets created
    uint32 private _ticketId;

    /// @notice Maps user addresses to User struct
    mapping(address => User) private user;

    /// @notice Maps event IDs to Event struct
    mapping(uint32 => Event) private events;

    /// @notice Maps user addresses to Ticket struct
    mapping(address => Ticket) private ticket;

    /// @notice Maps event group IDs to EventGroup struct
    mapping(uint32 => EventGroup) private rooms;

    /// @notice Tracks if a user has purchased a ticket for a specific event
    /// @dev First mapping is user address, second mapping is event ID, value is boolean
    mapping(address => mapping(uint32 => bool)) private hasPurchasedEvent;

    /// @notice Tracks if a user has joined a specific event group
    /// @dev First mapping is user address, second mapping is event group ID, value is boolean
    mapping(address user => mapping(uint32 => bool _groupId)) hasJoinedGroup;

    mapping(address => NFT) private nfts;

    /// @notice List of all events
    Event[] private eventList;

    /// @notice List of all event groups
    EventGroup[] private roomList;

    /// @notice List of all tickets
    Ticket[] private tickets;

    /// @notice List of all users
    User[] private usersList;

    /// @notice ERC20 token used in the protocol
    BlumaToken private blumaToken;

    /// @notice ERC721 token used in the protocol
    BlumaNFT private blumaNFT;



    ///////////////
    /// EVENTS ///
    /////////////

    event EventCreated(uint32 indexed _totalEventsId,uint32 indexed _seatNumber,uint32 indexed _capacity);
    event GroupCreated(uint32 indexed _roomId, string imageUrl, string _title);
    event GroupJoinedSuccessfully(address indexed _sender, uint32 indexed _eventId, uint256 indexed _joinedTimw);
    event RegistrationClose(uint256 indexed _currentTime, uint8 indexed _status);
    event TicketPurchased(address indexed buyer, uint32 indexed _eventId, uint32 numberOfTickets);
    event RefundIssued(address indexed buyer, uint32 indexed _ticketId, uint32 indexed _eventId, uint256 amount);
    event EventClosed(uint32 indexed _eventId, uint256 indexed _currentTime);
    event MessageSent(address indexed sender, uint32 indexed groupId, string text, uint256 timestamp);
    event AttendeesNFTMinted(address indexed owner, uint32 indexed eventId, uint32 numberOfTickets, uint256  indexed tokenId);
    event NftMintedSuccessful(address indexed sender,string indexed nftUrl, uint32 indexed eventId,string title);
    




  

    /////////////////////
    ///     ENUMS    ///
    ////////////////////

    enum RegStatus {
        OPEN,
        CLOSE,
        PENDING
    }

    enum EventStatus {
        OPEN,
        CLOSE,
        PENDING
    }

    enum EventType {
        PAID,
        FREE
    }


    ////////////////////
    ///   Structs    ///
    ///////////////////
    struct User {
        string email;
        address userAddr;
        bool isRegistered;
        string avatar;
        uint256 balance;
    }

    struct Event {
        uint32 eventId;
        string title;
        string imageUrl;
        string location;
        string description;
        address creator;
        uint32 seats;
        uint32 capacity;
        uint256 regStartTime;
        uint256 regEndTime;
        EventGroup groups;
        RegStatus regStatus;
        EventStatus eventStatus;
        EventType eventType;
        string nftUrl;
        uint256 eventStartTime;
        uint256 eventEndTime;
        uint96 ticketPrice;
        uint256 totalSales;
        uint256 createdAt;
        bool isCreatorPaid;
        bool hasMinted;
    }

    struct EventGroup {
        uint32 eventId;
        string title;
        string imageUrl;
        string description;
        Member [] members;
        Message [] messages;
        
    }
    struct Member {
        address user;
        uint256 joinTime;
    }

    struct Ticket {
        uint32 ticketId;
        uint32 eventId;
        address owner;
        uint256 ticketCost;
        uint256 purchaseTime;
        uint32 numberOfTicket;
    }

    struct Message{
        address sender;
        string email;
        string text;
        uint256 timestamp;
    }

    struct NFT{
        uint32 eventId;
        string title;
        address owner;
        string nftUrl;
    }

    //////////////////
    /// FUNCTIONS ///
    ////////////////

    /**
     * @dev Update the email of the user.
     * @param _email The new email of the user.
     * @param _avatar the image of the user 
     */
    function createAccount(string memory _email, address _addr, string memory _avatar) external {
            
        if(bytes(_email).length < 1) revert EMPTY_INPUT_FIELD();
        if(bytes(_avatar).length < 1) revert EMPTY_INPUT_FIELD();
        User storage _user = user[_addr];
        _user.email = _email;
        _user.isRegistered = true;
        _user.userAddr = _addr;
        _user.avatar = _avatar;
        usersList.push(_user);
    }

       /**
     * @dev Create a new event.
     * @param _title The title of the event.
     * @param _imageUrl The image URL of the event.
     * @param _description The description of the event.
     * @param _location The location of the event.
     * @param _capacity The capacity of the event.
     * @param _regStartTime The registration start time.
     * @param _regEndTime The registration end time.
     * @param _eventStartTime The event start time.
     * @param _eventEndTime The event end time.
     * @param _ticketPrice The price of a ticket.
     * @param _isEventPaid The event status if free/paid.
     */
    function createEvent(
        string memory _title,
        string memory _imageUrl,
        string memory _description,
        string memory _location,
        uint32 _capacity,
        uint256 _regStartTime,
        uint256 _regEndTime,
        uint256 _eventStartTime,
        uint256 _eventEndTime,
        uint96 _ticketPrice,
        bool _isEventPaid
    ) external {
     if(bytes(_title).length < 1) revert EMPTY_INPUT_FIELD();
        if(bytes(_imageUrl).length < 1) revert EMPTY_INPUT_FIELD();
        if(bytes(_description).length < 1) revert EMPTY_INPUT_FIELD();
        if(bytes(_location).length < 1) revert EMPTY_INPUT_FIELD();
    require(_regStartTime <= _regEndTime, "Registration start time must be before end time");
    require(_eventStartTime <= _eventEndTime, "Event start time must be before end time");
            _totalEventsId = _totalEventsId + 1;

        Event memory _event;
        if (currentTime() < _regStartTime) {
            _event.regStatus = RegStatus.PENDING;
        } else {
            _event.regStatus = RegStatus.OPEN;
        }
        if (_isEventPaid) {
            _event.eventType = EventType.PAID;
            _event.ticketPrice = _ticketPrice;
        } else {
            _event.ticketPrice = 0;
            _event.eventType = EventType.FREE;
        }

        _event.eventId = _totalEventsId;
        _event.title = _title;
        _event.imageUrl = _imageUrl;
        _event.description = _description;
        _event.creator = msg.sender;
        _event.location = _location;
        _event.capacity = _capacity;
        _event.regStartTime = _regStartTime;
        _event.regEndTime = _regEndTime;
        _event.eventStartTime = _eventStartTime;
        _event.eventEndTime = _eventEndTime;
        _event.eventStatus = EventStatus.PENDING;
        _event.createdAt = currentTime();

        events[_totalEventsId] = _event;

        emit EventCreated(_totalEventsId, _event.seats, _capacity);
    }
 


   function mintNft(uint32 _eventId, string calldata _nftUrl) external {
        if(bytes(_nftUrl).length < 1) revert EMPTY_INPUT_FIELD();
        Event storage _event = events[_eventId];
        if (_event.eventId == 0) revert INVALID_ID();
        if (_event.creator != msg.sender) revert INVALID_NOT_AUTHORIZED();
        NFT storage _nft = nfts[msg.sender];
        _nft.eventId = _event.eventId;
        _nft.owner = msg.sender;
        _nft.title = _event.title;
        _nft.nftUrl = _nftUrl;

        blumaNFT.safeMint(msg.sender, _nftUrl);
        emit NftMintedSuccessful(msg.sender, _nft.nftUrl, _nft.eventId, _nft.title);
    }
    

    function createGroup(uint32 _eventId) external {
        Event storage _event = events[_eventId];
        if (_event.eventId == 0) revert INVALID_ID();
        if(_event.creator != msg.sender) revert INVALID_NOT_AUTHORIZED();
         // Initialize EventGroup for the event
        EventGroup storage _eventGroup = _event.groups;
        _eventGroup.eventId = _event.eventId;
        _eventGroup.title = _event.title;
        _eventGroup.imageUrl = _event.imageUrl;
        _eventGroup.description = _event.description;
       
        // Add creator to members
        _eventGroup.members.push(Member({
            user: _event.creator,
            joinTime: currentTime()
        }));
     

        roomList.push(_eventGroup);
        emit GroupCreated(_eventGroup.eventId, _eventGroup.imageUrl, _eventGroup.title);
    }

    /**
     * @dev Join an event group.
     * @param _eventId The ID of the event.
     */
    function joinGroup(uint32 _eventId) external {
        _validateId(_eventId);
        Event storage _eventGroup = events[_eventId];
        if(_eventGroup.eventId == 0) revert INVALID_ID();
        if(hasJoinedGroup[msg.sender][_eventId]) revert ALREADY_A_MEMBER();

           // Add creator to members
        _eventGroup.groups.members.push(Member({
            user: msg.sender,
            joinTime: currentTime()
        }));

        hasJoinedGroup[msg.sender][_eventId] = true;

        emit GroupJoinedSuccessfully(msg.sender, _eventId, currentTime());
    }


    /**
     * @dev Purchase tickets for an event.
     * @param _eventId The ID of the event.
     * @param _numberOfTickets The number of tickets to purchase.
     */
    function purchaseFreeTicket(uint32 _eventId, uint32 _numberOfTickets) external {
        _validateId(_eventId);
        Event storage _event = events[_eventId];
        if (_event.regStatus != RegStatus.OPEN) revert REGISTRATION_NOT_OPEN();
            _event.seats = _event.seats + _numberOfTickets; 
        if ( _event.seats > _event.capacity) revert NOT_ENOUGH_AVAILABLE_SEAT();
        _ticketId =   _ticketId + 1;
        Ticket storage _ticket = ticket[msg.sender];

        _ticket.ticketId = _ticketId;
        _ticket.owner = msg.sender;
        _ticket.purchaseTime = currentTime();
        _ticket.eventId = _eventId;
        _ticket.numberOfTicket = _ticket.numberOfTicket + _numberOfTickets;
        tickets.push(_ticket);
        emit TicketPurchased(msg.sender, _eventId, _numberOfTickets);
    }


        /**
     * @dev Purchase tickets for an event.
     * @param _eventId The ID of the event.
     * @param _numberOfTickets The number of tickets to purchase.
     */
    function purchasePaidTicket(uint32 _eventId, uint32 _numberOfTickets) external {
        _validateId(_eventId);
        _ticketId =   _ticketId + 1;
        Event storage _event = events[_eventId];
         _event.seats = _event.seats + _numberOfTickets; 

        if (_event.regStatus != RegStatus.OPEN) revert REGISTRATION_NOT_OPEN();
        if ( _event.seats > _event.capacity) revert NOT_ENOUGH_AVAILABLE_SEAT();
        if (_event.eventType != EventType.PAID) revert NOT_PAID_EVENT();
        Ticket storage _ticket = ticket[msg.sender];

        uint256   _totalPrice = _numberOfTickets * _event.ticketPrice;

            if (blumaToken.balanceOf(msg.sender) < _totalPrice) revert INSUFFICIENT_BALANCE();
            if (blumaToken.allowance(msg.sender, address(this)) < _totalPrice) revert NO_ALLOWANCE();
            blumaToken.transferFrom(msg.sender, address(this), _totalPrice);
            _event.totalSales = _event.totalSales + _totalPrice;
            _ticket.ticketCost = _ticket.ticketCost + _totalPrice;
        
        _ticket.ticketId = _ticketId;
        _ticket.owner = msg.sender;
        _ticket.purchaseTime = currentTime();
        _ticket.eventId = _eventId;
        _ticket.numberOfTicket = _ticket.numberOfTicket + _numberOfTickets;
        tickets.push(_ticket);
        
        emit TicketPurchased(msg.sender, _eventId, _numberOfTickets);
    }

    function groupChat(uint32 _eventId, string calldata _text) external {
        _validateId(_eventId);
        Validator._validateString(_text);

        // Ensure the sender is a member of the group
        Event storage _event = events[_eventId];
        if(_event.eventId == 0) revert INVALID_ID();

         if(_event.creator == msg.sender){
            hasJoinedGroup[msg.sender][_eventId] = true;
         }

        if(!hasJoinedGroup[msg.sender][_eventId]) revert INVALID_NOT_AUTHORIZED();

        // Add the message to the group's message list
        Message memory _message;
        _message.email = user[msg.sender].email;
        _message.sender = msg.sender;
        _message.text = _text;
        _message.timestamp = currentTime();
        _event.groups.messages.push(_message);

        emit MessageSent(msg.sender, _eventId, _text, _message.timestamp);
    }

    /**
     * @dev Refund tickets for an event.
     * @param _eventId The ID of the event.
     */
    function refundFee(uint32 _eventId) external {
        _validateId(_eventId);
        Event storage _event = events[_eventId];
        updateRegStatus(_eventId);

        Ticket storage _ticket = ticket[msg.sender];


        if(_event.eventType != EventType.PAID) revert NOT_PAID_EVENT();
        if(_event.regStatus != RegStatus.OPEN) revert REGISTRATION_CLOSE();
        if(_ticket.owner != msg.sender) revert NOT_OWNER();
        if(_ticket.eventId != _eventId) revert INVALID_EVENT_ID();
        if(_ticket.numberOfTicket < 1) revert INSUFFICIENT_TICKET_PURCHASED();

        uint256 _totalPrice = _ticket.numberOfTicket * _event.ticketPrice;
        _event.seats = _event.seats - _ticket.numberOfTicket;
        _event.totalSales =   _event.totalSales - _totalPrice;
    
        blumaToken.transfer(msg.sender, _totalPrice);

        emit RefundIssued(msg.sender, _ticket.ticketId, _eventId, _totalPrice);
    }

      
    
/**
 * @dev Update registration status based on time.
 * @param _eventId The ID of the event.
 */
function updateRegStatus(uint32 _eventId) public {
    _validateId(_eventId);
    Event storage _event = events[_eventId];

    if (currentTime() > _event.regEndTime) {
        if (_event.regStatus != RegStatus.CLOSE) {
            _event.regStatus = RegStatus.CLOSE;
            uint currentTime_ = currentTime();
            emit RegistrationClose(currentTime_, uint8(RegStatus.CLOSE));
        }
    }
}

    /**
     * @dev Update the status of the event based on the current time.
     * @param _eventId The ID of the event.
     */
    function updateEventStatus(uint32 _eventId) public {
        _validateId(_eventId);
        Event storage _event = events[_eventId];

        if (currentTime() >= _event.eventStartTime && currentTime() <= _event.eventEndTime) {
            _event.eventStatus = EventStatus.OPEN;
        } else if (currentTime() > _event.eventEndTime) {
            _event.eventStatus = EventStatus.CLOSE;
            emit EventClosed(_eventId, currentTime());
        }
    }

    /**
     * @dev Withdraw event fees by the event creator.
     * @param _eventId The ID of the event.
     */
    function withdrawEventFee(uint32 _eventId) external {
        _validateId(_eventId);
        Event storage _event = events[_eventId];
        User storage _user = user[msg.sender];
        
        updateEventStatus(_eventId); // Ensure the event status is updated based on the current time

        if (_event.eventStatus != EventStatus.CLOSE) revert EVENT_NOT_CLOSED();
        if (_event.creator != msg.sender) revert NOT_CREATOR();
        if (_event.isCreatorPaid) revert ALREADY_PAID();

        uint256 amount_ = _event.totalSales;
        _event.totalSales = 0;
        _event.isCreatorPaid = true;
        _user.balance =_user.balance + amount_;
        blumaToken.transfer(msg.sender, amount_);
    }


        /**
     * @notice Mints NFTs for all attendees of a specific event.
     * @param _eventId The ID of the event.
     * @dev This function can only be called after the registration period has ended and if the NFTs haven't been minted yet.
     * Emits a `AttendeesNFTMinted` event for each minted NFT.
     */
    function mintNFTsForAttendees(uint32 _eventId) external {
        Event storage _event = events[_eventId];
        if(_event.eventId == 0) revert INVALID_EVENT_ID();
        if(currentTime() < _event.regEndTime) revert REGISTRATION_NOT_CLOSED();
        if(_event.hasMinted) revert  NFT_ALREADY_MINTED();

        for (uint256 i = 0; i < tickets.length; i++) {
            if (tickets[i].eventId == _eventId && tickets[i].owner != address(0)) {
                uint256 tokenId = blumaNFT.getNextTokenId();
                blumaNFT.safeMint(tickets[i].owner, _event.nftUrl);
                emit AttendeesNFTMinted(tickets[i].owner, _eventId, tickets[i].numberOfTicket, tokenId);
            }
        }

        _event.hasMinted = true;
    }

   





    ///////////////////////
    /// VIEW FUNCTIONS ////
    //////////////////////

    /**
     * @dev Get the details of the user.
     * @return _user The details of the user.
     */
    function getUser(address _addr) external view returns (User memory _user) {
        _user = user[_addr];
    }

   /**
    *@notice get function dont consume gas so to make it east to fetch data
     * @dev Get the details of all events.
     * @return events_ The details of all events.
     */
    function getAllEvents() external view returns (Event[] memory) {
        Event[] memory events_ = new Event[](_totalEventsId);
        uint32 counter = 0;
        // Iterate over the possible event IDs
        for (uint32 i = 1; i <= _totalEventsId; i++) {
            if (events[i].eventId != 0) {    
                events_[counter] = events[i];
                counter++;
            }
        }
        // Create a new array with the exact size of existing events
        Event[] memory allEvents = new Event[](counter);
        // Copy the events to the new array
        for (uint32 j = 0; j < counter; j++) {
            allEvents[j] = events_[j];
        }
        
        return allEvents;
    }


    /**
     * @dev Get the details of a specific event.
     * @param _eventId The ID of the event.
     * @return events_ The details of the event.
     */
    function getEventById(uint32 _eventId) external view returns (Event memory events_) {
        _validateId(_eventId);
        events_ = events[_eventId];
    }

  

    function getGroupMembers(uint32 _eventId) external view returns (Member[] memory) {
        _validateId(_eventId);
        Event storage _event = events[_eventId];
        if (_event.eventId == 0) revert GROUP_ALREADY_EXISTS();
        return _event.groups.members;
    }

    function getAllEventGroups() external view returns (EventGroup[] memory) {
        return roomList;
    }

    function getEventGroup(uint32 _eventId) external view returns (EventGroup memory) {
        Event storage _event = events[_eventId];
        if (_event.eventId == 0) revert GROUP_ALREADY_EXISTS();
        return _event.groups;
    }

    function getNfts(address _user) external view returns (NFT memory){
        return nfts[_user];
    }


    function isNotEmpty(string memory str) private  pure{
        if (keccak256(bytes(str)) == keccak256(bytes(""))) {
        revert EMPTY_INPUT_FIELD();
        }
    }


    /**
     * @dev Get the list of tickets purchased.
     * @return _tickets The list of tickets purchased.
     */
    function getAllTickets() external view returns (Ticket[] memory _tickets) {
        _tickets = tickets;
    }


    function getTicket(address _addr) external view returns(Ticket memory _ticket){
        _ticket = ticket[_addr];
    }

    function getAllGroupMessages(uint32 _eventId) external view returns (Message[] memory) {
         Event storage _event = events[_eventId];
        if (_event.eventId == 0) revert GROUP_ALREADY_EXISTS();
        return _event.groups.messages;
    }

    function getGroupMember(uint32 _groupId, uint _index) external view returns (Member memory) {
        _validateId(_groupId);
        EventGroup storage group = rooms[_groupId];

        if (_index >= group.members.length) revert INVALID_ID();
        
        return group.members[_index];
    }

    function getAllUser() external view returns (User [] memory) {
        return usersList;
    }

    function hasPurchasedTicket(address _user, uint32 _eventId) external view returns(bool){
        return hasPurchasedEvent[_user][_eventId];
    }

    /**
     * @dev Check if a user is registered.
     * @param _addr The address of the user.
     * @return True if the user is registered, false otherwise.
     */
    function isRegistered(address _addr) external view returns (bool) {
        return user[_addr].isRegistered;
    }

    /**
     * @dev Check the user balance.
     * @param _addr The address of the user.
     * @return bal_ if the user have any token
     */
    function checkUserBalance(address _addr) external view returns(uint256 bal_){
        bal_ = user[_addr].balance;
    } 

    function currentTime() internal view returns (uint256) {
        return (block.timestamp * 1000) + 1000;
    }

   /**
     * @dev Check the contract balance.
     * @return bal_ The contract balance.
     */
    function checkContractBalance() external view returns (uint256 bal_) {
        bal_ = blumaToken.balanceOf(address(this));
    }


    /**
     * @dev Validate the ID of an event.
     * @param _eventId The ID of the event.
     */
    function _validateId(uint32 _eventId) private view {
        if (_eventId > _totalEventsId) revert INVALID_ID();
    }
      function validateIsRegistered(address _user) private view{
          if(!user[_user].isRegistered) revert USER_NOT_REGISTERED();
    }

    /**
     * @dev Initialize the contract with the initial owner.
     * @param initialOwner The address of the initial owner.
     */
    function initialize(address initialOwner, address _blumaToken, address _blumaNFT) public initializer {
        __Ownable_init(initialOwner);
        // __UUPSUpgradeable_init();
        blumaToken = BlumaToken(_blumaToken);
        blumaNFT = BlumaNFT(_blumaNFT);
    }

    /**
     * @dev Authorize the upgrade of the contract.
     * @param newImplementation The address of the new implementation.
     */
    function _authorizeUpgrade(address newImplementation) internal override onlyOwner {}
}

