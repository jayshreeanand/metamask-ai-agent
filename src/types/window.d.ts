interface Window {
  ethereum?: {
    isMetaMask?: boolean;
    request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
    on: (eventName: string, callback: (params: unknown) => void) => void;
    removeListener: (eventName: string, callback: (params: unknown) => void) => void;
    selectedAddress: string | null;
  };
} 