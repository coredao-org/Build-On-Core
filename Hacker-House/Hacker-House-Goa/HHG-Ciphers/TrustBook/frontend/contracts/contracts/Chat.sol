// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SimpleDecentralizedChat {
    struct Message {
        address sender;
        string content;
        bool isPicture;
        uint256 timestamp;
    }

    Message[] public messages;

    event MessageSent(uint256 indexed messageId, address indexed sender, string content, bool isPicture, uint256 timestamp);

    function sendMessage(string memory _content, bool _isPicture) external {
        require(bytes(_content).length > 0, "Message content cannot be empty");
        
        uint256 messageId = messages.length;
        
        Message memory newMessage = Message({
            sender: msg.sender,
            content: _content,
            isPicture: _isPicture,
            timestamp: block.timestamp
        });

        messages.push(newMessage);

        emit MessageSent(messageId, msg.sender, _content, _isPicture, block.timestamp);
    }

    function getMessageCount() external view returns (uint256) {
        return messages.length;
    }

    function getMessage(uint256 _messageId) external view returns (address sender, string memory content, bool isPicture, uint256 timestamp) {
        require(_messageId < messages.length, "Message does not exist");
        Message memory message = messages[_messageId];
        return (message.sender, message.content, message.isPicture, message.timestamp);
    }
}