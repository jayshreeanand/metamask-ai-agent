'use client';

import { useState } from 'react';
import { PaperAirplaneIcon, SparklesIcon } from '@heroicons/react/24/outline';
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
    if (!input.trim()) return;

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
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-blue-50">
              <SparklesIcon className="w-6 h-6 text-blue-500" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900">AI Assistant</h2>
          </div>
          <WalletConnect />
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-lg">
          <div className="p-6">
            <div className="h-[600px] flex flex-col">
              <div className="flex-1 overflow-y-auto space-y-4 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent pr-4">
                {messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                    <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center">
                      <SparklesIcon className="w-8 h-8 text-blue-500" />
                    </div>
                    <div>
                      <p className="text-lg font-medium text-gray-900">Start a conversation!</p>
                      <p className="text-sm text-gray-500 mt-1">Ask about your wallet balance or transactions</p>
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
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-100 text-gray-900'
                        }`}
                      >
                        {message.content}
                      </div>
                    </div>
                  ))
                )}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 rounded-2xl px-6 py-4">
                      <div className="flex space-x-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-150" />
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-300" />
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
                    placeholder="Ask about your wallet..."
                    className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-6 py-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={!isConnected}
                  />
                  <button
                    type="submit"
                    disabled={!input.trim() || isLoading || !isConnected}
                    className="bg-blue-500 text-white rounded-xl px-6 py-3 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
  );
}
