import OpenAI from 'openai';
import { WalletService } from './wallet';
import { ethers } from 'ethers';

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

const NETWORK_NAMES: { [key: string]: string } = {
  '0x1': 'Ethereum Mainnet',
  '0x5': 'Goerli Testnet',
  '0xaa36a7': 'Sepolia Testnet',
  '0x89': 'Polygon Mainnet',
  '0x13881': 'Mumbai Testnet'
};

export interface AIResponse {
  content: string;
}

export const useAI = () => {
  const walletService = new WalletService();

  const getNetworkInfo = async (provider: ethers.providers.Web3Provider) => {
    const network = await provider.getNetwork();
    const chainId = '0x' + network.chainId.toString(16);
    return {
      name: NETWORK_NAMES[chainId] || `Unknown Network (${chainId})`,
      chainId: chainId
    };
  };

  const formatBalance = (balance: string): string => {
    const value = parseFloat(balance);
    if (value < 0.00001) {
      return value.toExponential(4);
    }
    return value.toFixed(4);
  };

  const processMessage = async (message: string): Promise<AIResponse> => {
    try {
      let walletContext = '';
      
      if (typeof window !== 'undefined' && window.ethereum) {
        try {
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const accounts = await provider.listAccounts();
          
          if (accounts && accounts.length > 0) {
            const address = accounts[0];
            const balance = await walletService.getBalance(address);
            const transactions = await walletService.getTransactions(address);
            const network = await getNetworkInfo(provider);
            
            const tokenBalances = balance.tokens
              .filter(token => parseFloat(token.balance) > 0)
              .map(token => `${formatBalance(token.balance)} ${token.symbol}`)
              .join('\n                 ');

            walletContext = `
              Current wallet state:
              - Network: ${network.name} (${network.chainId})
              - Address: ${address}
              - Native Balance: ${formatBalance(balance.balance)} ${balance.symbol}
              - Token Balances:
                 ${tokenBalances || 'No token balances found'}
              - Number of recent transactions: ${transactions.length}
              
              Latest transactions:
              ${transactions.slice(0, 3).map(tx => 
                `- ${tx.type === 'send' ? 'Sent' : 'Received'} ${formatBalance(tx.value)} ${balance.symbol}`
              ).join('\n              ')}
            `;
          } else {
            walletContext = 'No wallet is currently connected.';
          }
        } catch (err) {
          console.error('Error getting wallet context:', err);
          walletContext = 'Unable to fetch wallet information. Please ensure your wallet is properly connected.';
        }
      } else {
        walletContext = 'MetaMask is not installed or not accessible.';
      }

      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: `You are a helpful AI assistant for a MetaMask wallet interface. You have direct access to the user's wallet information through the application.
            
            ${walletContext}
            
            When asked about wallet information, use the real data provided above. For questions about sending transactions, explain that they can use the send command with an address and amount. For general crypto questions, provide helpful guidance about Web3 and cryptocurrency.
            
            If the wallet data shows any errors or connection issues, inform the user about the specific problem and guide them to resolve it.`
          },
          {
            role: "user",
            content: message
          }
        ],
      });

      return {
        content: completion.choices[0].message.content || "I'm sorry, I couldn't process that request."
      };
    } catch (error) {
      console.error('Error processing message:', error);
      throw error;
    }
  };

  return {
    processMessage
  };
}; 