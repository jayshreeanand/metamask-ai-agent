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
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} min-h-screen bg-gradient-to-br from-gray-50 to-gray-100`}>
        <MetaMaskProvider>
          <div className="min-h-screen flex flex-col">
            <nav className="border-b border-gray-200 bg-white/80 backdrop-blur-xl sticky top-0 z-50">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-blue-50 text-blue-500">
                      <WalletIcon className="w-6 h-6" />
                    </div>
                    <h1 className="text-xl font-semibold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                      MetaMask AI Agent
                    </h1>
                  </div>
                </div>
              </div>
            </nav>
            <main className="flex-1 container mx-auto px-4 py-8 sm:px-6 lg:px-8">
              {children}
            </main>
          </div>
        </MetaMaskProvider>
      </body>
    </html>
  );
}
