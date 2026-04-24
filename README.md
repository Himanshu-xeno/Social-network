# ⛓️ DChain Social — Decentralized Social Media Platform

![DChain Social](https://img.shields.io/badge/DChain-Social-6c5ce7?style=for-the-badge&logo=ethereum&logoColor=white)
![Solidity](https://img.shields.io/badge/Solidity-^0.8.19-363636?style=for-the-badge&logo=solidity)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![Ethereum](https://img.shields.io/badge/Ethereum-Blockchain-3C3C3D?style=for-the-badge&logo=ethereum)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

**A fully decentralized social media platform built on Ethereum blockchain where you own your data, your content, and your identity.**

[Live Demo](#) · [Report Bug](../../issues) · [Request Feature](../../issues)

---

## 📖 Table of Contents

- [About The Project](#about-the-project)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
- [Running The Project](#running-the-project)
- [Testing](#testing)
- [Deployment](#deployment)
- [How To Use](#how-to-use)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

---

## 🌟 About The Project

Traditional social media platforms collect your personal information, track your behavior, sell your data to advertisers, and can delete your content or ban your account at any time.

**DChain Social** changes this completely:
- Every post, like, comment, and tip is recorded on the **Ethereum blockchain**
- Media files are stored on **IPFS** (decentralized storage)
- Your **MetaMask wallet** is your identity — no emails, no passwords
- **Nobody** can censor, delete, or manipulate your content
- Content creators **earn ETH** directly through tips with zero platform fees

---

## ✨ Features

| Category | Feature | Description |
|----------|---------|-------------|
| 🔐 Account | Wallet-based Auth | No passwords — MetaMask IS your account |
| 👤 Profile | User Profiles | Username, bio, avatar stored on blockchain |
| 📝 Posting | Multi-Media Posts | Text, images, videos, and audio |
| 💰 Social | ETH Tipping | Tip creators directly with cryptocurrency |
| ❤️ Social | On-Chain Likes | Like/unlike permanently recorded |
| 💬 Social | Comments | Blockchain-verified comment system |
| 🔍 Feed | Post Filtering | Filter by All, Text, Image, Video, Audio |
| 📊 Feed | Post Sorting | Sort by Newest, Most Tipped, Most Liked |
| 🌓 UI | Dark & Light Mode | Toggle between themes with persistence |
| 📱 UI | Responsive Design | Works on mobile and desktop |
| ℹ️ Info | About Page | Project motivation and tech details |
| 🔔 UX | Toast Notifications | Real-time feedback for all actions |
| 🖼️ UX | Image Lightbox | Click to view full-size images |
| 📈 Stats | Dashboard | Total posts, users, ETH tipped, likes |

---

## 🛠️ Tech Stack

| Technology | Purpose |
|-----------|---------|
| **Solidity ^0.8.19** | Smart Contract Language |
| **Ethereum** | Blockchain Network |
| **Truffle** | Smart Contract Development Framework |
| **Ganache** | Local Blockchain for Development |
| **React 18** | Frontend UI Library |
| **Web3.js** | Ethereum JavaScript API |
| **IPFS (Pinata)** | Decentralized File Storage |
| **MetaMask** | Wallet & Authentication |
| **Bootstrap 5** | CSS Framework |
| **React Icons** | Icon Library |
| **React Toastify** | Notification System |

---

## 📋 Prerequisites

Before you begin, make sure you have the following installed:

1. **Node.js** (v18 or higher)
   ```bash
   # Check version
   node --version
   # Download from: https://nodejs.org
   ```

2. **Truffle** (installed globally)
   ```bash
   npm install -g truffle
   ```

3. **Ganache** (GUI Application)
   - Download from: https://trufflesuite.com/ganache
   - Create a workspace with:
     - Port: `8545`
     - Network ID / Chain ID: `1337`

4. **MetaMask** (Browser Extension)
   - Install from: https://metamask.io
   - You will need to add a custom network and import accounts

5. **Pinata Account** (Free — for IPFS file storage)
   - Sign up at: https://app.pinata.cloud
   - Create an API key with all permissions enabled

---

## 🚀 Installation & Setup

### Step 1: Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/dchain-social.git
cd dchain-social
```

### Step 2: Install Dependencies

```bash
npm install
```

If you encounter errors:
```bash
npm install --legacy-peer-deps
```

### Step 3: Configure Environment Variables

Create a `.env` file in the project root:

```env
REACT_APP_PINATA_API_KEY=your_pinata_api_key_here
REACT_APP_PINATA_SECRET_KEY=your_pinata_secret_key_here
```

### Step 4: Start Ganache

1. Open Ganache application
2. Create a new workspace or use quickstart
3. Ensure settings:
   - **Port**: 8545
   - **Network ID**: 1337

### Step 5: Compile Smart Contracts

```bash
truffle compile
```

### Step 6: Deploy Smart Contracts

```bash
truffle migrate --reset
```

You should see output showing the deployed contract address.

### Step 7: Configure MetaMask

1. Open MetaMask in your browser
2. **Add Custom Network**:
   - Network Name: `Ganache Local`
   - RPC URL: `http://127.0.0.1:8545`
   - Chain ID: `1337`
   - Currency Symbol: `ETH`
3. **Import Ganache Account**:
   - In Ganache, click the 🔑 key icon next to an account
   - Copy the private key
   - In MetaMask: Account icon → Import Account → Paste private key
   - Repeat for 2-3 accounts to test multi-user features

### Step 8: Start the Application

```bash
npm start
```

The app will open at `http://localhost:3000`

---

## 🏃 Running The Project

### Daily Startup (Quick)

If Ganache is still running with the same workspace and you haven't reset it:

```bash
npm start
```

### Full Startup (After Ganache Reset)

```bash
# 1. Open Ganache (make sure it's running)
# 2. Deploy contracts
truffle migrate --reset
# 3. Start app
npm start
# 4. Make sure MetaMask is on Ganache network (Chain ID 1337)
```

### If You Get OpenSSL Errors

```bash
# Windows CMD:
set NODE_OPTIONS=--openssl-legacy-provider
npm start

# Windows PowerShell:
$env:NODE_OPTIONS="--openssl-legacy-provider"
npm start

# Mac / Linux:
export NODE_OPTIONS=--openssl-legacy-provider
npm start
```

### If MetaMask Shows "Nonce Too High" Error

Go to MetaMask → Settings → Advanced → Clear Activity Tab Data

---

## 🧪 Testing

Run the smart contract test suite:

```bash
truffle test
```

This will run all tests including:
- Contract deployment verification
- Profile creation and uniqueness
- Post creation (text and media)
- Tipping system with balance verification
- Like/unlike functionality
- Comment system
- Username availability checking

---

## 🌐 Deployment

### Deploy Smart Contract to Sepolia Testnet (Free)

1. Get a free Infura account: https://infura.io
2. Get free Sepolia ETH: https://sepoliafaucet.com
3. Update `.env` with your Infura key and MetaMask seed phrase
4. Run: `truffle migrate --reset --network sepolia`

### Deploy Frontend to Vercel (Free)

1. Push your code to GitHub
2. Go to https://vercel.com and sign in with GitHub
3. Import your repository
4. Add environment variables (Pinata keys)
5. Click Deploy

---

## 👤 How To Use

### For New Users

1. Open the app in your browser
2. MetaMask will ask to connect — click **Connect**
3. You'll see the **Welcome Screen** (signup)
4. Choose a unique username (minimum 3 characters)
5. Add a bio and profile picture (optional)
6. Click **Create Profile** → Confirm the transaction in MetaMask
7. You're in! Start posting, liking, commenting, and tipping

### Creating a Post

1. Write your message in the text box
2. Optionally attach an image, video, or audio file
3. Click **Post** → Confirm in MetaMask
4. Your post appears in the feed once the transaction is confirmed

### Tipping a Creator

1. Click the **Tip** button on any post
2. Choose a quick amount (0.01, 0.05, 0.1 ETH) or enter a custom amount
3. Click **Send** → Confirm in MetaMask
4. ETH is transferred directly to the creator's wallet

### Testing with Multiple Accounts

1. Import multiple Ganache accounts into MetaMask
2. Switch between accounts to simulate different users
3. Each account needs to create a profile on first use

---

## 📁 Project Structure

```
dchain-social/
├── migrations/
│   ├── 1_initial_migration.js
│   └── 2_deploy_contracts.js
├── public/
│   └── index.html
├── src/
│   ├── abis/                    # Compiled contract JSON (auto-generated)
│   ├── components/
│   │   ├── About.js             # About page
│   │   ├── App.css              # Global stylesheet (dark/light theme + layout)
│   │   ├── App.js               # Main application controller (Web3 + state)
│   │   ├── AuthScreen.js        # Login/Register screen (wallet-based auth)
│   │   ├── ConnectWallet.js     # MetaMask connection logic
│   │   ├── ConnectWallet.css    # Wallet connection styles
│   │   ├── CreatePost.js        # Post creation (text + media + IPFS)
│   │   ├── CreateProfile.js     # User profile creation
│   │   ├── CreateProfile.css    # Profile creation styling
│   │   ├── Main.js              # Feed/dashboard (filters, sorting, posts)
│   │   ├── Navbar.js            # Navigation bar (profile, logout, theme)
│   │   ├── PostCard.js          # Individual post display (like, tip, comment)
│   │   ├── ProfileModal.js      # Profile popup/modal view
│   │   ├── UserProfile.js       # User profile page (posts, stats, details)
│   │   └── WelcomeScreen.js     # Onboarding / intro screen
│   ├── contracts/
│   │   ├── Migrations.sol
│   │   └── SocialNetwork.sol    # Core smart contract (profiles, posts, tips)
│   ├── index.js                 # React entry point
│   ├── pinata.js                # IPFS upload module (Pinata integration)
│   ├── ThemeContext.js          # Dark/Light mode context provider
│   └── serviceWorker.js         # Service worker (PWA support)
├── test/
│   └── SocialNetwork.test.js    # Smart contract tests
├── .env                         # Environment variables (API keys, etc.)
├── .gitignore
├── package.json                 # Project dependencies & scripts
├── truffle-config.js            # Truffle configuration (networks, compiler)
├── vercel.json                  # Vercel deployment config
└── README.md                    # Project documentation
```

---

## 🤝 Contributing

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the MIT License.

---

## 🙏 Acknowledgments

- [Ethereum](https://ethereum.org/) — Blockchain platform
- [Truffle Suite](https://trufflesuite.com/) — Development framework
- [MetaMask](https://metamask.io/) — Wallet provider
- [Pinata](https://pinata.cloud/) — IPFS pinning service
- [React](https://reactjs.org/) — UI library

---


**⭐ Star this repo if you found it helpful! ⭐**

Built with ❤️ on the Ethereum Blockchain

</div>
