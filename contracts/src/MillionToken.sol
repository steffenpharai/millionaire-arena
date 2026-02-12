// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title MillionToken ($MILLION)
 * @dev ERC-20 with 0.5% tax (50% pot, 50% LP), 0.1% per-tx burn, 10% initial burn.
 * Total supply 1B. Skill-based contest token for Millionaire Arena.
 */
contract MillionToken is ERC20, Ownable {
    uint256 public constant MAX_SUPPLY = 1_000_000_000 * 10**18;
    uint256 public constant TAX_BPS = 50; // 0.5%
    uint256 public constant BURN_PER_TX_BPS = 10; // 0.1% per tx
    uint256 public constant POT_SHARE_BPS = 5000; // 50% of tax to pot
    uint256 public constant INITIAL_BURN_BPS = 1000; // 10% at launch

    address public potAddress;
    address public lpAddress;
    bool public taxEnabled = true;

    event TaxSentToPot(uint256 amount);
    event TaxSentToLP(uint256 amount);
    event Burned(uint256 amount);

    constructor(
        address _potAddress,
        address _lpAddress,
        address initialOwner
    ) ERC20("Million Arena", "MILLION") Ownable(initialOwner) {
        potAddress = _potAddress;
        lpAddress = _lpAddress;
        uint256 toMint = MAX_SUPPLY;
        uint256 burnAtLaunch = (toMint * INITIAL_BURN_BPS) / 10000;
        toMint -= burnAtLaunch;
        _mint(initialOwner, toMint);
        emit Burned(burnAtLaunch);
    }

    function setPotAddress(address _pot) external onlyOwner {
        potAddress = _pot;
    }

    function setLPAddress(address _lp) external onlyOwner {
        lpAddress = _lp;
    }

    function setTaxEnabled(bool _enabled) external onlyOwner {
        taxEnabled = _enabled;
    }

    function _update(
        address from,
        address to,
        uint256 amount
    ) internal override {
        if (from == address(0)) {
            super._update(from, to, amount);
            return;
        }
        if (!taxEnabled || (from != address(0) && to != address(0) && amount == 0)) {
            super._update(from, to, amount);
            return;
        }
        uint256 tax = (amount * TAX_BPS) / 10000;
        uint256 burnAmount = (amount * BURN_PER_TX_BPS) / 10000;
        uint256 toTransfer = amount - tax - burnAmount;
        if (burnAmount > 0) {
            super._update(from, address(0), burnAmount);
            emit Burned(burnAmount);
        }
        uint256 toPot = (tax * POT_SHARE_BPS) / 10000;
        uint256 toLP = tax - toPot;
        if (toPot > 0 && potAddress != address(0)) {
            super._update(from, potAddress, toPot);
            emit TaxSentToPot(toPot);
        }
        if (toLP > 0 && lpAddress != address(0)) {
            super._update(from, lpAddress, toLP);
            emit TaxSentToLP(toLP);
        }
        if (toTransfer > 0) {
            super._update(from, to, toTransfer);
        }
    }
}
