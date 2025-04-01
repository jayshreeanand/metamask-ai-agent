import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

export interface AIResponse {
  content: string;
}

export const useAI = () => {
  const processMessage = async (message: string): Promise<AIResponse> => {
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a helpful AI assistant for a MetaMask wallet interface. You can help users understand their wallet balance, transactions, and provide general guidance about cryptocurrency and Web3."
          },
          {
            role: "user",
            content: message
          }
        ],
      });

      return {
        content: completion.choices[0].message.content || "I'm sorry, I couldn't process that request."
      };
    } catch (error) {
      console.error('Error processing message:', error);
      throw error;
    }
  };

  return {
    processMessage
  };
}; 