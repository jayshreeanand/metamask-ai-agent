import { useState, useEffect } from 'react';
import { WalletService, Transaction, WalletBalance } from '@/services/wallet';

export function useWallet() {
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState<string | null>(null);
  const [balance, setBalance] = useState<WalletBalance | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const walletService = new WalletService();

  useEffect(() => {
    const checkConnection = async () => {
      try {
        if (typeof window === 'undefined' || !window.ethereum) return;

        const accounts = await window.ethereum.request({ method: 'eth_accounts' }) as string[];
        if (accounts && accounts.length > 0) {
          const currentAddress = accounts[0];
          setAddress(currentAddress);
          setIsConnected(true);
          await fetchBalance(currentAddress);
          await fetchTransactions(currentAddress);
        }
      } catch (err) {
        console.error('Error checking connection:', err);
      }
    };

    const handleAccountsChanged = (accounts: unknown) => {
      const addresses = accounts as string[];
      if (!addresses || addresses.length === 0) {
        // User disconnected
        setAddress(null);
        setIsConnected(false);
        setBalance(null);
        setTransactions([]);
      } else {
        // User switched accounts
        const newAddress = addresses[0];
        setAddress(newAddress);
        setIsConnected(true);
        fetchBalance(newAddress).catch(console.error);
        fetchTransactions(newAddress).catch(console.error);
      }
    };

    const handleChainChanged = () => {
      // Reload the page when chain changes
      window.location.reload();
    };

    // Check initial connection
    checkConnection();

    // Set up event listeners
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);
    }

    // Cleanup event listeners
    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      }
    };
  }, []);

  const fetchBalance = async (address: string) => {
    try {
      const balance = await walletService.getBalance(address);
      setBalance(balance);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch balance');
    }
  };

  const fetchTransactions = async (address: string) => {
    try {
      const txs = await walletService.getTransactions(address);
      setTransactions(txs);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch transactions');
    }
  };

  const connect = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const address = await walletService.connect();
      setAddress(address);
      setIsConnected(true);
      await fetchBalance(address);
      await fetchTransactions(address);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to connect wallet');
    } finally {
      setIsLoading(false);
    }
  };

  const disconnect = async () => {
    try {
      setIsLoading(true);
      setError(null);
      await walletService.disconnect();
      setAddress(null);
      setIsConnected(false);
      setBalance(null);
      setTransactions([]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to disconnect wallet');
    } finally {
      setIsLoading(false);
    }
  };

  const sendTransaction = async (to: string, amount: string) => {
    if (!address) {
      throw new Error('Wallet not connected');
    }

    try {
      setIsLoading(true);
      setError(null);
      const txHash = await walletService.sendTransaction(to, amount);
      await fetchTransactions(address);
      return txHash;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send transaction');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isConnected,
    address,
    balance,
    transactions,
    isLoading,
    error,
    connect,
    disconnect,
    sendTransaction,
    refreshTransactions: () => address && fetchTransactions(address),
  };
} 