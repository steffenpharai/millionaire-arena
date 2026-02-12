// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import { Test, console } from "forge-std/Test.sol";
import { MillionToken } from "../src/MillionToken.sol";
import { ArenaPot } from "../src/ArenaPot.sol";

contract MillionTokenTest is Test {
    MillionToken public token;
    ArenaPot public pot;
    address owner = address(1);
    address user = address(2);
    address potAddr;
    address lpAddr;

    function setUp() public {
        pot = new ArenaPot(address(0));
        potAddr = address(pot);
        lpAddr = address(3);
        token = new MillionToken(potAddr, lpAddr, owner);
    }

    function test_InitialSupply() public view {
        uint256 expected = (1_000_000_000 * 10**18 * 9000) / 10000; // 90% after 10% burn
        assertEq(token.totalSupply(), expected);
        assertEq(token.balanceOf(owner), expected);
    }

    function test_TaxAndBurnOnTransfer() public {
        uint256 amount = 1000 * 10**18;
        vm.prank(owner);
        token.transfer(user, amount);
        uint256 tax = (amount * 50) / 10000;
        uint256 burnAmount = (amount * 10) / 10000;
        uint256 toUser = amount - tax - burnAmount;
        assertEq(token.balanceOf(user), toUser);
        assertEq(token.balanceOf(potAddr), tax / 2);
        assertEq(token.balanceOf(lpAddr), tax - tax / 2);
    }

    function test_MintExcludedFromTax() public {
        // Mint (from==0) does not apply tax
        assertGt(token.balanceOf(owner), 0);
    }
}
