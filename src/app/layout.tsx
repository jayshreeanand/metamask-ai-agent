import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import MetaMaskProvider from "@/components/providers/MetaMaskProvider";
import { WalletIcon } from "@heroicons/react/24/outline";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MetaMask Assist AI",
  description: "Your intelligent crypto companion powered by AI",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} min-h-screen bg-white`}>
        <MetaMaskProvider>
          <div className="min-h-screen flex flex-col">
            <nav className="border-b border-gray-200 bg-white sticky top-0 z-50">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-[#037DD6] text-white">
                      <WalletIcon className="w-6 h-6" />
                    </div>
                    <h1 className="text-xl font-semibold bg-gradient-to-r from-[#037DD6] to-[#1098FC] bg-clip-text text-transparent">
                      MetaMask Assist AI
                    </h1>
                  </div>
                </div>
              </div>
            </nav>
            <main className="flex-1 container mx-auto px-4 py-8 sm:px-6 lg:px-8">
              {children}
            </main>
            <footer className="border-t border-gray-200 bg-white py-8">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center text-sm text-[#037DD6]">
                  Powered by MetaMask and OpenAI
                </div>
              </div>
            </footer>
          </div>
        </MetaMaskProvider>
      </body>
    </html>
  );
}
