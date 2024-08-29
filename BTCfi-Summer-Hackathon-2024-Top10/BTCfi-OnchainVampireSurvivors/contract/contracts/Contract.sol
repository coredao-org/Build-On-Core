// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import "@thirdweb-dev/contracts/extension/Ownable.sol";

interface IUltraVerifier {
    function getVerificationKeyHash() external pure returns (bytes32);

    function verify(
        bytes calldata _proof,
        bytes32[] calldata _publicInputs
    ) external view returns (bool);
}

contract ZKGameClient is Ownable {
    // 0: Gold; 1: Diamond;
    struct PriceItem {
        uint priceType;
        uint price;
    }

    struct MessageItem {
        address player;
        uint time;
        uint kills;
    }

    // 0: Gold; 1: Diamond; 2: skin; 3: Weapon
    struct LotteryItem {
        uint itemType;
        uint num;
    }

    struct GameLog{
        uint startTime;
        uint endTime;
        address player;
        uint reLive;
        uint grade;
    }

    event RequestLottery(
        uint256 requestId,
        uint256 random,
        LotteryItem lotteryItem
    );

    event GameLogEvent(
        uint startTime,
        uint endTime,
        address player,
        uint grade,
        uint reLive
    );
    
    // Lottery
    uint256 public totalLotteryTimes = 0;
    LotteryItem[] public LotteryItemList;
    mapping(address => uint256) public playerLastlotteryResultIndexMap; /*  address --> requestId */

    // player's weapon
    mapping(address => uint[]) public playerWeaponMap; /* player --> uint[] */
    mapping(address => mapping(uint=>uint)) public playerWeaponLevelMap; /* player --> id ->level*/
    mapping(address => uint[]) public playerSkinMap; /* player --> uint[] */
    mapping(address => mapping(uint=>uint)) public playerSkinLevelMap; /* player --> id ->level*/
    mapping(address => uint) public playerGoldMap; /* player --> uint */
    mapping(address => uint) public playerDiamondMap; /* player --> uint */

    /// topList
    uint[10] public topGradeList; // Top 10 grade List, kills
    uint[10] public topTimeList; // Top 10 grade List, timestamp
    address[10] public topPlayerList; // Top 10 player List, address
    uint public lastUpdateTime; // last update time of topList

    /// log
    mapping(address => uint) public playerLatestGameLogIdMap; // id => GameLog
    mapping(uint => GameLog) public gameLogMap; // id => GameLog
    uint public totalGame = 0;

    // weapon upgrade
    mapping(uint => PriceItem) public weaponPriceMap; // id => price
    uint[] public weaponLevelPriceList;
    // skin upgrade
    mapping(uint => PriceItem) public skinPriceMap; // id => price
    uint[] public skinLevelPriceList;

    constructor(){
        _setupOwner(msg.sender);
        initWeaponAndSkinData();
        initLotteryList();
    }

    function initWeaponAndSkinData() public onlyOwner {
        // weapon price
        weaponPriceMap[0] = PriceItem(0, 0);
        weaponPriceMap[1] = PriceItem(0, 1000);
        weaponPriceMap[5] = PriceItem(0, 1500);
        weaponPriceMap[6] = PriceItem(0, 2000);
        weaponPriceMap[7] = PriceItem(0, 500);
        weaponPriceMap[8] = PriceItem(0, 5000);
        weaponPriceMap[9] = PriceItem(1, 500);
        weaponPriceMap[15] = PriceItem(1, 500);
        weaponPriceMap[16] = PriceItem(0, 3000);
        weaponPriceMap[18] = PriceItem(1, 1000);

        // skin price
        skinPriceMap[0] = PriceItem(0, 0);
        skinPriceMap[1] = PriceItem(0, 1000);
        skinPriceMap[2] = PriceItem(0, 2500);
        skinPriceMap[3] = PriceItem(1, 1000);

        // weapon leavel price (glod)
        weaponLevelPriceList.push(0); // new weapon
        weaponLevelPriceList.push(100);
        weaponLevelPriceList.push(300);
        weaponLevelPriceList.push(600);
                
        // skin leavel price (glod)
        skinLevelPriceList.push(0); // new skin
        skinLevelPriceList.push(100);
        skinLevelPriceList.push(200);
        skinLevelPriceList.push(300);
        skinLevelPriceList.push(400);
        skinLevelPriceList.push(500);
        skinLevelPriceList.push(600);
    }

    // lottery
    function initLotteryList() public onlyOwner {
        // LotteryItemList.push(LotteryItem(0,100));
        // LotteryItemList.push(LotteryItem(0,50));
        LotteryItemList.push(LotteryItem(1,10));
        LotteryItemList.push(LotteryItem(0,50));
        LotteryItemList.push(LotteryItem(0,150));
        LotteryItemList.push(LotteryItem(3,18));
        LotteryItemList.push(LotteryItem(0,200));
        // LotteryItemList.push(LotteryItem(0,50));
        LotteryItemList.push(LotteryItem(1,20));
        // LotteryItemList.push(LotteryItem(0,50));
        // LotteryItemList.push(LotteryItem(0,200));
        LotteryItemList.push(LotteryItem(3,9));
    }

    function distribution(address payable winner, uint amount) internal {
        winner.transfer(amount);
    }

    function startGame() public payable {
        // pay gas token
        uint gasTokenAmountToPay = 10**16; // 0.01 tCORE
        require(msg.value >= gasTokenAmountToPay,"Gas Token is not enough!");

        // save log
        playerLatestGameLogIdMap[msg.sender] = totalGame;
        gameLogMap[totalGame].startTime = block.timestamp;
        gameLogMap[totalGame].player = msg.sender;
        totalGame = totalGame + 1;

        // distribution
        address payable top1Player = payable(topPlayerList[0]);
        uint balance = address(this).balance;
        if(balance >0 && top1Player != address(0)) {
            distribution(top1Player, balance);
        }
    }

    function reLive() public payable {
        // pay gas token
        uint gasTokenAmountToPay = 5*10**16; // 0.05 tCORE
        require(msg.value >= gasTokenAmountToPay,"Gas Token is not enough!");

        // distribution
        address payable top1Player = payable(topPlayerList[0]);
        uint balance = address(this).balance;
        if(balance >0 && top1Player != address(0)) {
            distribution(top1Player, balance);
        }
    }

    function testWeaponSkin() external onlyOwner {
        playerWeaponMap[msg.sender].push(5);
        playerWeaponMap[msg.sender].push(15);
        playerSkinMap[msg.sender].push(2);
        playerGoldMap[msg.sender] = 999999;
        playerDiamondMap[msg.sender] = 999999;
    }

    function getPlayerAllWeaponInfo(address player) external view returns(uint[] memory weaponIdList, uint[] memory weaponLevelList) {
        weaponIdList = playerWeaponMap[player];
        weaponLevelList = new uint[](weaponIdList.length);
        for(uint i=0; i < weaponIdList.length; i++) {
            weaponLevelList[i] = playerWeaponLevelMap[player][i];
        }
        return (weaponIdList, weaponLevelList);
    }

    function getPlayerAllSkinInfo(address player) external view returns(uint[] memory skinIdList, uint[] memory skinLevelList) {
        skinIdList = playerSkinMap[player];
        skinLevelList = new uint[](skinIdList.length);
        for(uint i=0; i < skinIdList.length; i++) {
            skinLevelList[i] = playerSkinLevelMap[player][i];
        }
        return (skinIdList, skinLevelList);
    }

    function buyOrUpgradeSkin(uint id) external {
        uint[] memory skinList = playerSkinMap[msg.sender];
        bool found = false;
        for(uint i=0; i<skinList.length; i++) {
            if(skinList[i] == id) {
                found = true;
            }
        }
        if(found || id == 0) {
            // upgrade
            uint currentLevel = playerSkinLevelMap[msg.sender][id];
            require(currentLevel < skinLevelPriceList.length -1, "Your skin is reached the highest level");
            uint goldPrice = skinLevelPriceList[currentLevel+1];
            uint goldNum = playerGoldMap[msg.sender];
            require(goldNum >= goldPrice, 'Your gold is not enough!');
            playerGoldMap[msg.sender] -= goldPrice;
            playerSkinLevelMap[msg.sender][id]++;
        } else {
            // buy
            PriceItem memory priceItem = skinPriceMap[id];
            if(priceItem.priceType == 0) {
                uint goldNum = playerGoldMap[msg.sender];
                require(goldNum >= priceItem.price, 'Your gold is not enough!');
                playerGoldMap[msg.sender] -= priceItem.price;
                playerSkinMap[msg.sender].push(id);
            } else if(priceItem.priceType == 1) {
                uint diamondNum =  playerDiamondMap[msg.sender];
                require(diamondNum >= priceItem.price, 'Your diamond is not enough!');
                playerDiamondMap[msg.sender] -= priceItem.price;
                playerSkinMap[msg.sender].push(id);
            }
        }
    }

    function buyOrUpgradeWeapon(uint id) external {
        uint[] memory weaponList = playerWeaponMap[msg.sender];
        bool found = false;
        for(uint i=0; i<weaponList.length; i++) {
            if(weaponList[i] == id) {
                found = true;
            }
        }
        if(found || id == 0) {
            // upgrade
            uint currentLevel = playerWeaponLevelMap[msg.sender][id];
            require(currentLevel < weaponLevelPriceList.length -1, "Your weapon is reached the highest level");
            uint goldPrice = weaponLevelPriceList[currentLevel+1];
            uint goldNum = playerGoldMap[msg.sender];
            require(goldNum >= goldPrice, 'Your gold is not enough!');
            playerGoldMap[msg.sender] -= goldPrice;
            playerWeaponLevelMap[msg.sender][id]++;
        } else {
            // buy
            PriceItem memory priceItem = weaponPriceMap[id];
            if(priceItem.priceType == 0) {
                uint goldNum = playerGoldMap[msg.sender];
                require(goldNum >= priceItem.price, 'Your gold is not enough!');
                playerGoldMap[msg.sender] -= priceItem.price;
                playerWeaponMap[msg.sender].push(id);
            } else if(priceItem.priceType == 1) {
                uint diamondNum =  playerDiamondMap[msg.sender];
                require(diamondNum >= priceItem.price, 'Your diamond is not enough!');
                playerDiamondMap[msg.sender] -= priceItem.price;
                playerWeaponMap[msg.sender].push(id);
            }
        }
    }

    function mintGold()  external payable {
        // pay gas token
        uint gasTokenAmountToPay = 10**16; // 0.01 tCORE
        require(msg.value >= gasTokenAmountToPay,"Gas Token is not enough!");
        playerGoldMap[msg.sender] += 500;
    }

    // random number generator
    function VRF(uint256 salt) public view returns (uint256) {
        return salt + block.timestamp;
    }

    // lottery
    function requestLottery() external payable {
        // pay gas token
        uint gasTokenAmountToPay = 4*10**16; // 0.04 tCORE
        require(msg.value >= gasTokenAmountToPay,"Gas Token is not enough!");

        totalLotteryTimes = totalLotteryTimes + 1;

        // get random from VRF
        uint256 random = VRF(totalLotteryTimes);

        // get lottery reault
        uint len = LotteryItemList.length;
        uint index = random % len;
        LotteryItem memory item = LotteryItemList[index];

        playerLastlotteryResultIndexMap[msg.sender] = index;

        // distribution rewards
        if(item.itemType == 0) {
            // mint gold
            playerGoldMap[msg.sender] += item.num;
        } else if(item.itemType == 1) {
            // mint diamond
            playerDiamondMap[msg.sender] += item.num;
        } else if(item.itemType == 2) {
            // TODO: mint skin
        } else if(item.itemType == 3) {
            // mint weapon
            playerWeaponMap[msg.sender].push(item.num);
        }

        emit RequestLottery(
            totalLotteryTimes,
            random,
            item
        );
    }

    // lottery
    function getPlayerLastLotteryResult(address player) external view returns (uint itemType,uint num) {
        uint256 index = playerLastlotteryResultIndexMap[player];
        LotteryItem memory item = LotteryItemList[index];
        return (item.itemType, item.num);
    }


    // player info
    function getPlayerAllAssets(address player) external view returns(uint gold,uint diamond) {
        return (playerGoldMap[player], playerDiamondMap[player]);
    }

    function gameOver(uint time, uint kills) external {
        // TODO: zk proof

        // save data
        uint logId = playerLatestGameLogIdMap[msg.sender];
        gameLogMap[logId].endTime = block.timestamp;
        gameLogMap[logId].grade = time;
        pushDataToTopList(MessageItem(msg.sender,time, kills));

        // mint gold
        if(kills > 0) {
            playerGoldMap[msg.sender] += kills;
        }

        emit GameLogEvent(
            gameLogMap[logId].startTime,
            gameLogMap[logId].endTime,
            gameLogMap[logId].player,
            time,
            gameLogMap[logId].reLive
        );
    }

    /// Use binary search algorithm
    function pushDataToTopList(MessageItem memory messageItem) internal {
        uint time = messageItem.time;
        uint kills = messageItem.kills;
        address player = messageItem.player;

        if(topGradeList[topGradeList.length -1] < kills) {
            uint left = 0;
            uint right = topGradeList.length - 1;
            uint mid;

            while (left < right) {
                mid = (left + right) / 2;
                if (topGradeList[mid] < kills) {
                    right = mid;
                } else {
                    left = mid + 1;
                }
            }

            for(uint i = topGradeList.length - 1; i > left; i--) {
                topGradeList[i] = topGradeList[i - 1];
                topTimeList[i] = topTimeList[i - 1];
                topPlayerList[i] = topPlayerList[i - 1];
            }
            topGradeList[left] = kills;
            topTimeList[left] = time;
            topPlayerList[left] = player;
        }

        lastUpdateTime = block.timestamp;
    }

    function getTopListInfo() public view returns (uint[10] memory , uint[10] memory, address[10] memory, uint) {
        return (topGradeList, topTimeList, topPlayerList, lastUpdateTime);
    }

    function _canSetOwner() internal virtual view override returns (bool) {
        return msg.sender == owner();
    }
}