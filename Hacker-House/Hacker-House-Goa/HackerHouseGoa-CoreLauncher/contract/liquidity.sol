/**
 *Submitted for verification at testnet.bscscan.com on 2024-04-08
*/

// SPDX-License-Identifier: MIT

pragma solidity ^0.8.24;

library Address {
    function isContract(address account) internal view returns (bool) {
        return account.code.length > 0;
    }
    function sendValue(address payable recipient, uint256 amount) internal {
        require(address(this).balance >= amount, "Address: insufficient balance");
        (bool success, ) = recipient.call{ value: amount }("");
        require(success, "Address: unable to send value, recipient may have reverted");
    }
    function functionCall(address target, bytes memory data) internal returns (bytes memory) {
        return functionCallWithValue(target, data, 0, "Address: low-level call failed");
    }
    function functionCall(
        address target,
        bytes memory data,
        string memory errorMessage
    ) internal returns (bytes memory) {
        return functionCallWithValue(target, data, 0, errorMessage);
    }
    function functionCallWithValue(address target, bytes memory data, uint256 value) internal returns (bytes memory) {
        return functionCallWithValue(target, data, value, "Address: low-level call with value failed");
    }
    function functionCallWithValue(
        address target,
        bytes memory data,
        uint256 value,
        string memory errorMessage
    ) internal returns (bytes memory) {
        require(address(this).balance >= value, "Address: insufficient balance for call");
        (bool success, bytes memory returndata) = target.call{ value: value }(data);
        return verifyCallResultFromTarget(target, success, returndata, errorMessage);
    }
    function functionStaticCall(address target, bytes memory data) internal view returns (bytes memory) {
        return functionStaticCall(target, data, "Address: low-level static call failed");
    }
    function functionStaticCall(
        address target,
        bytes memory data,
        string memory errorMessage
    ) internal view returns (bytes memory) {
        (bool success, bytes memory returndata) = target.staticcall(data);
        return verifyCallResultFromTarget(target, success, returndata, errorMessage);
    }
    function functionDelegateCall(address target, bytes memory data) internal returns (bytes memory) {
        return functionDelegateCall(target, data, "Address: low-level delegate call failed");
    }
    function functionDelegateCall(
        address target,
        bytes memory data,
        string memory errorMessage
    ) internal returns (bytes memory) {
        (bool success, bytes memory returndata) = target.delegatecall(data);
        return verifyCallResultFromTarget(target, success, returndata, errorMessage);
    }
    function verifyCallResultFromTarget(
        address target,
        bool success,
        bytes memory returndata,
        string memory errorMessage
    ) internal view returns (bytes memory) {
        if (success) {
            if (returndata.length == 0) {
                require(isContract(target), "Address: call to non-contract");
            }
            return returndata;
        } else {
            _revert(returndata, errorMessage);
        }
    }
    function verifyCallResult(
        bool success,
        bytes memory returndata,
        string memory errorMessage
    ) internal pure returns (bytes memory) {
        if (success) {
            return returndata;
        } else {
            _revert(returndata, errorMessage);
        }
    }
    function _revert(bytes memory returndata, string memory errorMessage) private pure {
        if (returndata.length > 0) {
            assembly {
                let returndata_size := mload(returndata)
                revert(add(32, returndata), returndata_size)
            }
        } else {
            revert(errorMessage);
        }
    }
}

interface IERC20 {
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
    function totalSupply() external view returns (uint256);
    function balanceOf(address account) external view returns (uint256);
    function transfer(address to, uint256 amount) external returns (bool);
    function allowance(address owner, address spender) external view returns (uint256);
    function approve(address spender, uint256 amount) external returns (bool);
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
}

interface IERC20Metadata is IERC20 {
    function name() external view returns (string memory);
    function symbol() external view returns (string memory);
    function decimals() external view returns (uint8);
}

