'use client';

import { MetaMaskProvider as Provider } from '@metamask/sdk-react';

export default function MetaMaskProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Provider
      debug={false}
      sdkOptions={{
        dappMetadata: {
          name: "MetaMask AI Agent",
          url: typeof window !== "undefined" ? window.location.href : "",
        },
      }}
    >
      {children}
    </Provider>
  );
} 