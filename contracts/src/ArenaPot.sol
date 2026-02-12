// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title ArenaPot
 * @dev Escrow for arena pots. Stake, contribute, and claim. 20% to winners; gasless-friendly.
 */
contract ArenaPot is ReentrancyGuard, Ownable {
    IERC20 public token;
    uint256 public constant WINNER_SHARE_BPS = 2000; // 20% to winners

    struct Round {
        bytes32 roundId;
        uint256 totalStaked;
        uint256 communityContributed;
        address[] players;
        address winner;
        bool settled;
    }

    mapping(bytes32 => Round) public rounds;
    mapping(bytes32 => mapping(address => uint256)) public stakes;

    event Staked(bytes32 indexed roundId, address indexed user, uint256 amount);
    event Contributed(bytes32 indexed roundId, address indexed user, uint256 amount);
    event Settled(bytes32 indexed roundId, address winner, uint256 winnerShare, uint256 potTotal);
    event RoundCreated(bytes32 indexed roundId);

    constructor(address _token) Ownable(msg.sender) {
        token = IERC20(_token);
    }

    function createRound(bytes32 roundId) external onlyOwner {
        require(rounds[roundId].roundId == bytes32(0), "Round exists");
        rounds[roundId] = Round({
            roundId: roundId,
            totalStaked: 0,
            communityContributed: 0,
            players: new address[](0),
            winner: address(0),
            settled: false
        });
        emit RoundCreated(roundId);
    }

    function stake(bytes32 roundId, uint256 amount) external nonReentrant {
        Round storage r = rounds[roundId];
        require(r.roundId != bytes32(0), "No round");
        require(!r.settled, "Round settled");
        require(amount > 0, "Zero stake");
        require(token.transferFrom(msg.sender, address(this), amount), "Transfer failed");
        if (stakes[roundId][msg.sender] == 0) {
            r.players.push(msg.sender);
        }
        stakes[roundId][msg.sender] += amount;
        r.totalStaked += amount;
        emit Staked(roundId, msg.sender, amount);
    }

    function contributeToPot(bytes32 roundId, uint256 amount) external nonReentrant {
        Round storage r = rounds[roundId];
        require(r.roundId != bytes32(0), "No round");
        require(!r.settled, "Round settled");
        require(amount > 0, "Zero amount");
        require(token.transferFrom(msg.sender, address(this), amount), "Transfer failed");
        r.communityContributed += amount;
        emit Contributed(roundId, msg.sender, amount);
    }

    function settleAndClaim(
        bytes32 roundId,
        address winner
    ) external onlyOwner nonReentrant {
        Round storage r = rounds[roundId];
        require(r.roundId != bytes32(0), "No round");
        require(!r.settled, "Already settled");
        r.winner = winner;
        r.settled = true;
        uint256 potTotal = r.totalStaked + r.communityContributed;
        uint256 winnerShare = (potTotal * WINNER_SHARE_BPS) / 10000;
        if (potTotal > 0 && winner != address(0) && winnerShare > 0) {
            require(token.transfer(winner, winnerShare), "Winner transfer failed");
        }
        emit Settled(roundId, winner, winnerShare, potTotal);
    }

    function getRound(bytes32 roundId) external view returns (
        uint256 totalStaked,
        uint256 communityContributed,
        uint256 playerCount,
        address winner,
        bool settled
    ) {
        Round storage r = rounds[roundId];
        return (
            r.totalStaked,
            r.communityContributed,
            r.players.length,
            r.winner,
            r.settled
        );
    }
}
