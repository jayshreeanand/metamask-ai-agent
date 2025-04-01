import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import MetaMaskProvider from "@/components/providers/MetaMaskProvider";
import { WalletIcon } from "@heroicons/react/24/outline";

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
        <MetaMaskProvider>
          <div className="min-h-screen bg-gray-900">
            <nav className="bg-gray-800 border-b border-gray-700">
              <div className="max-w-7xl mx-auto px-4">
                <div className="flex h-16 items-center justify-between">
                  <div className="flex items-center gap-2">
                    <WalletIcon className="h-8 w-8 text-blue-500" />
                    <h1 className="text-xl font-bold text-white">MetaMask AI Agent</h1>
                  </div>
                </div>
              </div>
            </nav>
            <main className="max-w-7xl mx-auto p-4">
              {children}
            </main>
          </div>
        </MetaMaskProvider>
      </body>
    </html>
  );
}
