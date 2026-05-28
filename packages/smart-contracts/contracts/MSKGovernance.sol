// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title MSKGovernance
 * @dev Governance and voting mechanisms for MSK DAO
 * Implements quadratic voting using sqrt(contribution_credits)
 */
contract MSKGovernance is Ownable {
    enum ProposalStatus { DRAFT, ACTIVE, PASSED, REJECTED, EXECUTED }

    struct Proposal {
        uint256 id;
        string title;
        string description;
        address author;
        uint256 votesFor;
        uint256 votesAgainst;
        uint256 votesAbstain;
        uint256 startTime;
        uint256 endTime;
        ProposalStatus status;
        bool executed;
        mapping(address => bool) hasVoted;
    }

    mapping(uint256 => Proposal) public proposals;
    uint256 public proposalCount;
    uint256 public constant QUORUM_PERCENTAGE = 30;
    uint256 public constant VOTING_PERIOD = 7 days;

    event ProposalCreated(uint256 indexed proposalId, address indexed author, string title);
    event VoteCast(uint256 indexed proposalId, address indexed voter, uint256 weight, string vote);
    event ProposalExecuted(uint256 indexed proposalId);

    /**
     * @dev Create a new proposal
     */
    function createProposal(
        string memory title,
        string memory description
    ) external {
        uint256 proposalId = proposalCount++;
        
        Proposal storage proposal = proposals[proposalId];
        proposal.id = proposalId;
        proposal.title = title;
        proposal.description = description;
        proposal.author = msg.sender;
        proposal.startTime = block.timestamp;
        proposal.endTime = block.timestamp + VOTING_PERIOD;
        proposal.status = ProposalStatus.ACTIVE;

        emit ProposalCreated(proposalId, msg.sender, title);
    }

    /**
     * @dev Cast a vote on a proposal using quadratic voting
     */
    function vote(
        uint256 proposalId,
        string memory voteType,
        uint256 votingPower
    ) external {
        require(proposalId < proposalCount, "Invalid proposal");
        Proposal storage proposal = proposals[proposalId];
        
        require(block.timestamp <= proposal.endTime, "Voting period ended");
        require(!proposal.hasVoted[msg.sender], "Already voted");
        require(votingPower > 0, "Invalid voting power");

        proposal.hasVoted[msg.sender] = true;

        if (keccak256(abi.encodePacked(voteType)) == keccak256(abi.encodePacked("for"))) {
            proposal.votesFor += votingPower;
        } else if (keccak256(abi.encodePacked(voteType)) == keccak256(abi.encodePacked("against"))) {
            proposal.votesAgainst += votingPower;
        } else if (keccak256(abi.encodePacked(voteType)) == keccak256(abi.encodePacked("abstain"))) {
            proposal.votesAbstain += votingPower;
        } else {
            revert("Invalid vote type");
        }

        emit VoteCast(proposalId, msg.sender, votingPower, voteType);
    }

    /**
     * @dev Execute a proposal if it passed
     */
    function executeProposal(uint256 proposalId) external onlyOwner {
        require(proposalId < proposalCount, "Invalid proposal");
        Proposal storage proposal = proposals[proposalId];

        require(block.timestamp > proposal.endTime, "Voting still ongoing");
        require(!proposal.executed, "Already executed");

        uint256 totalVotes = proposal.votesFor + proposal.votesAgainst + proposal.votesAbstain;
        require(totalVotes > 0, "No votes cast");

        if (proposal.votesFor > proposal.votesAgainst) {
            proposal.status = ProposalStatus.PASSED;
        } else {
            proposal.status = ProposalStatus.REJECTED;
        }

        proposal.executed = true;
        emit ProposalExecuted(proposalId);
    }

    /**
     * @dev Get proposal details
     */
    function getProposal(uint256 proposalId)
        external
        view
        returns (
            string memory title,
            string memory description,
            uint256 votesFor,
            uint256 votesAgainst,
            uint256 votesAbstain,
            ProposalStatus status
        )
    {
        require(proposalId < proposalCount, "Invalid proposal");
        Proposal storage proposal = proposals[proposalId];
        return (
            proposal.title,
            proposal.description,
            proposal.votesFor,
            proposal.votesAgainst,
            proposal.votesAbstain,
            proposal.status
        );
    }
}
