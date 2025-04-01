'use client';

import { useState } from 'react';
import { PaperAirplaneIcon, SparklesIcon, ChatBubbleBottomCenterTextIcon, ShieldCheckIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline';
import WalletConnect from '@/components/wallet/WalletConnect';
import WalletInfo from '@/components/wallet/WalletInfo';
import { useWallet } from '@/hooks/useWallet';
import { useAI } from '@/services/ai';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function Home() {
  const { isConnected } = useWallet();
  const { processMessage } = useAI();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !isConnected) return;

    const userMessage: Message = {
      role: 'user',
      content: input,
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await processMessage(input);
      const assistantMessage: Message = {
        role: 'assistant',
        content: response.content,
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error processing message:', error);
      const errorMessage: Message = {
        role: 'assistant',
        content: 'Sorry, I encountered an error processing your message. Please try again.',
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <div className="text-center space-y-8">
        <h1 className="text-4xl sm:text-5xl font-bold text-[#24272A]">
          Your Intelligent Crypto Assistant
        </h1>
        <p className="text-xl text-[#535A61] max-w-2xl mx-auto">
          Connect your MetaMask wallet and chat with an AI that understands your crypto needs
        </p>
        <div className="flex justify-center">
          <WalletConnect />
        </div>
      </div>

      {/* Features Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-lg">
          <div className="flex items-center space-x-3 mb-4">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-[#037DD6]/10">
              <ChatBubbleBottomCenterTextIcon className="w-6 h-6 text-[#037DD6]" />
            </div>
            <h3 className="text-lg font-semibold text-[#24272A]">Natural Conversations</h3>
          </div>
          <p className="text-[#535A61]">Chat naturally about your crypto portfolio, transactions, and get real-time insights</p>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-lg">
          <div className="flex items-center space-x-3 mb-4">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-[#037DD6]/10">
              <ShieldCheckIcon className="w-6 h-6 text-[#037DD6]" />
            </div>
            <h3 className="text-lg font-semibold text-[#24272A]">Secure Integration</h3>
          </div>
          <p className="text-[#535A61]">Direct and secure integration with your MetaMask wallet for real-time data</p>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-lg">
          <div className="flex items-center space-x-3 mb-4">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-[#037DD6]/10">
              <CurrencyDollarIcon className="w-6 h-6 text-[#037DD6]" />
            </div>
            <h3 className="text-lg font-semibold text-[#24272A]">Token Management</h3>
          </div>
          <p className="text-[#535A61]">View balances, track transactions, and manage your tokens with ease</p>
        </div>
      </div>

      {/* Chat Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-[#037DD6]/10">
                <SparklesIcon className="w-6 h-6 text-[#037DD6]" />
              </div>
              <h2 className="text-2xl font-semibold text-[#24272A]">AI Assistant</h2>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 shadow-lg">
            <div className="p-6">
              <div className="h-[400px] flex flex-col">
                <div className="flex-1 overflow-y-auto space-y-4 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent pr-4">
                  {!isConnected ? (
                    <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                      <div className="w-16 h-16 rounded-full bg-[#037DD6]/10 flex items-center justify-center">
                        <SparklesIcon className="w-8 h-8 text-[#037DD6]" />
                      </div>
                      <div>
                        <p className="text-lg font-medium text-[#24272A]">Connect your wallet to start!</p>
                        <p className="text-sm text-[#535A61] mt-1">Use the connect button above to get started</p>
                      </div>
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                      <div className="w-16 h-16 rounded-full bg-[#037DD6]/10 flex items-center justify-center">
                        <SparklesIcon className="w-8 h-8 text-[#037DD6]" />
                      </div>
                      <div>
                        <p className="text-lg font-medium text-[#24272A]">Start a conversation!</p>
                        <p className="text-sm text-[#535A61] mt-1">Ask about your wallet balance or transactions</p>
                      </div>
                    </div>
                  ) : (
                    messages.map((message, index) => (
                      <div
                        key={index}
                        className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[80%] rounded-2xl px-6 py-4 ${
                            message.role === 'user'
                              ? 'bg-[#037DD6] text-white'
                              : 'bg-[#F2F4F6] text-[#24272A]'
                          }`}
                        >
                          {message.content}
                        </div>
                      </div>
                    ))
                  )}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-[#F2F4F6] rounded-2xl px-6 py-4">
                        <div className="flex space-x-2">
                          <div className="w-2 h-2 bg-[#037DD6] rounded-full animate-bounce" />
                          <div className="w-2 h-2 bg-[#037DD6] rounded-full animate-bounce delay-150" />
                          <div className="w-2 h-2 bg-[#037DD6] rounded-full animate-bounce delay-300" />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div className="mt-6">
                  <form onSubmit={handleSendMessage} className="flex space-x-4">
                    <input
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder={isConnected ? "Ask about your wallet..." : "Connect wallet to chat"}
                      className="flex-1 bg-[#F2F4F6] border border-gray-200 rounded-xl px-6 py-3 text-[#24272A] placeholder-[#535A61] focus:outline-none focus:ring-2 focus:ring-[#037DD6] focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={!isConnected}
                    />
                    <button
                      type="submit"
                      disabled={!input.trim() || isLoading || !isConnected}
                      className="bg-[#037DD6] text-white rounded-xl px-6 py-3 hover:bg-[#0376C9] focus:outline-none focus:ring-2 focus:ring-[#037DD6] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <PaperAirplaneIcon className="w-5 h-5" />
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <WalletInfo />
        </div>
      </div>
    </div>
  );
}
