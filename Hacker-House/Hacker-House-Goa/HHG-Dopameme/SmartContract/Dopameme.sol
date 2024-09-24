// SPDX-License-Identifier: MIT

pragma solidity 0.8.18;

contract HHGOA {
    // constants
    uint256 internal tokenPool = 5_000_000_000_000_000;
    uint256 internal  constant TOKEN_PRICE = 0.001 ether; // Token price in Ether

    // variables5
    uint256 internal postIndex = 0;
    uint256 internal quiz_user_index = 0;
    address public owner;
    address[] internal leaderboardAddr;
    // structs
    struct Quiz_User {
        string category;
        bool result;
        uint answer;
    }

    struct Leaderboard {
        address user;
        string username;
        uint16 wins;
    }

    struct Post {
        address owner;
        string caption;
        string post_url;
        uint32 likes;
        uint256 tips;
    }

    struct User {
        string name;
        string username;
        string profile_url;
        string[] interests;
        uint256 tokens;
        uint256[] posts;
        uint256[] saved_posts;
        uint256[] quiz_history;
        uint256 tips;
        uint256 quiz_won;
    }

    //  mapping
    mapping(address => User) internal  users;
    mapping(uint256 => Post) internal  posts;
    mapping(uint256 => Quiz_User) public quiz_users;
    mapping(address => Leaderboard) internal leaderboard;
   
    mapping(address => bool) internal isInLeaderboard;
    mapping(string => bool) internal   isUsernameExist;

    // events
    // event HelpBuildersEvent(string projectName, address projectOwner);
    // event CreatedQuestionEvent(string question);
    // event PlacedBetEvent(uint questionId, bool selectedOption);
    // event CompletedQuestionEvent(
    //     uint questionId,
    //     bool selectedOption,
    //     uint winnerAmount
    // );
    // event MessageEvent(address sender, address receiver, string message);
    event UserEvent(string username);
    event PostEvent(string postUrl, address owner);

    // event BlogEvent(string postUrl, address owner);

    // constructor
    constructor() {
        owner = msg.sender;
    }

    // functions

    function register_user(
        string memory _name,
        string memory _username,
        string memory _profile_url,
        string[] memory _interests
    ) public {
        require(!isUsernameExists(_username), "Username already exists");
        isUsernameExist[_username] = true;
        users[msg.sender] = User({
            name: _name,
            username: _username,
            profile_url: _profile_url,
            interests: _interests,
            tokens: 5_000_000_000,
            posts: new uint256[](0),
            quiz_history: new uint256[](0),
            saved_posts: new uint256[](0),
            tips: 0,
            quiz_won: 0
        });
    }

    function buy_token(uint256 _token) public payable {
        // 1 token = 0.001 eth
        require(
            msg.value == _token * TOKEN_PRICE,
            "Incorrect Ether amount sent"
        );

        // Ensure there are enough tokens in the pool
        require(tokenPool >= _token, "Not enough tokens available");

        User storage user = users[msg.sender];

        tokenPool -= _token*100_000_000;
        user.tokens += _token*100_000_000;
    }

    function gen_image() public {
        User storage user = users[msg.sender];

        // Ensure that user has enough tokens

        user.tokens -= 200_000_000;
        tokenPool += 200_000_000;
    }

    function create_post(string memory _post_url, string memory _caption)
        public
    {
        User storage user = users[msg.sender]; // Use storage keyword to modify

        // require(
        //     user.tokens >= 200_000_000,
        //     "Insufficient tokens to create post."
        // );

        user.tokens -= 200_000_000;
        tokenPool += 200_000_000;

        Post memory new_post = Post({
            owner: msg.sender,
            post_url: _post_url,
            caption: _caption,
            likes: 0,
            tips: 0
        });

        // Store post data in the mapping
        posts[postIndex] = new_post;
        postIndex++;

        // Update user's list of posts
        user.posts.push(postIndex);

        // Emit event
        // emit PostEvent(_post_url, msg.sender);
    }

    function save_post(uint256 _post_index) public {
        User storage user = users[msg.sender];

        // Check if the post is already saved
        for (uint256 i = 0; i < user.saved_posts.length; i++) {
            if (user.saved_posts[i] == _post_index) {
                return; // Exit the function if the post is already saved
            }
        }

        // Add the post if it's not already saved
        user.saved_posts.push(_post_index);
    }

    function payEntryFeesForQuiz() public {
        User storage user = users[msg.sender];
        require(user.tokens >= 500_000_000, "Insufficient tokens.");
        user.tokens -= 500_000_000;
        tokenPool += 500_000_000;
    }

    function quiz_submit(string memory _category, uint256 _result) public {
        bool resultBool = _result >= 4 ? true : false;

        quiz_users[quiz_user_index] = Quiz_User({
            category: _category,
            result: resultBool,
            answer:_result
        });
        users[msg.sender].quiz_history.push(quiz_user_index);
        quiz_user_index++;

        if (resultBool) {
            users[msg.sender].quiz_won++;
            require(tokenPool >= 800_000_000, "Insufficient tokens.");

            tokenPool -= 800_000_000;

            users[msg.sender].tokens += 800_000_000;

            if (isInLeaderboard[msg.sender]) {
                leaderboard[msg.sender].wins += 1;
            } else {
                leaderboardAddr.push(msg.sender);
                isInLeaderboard[msg.sender] = true;
                leaderboard[msg.sender].user = msg.sender;
                leaderboard[msg.sender].username = users[msg.sender].username;
                leaderboard[msg.sender].wins = 1;
            }
        }
    }

    function like_post(uint256 _post_id) public {
        Post storage post = posts[_post_id];
        post.likes++;

        // Reward the post owner with tokens
        // address owner = post.owner;
        // users[owner].tokens += 1;
    }

    function tip_user(address _receiver_address, uint256 _no_of_tokens) public {
        User storage sender = users[msg.sender];
        User storage receiver = users[_receiver_address];

        require(
            sender.tokens >= _no_of_tokens*100_000_000,
            "Insufficient tokens for tipping."
        );

        sender.tokens -= _no_of_tokens*100_000_000;
        receiver.tokens += _no_of_tokens*100_000_000;
        receiver.tips += _no_of_tokens;
    }

    // view function
    function get_user_profile(address user_address)
        public
        view
        returns (User memory)
    {
        return users[user_address];
    }

    function view_all_posts() public view returns (Post[] memory) {
        Post[] memory all_posts = new Post[](postIndex);

        for (uint256 i = 0; i < postIndex; i++) {
            all_posts[i] = posts[i];
        }

        return all_posts;
    }

    function is_user_registered(address user_address)
        public
        view
        returns (bool)
    {
        return bytes(users[user_address].name).length != 0;
    }

    function get_all_leaderboard() public  view returns ( Leaderboard[] memory){

        Leaderboard[] memory all_leaderboard= new Leaderboard[](leaderboardAddr.length);
        for (uint256 i = 0; i < leaderboardAddr.length; i++) {
            all_leaderboard[i]=leaderboard[leaderboardAddr[i]];
        }
        return all_leaderboard;

    }

    function isUsernameExists(string memory _username)
        public
        view
        returns (bool)
    {
        return isUsernameExist[_username];
    }

    function get_user_quiz_history(address user_address) public view returns ( Quiz_User[] memory){
        User memory user=users[user_address];
        Quiz_User[] memory quiz_history= new Quiz_User[](user.quiz_history.length);
        for(uint i=0 ;i<user.quiz_history.length ;i++){
            quiz_history[i] = quiz_users[user.quiz_history[i]];
        }
        
        return quiz_history;
        
    }
}
