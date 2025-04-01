'use client';

import { useWallet } from '@/hooks/useWallet';
import { format } from 'date-fns';
import { CurrencyDollarIcon, ArrowPathIcon, ArrowUpIcon } from '@heroicons/react/24/outline';

export default function WalletInfo() {
  const { balance, transactions, isLoading, error } = useWallet();

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-32 bg-white/5 rounded-2xl"></div>
        <div className="h-64 bg-white/5 rounded-2xl"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-2xl">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {balance && (
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl border border-white/10 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <CurrencyDollarIcon className="h-6 w-6 text-blue-500" />
            <h2 className="text-lg font-semibold text-white">Wallet Balance</h2>
          </div>
          <div className="text-3xl font-bold text-white">
            {parseFloat(balance.balance).toFixed(4)}
            <span className="text-lg text-gray-400 ml-1">{balance.symbol}</span>
          </div>
        </div>
      )}

      <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl border border-white/10 p-6">
        <div className="flex items-center space-x-3 mb-4">
          <ArrowPathIcon className="h-6 w-6 text-blue-500" />
          <h2 className="text-lg font-semibold text-white">Recent Transactions</h2>
        </div>
        {transactions.length === 0 ? (
          <div className="text-center text-gray-400 py-8">
            <p>No transactions found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {transactions.map((tx) => (
              <div
                key={tx.hash}
                className="border-b border-white/10 pb-4 last:border-b-0 last:pb-0"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="text-sm text-gray-400">
                      {format(tx.timestamp * 1000, 'MMM d, yyyy HH:mm')}
                    </div>
                    <div className="font-medium text-white">
                      {tx.from.slice(0, 6)}...{tx.from.slice(-4)} →{' '}
                      {tx.to.slice(0, 6)}...{tx.to.slice(-4)}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-blue-500 flex items-center">
                      <ArrowUpIcon className="h-4 w-4 mr-1" />
                      {parseFloat(tx.value).toFixed(4)} ETH
                    </div>
                    <div className="text-sm text-gray-400">
                      Gas: {tx.gasPrice} Gwei
                    </div>
                  </div>
                </div>
                <div className="mt-2">
                  <a
                    href={`https://etherscan.io/tx/${tx.hash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    View on Etherscan
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 