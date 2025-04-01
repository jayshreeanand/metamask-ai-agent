import { ethers } from 'ethers';

export interface Transaction {
  hash: string;
  from: string;
  to: string;
  value: string;
  timestamp: number;
  gasPrice: string;
  gasUsed: string;
}

export interface WalletBalance {
  address: string;
  balance: string;
  symbol: string;
}

export interface TransactionResponse {
  hash: string;
  from: string;
  to: string;
  value: ethers.BigNumber;
  gasPrice: ethers.BigNumber;
  gasLimit: ethers.BigNumber;
}

export class WalletService {
  private provider: ethers.providers.Web3Provider | null = null;

  constructor() {
    if (typeof window !== 'undefined' && window.ethereum) {
      this.provider = new ethers.providers.Web3Provider(window.ethereum);
    }
  }

  async connect(): Promise<string> {
    if (!this.provider) {
      throw new Error('MetaMask not installed');
    }

    try {
      await this.provider.send('eth_requestAccounts', []);
      const signer = this.provider.getSigner();
      return await signer.getAddress();
    } catch (error) {
      console.error('Error connecting to MetaMask:', error);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    // MetaMask doesn't have a true disconnect method
    // We'll just clear the provider
    this.provider = null;
  }

  async getBalance(address: string): Promise<WalletBalance> {
    if (!this.provider) {
      throw new Error('Wallet not connected');
    }

    try {
      const balance = await this.provider.getBalance(address);
      return {
        address,
        balance: ethers.utils.formatEther(balance),
        symbol: 'ETH',
      };
    } catch (error) {
      console.error('Error getting balance:', error);
      throw error;
    }
  }

  async getTransactions(address: string): Promise<Transaction[]> {
    if (!this.provider) {
      throw new Error('Wallet not connected');
    }

    try {
      // Note: This is a simplified version. In a real app, you'd want to use
      // a service like Etherscan API to get transaction history
      const blockNumber = await this.provider.getBlockNumber();
      const block = await this.provider.getBlock(blockNumber);
      
      if (!block.transactions) {
        return [];
      }

      return block.transactions
        .filter((tx): tx is TransactionResponse => 
          typeof tx !== 'string' && 
          (tx.from === address || tx.to === address)
        )
        .map(tx => ({
          hash: tx.hash,
          from: tx.from,
          to: tx.to,
          value: ethers.utils.formatEther(tx.value),
          timestamp: block.timestamp,
          gasPrice: ethers.utils.formatUnits(tx.gasPrice, 'gwei'),
          gasUsed: tx.gasLimit.toString(),
        }));
    } catch (error) {
      console.error('Error getting transactions:', error);
      throw error;
    }
  }

  async sendTransaction(to: string, amount: string): Promise<string> {
    if (!this.provider) {
      throw new Error('Wallet not connected');
    }

    try {
      const signer = this.provider.getSigner();
      const tx = await signer.sendTransaction({
        to,
        value: ethers.utils.parseEther(amount),
      });
      return tx.hash;
    } catch (error) {
      console.error('Error sending transaction:', error);
      throw error;
    }
  }
} 