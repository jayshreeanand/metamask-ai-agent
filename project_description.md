MetaMask Assist AI – Your AI-Powered Crypto Wallet Assistant

Overview

The MetaMask Assist AI is an intelligent AI agent that combines MetaMask wallet integration with AI-powered assistance to revolutionize how users interact with their cryptocurrency portfolios. It offers a conversational interface where users can chat with an AI assistant to effortlessly manage their assets, check balances, view transaction history, execute transactions, and analyze portfolio data—all through natural language commands.

---

Objective

The complexity of managing cryptocurrency wallets can be daunting, especially for new users. Traditional interfaces can be cumbersome and unintuitive. MetaMask AI Agent aims to:

- Simplify wallet interactions using natural language queries.
- Enhance user experience through a conversational interface.
- Provide real-time, meaningful insights for better portfolio management.
- Ensure seamless integration with the MetaMask SDK for a smooth user experience.

---

Features

1. Natural Language Interface (AI-Powered Interaction)

- Conversational interface using OpenAI’s GPT-3.5 to process and respond to user queries.
- Supports a wide range of wallet-related queries, such as:
  - “What’s my current ETH balance?”
  - “Show me my recent transactions.”
  - “Send 0.5 ETH to Alice.”
  - “What’s the value of my NFT collection?”
- Processes complex questions like:
  - “What was my highest-value transaction last month?”
  - “Summarize my wallet activity for the last week.”

2. Wallet Integration (MetaMask SDK)

- Seamless integration with MetaMask wallet via MetaMask SDK.
- Real-time balance tracking across all connected accounts.
- Viewing transaction history with filtering options (e.g., token transfers, NFTs, smart contract interactions).
- Network detection and switching.
- Token management (adding/removing tokens, viewing balances).

3. Quick Actions (Streamlined User Experience)

- One-click access to predefined queries for common tasks.
- Suggested questions for users to explore various functionalities.
- Example commands: “What tokens do I hold?”, “Show me my NFTs.”

4. Modern UI/UX (Smooth User Interaction)

- Built with Next.js 14 with App Router for fast rendering and modern routing capabilities.
- Styled using Tailwind CSS for clean, responsive, and aesthetic design.
- Integrated animations and transitions for a polished user experience.
- Mobile and desktop compatibility for accessibility across devices.

---

🔨 Technical Implementation

1. MetaMask SDK Integration

- Implemented wallet connection, transaction handling, and token management through MetaMask SDK.
- Supports multiple networks and account switching.

2. AI Integration (OpenAI GPT-3.5)

- Utilized GPT-3.5 for natural language processing to parse user queries.
- Enhanced with prompt engineering to understand Web3-specific commands.
- Provides contextual responses based on real-time wallet data.

3. Blockchain Interaction (Ethers.js & Etherscan API)

- Ethers.js used for interacting with Ethereum-compatible networks.
- Etherscan API for fetching transaction history and verifying smart contract interactions.

4. Security Considerations

- All wallet interactions are securely handled by MetaMask.
- No private keys or sensitive user data are stored or processed by the application.
- API keys are securely stored in environment variables.

Future Roadmap

- Implement voice interaction support for hands-free wallet management.
- Add security analytics to detect risky transactions before execution.
- Expand analytics with data visualization tools for portfolio insights.
- Integrate support for other wallets (e.g., WalletConnect).

Tech Stack

- **Frontend Framework**: Next.js 14 with App Router
- **UI Components**: Tailwind CSS, Heroicons
- **Wallet Integration**: MetaMask SDK
- **AI Integration**: OpenAI GPT-3.5
- **Blockchain Interaction**: Ethers.js
- **API Integration**: Etherscan API

Installation

1. Clone the repository:

```bash
git clone https://github.com/jayshreeanand/metamask-ai-agent.git
cd metamask-ai-agent
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env.local` file in the root directory with the following variables:

```env
NEXT_PUBLIC_OPENAI_API_KEY=your_openai_api_key_here
NEXT_PUBLIC_ETHERSCAN_API_KEY=your_etherscan_api_key_here
```

4. Start the development server:

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

API Keys Required

1. **OpenAI API Key**

   - Get your API key from [OpenAI Platform](https://platform.openai.com/)
   - Used for AI-powered responses and natural language processing

2. **Etherscan API Key**
   - Get your API key from [Etherscan](https://etherscan.io/apis)
   - Used for fetching transaction history and blockchain data

Usage

1. **Connect Wallet**

   - Click the "Connect Wallet" button
   - Approve the connection in MetaMask

2. **Start Chatting**

   - Use quick chat options for common queries
   - Type custom questions in the chat input
   - View real-time responses with wallet data

3. **Common Queries**
   - "What's my balance?"
   - "Show recent transactions"
   - "Show my tokens"
   - "Which network am I on?"
