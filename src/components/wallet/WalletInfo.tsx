'use client';

import { useWallet } from '@/hooks/useWallet';
import { format } from 'date-fns';

export default function WalletInfo() {
  const { balance, transactions, isLoading, error } = useWallet();

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 p-4 bg-red-50 rounded-lg">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {balance && (
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Wallet Balance</h2>
          <div className="text-2xl font-bold text-blue-600">
            {parseFloat(balance.balance).toFixed(4)} {balance.symbol}
          </div>
        </div>
      )}

      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Recent Transactions</h2>
        {transactions.length === 0 ? (
          <p className="text-gray-500">No transactions found</p>
        ) : (
          <div className="space-y-4">
            {transactions.map((tx) => (
              <div
                key={tx.hash}
                className="border-b pb-4 last:border-b-0 last:pb-0"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="text-sm text-gray-600">
                      {format(tx.timestamp * 1000, 'MMM d, yyyy HH:mm')}
                    </div>
                    <div className="font-medium">
                      {tx.from.slice(0, 6)}...{tx.from.slice(-4)} →{' '}
                      {tx.to.slice(0, 6)}...{tx.to.slice(-4)}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-blue-600">
                      {parseFloat(tx.value).toFixed(4)} ETH
                    </div>
                    <div className="text-sm text-gray-500">
                      Gas: {tx.gasPrice} Gwei
                    </div>
                  </div>
                </div>
                <div className="mt-2">
                  <a
                    href={`https://etherscan.io/tx/${tx.hash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-500 hover:text-blue-600"
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