contract ERC20 is IERC20Metadata {
    string private _name;
    string private _symbol;
    uint8 private _decimals;
    uint256 private _totalSupply;
    uint256 private _maxSupply;
    mapping(address => uint256) private _balances;
    mapping(address => mapping(address => uint256)) private _allowances;
    
    constructor(string memory name_, string memory symbol_, uint8 decimals_, uint256 maxSupply_) {
        _name = name_;
        _symbol = symbol_;
        _decimals = decimals_;
        _maxSupply = maxSupply_;
    }
    
    function name() public view override returns (string memory) {
        return _name;
    }
    function symbol() public view override returns (string memory) {
        return _symbol;
    }
    function decimals() public view override returns (uint8) {
        return _decimals;
    }
    function totalSupply() public view override returns (uint256) {
        return _totalSupply;
    }
    function balanceOf(address account) public view override returns (uint256) {
        return _balances[account];
    }
    function transfer(address to, uint256 amount) public override returns (bool) {
        _transfer(msg.sender, to, amount);
        return true;
    }
    function allowance(address owner, address spender) public view override returns (uint256) {
        return _allowances[owner][spender];
    }
    function approve(address spender, uint256 amount) public override returns (bool) {
        _approve(msg.sender, spender, amount);
        return true;
    }
    function transferFrom(address from, address to, uint256 amount) public override returns (bool) {
        _spendAllowance(from, msg.sender, amount);
        _transfer(from, to, amount);
        return true;
    }
    function _transfer(address from, address to, uint256 amount) internal virtual {
        require(from != address(0), "ERC20: transfer from the zero address");
        require(to != address(0), "ERC20: transfer to the zero address");
        require(_balances[from] >= amount, "ERC20: transfer amount exceeds balance");
        _balances[from] -= amount;
        _balances[to] += amount;
        emit Transfer(from, to, amount);
    }
    function _mint(address account, uint256 amount) internal virtual {
        require(account != address(0), "ERC20: mint to the zero address");
        require(_totalSupply + amount <= _maxSupply, "ERC20: cap exceeded");
        _totalSupply += amount;
        _balances[account] += amount;
        emit Transfer(address(0), account, amount);
    }
    function _burn(address account, uint256 amount) internal virtual {
        require(account != address(0), "ERC20: burn from the zero address");
        require(_balances[account] >= amount, "ERC20: burn amount exceeds balance");
        _balances[account] -= amount;
        _totalSupply -= amount;
        emit Transfer(account, address(0), amount);
    }
    function _approve(address owner, address spender, uint256 amount) internal virtual {
        require(owner != address(0), "ERC20: approve from the zero address");
        require(spender != address(0), "ERC20: approve to the zero address");
        _allowances[owner][spender] = amount;
        emit Approval(owner, spender, amount);
    }
    function _spendAllowance(address owner, address spender, uint256 amount) internal virtual {
        uint256 currentAllowance = _allowances[owner][spender];
        if (currentAllowance != type(uint256).max) {
            require(currentAllowance >= amount, "ERC20: insufficient allowance");
            _approve(owner, spender, currentAllowance - amount);
        }
    }
}

abstract contract Ownable {
    address private _owner;
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);
    constructor() {
        _transferOwnership(msg.sender);
    }
    modifier onlyOwner() {
        _checkOwner();
        _;
    }
    function owner() public view virtual returns (address) {
        return _owner;
    }
    function _checkOwner() internal view virtual {
        require(owner() == msg.sender, "Ownable: caller is not the owner");
    }
    function renounceOwnership() public virtual onlyOwner {
        _transferOwnership(address(0));
    }
    function transferOwnership(address newOwner) public virtual onlyOwner {
        require(newOwner != address(0), "Ownable: new owner is the zero address");
        _transferOwnership(newOwner);
    }
    function _transferOwnership(address newOwner) internal virtual {
        address oldOwner = _owner;
        _owner = newOwner;
        emit OwnershipTransferred(oldOwner, newOwner);
    }
}

interface IUniswapV2Factory {
    event PairCreated(address indexed token0, address indexed token1, address pair, uint);
    function feeTo() external view returns (address);
    function feeToSetter() external view returns (address);
    function getPair(address tokenA, address tokenB) external view returns (address pair);
    function allPairs(uint) external view returns (address pair);
    function allPairsLength() external view returns (uint);
    function createPair(address tokenA, address tokenB) external returns (address pair);
    function setFeeTo(address) external;
    function setFeeToSetter(address) external;
}

