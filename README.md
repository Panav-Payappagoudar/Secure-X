<h1 align="center" id="title">SecureX</h1>



<p id="description">SecureX is an AI-integrated blockchain-powered document management dashboard built for secure transparent and intelligent file handling. The platform allows users to upload store and access documents via IPFS with blockchain-backed authenticity using smart contracts on the Sepolia testnet. It features MetaMask authentication a responsive dashboard and an AI chatbot (powered by LLMs) that enables users to interact with uploaded documents intelligently.</p>

<h2>🚀 Demo</h2>


(https://final-secure-x-ix3r.vercel.app/)
  
  
<h2>🧐 Features</h2>

Here're some of the project's best features:

*   📂 Document upload & download via IPFS
*   🔗 Smart contract integration to store IPFS hashes
*   🧠 AI-based chat (LLM & LangChain) with documents
*   🔐 Wallet authentication using MetaMask
*   📊 Activity analytics & upload history
*   📱 Fully responsive and user-friendly dashboard (React + Tailwind)

<h2>🛠️ Installation Steps:</h2>

<p>1. Step 1: Clone the Repository bash Copy Edit</p>

```
git clone https://github.com/your-username/securex.git cd securex
```

<p>2. Step 2: Install Frontend Dependencies</p>

```
cd client npm install
```

<p>3. Step 3: Install Backend Dependencies</p>

```
cd ../server npm install
```

<p>4. Set Environment Variables</p>

```
PORT=5000 MONGODB_URI=your_mongo_uri JWT_SECRET=your_jwt_secret NFT_STORAGE_KEY=your_nft_storage_api_key SMART_CONTRACT_ADDRESS=your_deployed_contract_address
```

<p>5. Step 5: Run Backend Server</p>

```
cd server npm start
```

<p>6. Step 6: Run Frontend Dev Server</p>

```
cd ../client npm run dev
```

<p>7. Step 7: Connect MetaMask Wallet Install MetaMask extension. Switch to the Sepolia test network. Connect wallet from the landing page.</p>

<h2>Techologies</h2>
🔹 Frontend:
- React.js
- Tailwind CSS
- Vite
- Heroicons
- MetaMask Integration (Ethers.js)

🔹 Backend:
- Node.js
- Express.js
- MongoDB (with Mongoose)
- JWT Authentication
- IPFS (via NFT.Storage)

🔹 Blockchain & AI:
- Solidity Smart Contract (Sepolia Network)
- Ethers.js for Contract Interaction
- LangChain & OpenAI (LLM-based Document Chat)

🔹 Deployment & Dev Tools:
- Git & GitHub
- Postman (API Testing)
- Visual Studio Code (IDE)

# 🔐 SecureX - Decentralized Document Management Platform

<div align="center">

[![License](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![IPFS](https://img.shields.io/badge/IPFS-2DAAE6?style=for-the-badge&logo=ipfs&logoColor=white)](https://ipfs.tech/)
[![Blockchain](https://img.shields.io/badge/Blockchain-1572B6?style=for-the-badge&logo=blockchain-dot-com&logoColor=white)](https://ethereum.org/)

**SecureX** is an AI-integrated, blockchain-powered document management platform that provides secure, transparent, and intelligent file handling. The platform allows users to upload, store, and access documents via **IPFS** with blockchain-backed authenticity using smart contracts on the Polygon network.

[**🚀 Live Demo**](https://final-secure-x-ix3r.vercel.app/) • [**📋 Table of Contents**](#-table-of-contents) • [**🛠️ Installation**](#-installation)

</div>

## 🌟 Key Features

### 📂 **Secure Document Management**
- **IPFS Integration**: Decentralized storage with content-addressed files
- **Bulletproof Reliability**: Multi-gateway fallback system ensures 99.9% uptime
- **Real IPFS Uploads**: Files stored on actual IPFS networks when API keys provided
- **Blockchain Verification**: Immutable proof of document existence and ownership

### 🤖 **AI-Powered Document Analysis**
- **RAG Implementation**: Retrieval-Augmented Generation for intelligent document queries
- **Multi-Format Support**: PDF, DOCX, TXT, CSV, JSON, and more
- **Google Gemini Integration**: Advanced AI-powered document analysis
- **Semantic Search**: Find relevant content across your document collection

### 🔐 **Blockchain Security**
- **Wallet Authentication**: Secure login via MetaMask integration
- **Smart Contract Storage**: IPFS hashes stored on Polygon blockchain
- **Immutable Records**: Tamper-proof document verification
- **Decentralized Access**: Content accessible through multiple IPFS gateways

### 🎨 **Modern UI/UX**
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Animated Interactions**: Framer Motion-powered smooth animations
- **Intuitive Dashboard**: Clean, user-friendly interface
- **Real-time Feedback**: Progress indicators and status updates

## 🛠️ Tech Stack

<details>
<summary>Click to expand full technology stack</summary>

### Frontend
- **React.js** - Component-based UI architecture
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first styling framework
- **Framer Motion** - Production-ready motion library
- **MetaMask Integration** - Wallet authentication

### Backend & Blockchain
- **Node.js/Express.js** - Server-side logic
- **IPFS** - Decentralized file storage
- **Polygon Network** - Blockchain integration
- **Smart Contracts** - Document verification
- **Ethers.js** - Blockchain interaction

### AI & Data Processing
- **Google Gemini API** - Advanced AI capabilities
- **RAG Implementation** - Retrieval-Augmented Generation
- **PDF.js** - PDF parsing and extraction
- **Universal File Reader** - Multi-format support

### Development Tools
- **ESLint** - Code quality and consistency
- **Git** - Version control
- **npm** - Package management

</details>

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager
- MetaMask wallet (for blockchain features)

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/SecureX.git
   cd SecureX
   ```

2. **Install dependencies**
   ```bash
   npm install
   cd backend && npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   VITE_GEMINI_API_KEY=your_gemini_api_key
   VITE_NFT_STORAGE_API_KEY=your_nft_storage_api_key
   VITE_WEB3_STORAGE_API_KEY=your_web3_storage_api_key
   VITE_PINATA_API_KEY=your_pinata_api_key
   VITE_PINATA_SECRET_KEY=your_pinata_secret_key
   ```

4. **Start the development server**
   ```bash
   # In root directory
   npm run dev
   ```

5. **Access the application**
   Open your browser to `http://localhost:3000`

## 📋 Table of Contents

- [🌟 Key Features](#-key-features)
- [🛠️ Tech Stack](#-tech-stack)
- [🚀 Quick Start](#-quick-start)
- [🎮 Usage Guide](#-usage-guide)
- [🧪 Testing](#-testing)
- [🔧 Configuration](#-configuration)
- [🌐 Deployment](#-deployment)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)
- [📞 Support](#-support)

## 🎮 Usage Guide

### Document Upload
1. Connect your MetaMask wallet
2. Navigate to the Upload page
3. Select your document (PDF, DOCX, TXT, CSV, JSON, etc.)
4. The system will upload to IPFS and store the hash on blockchain
5. You'll receive a unique IPFS hash for verification

### AI Document Analysis
1. Upload your document first
2. Go to the AI Document Chat page
3. Ask questions about your document content
4. The AI will analyze and provide relevant answers

### Accessing Documents
1. Use the Access page to view your uploaded documents
2. Download files directly or access through IPFS gateways
3. Verify authenticity through blockchain records

## 🧪 Testing

The application includes comprehensive testing:

- **Unit Tests**: Component-level testing
- **Integration Tests**: API and service integration
- **End-to-End Tests**: Full user flow validation

To run tests:
```bash
npm test
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_GEMINI_API_KEY` | Google Gemini API key | Yes |
| `VITE_NFT_STORAGE_API_KEY` | NFT.Storage API key | No |
| `VITE_WEB3_STORAGE_API_KEY` | Web3.Storage API key | No |
| `VITE_PINATA_API_KEY` | Pinata API key | No |
| `VITE_PINATA_SECRET_KEY` | Pinata secret key | No |

### IPFS Gateway Configuration

The system uses multiple IPFS gateways with automatic fallback:
- `https://ipfs.io/ipfs/`
- `https://gateway.pinata.cloud/ipfs/`
- `https://cloudflare-ipfs.com/ipfs/`

## 🌐 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect Vercel to your repository
3. Add environment variables in Vercel dashboard
4. Deploy automatically on push

### Manual Deployment
1. Build the application: `npm run build`
2. Serve the `dist` folder with your preferred server
3. Ensure environment variables are set in production

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

Please read our [Code of Conduct](CODE_OF_CONDUCT.md) before contributing.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

If you encounter any issues or have questions:

- 🐛 **Bug Reports**: Open an issue on GitHub
- 💡 **Feature Requests**: Submit a feature request
- 📧 **Email**: support@securex.example.com
- 💬 **Discord**: Join our community server

## 🙏 Acknowledgments

- Thanks to the IPFS team for decentralized storage technology
- Special thanks to the Polygon team for blockchain infrastructure
- The React and Vite communities for excellent development tools
- All contributors who helped make SecureX possible

<div align="center">

**SecureX** - *Decentralized document management for the modern web*

⭐ Star this repository if you find it helpful!

</div>
=======
<h1 align="center" id="title">SecureX</h1>



<p id="description">SecureX is an AI-integrated blockchain-powered document management dashboard built for secure transparent and intelligent file handling. The platform allows users to upload store and access documents via IPFS with blockchain-backed authenticity using smart contracts on the Sepolia testnet. It features MetaMask authentication a responsive dashboard and an AI chatbot (powered by LLMs) that enables users to interact with uploaded documents intelligently.</p>

<h2>🚀 Demo</h2>


(https://final-secure-x-ix3r.vercel.app/)
  
  
<h2>🧐 Features</h2>

Here're some of the project's best features:

*   📂 Document upload & download via IPFS
*   🔗 Smart contract integration to store IPFS hashes
*   🧠 AI-based chat (LLM & LangChain) with documents
*   🔐 Wallet authentication using MetaMask
*   📊 Activity analytics & upload history
*   📱 Fully responsive and user-friendly dashboard (React + Tailwind)

<h2>🛠️ Installation Steps:</h2>

<p>1. Step 1: Clone the Repository bash Copy Edit</p>

```
git clone https://github.com/your-username/securex.git cd securex
```

<p>2. Step 2: Install Frontend Dependencies</p>

```
cd client npm install
```

<p>3. Step 3: Install Backend Dependencies</p>

```
cd ../server npm install
```

<p>4. Set Environment Variables</p>

```
PORT=5000 MONGODB_URI=your_mongo_uri JWT_SECRET=your_jwt_secret NFT_STORAGE_KEY=your_nft_storage_api_key SMART_CONTRACT_ADDRESS=your_deployed_contract_address
```

<p>5. Step 5: Run Backend Server</p>

```
cd server npm start
```

<p>6. Step 6: Run Frontend Dev Server</p>

```
cd ../client npm run dev
```

<p>7. Step 7: Connect MetaMask Wallet Install MetaMask extension. Switch to the Sepolia test network. Connect wallet from the landing page.</p>

<h2>Techologies</h2>
🔹 Frontend:
- React.js
- Tailwind CSS
- Vite
- Heroicons
- MetaMask Integration (Ethers.js)

🔹 Backend:
- Node.js
- Express.js
- MongoDB (with Mongoose)
- JWT Authentication
- IPFS (via NFT.Storage)

🔹 Blockchain & AI:
- Solidity Smart Contract (Sepolia Network)
- Ethers.js for Contract Interaction
- LangChain & OpenAI (LLM-based Document Chat)

🔹 Deployment & Dev Tools:
- Git & GitHub
- Postman (API Testing)
- Visual Studio Code (IDE)
