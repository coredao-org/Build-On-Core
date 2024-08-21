//SPDX-License-Identifier: MIT


import "../../helperContracts/ierc20_permit.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "../../helperContracts/safemath.sol";
import "./erc20Meme.sol";
import "../../helperContracts/wcore_interface.sol";
import "@uniswap/v2-core/contracts/interfaces/IUniswapV2Factory.sol";
import "@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router02.sol";

pragma solidity ^0.8.19;

interface Pool {
    function createPair(address tokenA, address tokenB) external returns(address);
}


contract Commeme {
    address[] public donators;
    mapping(address => uint256) public donatorsAmount;
    uint256 public donationAmount;
    mapping(address => bool) public isDonator;
    bool public isActive;
    uint256 public timeToClose;
    uint256 public threshold;
    bool public poolCreated;
    mapping(address => mapping(address => mapping(uint24 => address))) public getPool;
    address private factoryContractAddress;
    IWCORE private _wcore;
    IUniswapV2Router02 public immutable IUniswapV2Router;
    IERC20Permit private _meme;
    address public ROUTER;
    // AggregatorV3Interface public immutable corePriceAggregator;

    using SafeMath for uint256;
    address public poolAddress;

    string public metadata;

    uint256 public price;

    address public legacy;

    error AETS();

    event CommemeCreated(address indexed sender,string metadata ,uint256 threshold,string name,string symbol,uint256 totalSupply);
    event PoolCreated(address indexed poolAddress, address tokenA, address tokenB);
    event TokenDeployed(address indexed tokenAddress, string tokenName, string tokenSymbol, uint256 totalSupply);
    event LiquidityAdded(address tokenA, address tokenB, uint256 amountA, uint256 amountB);
    event Donation(bool isActive, uint256 totalDonationAmount, uint256 currentDonation,uint256 timeToClose,address token,address donor);

    struct MemeDetails {
        string name;
        string symbol;
        uint256 totalSupply;
        address tokenAddress;
        address owner;
    }

    MemeDetails public memeDetails;

    modifier _SupplyEnded(uint256 _buyAmount) {
        if(memeDetails.totalSupply < _buyAmount) revert AETS();
        _;
    }

    constructor(
        address _sender, 
        string memory _name, 
        string memory _symbol, 
        string memory _metadata,
        uint256 _totalSupply, 
        uint256 _threshold,
        address _factoryContractAddress,
        address _router,
        address _wCoreAddress,
        address _legacy,
        uint256 _price
    ) {
        memeDetails = MemeDetails({
            name: _name,
            symbol: _symbol,
            totalSupply: _totalSupply,
            tokenAddress: 0x0000000000000000000000000000000000000000,
            owner: _sender
        });
        legacy = _legacy;
        timeToClose = block.timestamp + 1440 minutes;
        threshold = _threshold;
        _wcore = IWCORE(_wCoreAddress);
        ROUTER = _router;
        price = _price;
        metadata = _metadata;
        factoryContractAddress = _factoryContractAddress;
        // corePriceAggregator = AggregatorV3Interface(_corePriceAggregator);
        isActive = true;

        emit CommemeCreated( _sender,_metadata, _threshold, _name,_symbol,_totalSupply);
    }

    function earlyDonations(address _sender, uint256 _amount) public payable {
        if(donationAmount >= threshold) revert("ATR"); // ATR - Already Threshold Reaches
        if(donationAmount < threshold && block.timestamp >= timeToClose) {
            _refundIfNotActive();
        } else {
            // uint256 _amount = msg.value;
            if(!isDonator[_sender]) {
                donators.push(_sender);
                isDonator[_sender] = true;
                donatorsAmount[_sender] = donatorsAmount[_sender].add(_amount);
                donationAmount = donationAmount.add(_amount);
            } else {
                donatorsAmount[_sender] = donatorsAmount[_sender].add(_amount);
                donationAmount = donationAmount.add(_amount);
            }
            uint256 minutesToAdd = ((price.mul(_amount)).mul(60));
            timeToClose = timeToClose.add((minutesToAdd.mul(1 minutes)));
           
            if(donationAmount >= threshold) {
                _deployToken();
                emit TokenDeployed(memeDetails.tokenAddress, memeDetails.name, memeDetails.symbol, memeDetails.totalSupply);
                _createPool(address(_wcore) , memeDetails.tokenAddress, factoryContractAddress);
                emit PoolCreated(poolAddress, address(_wcore), memeDetails.tokenAddress);
                _meme = IERC20Permit(memeDetails.tokenAddress);
                // uint256 _legacyAmount = (donationAmount.mul(10)).div(100);
                // donationAmount = donationAmount.sub(_legacyAmount);
                // payable(legacy).transfer(_legacyAmount);
                
                uint256 depositAmount = (donationAmount.mul(90)).div(100);
                // require(depositAmount < donationAmount, "deposit exceeding or not calculating");
                _wcore.deposit{value: depositAmount}();
                uint256 toLiquidity =  (memeDetails.totalSupply.mul(70)).div(100);
                // require(toLiquidity < memeDetails.totalSupply, "liquidity amount exceeds");
                uint256 forAirDrop = memeDetails.totalSupply.sub(toLiquidity);
                require((toLiquidity.add(forAirDrop)) <= memeDetails.totalSupply);
                _addLiquidity(toLiquidity, depositAmount);
                emit LiquidityAdded(address(_wcore), memeDetails.tokenAddress, toLiquidity, depositAmount);
                _transferTokens(forAirDrop);
                uint256 _legacyAmount = donationAmount.sub(depositAmount);
                require(_legacyAmount <= address(this).balance);
                // donationAmount = donationAmount.sub(_legacyAmount);
                payable(legacy).transfer(_legacyAmount);
            }
            // (, int256 latestPrice , , ,)  = corePriceAggregator.latestRoundData();
            // uint256 minutesToAdd = ((price.mul(_amount)).mul(60));
            // timeToClose = timeToClose.add((minutesToAdd.mul(1 minutes)));
            emit Donation(isActive, donationAmount, _amount, timeToClose, address(_meme), _sender);
        }
    }

    function _createPool(address token0, address token1, address _factory) private returns(address){
        // require(token0 != token1, "Cannot create a pool with the same token");
        Pool pool = Pool(_factory);
        poolAddress = pool.createPair(token0, token1);
        return poolAddress;
    }

    function _addLiquidity(uint256 _amountmeme, uint256 _amountCoin) private returns(uint256, uint256, uint256) {

        _meme.approve(ROUTER, _amountmeme);
        _wcore.approve(ROUTER, _amountCoin);

        (uint256 amountA, uint256 amountB, uint256 liquidity) = IUniswapV2Router02(ROUTER).addLiquidity(
            address(_meme),
            address(_wcore),
            _amountmeme,
            _amountCoin,
            1,
            1,
            address(this),
            block.timestamp
        );

        return(amountA, amountB, liquidity);
    }


    function _refundIfNotActive() private {
        if(isActive) revert("it's still active");
        for(uint256 i=0; i<donators.length; i++) {
            uint256 transferable_amount = donatorsAmount[donators[i]];
            donatorsAmount[donators[i]] = 0;
            payable(donators[i]).transfer(transferable_amount);
        }
    }

    function _deployToken() private {
        require(memeDetails.tokenAddress == 0x0000000000000000000000000000000000000000, "Token already deployed");


        ERC20MemeToken token = new ERC20MemeToken(
            memeDetails.name,
            memeDetails.symbol,
            memeDetails.totalSupply
        );
        memeDetails.tokenAddress = address(token);
    }

    function _transferTokens(uint256 forAirDrop) private {
        for(uint i=0; i<donators.length; i++) {
            address donator = donators[i];
            uint256 donatorContribution = donatorsAmount[donator];
            // require(donatorContribution > 0, "donatorContribution cant be zero");
            uint256 donatorPercentage = (donatorContribution.mul(100)).div(donationAmount);
            // require(donatorPercentage > 0, "donatorPercentage");
            uint256 tokensToSend = (forAirDrop.mul(donatorPercentage)).div(100);
            // require(tokensToSend > 0, "tokensToSend cant be zero");
            _meme.transfer(donator, tokensToSend);
        }
    }

    receive() external payable {
        earlyDonations(msg.sender, msg.value);
    }
}