interface IUniswapV2Router01 {
    function factory() external pure returns (address);
    function WETH() external pure returns (address);
    function addLiquidity(address tokenA, address tokenB, uint amountADesired, uint amountBDesired, uint amountAMin, uint amountBMin, address to, uint deadline) external returns (uint amountA, uint amountB, uint liquidity);
    function addLiquidityETH(address token, uint amountTokenDesired, uint amountTokenMin, uint amountETHMin, address to, uint deadline) external payable returns (uint amountToken, uint amountETH, uint liquidity);
    function removeLiquidity(address tokenA, address tokenB, uint liquidity, uint amountAMin, uint amountBMin, address to, uint deadline) external returns (uint amountA, uint amountB);
    function removeLiquidityETH(address token, uint liquidity, uint amountTokenMin, uint amountETHMin, address to, uint deadline) external returns (uint amountToken, uint amountETH);
    function removeLiquidityWithPermit(address tokenA, address tokenB, uint liquidity, uint amountAMin, uint amountBMin, address to, uint deadline, bool approveMax, uint8 v, bytes32 r, bytes32 s) external returns (uint amountA, uint amountB);
    function removeLiquidityETHWithPermit(address token, uint liquidity, uint amountTokenMin, uint amountETHMin, address to, uint deadline, bool approveMax, uint8 v, bytes32 r, bytes32 s) external returns (uint amountToken, uint amountETH);
    function swapExactTokensForTokens(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts);
    function swapTokensForExactTokens(uint amountOut, uint amountInMax, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts);
    function swapExactETHForTokens(uint amountOutMin, address[] calldata path, address to, uint deadline) external payable returns (uint[] memory amounts);
    function swapTokensForExactETH(uint amountOut, uint amountInMax, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts);
    function swapExactTokensForETH(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts);
    function swapETHForExactTokens(uint amountOut, address[] calldata path, address to, uint deadline) external payable returns (uint[] memory amounts);
    function quote(uint amountA, uint reserveA, uint reserveB) external pure returns (uint amountB);
    function getAmountOut(uint amountIn, uint reserveIn, uint reserveOut) external pure returns (uint amountOut);
    function getAmountIn(uint amountOut, uint reserveIn, uint reserveOut) external pure returns (uint amountIn);
    function getAmountsOut(uint amountIn, address[] calldata path) external view returns (uint[] memory amounts);
    function getAmountsIn(uint amountOut, address[] calldata path) external view returns (uint[] memory amounts);
}

