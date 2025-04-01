import { ethers } from 'ethers';

export interface Transaction {
  hash: string;
  from: string;
  to: string;
  value: string;
  timestamp: number;
  gasPrice: string;
  gasUsed: string;
  type: 'send' | 'receive';
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
      const blockNumber = await this.provider.getBlockNumber();
      const block = await this.provider.getBlock(blockNumber);
      const transactions: Transaction[] = [];

      if (!block.transactions.length) {
        return transactions;
      }

      for (const txHash of block.transactions) {
        const tx = await this.provider.getTransaction(txHash);
        if (!tx || (!tx.from && !tx.to)) continue;

        if (tx.from.toLowerCase() === address.toLowerCase() || 
            (tx.to && tx.to.toLowerCase() === address.toLowerCase())) {
          transactions.push({
            hash: tx.hash,
            from: tx.from,
            to: tx.to || '',
            value: ethers.utils.formatEther(tx.value),
            timestamp: block.timestamp,
            gasPrice: ethers.utils.formatUnits(tx.gasPrice || 0, 'gwei'),
            gasUsed: tx.gasLimit.toString(),
            type: tx.from.toLowerCase() === address.toLowerCase() ? 'send' : 'receive'
          });
        }
      }

      return transactions;
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