// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.25;

import { MoonLaunchToken } from "./Token.sol";
import "@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router02.sol";
import "@uniswap/v2-core/contracts/interfaces/IUniswapV2Factory.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import { FixedPointMathLib } from "@solmate/utils/FixedPointMathLib.sol";
import { SafeTransferLib } from "@solmate/utils/SafeTransferLib.sol";
import { ERC20 } from "@solmate/tokens/ERC20.sol";

error NotPermitted();
error Paused();
error InsufficientPayment();
error InvalidAmountIn();
error InvalidLaunchPrice();
error InvalidTargetMCap();
error InsufficientOutput();
error DeadlineExceeded();
error InvalidToken();
error FeeTooHigh();

struct TokenLaunchParam {
    string name;
    string symbol;
    string description;
    string image;
    string twitterLink;
    string telegramLink;
    string website;
}
struct Pool {
    MoonLaunchToken token;
    uint256 tokenReserve;
    uint256 virtualTokenReserve;
    uint256 ethReserve;
    uint256 virtualEthReserve;
    uint256 curveConstant;
    uint256 targetMCap;
    uint256 lastPrice;
    uint256 lastMcapInEth;
    uint256 lastTimestamp;
    uint256 lastBlock;
    address creator;
    bool migrated;
}

contract BondingCurveAMM is ReentrancyGuard {
    using FixedPointMathLib for uint256;

    uint256 public constant FEE_DENOMINATOR = 100_00;
    uint256 public constant MAX_FEE = 10_00; // 10%
    uint256 public constant INIT_REAL_TOKEN_RESERVE = 793_100_000 ether;
    uint256 public constant INIT_VIRTUAL_TOKEN_RESERVE = 1073000000 ether;
    uint256 public constant TOTAL_SUPPLY = 1_000_000_000 ether;
    IUniswapV2Router02 public immutable swapRouter;
    IUniswapV2Factory public immutable uniswapV2Factory;
    uint256 public minimumTargetMCap;
    uint256 public creationFee;
    uint256 public tradingFeeRate;
    uint256 public migrationFeeRate;
    address public admin;
    address payable public protocolFeeRecipient;
    bool public paused;
    mapping(address => Pool) public tokenPool;

    event TokenLaunch(
        address indexed creator,
        address token,
        uint256 targetMCapCore,
        string name,
        string symbol,
        string description,
        string image,
        string twitterLink,
        string telegramLink,
        string website,
        uint256 timestamp
    );
    event PriceUpdate(
        address indexed token,
        address indexed trader,
        uint256 price,
        uint256 mcapEth,
        uint256 timestamp
    );
    event Trade(
        address indexed trader,
        address indexed token,
        uint256 amountIn,
        uint256 amountOut,
        uint256 fee,
        uint256 timestamp,
        bool isBuy
    );
    event MigrateLiquidity(
        address indexed token,
        address indexed pair, 
        uint256 ethAmount, 
        uint256 tokenAmount, 
        uint256 fee, 
        uint256 timestamp
    );


    modifier onlyAdmin() {
        if (msg.sender != admin) revert NotPermitted();
        _;
    }
    modifier onlyUnPaused() {
        if (paused) revert Paused();
        _;
    }
    modifier checkDeadline(uint256 deadline) {
        if (block.timestamp > deadline) revert DeadlineExceeded();
        _;
    }


    constructor(
        uint256 _tradingFeeRate,
        uint256 _migrationFeeRate,
        uint256 _creationFee,
        uint256 _minimumTargetMCap,
        address feeRecipient,
        address router,
        address factory
    ) {
        admin = msg.sender;
        tradingFeeRate = _tradingFeeRate;
        migrationFeeRate = _migrationFeeRate;
        creationFee = _creationFee;
        minimumTargetMCap = _minimumTargetMCap;
        swapRouter = IUniswapV2Router02(router);
        uniswapV2Factory = IUniswapV2Factory(factory);
        paused = false;
        protocolFeeRecipient = payable(feeRecipient);
    }


    function launchToken(TokenLaunchParam memory param, uint256 targetMCap) external payable onlyUnPaused returns (address) {
        if (msg.value < creationFee) revert InsufficientPayment();
        if (targetMCap < minimumTargetMCap) revert InvalidTargetMCap();
        if (creationFee > 0) SafeTransferLib.safeTransferETH(protocolFeeRecipient, creationFee);
        (uint256 curveConstant, uint256 initVirtualEthReserve) = calculateTokenCurveVariables(targetMCap);
        MoonLaunchToken token = new MoonLaunchToken(param.name, param.symbol, address(this), msg.sender, TOTAL_SUPPLY);
        Pool storage pool = tokenPool[address(token)];
        pool.token = token;
        pool.tokenReserve = INIT_REAL_TOKEN_RESERVE;
        pool.virtualTokenReserve = INIT_VIRTUAL_TOKEN_RESERVE;
        pool.ethReserve = 0;
        pool.virtualEthReserve = initVirtualEthReserve;
        pool.curveConstant = curveConstant;
        pool.targetMCap = targetMCap;
        pool.lastPrice = initVirtualEthReserve.divWadDown(INIT_VIRTUAL_TOKEN_RESERVE);
        pool.lastMcapInEth = TOTAL_SUPPLY.mulWadUp(pool.lastPrice);
        pool.lastTimestamp = block.timestamp;
        pool.lastBlock = block.number;
        pool.creator = msg.sender;
        pool.migrated = false;

        emit TokenLaunch(
            msg.sender,
            address(token),
            pool.targetMCap,
            param.name,
            param.symbol,
            param.description,
            param.image,
            param.twitterLink,
            param.telegramLink,
            param.website,
            block.timestamp
        );
        emit PriceUpdate(
            address(token), 
            msg.sender, 
            pool.lastPrice, 
            pool.lastMcapInEth, 
            block.timestamp
        );
        return address(token);
    }

    function swapEthForTokens(address token, uint256 amountIn, uint256 amountOutMin, uint256 deadline) 
        external 
        payable 
        nonReentrant 
        onlyUnPaused 
        checkDeadline(deadline) 
        returns (uint256 amountOut) 
    {
        if (msg.value < amountIn) revert InsufficientPayment();
        if (amountIn == 0) revert InvalidAmountIn();
        uint256 fee = 0;
        if (tokenPool[token].migrated) {
            ( amountOut, fee ) = _swapETHForTokenOnRouter(token, amountIn, amountOutMin, msg.sender);
        } else {
            fee = amountIn * tradingFeeRate / FEE_DENOMINATOR;
            amountIn -= fee;
            SafeTransferLib.safeTransferETH(protocolFeeRecipient, fee);
            if (tokenPool[token].creator == address(0)) revert InvalidToken();
            uint256 newVirtualEthReserve = tokenPool[token].virtualEthReserve + amountIn;
            uint256 newVirtualTokenReserve = tokenPool[token].curveConstant/newVirtualEthReserve;
            amountOut = tokenPool[token].virtualTokenReserve - newVirtualTokenReserve;
            if (amountOut > tokenPool[token].tokenReserve) {
                amountOut = tokenPool[token].tokenReserve;
            }
            if (amountOut < amountOutMin) revert InsufficientOutput();

            tokenPool[token].virtualEthReserve = newVirtualEthReserve;
            tokenPool[token].virtualTokenReserve = newVirtualTokenReserve;

            tokenPool[token].lastPrice = newVirtualEthReserve.divWadDown(newVirtualTokenReserve);
            tokenPool[token].lastMcapInEth = TOTAL_SUPPLY.mulWadUp(tokenPool[token].lastPrice);
            tokenPool[token].lastTimestamp = block.timestamp;
            tokenPool[token].lastBlock = block.number;
            tokenPool[token].ethReserve += amountIn;
            tokenPool[token].tokenReserve -= amountOut;
            SafeTransferLib.safeTransfer(ERC20(token), msg.sender, amountOut);
            emit PriceUpdate(token, msg.sender, tokenPool[token].lastPrice, tokenPool[token].lastMcapInEth, block.timestamp);

            if (tokenPool[token].ethReserve >= tokenPool[token].targetMCap) {
                _migrateLiquidity(token);
            }
        }
        emit Trade(msg.sender, token, amountIn + fee, amountOut, fee, block.timestamp, true);
    }

    function swapTokensForEth(address token, uint256 amountIn, uint256 amountOutMin, uint256 deadline)
        external
        nonReentrant
        onlyUnPaused
        checkDeadline(deadline)
        returns (uint256 amountOut)
    {
        uint256 fee = 0;
        if (amountIn == 0) revert InvalidAmountIn();
        SafeTransferLib.safeTransferFrom(ERC20(token), msg.sender, address(this), amountIn);
        if (tokenPool[token].migrated) {
            ( amountOut, fee ) = _swapTokenForETHOnRouter(token, amountIn, amountOutMin, msg.sender);
        } else {
            if (tokenPool[token].creator == address(0)) revert InvalidToken();
            uint256 newVirtualTokenReserve = tokenPool[token].virtualTokenReserve + amountIn;
            uint256 newVirtualEthReserve = tokenPool[token].curveConstant / newVirtualTokenReserve;
            amountOut = tokenPool[token].virtualEthReserve - newVirtualEthReserve;
            tokenPool[token].virtualTokenReserve = newVirtualTokenReserve;
            tokenPool[token].virtualEthReserve = newVirtualEthReserve;
            tokenPool[token].lastPrice = newVirtualEthReserve.divWadDown(newVirtualTokenReserve);
            tokenPool[token].lastMcapInEth = TOTAL_SUPPLY.mulWadUp(tokenPool[token].lastPrice);
            tokenPool[token].lastTimestamp = block.timestamp;
            tokenPool[token].lastBlock = block.number;
            tokenPool[token].tokenReserve += amountIn;
            tokenPool[token].ethReserve -= amountOut;
            fee = amountOut * tradingFeeRate / FEE_DENOMINATOR;
            amountOut -= fee;

            if (amountOut < amountOutMin) revert InsufficientOutput();
            SafeTransferLib.safeTransferETH(protocolFeeRecipient, fee);
            SafeTransferLib.safeTransferETH(msg.sender, amountOut);

            emit PriceUpdate(token, msg.sender, tokenPool[token].lastPrice, tokenPool[token].lastMcapInEth, block.timestamp);
        }
        emit Trade(msg.sender, token, amountIn, amountOut, fee, block.timestamp, false);
    }

    function _migrateLiquidity(address token) private {
        if (tokenPool[token].creator == address(0)) revert InvalidToken();
        tokenPool[token].lastTimestamp = block.timestamp;
        tokenPool[token].lastBlock = block.number;

        uint256 fee = tokenPool[token].ethReserve * migrationFeeRate / FEE_DENOMINATOR;
        SafeTransferLib.safeTransferETH(protocolFeeRecipient, fee);
        uint256 ethAmount = tokenPool[token].ethReserve - fee;
        uint256 tokenAmount = TOTAL_SUPPLY - INIT_REAL_TOKEN_RESERVE;

        MoonLaunchToken(token).setIsApprovable(true);
        bool success = MoonLaunchToken(token).approve(address(swapRouter), tokenAmount);
        require(success, "token approval failed");
        address pair = uniswapV2Factory.createPair(token, swapRouter.WETH());
        swapRouter.addLiquidityETH{ value: ethAmount }(
            token,
            tokenAmount,
            tokenAmount,
            ethAmount,
            address(0), // permanently lock the liquidity
            block.timestamp + 1 minutes
        );
        tokenPool[token].migrated = true;
        tokenPool[token].virtualEthReserve = 0;
        tokenPool[token].virtualTokenReserve = 0;
        tokenPool[token].ethReserve = 0;
        tokenPool[token].tokenReserve = 0;
        emit MigrateLiquidity(token, pair, ethAmount, tokenAmount, fee, block.timestamp);
    }

    function calcAmountOutFromToken(address token, uint256 amountIn) external view returns (uint256 amountOut) {
        if (amountIn == 0) revert InvalidAmountIn();

        uint256 newVirtualTokenReserve = tokenPool[token].virtualTokenReserve + amountIn;
        uint256 newVirtualEthReserve = tokenPool[token].curveConstant / newVirtualTokenReserve;
        amountOut = tokenPool[token].virtualEthReserve - newVirtualEthReserve;

        uint256 fee = amountOut * tradingFeeRate / FEE_DENOMINATOR;
        amountOut -= fee;
    }

    function calcAmountOutFromEth(address token, uint256 amountIn) external view returns (uint256 amountOut) {
        if (amountIn == 0) revert InvalidAmountIn();

        uint256 fee = amountIn * tradingFeeRate / FEE_DENOMINATOR;
        amountIn -= fee;

        uint256 newVirtualEthReserve = tokenPool[token].virtualEthReserve + amountIn;
        uint256 newVirtualTokenReserve = tokenPool[token].curveConstant / newVirtualEthReserve;
        amountOut = tokenPool[token].virtualTokenReserve - newVirtualTokenReserve;

        if (amountOut > tokenPool[token].tokenReserve) {
            amountOut = tokenPool[token].tokenReserve;
        }
    }

    function _swapETHForTokenOnRouter(address token, uint256 amountIn, uint256 amountOutMin, address to) private returns (uint256, uint256) {
        if (msg.value < amountIn) revert InsufficientPayment();
        uint256 fee = (amountIn * tradingFeeRate) / FEE_DENOMINATOR;
        address[] memory path = new address[](2);
        path[0] = swapRouter.WETH();
        path[1] = token;
        uint[] memory amounts = swapRouter.swapExactETHForTokens{value: amountIn - fee}(
            amountOutMin,
            path,
            to,
            block.timestamp + 1 minutes
        );
        uint amountOut = amounts[amounts.length - 1];
        SafeTransferLib.safeTransferETH(protocolFeeRecipient, fee);
        return (amountOut, fee);
    }

    function _swapTokenForETHOnRouter(address token, uint256 amountIn, uint256 amountOutMin, address to) private returns (uint256, uint256) {
        address[] memory path = new address[](2);
        path[0] = token;
        path[1] = swapRouter.WETH();
        MoonLaunchToken(token).approve(address(swapRouter), amountIn);
        uint[] memory amounts = swapRouter.swapExactTokensForETH(
            amountIn, 
            amountOutMin, 
            path,
            address(this), 
            block.timestamp + 1 minutes
        );
        uint amountOut = amounts[amounts.length - 1];
        uint256 fee = (amountOut * tradingFeeRate) / FEE_DENOMINATOR;
        SafeTransferLib.safeTransferETH(protocolFeeRecipient, fee);
        SafeTransferLib.safeTransferETH(to, amountOut - fee);
        return (amountOut - fee, fee);
    }

    function _calculateYAndK1(uint256 startPriceInCore, uint256 targetMCapCore) private pure returns (uint256 y, uint256 k1) {
        uint256 ca = startPriceInCore * INIT_REAL_TOKEN_RESERVE;
        uint256 cb = targetMCapCore * INIT_REAL_TOKEN_RESERVE;
        uint256 x1 = ca + cb - startPriceInCore;
        k1 = x1 / targetMCapCore;
        y = (k1 + 1 ether) * (startPriceInCore);
    }

    function calculateTokenCurveVariables(uint256 targetMCapCore) public pure returns (uint256 curveConstant, uint256 initVirtualEthReserve) {
        initVirtualEthReserve = targetMCapCore * (INIT_VIRTUAL_TOKEN_RESERVE - INIT_REAL_TOKEN_RESERVE)/INIT_REAL_TOKEN_RESERVE;
        curveConstant = initVirtualEthReserve * INIT_VIRTUAL_TOKEN_RESERVE;
    }

    function setMinimumTargetMCap(uint256 value) external onlyAdmin {
        minimumTargetMCap = value;
    }

    function setProtocolFeeRecipient(address recpt) external onlyAdmin {
        protocolFeeRecipient = payable(recpt);
    }

    function setCreationFee(uint256 value) external onlyAdmin {
        creationFee = value;
    }

    function setMigrationFeeRate(uint256 value) external onlyAdmin {
        if (value > MAX_FEE) revert FeeTooHigh();
        migrationFeeRate = value;
    }

    function setTradingFeeRate(uint256 value) external onlyAdmin {
        if (value > MAX_FEE) revert FeeTooHigh();
        tradingFeeRate = value;
    }

    function setAdmin(address newAdmin) external onlyAdmin {
        admin = newAdmin;
    }

    function setPaused(bool _val) external onlyAdmin {
        paused = _val;
    }

    receive() external payable {}
}