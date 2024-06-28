// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract Assessment {
    address payable public owner;
    uint256 public balance;
    bool public isFrozen;
    uint256 public minimumBalance;

    event Deposit(uint256 amount);
    event Withdraw(uint256 amount);
    event ContractFrozen();
    event ContractUnfrozen();
    event MinimumBalanceSet(uint256 newMinimumBalance);

    constructor(uint initBalance) payable {
        owner = payable(msg.sender);
        balance = initBalance;
        isFrozen = false;
        minimumBalance = 0;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "You are not the owner of this account");
        _;
    }

    modifier notFrozen() {
        require(!isFrozen, "Contract is frozen");
        _;
    }

    function getBalance() public view returns (uint256) {
        return balance;
    }

    function deposit(uint256 _amount) public payable onlyOwner notFrozen {
        uint256 _previousBalance = balance;

        balance += _amount;

        assert(balance == _previousBalance + _amount);

        emit Deposit(_amount);
    }

    error InsufficientBalance(uint256 balance, uint256 withdrawAmount);

    function withdraw(uint256 _withdrawAmount) public onlyOwner notFrozen {
        require(balance >= minimumBalance, "Balance is below minimum");
        uint256 _previousBalance = balance;
        if (balance < _withdrawAmount) {
            revert InsufficientBalance({
                balance: balance,
                withdrawAmount: _withdrawAmount
            });
        }

        balance -= _withdrawAmount;

        assert(balance == (_previousBalance - _withdrawAmount));

        emit Withdraw(_withdrawAmount);
    }

    function freezeContract() public onlyOwner {
        isFrozen = true;
        emit ContractFrozen();
    }

    function unfreezeContract() public onlyOwner {
        isFrozen = false;
        emit ContractUnfrozen();
    }

    function setMinimumBalance(uint256 _minimumBalance) public onlyOwner {
        minimumBalance = _minimumBalance;
        emit MinimumBalanceSet(_minimumBalance);
    }
}
