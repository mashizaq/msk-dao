// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title MSKGovernanceToken
 * @dev Soulbound token (ERC-4973) for MSK DAO governance
 * Contribution credits are non-transferable
 */
contract MSKGovernanceToken is ERC721, Ownable {
    struct ContributionRecord {
        uint256 credits;
        uint256 lastUpdated;
        string contributionType;
    }

    mapping(address => ContributionRecord) public contributions;
    mapping(address => bool) public hasToken;
    uint256 private tokenIdCounter;

    event ContributionRecorded(address indexed contributor, uint256 credits, string contributionType);
    event SoulboundMinted(address indexed recipient, uint256 tokenId);

    constructor() ERC721("MSK Governance Token", "MSKG") {}

    /**
     * @dev Record a contribution and mint soulbound token if eligible
     */
    function recordContribution(
        address contributor,
        uint256 credits,
        string memory contributionType
    ) external onlyOwner {
        contributions[contributor].credits += credits;
        contributions[contributor].lastUpdated = block.timestamp;
        contributions[contributor].contributionType = contributionType;

        if (!hasToken[contributor]) {
            _mintSoulbound(contributor);
        }

        emit ContributionRecorded(contributor, credits, contributionType);
    }

    /**
     * @dev Internal function to mint soulbound token
     */
    function _mintSoulbound(address recipient) private {
        require(!hasToken[recipient], "User already has token");
        
        uint256 tokenId = tokenIdCounter++;
        _safeMint(recipient, tokenId);
        hasToken[recipient] = true;

        emit SoulboundMinted(recipient, tokenId);
    }

    /**
     * @dev Override transfer functions to prevent transfers (soulbound)
     */
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId,
        uint256 batchSize
    ) internal override {
        require(from == address(0), "Token is non-transferable");
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
    }

    /**
     * @dev Get voting power (quadratic voting: sqrt(credits))
     */
    function getVotingPower(address contributor) external view returns (uint256) {
        return _sqrt(contributions[contributor].credits);
    }

    /**
     * @dev Get contribution credits
     */
    function getCredits(address contributor) external view returns (uint256) {
        return contributions[contributor].credits;
    }

    /**
     * @dev Internal sqrt function
     */
    function _sqrt(uint256 x) private pure returns (uint256) {
        if (x == 0) return 0;
        uint256 z = (x + 1) / 2;
        uint256 y = x;
        while (z < y) {
            y = z;
            z = (x / z + z) / 2;
        }
        return y;
    }
}
