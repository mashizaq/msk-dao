import { ethers } from 'ethers';
import { getBlockchainConfig } from '../../config/blockchain';
import { logger } from '../../utils/logger';

class ContractService {
  /**
   * Call contract function (read-only)
   */
  async callContractFunction(
    contractAddress: string,
    abi: any[],
    functionName: string,
    args: any[] = []
  ): Promise<any> {
    try {
      const config = getBlockchainConfig();
      const contract = new ethers.Contract(
        contractAddress,
        abi,
        config.ethereum.provider
      );

      const result = await contract[functionName](...args);
      return result;
    } catch (error) {
      logger.error('Error calling contract function:', error);
      throw error;
    }
  }

  /**
   * Execute contract function (write)
   */
  async executeContractFunction(
    contractAddress: string,
    abi: any[],
    functionName: string,
    args: any[] = [],
    value: string = '0'
  ): Promise<string> {
    try {
      const config = getBlockchainConfig();
      if (!config.ethereum.signer) {
        throw new Error('Signer not configured');
      }

      const contract = new ethers.Contract(
        contractAddress,
        abi,
        config.ethereum.signer
      );

      const tx = await contract[functionName](...args, { value: ethers.parseEther(value) });
      const receipt = await tx.wait();

      return receipt?.hash || tx.hash;
    } catch (error) {
      logger.error('Error executing contract function:', error);
      throw error;
    }
  }

  /**
   * Get voting power from governance token
   */
  async getVotingPower(userAddress: string, contractAddress: string): Promise<number> {
    try {
      const MSK_GOVERNANCE_ABI = [
        'function getVotingPower(address contributor) external view returns (uint256)',
      ];

      const result = await this.callContractFunction(
        contractAddress,
        MSK_GOVERNANCE_ABI,
        'getVotingPower',
        [userAddress]
      );

      return parseInt(result.toString());
    } catch (error) {
      logger.error('Error getting voting power:', error);
      throw error;
    }
  }

  /**
   * Record contribution to governance token
   */
  async recordContribution(
    userAddress: string,
    credits: number,
    contributionType: string,
    contractAddress: string
  ): Promise<string> {
    try {
      const MSK_GOVERNANCE_ABI = [
        'function recordContribution(address contributor, uint256 credits, string memory contributionType) external',
      ];

      return await this.executeContractFunction(
        contractAddress,
        MSK_GOVERNANCE_ABI,
        'recordContribution',
        [userAddress, credits, contributionType]
      );
    } catch (error) {
      logger.error('Error recording contribution:', error);
      throw error;
    }
  }

  /**
   * Cast vote on governance proposal
   */
  async castVote(
    proposalId: number,
    voteType: 'for' | 'against' | 'abstain',
    votingPower: number,
    contractAddress: string
  ): Promise<string> {
    try {
      const MSK_GOVERNANCE_ABI = [
        'function vote(uint256 proposalId, string memory voteType, uint256 votingPower) external',
      ];

      return await this.executeContractFunction(
        contractAddress,
        MSK_GOVERNANCE_ABI,
        'vote',
        [proposalId, voteType, votingPower]
      );
    } catch (error) {
      logger.error('Error casting vote:', error);
      throw error;
    }
  }

  /**
   * Get treasury balance
   */
  async getTreasuryBalance(currency: string, contractAddress: string): Promise<number> {
    try {
      const MSK_TREASURY_ABI = [
        'function getBalance(string memory currency) external view returns (uint256)',
      ];

      const result = await this.callContractFunction(
        contractAddress,
        MSK_TREASURY_ABI,
        'getBalance',
        [currency]
      );

      return parseInt(result.toString());
    } catch (error) {
      logger.error('Error getting treasury balance:', error);
      throw error;
    }
  }
}

export const contractService = new ContractService();
