import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { MetaMaskProvider } from "@metamask/sdk-react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MetaMask AI Agent",
  description: "Your conversational wallet manager powered by AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <MetaMaskProvider
          debug={false}
          sdkOptions={{
            dappMetadata: {
              name: "MetaMask AI Agent",
              url: typeof window !== "undefined" ? window.location.href : "",
            },
          }}
        >
          <div className="min-h-screen bg-gray-100">
            <nav className="bg-white shadow-lg">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                  <div className="flex items-center">
                    <h1 className="text-xl font-bold text-gray-800">MetaMask AI Agent</h1>
                  </div>
                </div>
              </div>
            </nav>
            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
              {children}
            </main>
          </div>
        </MetaMaskProvider>
      </body>
    </html>
  );
}
