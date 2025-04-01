'use client';

import { ArrowPathIcon } from '@heroicons/react/24/outline';
import { useWallet } from '@/hooks/useWallet';

export default function WalletConnect() {
  const { isConnected, address, connect, disconnect, isLoading } = useWallet();

  return (
    <div className="flex items-center space-x-4">
      {isConnected && address ? (
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">
            {address.slice(0, 6)}...{address.slice(-4)}
          </span>
          <button
            onClick={disconnect}
            disabled={isLoading}
            className="bg-red-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50"
          >
            Disconnect
          </button>
        </div>
      ) : (
        <button
          onClick={connect}
          disabled={isLoading}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center space-x-2 disabled:opacity-50"
        >
          <ArrowPathIcon className="h-5 w-5" />
          <span>Connect Wallet</span>
        </button>
      )}
    </div>
  );
} 