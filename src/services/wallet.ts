import { ethers } from 'ethers';

// ERC20 ABI for token balance and symbol
const ERC20_ABI = [
  'function balanceOf(address owner) view returns (uint256)',
  'function symbol() view returns (string)',
  'function decimals() view returns (uint8)'
];

// Common tokens by network
const NETWORK_TOKENS: { [chainId: string]: { [symbol: string]: string } } = {
  '0x1': { // Ethereum Mainnet
    'USDT': '0xdac17f958d2ee523a2206206994597c13d831ec7',
    'USDC': '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
    'DAI': '0x6b175474e89094c44da98b954eedeac495271d0f',
    'WETH': '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2'
  },
  '0x89': { // Polygon Mainnet
    'USDT': '0xc2132d05d31c914a87c6611c10748aeb04b58e8f',
    'USDC': '0x2791bca1f2de4661ed88a30c99a7a9449aa84174',
    'DAI': '0x8f3cf7ad23cd3cadbd9735aff958023239c6a063',
    'WMATIC': '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270'
  }
};

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

export interface TokenBalance {
  symbol: string;
  balance: string;
  address: string;
}

export interface WalletBalance {
  address: string;
  balance: string;
  symbol: string;
  tokens: TokenBalance[];
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

  private async getTokenBalance(tokenAddress: string, walletAddress: string): Promise<TokenBalance | null> {
    if (!this.provider) return null;

    try {
      const contract = new ethers.Contract(tokenAddress, ERC20_ABI, this.provider);
      const balance = await contract.balanceOf(walletAddress);
      const symbol = await contract.symbol();
      const decimals = await contract.decimals();

      return {
        symbol,
        balance: ethers.utils.formatUnits(balance, decimals),
        address: tokenAddress
      };
    } catch (error) {
      console.error(`Error fetching token balance for ${tokenAddress}:`, error);
      return null;
    }
  }

  async getBalance(address: string): Promise<WalletBalance> {
    if (!this.provider) {
      throw new Error('Wallet not connected');
    }

    try {
      const balance = await this.provider.getBalance(address);
      const network = await this.provider.getNetwork();
      const chainId = '0x' + network.chainId.toString(16);
      const tokens: TokenBalance[] = [];

      // Get token balances if we're on a supported network
      if (NETWORK_TOKENS[chainId]) {
        const tokenPromises = Object.entries(NETWORK_TOKENS[chainId]).map(
          ([_, tokenAddress]) => this.getTokenBalance(tokenAddress, address)
        );
        const tokenBalances = await Promise.all(tokenPromises);
        tokens.push(...tokenBalances.filter((balance): balance is TokenBalance => balance !== null));
      }

      return {
        address,
        balance: ethers.utils.formatEther(balance),
        symbol: 'ETH',
        tokens
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