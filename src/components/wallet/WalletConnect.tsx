'use client';

import { ArrowPathIcon } from '@heroicons/react/24/outline';
import { useWallet } from '@/hooks/useWallet';

export default function WalletConnect() {
  const { isConnected, address, connect, disconnect, isLoading } = useWallet();

  return (
    <div className="flex items-center space-x-4">
      {isConnected && address ? (
        <div className="flex items-center space-x-3">
          <div className="px-4 py-2 rounded-xl bg-gray-100 border border-gray-200 text-sm text-gray-600">
            {address.slice(0, 6)}...{address.slice(-4)}
          </div>
          <button
            onClick={disconnect}
            disabled={isLoading}
            className="bg-red-500 text-white px-4 py-2 rounded-xl text-sm hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 transition-colors"
          >
            Disconnect
          </button>
        </div>
      ) : (
        <button
          onClick={connect}
          disabled={isLoading}
          className="bg-blue-500 text-white px-6 py-2 rounded-xl hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center space-x-2 disabled:opacity-50 transition-colors"
        >
          {isLoading ? (
            <ArrowPathIcon className="w-5 h-5 animate-spin" />
          ) : (
            <>
              <ArrowPathIcon className="w-5 h-5" />
              <span>Connect Wallet</span>
            </>
          )}
        </button>
      )}
    </div>
  );
} 