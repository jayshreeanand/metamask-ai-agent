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
      if (typeof window !== 'undefined' && window.ethereum?.selectedAddress) {
        setAddress(window.ethereum.selectedAddress);
        setIsConnected(true);
        await fetchBalance(window.ethereum.selectedAddress);
        await fetchTransactions(window.ethereum.selectedAddress);
      }
    };

    checkConnection();
  }, []);

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