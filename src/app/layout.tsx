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
          <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
            <nav className="bg-white/10 backdrop-blur-lg border-b border-white/10">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                  <div className="flex items-center space-x-2">
                    <WalletIcon className="h-8 w-8 text-blue-500" />
                    <h1 className="text-xl font-bold text-white">MetaMask AI Agent</h1>
                  </div>
                </div>
              </div>
            </nav>
            <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
              {children}
            </main>
          </div>
        </MetaMaskProvider>
      </body>
    </html>
  );
}