interface IUniswapV2Router02 is IUniswapV2Router01 {
    function removeLiquidityETHSupportingFeeOnTransferTokens(address token, uint liquidity, uint amountTokenMin, uint amountETHMin, address to, uint deadline) external returns (uint amountETH);
    function removeLiquidityETHWithPermitSupportingFeeOnTransferTokens(address token, uint liquidity, uint amountTokenMin, uint amountETHMin, address to, uint deadline, bool approveMax, uint8 v, bytes32 r, bytes32 s) external returns (uint amountETH);
    function swapExactTokensForTokensSupportingFeeOnTransferTokens(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external;
    function swapExactETHForTokensSupportingFeeOnTransferTokens(uint amountOutMin, address[] calldata path, address to, uint deadline) external payable;
    function swapExactTokensForETHSupportingFeeOnTransferTokens(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external;
}

contract Merlin_Deflationary_Token is ERC20, Ownable {
    IUniswapV2Router02 public uniswapV2Router;
    address public uniswapV2Pair;
    struct WalletData {
        address liquidityWallet;
        address operationsWallet;
        address burnWallet;
    }
    struct LimitData {
        uint256 maxWalletAmount;
        uint256 maxTxAmount;
        uint256 minimumTokensBeforeSwap;
    }
    struct FeeData {
        uint16 liquidityFee;
        uint16 operationsFee;
        uint16 burnFee;
    }
    WalletData private wallets;
    LimitData public limits;
    FeeData public buyFees;
    FeeData public sellFees;
    mapping(address => bool) public automatedMarketMakerPairs;
    mapping(address => bool) private _isExcludedFromFee;
    mapping(address => bool) private _isExcludedFromMaxTxLimit;
    mapping(address => bool) private _isExcludedFromMaxWalletLimit;
    bool private _inSwapAndLiquify;
    event SwapAndLiquify(uint256 tokensSwapped, uint256 ethReceived, uint256 tokensIntoLiqudity);
    event LimitsUpdated(uint256 newMaxWalletAmount, uint256 newMaxTxAmount, uint256 newMinimumTokensBeforeSwap);
    event FeesUpdated(string feeType, uint16 liquidityFee, uint16 operationsFee, uint16 burnFee);
    event WalletsUpdated(address newLiquidityWallet, address newOperationsWallet, address newBurnWallet);

    constructor(string memory name_, string memory symbol_, uint8 decimals_, uint256 maxSupply_, uint256 maxWalletPct, uint256 maxTxPct, uint256 minimumSwapPct, address routerAddress_, FeeData memory buyFeeRates, FeeData memory sellFeeRates, WalletData memory wallets_) ERC20(name_, symbol_, decimals_, maxSupply_) {
        uniswapV2Router = IUniswapV2Router02(routerAddress_);
        uniswapV2Pair = IUniswapV2Factory(uniswapV2Router.factory()).createPair(address(this), uniswapV2Router.WETH());
        setAutomatedMarketMakerPair(uniswapV2Pair, true);
        buyFees = buyFeeRates;
        sellFees = sellFeeRates;
        wallets = wallets_;
        limits.maxWalletAmount = maxSupply_ * maxWalletPct / 10000;
        limits.maxTxAmount = maxSupply_ * maxTxPct / 10000;
        limits.minimumTokensBeforeSwap = maxSupply_ * minimumSwapPct / 10000;
        _isExcludedFromFee[owner()] = true;
        _isExcludedFromFee[address(this)] = true;
        _isExcludedFromMaxTxLimit[address(this)] = true;
        _isExcludedFromMaxWalletLimit[uniswapV2Pair] = true;
        _isExcludedFromMaxWalletLimit[address(uniswapV2Router)] = true;
        _isExcludedFromMaxWalletLimit[address(this)] = true;
        _isExcludedFromMaxWalletLimit[owner()] = true;
        _mint(owner(), maxSupply_);
    }

    modifier lockTheSwap {
        _inSwapAndLiquify = true;
        _;
        _inSwapAndLiquify = false;
    }

    receive() external payable {}

    function setAutomatedMarketMakerPair(address pair, bool value) public onlyOwner {
        require(automatedMarketMakerPairs[pair] != value, "Automated market maker pair is already set to that value");
        automatedMarketMakerPairs[pair] = value;
    }
    function excludeFromFees(address account, bool excluded) public onlyOwner {
        _isExcludedFromFee[account] = excluded;
    }
    function excludeFromMaxTransactionLimit(address account, bool excluded) public onlyOwner {
        _isExcludedFromMaxTxLimit[account] = excluded;
    }
    function excludeFromMaxWalletLimit(address account, bool excluded) public onlyOwner {
        _isExcludedFromMaxWalletLimit[account] = excluded;
    }
    function updateBuyFees(uint16 liquidity, uint16 operations, uint16 burn) public onlyOwner {
        uint16 totalFees = uint16(liquidity) + uint16(operations) + uint16(burn);
        require(totalFees <= 3000, "Total buy fees cannot exceed 30%");
        buyFees.liquidityFee = liquidity;
        buyFees.operationsFee = operations;
        buyFees.burnFee = burn;
        emit FeesUpdated("Buy", liquidity, operations, burn);
    }
    function updateSellFees(uint16 liquidity, uint16 operations, uint16 burn) public onlyOwner {
        uint16 totalFees = uint16(liquidity) + uint16(operations) + uint16(burn);
        require(totalFees <= 3000, "Total sell fees cannot exceed 30%");
        sellFees.liquidityFee = liquidity;
        sellFees.operationsFee = operations;
        sellFees.burnFee = burn;
        emit FeesUpdated("Sell", liquidity, operations, burn);
    }
    function updateWallets(address liquidityWallet, address operationsWallet, address burnWallet) public onlyOwner {
        wallets.liquidityWallet = liquidityWallet;
        wallets.operationsWallet = operationsWallet;
        wallets.burnWallet = burnWallet;
        emit WalletsUpdated(liquidityWallet, operationsWallet, burnWallet);
    }
    function updateLimits(uint256 newMaxWalletAmount, uint256 newMaxTxAmount, uint256 newMinimumTokensBeforeSwap) public onlyOwner {
        limits.maxWalletAmount = newMaxWalletAmount;
        limits.maxTxAmount = newMaxTxAmount;
        limits.minimumTokensBeforeSwap = newMinimumTokensBeforeSwap;
        emit LimitsUpdated(newMaxWalletAmount, newMaxTxAmount, newMinimumTokensBeforeSwap);
    }
    function swapTokensForEth(uint256 tokenAmount) private {
        address[] memory path = new address[](2);
        path[0] = address(this);
        path[1] = uniswapV2Router.WETH();
        _approve(address(this), address(uniswapV2Router), tokenAmount);
        uniswapV2Router.swapExactTokensForETHSupportingFeeOnTransferTokens(
            tokenAmount,
            0,
            path,
            address(this),
            block.timestamp
        );
    }
    function addLiquidity(uint256 tokenAmount, uint256 ethAmount) private {
        _approve(address(this), address(uniswapV2Router), tokenAmount);
        uniswapV2Router.addLiquidityETH{value: ethAmount}(
            address(this),
            tokenAmount,
            0,
            0,
            owner(),
            block.timestamp
        );
    }
    function swapAndLiquify() private lockTheSwap {
        uint256 contractTokenBalance = balanceOf(address(this));
        if(contractTokenBalance >= limits.minimumTokensBeforeSwap) {
            uint256 half = contractTokenBalance / 2;
            uint256 otherHalf = contractTokenBalance - half;
            uint256 initialBalance = address(this).balance;
            swapTokensForEth(half);
            uint256 newBalance = address(this).balance - initialBalance;
            addLiquidity(otherHalf, newBalance);
            emit SwapAndLiquify(half, newBalance, otherHalf);
            super._transfer(address(this), wallets.liquidityWallet, half);  // Transferring to liquidity wallet
            super._transfer(address(this), wallets.operationsWallet, otherHalf);  // Transferring to operations wallet
        }
    }
    function _transfer(address from, address to, uint256 amount) internal override {
        require(from != address(0) && to != address(0), "ERC20: transfer to/from the zero address");
        bool isBuyFromLP = automatedMarketMakerPairs[from];
        bool isSellToLP = automatedMarketMakerPairs[to];
        bool isExempted = _isExcludedFromFee[from] || _isExcludedFromFee[to];
        if (!isExempted) {
            if (!_isExcludedFromMaxTxLimit[from] && !_isExcludedFromMaxTxLimit[to]) {
                require(amount <= limits.maxTxAmount, "Transfer amount exceeds the maxTxAmount");
            }
            if (!_isExcludedFromMaxWalletLimit[to]) {
                require(balanceOf(to) + amount <= limits.maxWalletAmount, "Recipient balance exceeds max wallet amount");
            }
            uint256 totalFee = _adjustTaxes(isBuyFromLP, isSellToLP, amount);
            uint256 burnFee = _calculateFee(amount, isBuyFromLP ? buyFees.burnFee : sellFees.burnFee); 
            uint256 transferAmount = amount - totalFee;
            super._transfer(from, wallets.burnWallet, burnFee);  
            super._transfer(from, address(this), totalFee - burnFee);  
            amount = transferAmount;
        }
        super._transfer(from, to, amount);
        if (balanceOf(address(this)) > limits.minimumTokensBeforeSwap) {
            swapAndLiquify();
        }
    }
    function _calculateFee(uint256 amount, uint256 feeRate) private pure returns (uint256) {
        return amount * feeRate / 10000;  // Assuming feeRate is expressed in basis points
    }
    function _adjustTaxes(bool isBuyFromLP, bool isSellToLP, uint256 amount) private view returns (uint256 totalFee) {
        FeeData memory currentFees;
        if (isBuyFromLP) {
            currentFees = buyFees;  // Use buy fees if the transaction is a buy from LP
        } else if (isSellToLP) {
            currentFees = sellFees;  // Use sell fees if the transaction is a sell to LP
        } else {
            currentFees = sellFees;  // Default to sell fees for other types of transfers
        }
        uint256 liquidityFee = _calculateFee(amount, uint256(currentFees.liquidityFee));
        uint256 operationsFee = _calculateFee(amount, uint256(currentFees.operationsFee));
        uint256 burnFee = _calculateFee(amount, uint256(currentFees.burnFee));
        totalFee = liquidityFee + operationsFee + burnFee;
        return totalFee;
    }
    // Function to Withdraw Coins sent by mistake to the Token Contract Address.
    // Only the Contract owner can withdraw the Coins.
    function withdrawCoins() public onlyOwner {
        payable(msg.sender).transfer(address(this).balance);
    }
    // Function to Withdraw Tokens sent by mistake to the Token Contract Address.
    // This function excludes the ability to withdraw tokens dedicated to fees.
    // Only the Contract owner can withdraw the Tokens, and not the tokens collected as fees.
    function withdrawTokens(address tokenAddress, uint256 tokenAmount) public virtual onlyOwner {
        require(tokenAddress != address(this), "Cannot withdraw this token: Fee tokens are protected");
        IERC20(tokenAddress).transfer(owner(), tokenAmount);
    }
}