'use client';

import { ArrowPathIcon } from '@heroicons/react/24/outline';
import { useWallet } from '@/hooks/useWallet';

export default function WalletConnect() {
  const { isConnected, address, connect, disconnect, isLoading } = useWallet();

  return (
    <div className="flex items-center space-x-4">
      {isConnected && address ? (
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-300 bg-white/5 px-3 py-1 rounded-lg border border-white/10">
            {address.slice(0, 6)}...{address.slice(-4)}
          </span>
          <button
            onClick={disconnect}
            disabled={isLoading}
            className="bg-red-500/80 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 transition-colors"
          >
            Disconnect
          </button>
        </div>
      ) : (
        <button
          onClick={connect}
          disabled={isLoading}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 flex items-center space-x-2 disabled:opacity-50 transition-colors"
        >
          {isLoading ? (
            <ArrowPathIcon className="h-5 w-5 animate-spin" />
          ) : (
            <>
              <ArrowPathIcon className="h-5 w-5" />
              <span>Connect Wallet</span>
            </>
          )}
        </button>
      )}
    </div>
  );
} 