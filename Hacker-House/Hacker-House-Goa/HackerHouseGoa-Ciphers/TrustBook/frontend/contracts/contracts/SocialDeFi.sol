// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./SocialFiToken.sol";

contract SocialFiDapp is ReentrancyGuard, Ownable {
    SocialFiToken public token;

    struct User {
        string username;
        string profileHash; // IPFS hash of profile data
        uint256 followers;
        uint256 following;
    }

    struct Post {
        address author;
        string contentHash; // IPFS hash of post content
        uint256 timestamp;
        uint256 likes;
    }

    mapping(address => User) public users;
    mapping(uint256 => Post) public posts;
    mapping(address => mapping(address => bool)) public isFollowing;

    uint256 public postCount;
    uint256 public constant POST_COST = 1 ether; // Cost to create a post
    uint256 public constant LIKE_REWARD = 0.1 ether; // Reward for getting a like

    event UserCreated(address indexed user, string username);
    event PostCreated(
        uint256 indexed postId,
        address indexed author,
        string contentHash
    );
    event PostLiked(uint256 indexed postId, address indexed liker);
    event UserFollowed(address indexed follower, address indexed followed);

    constructor(address _tokenAddress) Ownable(msg.sender) {
        token = SocialFiToken(_tokenAddress);
    }

    function createUser(
        string memory _username,
        string memory _profileHash
    ) public {
        require(
            bytes(users[msg.sender].username).length == 0,
            "User already exists"
        );
        users[msg.sender] = User(_username, _profileHash, 0, 0);
        emit UserCreated(msg.sender, _username);
    }

    function createPost(string memory _contentHash) public nonReentrant {
        require(
            bytes(users[msg.sender].username).length > 0,
            "User does not exist"
        );
        require(
            token.balanceOf(msg.sender) >= POST_COST,
            "Insufficient tokens"
        );

        require(
            token.transferFrom(msg.sender, address(this), POST_COST),
            "Token transfer failed"
        );

        postCount++;
        posts[postCount] = Post(msg.sender, _contentHash, block.timestamp, 0);
        emit PostCreated(postCount, msg.sender, _contentHash);
    }

    function likePost(uint256 _postId) public nonReentrant {
        require(_postId > 0 && _postId <= postCount, "Invalid post ID");
        Post storage post = posts[_postId];
        require(post.author != msg.sender, "Cannot like own post");

        post.likes++;
        require(
            token.transfer(post.author, LIKE_REWARD),
            "Reward transfer failed"
        );
        emit PostLiked(_postId, msg.sender);
    }

    function followUser(address _userToFollow) public {
        require(msg.sender != _userToFollow, "Cannot follow yourself");
        require(!isFollowing[msg.sender][_userToFollow], "Already following");

        isFollowing[msg.sender][_userToFollow] = true;
        users[msg.sender].following++;
        users[_userToFollow].followers++;
        emit UserFollowed(msg.sender, _userToFollow);
    }

    function getPost(
        uint256 _postId
    ) public view returns (address, string memory, uint256, uint256) {
        require(_postId > 0 && _postId <= postCount, "Invalid post ID");
        Post memory post = posts[_postId];
        return (post.author, post.contentHash, post.timestamp, post.likes);
    }

    function getUser(
        address _user
    ) public view returns (string memory, string memory, uint256, uint256) {
        User memory user = users[_user];
        return (
            user.username,
            user.profileHash,
            user.followers,
            user.following
        );
    }

    // Function to withdraw tokens from the contract (only owner)
    function withdrawTokens(uint256 amount) public onlyOwner {
        require(token.transfer(owner(), amount), "Token withdrawal failed");
    }

    // Function to update token address (only owner)
    function updateTokenAddress(address newTokenAddress) public onlyOwner {
        token = SocialFiToken(newTokenAddress);
    }
}
