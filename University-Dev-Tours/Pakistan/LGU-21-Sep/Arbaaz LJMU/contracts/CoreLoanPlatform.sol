// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract CoreLoanPlatform is Ownable {
    using SafeERC20 for IERC20;

    IERC20 public immutable USD;
    IERC20 public immutable BTC;

    uint256 public constant COLLATERAL_RATIO = 150; // 150% collateralization
    uint256 public constant BORROWABLE_RATIO = 80; // 80% of collateral can be borrowed
    uint256 public constant INTEREST_RATE = 5; // 5% interest rate
    uint256 public constant LOAN_DURATION = 30 days;
    uint256 private constant SECONDS_IN_A_DAY = 86400;

    uint256 private totalStaked = 0; //Counter for total staked
    uint256 private totalBorrowed = 0; //Counter for total borrowed

    struct Loan {
        uint256 amount;
        uint256 collateral;
        uint256 timestamp;
        bool active;
    }

    mapping(address => Loan) public loans;
    mapping(address => uint256) public userCollateral;
    mapping(address => uint256) public lenderBalances;

    event LoanTaken(
        address indexed borrower,
        uint256 amount,
        uint256 collateral
    );
    event LoanRepaid(
        address indexed borrower,
        uint256 amount,
        uint256 interest
    );
    event CollateralDeposited(address indexed user, uint256 amount);
    event CollateralWithdrawn(address indexed user, uint256 amount);
    event BTCDeposited(address indexed lender, uint256 amount);
    event BTCWithdrawn(address indexed lender, uint256 amount);

    constructor(address _USD, address _BTC) Ownable(msg.sender) {
        require(
            _USD != address(0) && _BTC != address(0),
            "Invalid token addresses"
        );
        USD = IERC20(_USD);
        BTC = IERC20(_BTC);
    }

    function depositCollateral(uint256 amount) external {
        require(amount > 0, "Amount must be greater than 0");
        USD.safeTransferFrom(msg.sender, address(this), amount);
        userCollateral[msg.sender] += amount;
        emit CollateralDeposited(msg.sender, amount);
    }

    function withdrawCollateral(uint256 amount) external {
        require(amount > 0, "Amount must be greater than 0");
        require(
            userCollateral[msg.sender] >= amount,
            "Insufficient collateral"
        );
        uint256 borrowedAmount = loans[msg.sender].active
            ? loans[msg.sender].amount
            : 0;
        uint256 requiredCollateral = (borrowedAmount * COLLATERAL_RATIO) / 100;
        require(
            userCollateral[msg.sender] - amount >= requiredCollateral,
            "Withdrawal would undercollateralize loan"
        );
        userCollateral[msg.sender] -= amount;
        USD.safeTransfer(msg.sender, amount);
        emit CollateralWithdrawn(msg.sender, amount);
    }

    function borrowBTC(uint256 amount) external {
        require(amount > 0, "Amount must be greater than 0");
        require(
            !loans[msg.sender].active,
            "Existing loan must be repaid first"
        );

        uint256 requiredCollateral = (amount * COLLATERAL_RATIO) / 100;
        require(
            userCollateral[msg.sender] >= requiredCollateral,
            "Insufficient collateral"
        );

        uint256 maxBorrowable = (userCollateral[msg.sender] *
            BORROWABLE_RATIO) / 100;
        require(amount <= maxBorrowable, "Borrow amount exceeds limit");

        require(
            BTC.balanceOf(address(this)) >= amount,
            "Insufficient BTC in contract"
        );

        loans[msg.sender] = Loan(
            amount,
            requiredCollateral,
            block.timestamp,
            true
        );
        BTC.safeTransfer(msg.sender, amount);

        totalBorrowed = totalBorrowed + amount;

        emit LoanTaken(msg.sender, amount, requiredCollateral);
    }

    function getBorrowableAmount(address user) external view returns (uint256) {
        return (userCollateral[user] * BORROWABLE_RATIO) / 100;
    }

    function getUserCollateral(address user) external view returns (uint256) {
        return userCollateral[user];
    }

    function depositBTC(uint256 amount) external {
        require(amount > 0, "Amount must be greater than 0");
        BTC.safeTransferFrom(msg.sender, address(this), amount);
        lenderBalances[msg.sender] += amount;
        totalStaked = totalStaked + amount;
        emit BTCDeposited(msg.sender, amount);
    }

    function withdrawBTC(uint256 amount) external {
        require(amount > 0, "Amount must be greater than 0");
        require(lenderBalances[msg.sender] >= amount, "Insufficient balance");
        lenderBalances[msg.sender] -= amount;
        totalStaked = totalStaked - amount;
        BTC.safeTransfer(msg.sender, amount);
        emit BTCWithdrawn(msg.sender, amount);
    }

    function getUserStaked(address user) external view returns (uint256) {
        return lenderBalances[user];
    }

    function getCurrentApy() external pure returns (uint256) {
        return INTEREST_RATE;
    }

    function repayLoan(address user) external {
        Loan storage loan = loans[user];
        require(loan.active, "No active loan");
        uint256 daysElapsed = (block.timestamp - loan.timestamp) /
            SECONDS_IN_A_DAY;
        require(daysElapsed <= 30, "Loan duration exceeded 30 days");
        uint256 interest = (loan.amount * INTEREST_RATE * daysElapsed) / 36500;
        uint256 totalRepayment = loan.amount + interest;
        BTC.safeTransferFrom(user, address(this), totalRepayment);
        loan.active = false;
        totalBorrowed = totalBorrowed - loan.amount;
        emit LoanRepaid(msg.sender, loan.amount, interest);
    }

    function calculateInterest(address user) external view returns (uint256) {
        Loan storage loan = loans[user];
        if (loan.active) {
            uint256 daysElapsed = (block.timestamp - loan.timestamp) /
                SECONDS_IN_A_DAY;
            uint256 interest = (loan.amount * INTEREST_RATE * daysElapsed) /
                36500;
            return interest;
        } else {
            return 0;
        }
    }

    function getLoanDetails(address borrower)
        external
        view
        returns (Loan memory)
    {
        return loans[borrower];
    }

    function getLenderBalance(address lender) external view returns (uint256) {
        return lenderBalances[lender];
    }

    function getTotalStaked() external view returns (uint256) {
        return totalStaked;
    }

    function getTotalBorrowed() external view returns (uint256) {
        return totalBorrowed;
    }

    function getUserBorrowed(address user) external view returns (uint256) {
        Loan storage loan = loans[user];
        if (loan.active) {
            return loan.amount;
        }
        return 0;
    }
}
