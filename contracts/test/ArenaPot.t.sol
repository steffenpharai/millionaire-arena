// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import { Test, console } from "forge-std/Test.sol";
import { MillionToken } from "../src/MillionToken.sol";
import { ArenaPot } from "../src/ArenaPot.sol";

contract ArenaPotTest is Test {
    MillionToken public token;
    ArenaPot public pot;
    address owner = address(1);
    address player1 = address(2);
    address player2 = address(3);
    bytes32 roundId = keccak256("round1");

    function setUp() public {
        ArenaPot potFirst = new ArenaPot(address(0));
        token = new MillionToken(address(potFirst), owner, owner);
        pot = new ArenaPot(address(token));
        vm.prank(owner);
        token.setPotAddress(address(pot));
        pot.createRound(roundId); // pot owner is this contract (deployer)
        uint256 supply = token.balanceOf(owner);
        vm.prank(owner);
        token.transfer(player1, supply / 2);
        vm.prank(owner);
        token.transfer(player2, supply / 2);
    }

    function test_StakeAndSettle() public {
        vm.prank(player1);
        token.approve(address(pot), 100 * 10**18);
        vm.prank(player1);
        pot.stake(roundId, 100 * 10**18);
        (uint256 totalStaked,, uint256 count,, bool settled) = pot.getRound(roundId);
        assertEq(totalStaked, 100 * 10**18);
        assertEq(count, 1);
        assertFalse(settled);

        pot.settleAndClaim(roundId, player1); // pot owner is this contract
        (,,, address winnerAddr, bool settledFlag) = pot.getRound(roundId);
        assertTrue(settledFlag);
        assertEq(winnerAddr, player1);
    }
}
