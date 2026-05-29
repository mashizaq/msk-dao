import { ethers } from 'ethers';
import * as web3 from '@solana/web3.js';
import axios from 'axios';
import { getBlockchainConfig } from '../../config/blockchain';
import { logger } from '../../utils/logger';

export interface CryptoBalance {
  currency: string;
  balance: number;
  usdValue: number;
  chain: string;
}

export interface CryptoPrice {
  currency: string;
  price: number;
  change24h: number;
  marketCap: number;
}

class CryptoService {
  /**
   * Get prices for all 5 supported cryptocurrencies
   */
  async getPrices(): Promise<CryptoPrice[]> {
    try {
      const response = await axios.get(
        'https://api.coingecko.com/api/v3/simple/price',
        {
          params: {
            ids: 'bitcoin,ethereum,solana,tether,dogecoin',
            vs_currencies: 'usd',
            include_market_cap: true,
            include_24hr_change: true,
          },
        }
      );

      const prices: CryptoPrice[] = [
        {
          currency: 'BTC',
          price: response.data.bitcoin.usd,
          change24h: response.data.bitcoin.usd_24h_change,
          marketCap: response.data.bitcoin.usd_market_cap,
        },
        {
          currency: 'ETH',
          price: response.data.ethereum.usd,
          change24h: response.data.ethereum.usd_24h_change,
          marketCap: response.data.ethereum.usd_market_cap,
        },
        {
          currency: 'SOL',
          price: response.data.solana.usd,
          change24h: response.data.solana.usd_24h_change,
          marketCap: response.data.solana.usd_market_cap,
        },
        {
          currency: 'USDT',
          price: response.data.tether.usd,
          change24h: response.data.tether.usd_24h_change,
          marketCap: response.data.tether.usd_market_cap,
        },
        {
          currency: 'DOGE',
          price: response.data.dogecoin.usd,
          change24h: response.data.dogecoin.usd_24h_change,
          marketCap: response.data.dogecoin.usd_market_cap,
        },
      ];

      return prices;
    } catch (error) {
      logger.error('Error fetching crypto prices:', error);
      throw error;
    }
  }

  /**
   * Get Ethereum balance
   */
  async getEthereumBalance(address: string): Promise<number> {
    try {
      const config = getBlockchainConfig();
      const balance = await config.ethereum.provider.getBalance(address);
      return parseFloat(ethers.formatEther(balance));
    } catch (error) {
      logger.error('Error fetching Ethereum balance:', error);
      throw error;
    }
  }

  /**
   * Get Solana balance
   */
  async getSolanaBalance(publicKey: string): Promise<number> {
    try {
      const config = getBlockchainConfig();
      const pubKey = new web3.PublicKey(publicKey);
      const balance = await config.solana.connection.getBalance(pubKey);
      return balance / web3.LAMPORTS_PER_SOL;
    } catch (error) {
      logger.error('Error fetching Solana balance:', error);
      throw error;
    }
  }

  /**
   * Get token balance (USDT, etc.)
   */
  async getTokenBalance(
    tokenAddress: string,
    walletAddress: string,
    chain: 'ethereum' | 'polygon' | 'base' = 'ethereum'
  ): Promise<number> {
    try {
      const config = getBlockchainConfig();
      const provider = chain === 'ethereum' 
        ? config.ethereum.provider 
        : chain === 'polygon'
        ? config.polygon.provider
        : config.base.provider;

      const ERC20_ABI = [
        'function balanceOf(address owner) view returns (uint256)',
        'function decimals() view returns (uint8)',
      ];

      const contract = new ethers.Contract(tokenAddress, ERC20_ABI, provider);
      const balance = await contract.balanceOf(walletAddress);
      const decimals = await contract.decimals();
      
      return parseFloat(ethers.formatUnits(balance, decimals));
    } catch (error) {
      logger.error('Error fetching token balance:', error);
      throw error;
    }
  }

  /**
   * Convert crypto to USD
   */
  async convertToUSD(amount: number, currency: string): Promise<number> {
    try {
      const prices = await this.getPrices();
      const priceData = prices.find(p => p.currency === currency);
      
      if (!priceData) {
        throw new Error(`Price data not found for ${currency}`);
      }

      return amount * priceData.price;
    } catch (error) {
      logger.error('Error converting to USD:', error);
      throw error;
    }
  }

  /**
   * Send Ethereum transaction
   */
  async sendEthereumTransaction(
    toAddress: string,
    amount: string
  ): Promise<string> {
    try {
      const config = getBlockchainConfig();
      if (!config.ethereum.signer) {
        throw new Error('Signer not configured');
      }

      const tx = await config.ethereum.signer.sendTransaction({
        to: toAddress,
        value: ethers.parseEther(amount),
      });

      const receipt = await tx.wait();
      return receipt?.hash || tx.hash;
    } catch (error) {
      logger.error('Error sending Ethereum transaction:', error);
      throw error;
    }
  }

  /**
   * Send Solana transaction
   */
  async sendSolanaTransaction(
    toPublicKey: string,
    amount: number
  ): Promise<string> {
    try {
      const config = getBlockchainConfig();
      if (!config.solana.keypair) {
        throw new Error('Keypair not configured');
      }

      const fromPubkey = config.solana.keypair.publicKey;
      const toPubkey = new web3.PublicKey(toPublicKey);

      const instruction = web3.SystemProgram.transfer({
        fromPubkey,
        toPubkey,
        lamports: amount * web3.LAMPORTS_PER_SOL,
      });

      const message = new web3.TransactionMessage({
        payerKey: fromPubkey,
        recentBlockhash: (await config.solana.connection.getLatestBlockhash()).blockhash,
        instructions: [instruction],
      });

      const transaction = new web3.VersionedTransaction(message.compileToV0Message());
      transaction.sign([config.solana.keypair]);

      const txid = await config.solana.connection.sendTransaction(transaction);
      return txid;
    } catch (error) {
      logger.error('Error sending Solana transaction:', error);
      throw error;
    }
  }
}

export const cryptoService = new CryptoService();
