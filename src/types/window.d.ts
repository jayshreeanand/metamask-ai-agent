interface Window {
  ethereum?: {
    isMetaMask?: boolean;
    request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
    on: (eventName: string, callback: (params: any) => void) => void;
    removeListener: (eventName: string, callback: (params: any) => void) => void;
    selectedAddress: string | null;
  };
} 