import { useWallet } from '@/hooks/useWallet';
import { Transaction } from './wallet';

export interface AIResponse {
  content: string;
  action?: {
    type: 'transaction' | 'balance' | 'transactions';
    data: unknown;
  };
}

export function useAI() {
  const wallet = useWallet();

  const processMessage = async (message: string): Promise<AIResponse> => {
    const lowerMessage = message.toLowerCase();

    // Check for balance queries
    if (lowerMessage.includes('balance') || lowerMessage.includes('how much')) {
      const balance = wallet.balance;
      if (balance) {
        return {
          content: `Your current balance is ${parseFloat(balance.balance).toFixed(4)} ${balance.symbol}`,
          action: {
            type: 'balance',
            data: balance,
          },
        };
      }
      return {
        content: 'Please connect your wallet to check your balance.',
      };
    }

    // Check for transaction queries
    if (lowerMessage.includes('transaction') || lowerMessage.includes('history')) {
      const transactions = wallet.transactions;
      if (transactions.length > 0) {
        return {
          content: `I found ${transactions.length} recent transactions. Here are the details:`,
          action: {
            type: 'transactions',
            data: transactions,
          },
        };
      }
      return {
        content: 'No recent transactions found.',
      };
    }

    // Check for send transaction commands
    if (lowerMessage.includes('send') || lowerMessage.includes('transfer')) {
      const match = message.match(/send (\d+(?:\.\d+)?) eth to (0x[a-fA-F0-9]{40})/i);
      if (match) {
        const [, amount, address] = match;
        try {
          const txHash = await wallet.sendTransaction(address, amount);
          return {
            content: `Transaction sent successfully! Hash: ${txHash}`,
            action: {
              type: 'transaction',
              data: { hash: txHash },
            },
          };
        } catch (error) {
          return {
            content: `Failed to send transaction: ${error instanceof Error ? error.message : 'Unknown error'}`,
          };
        }
      }
      return {
        content: 'Please provide a valid amount and address in the format: "send X ETH to 0x..."',
      };
    }

    // Default response for unknown queries
    return {
      content: 'I can help you with:\n- Checking your balance\n- Viewing transaction history\n- Sending ETH\n\nWhat would you like to do?',
    };
  };

  const analyzeTransactions = async (transactions: Transaction[]): Promise<string> => {
    if (transactions.length === 0) {
      return 'No transactions to analyze.';
    }

    const totalSpent = transactions.reduce((sum, tx) => sum + parseFloat(tx.value), 0);
    const totalGas = transactions.reduce((sum, tx) => sum + parseFloat(tx.gasPrice), 0);
    const uniqueAddresses = new Set(transactions.map(tx => tx.to));

    return `Here's an analysis of your transactions:
- Total amount spent: ${totalSpent.toFixed(4)} ETH
- Total gas fees: ${totalGas.toFixed(4)} Gwei
- Number of unique recipients: ${uniqueAddresses.size}
- Most recent transaction: ${new Date(transactions[0].timestamp * 1000).toLocaleDateString()}`;
  };

  return {
    processMessage,
    analyzeTransactions,
  };
} 