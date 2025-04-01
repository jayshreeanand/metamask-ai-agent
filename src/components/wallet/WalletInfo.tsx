'use client';

import { useWallet } from '@/hooks/useWallet';
import { format } from 'date-fns';
import { CurrencyDollarIcon, ArrowPathIcon, ArrowUpIcon } from '@heroicons/react/24/outline';

export default function WalletInfo() {
  const { balance, transactions, isLoading, error } = useWallet();

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-lg h-32 animate-pulse" />
        <div className="bg-white rounded-2xl border border-gray-200 shadow-lg h-64 animate-pulse" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 rounded-2xl border border-red-200 p-6 text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {balance && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-blue-50">
              <CurrencyDollarIcon className="w-6 h-6 text-blue-500" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Balance</h2>
          </div>
          <div className="flex items-baseline space-x-2">
            <div className="text-3xl font-bold text-gray-900">
              {parseFloat(balance.balance).toFixed(4)}
            </div>
            <div className="text-lg text-gray-500">{balance.symbol}</div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-blue-50">
            <ArrowPathIcon className="w-6 h-6 text-blue-500" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900">Transactions</h2>
        </div>
        {transactions.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No transactions found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {transactions.map((tx) => (
              <div
                key={tx.hash}
                className="border-b border-gray-200 pb-4 last:border-b-0 last:pb-0"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="text-sm text-gray-500">
                      {format(tx.timestamp * 1000, 'MMM d, yyyy HH:mm')}
                    </div>
                    <div className="font-medium text-gray-900 mt-1">
                      {tx.from.slice(0, 6)}...{tx.from.slice(-4)} →{' '}
                      {tx.to.slice(0, 6)}...{tx.to.slice(-4)}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-blue-600 flex items-center">
                      <ArrowUpIcon className="w-4 h-4 mr-1" />
                      {parseFloat(tx.value).toFixed(4)} ETH
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      Gas: {tx.gasPrice} Gwei
                    </div>
                  </div>
                </div>
                <div className="mt-2">
                  <a
                    href={`https://etherscan.io/tx/${tx.hash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    View on Etherscan →
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