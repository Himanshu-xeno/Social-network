import React, { Component } from 'react';
import {
  FaShieldAlt, FaUsers, FaEthereum, FaImage,
  FaHeart, FaComment, FaLock, FaGlobe,
  FaCode, FaCubes, FaDatabase, FaPalette
} from 'react-icons/fa';

class About extends Component {
  render() {
    return (
      <div className="about-page">
        <div className="about-container">

          {/* Hero */}
          <div className="about-hero">
            <div className="about-hero-icon">⛓️</div>
            <h1>About DChain Social</h1>
            <p>
              A fully decentralized social media platform where you own your data,
              your content, and your identity. Built on Ethereum blockchain.
            </p>
          </div>

          {/* Motivation */}
          <div className="about-section">
            <h2>💡 Our Motivation</h2>
            <div className="about-motivation">
              "In a world where big tech companies control our data, censor our voices,
              and profit from our content — we believe there should be a better way.
              DChain Social was born from the idea that social media should be owned
              by the people, not corporations."
            </div>
            <p>
              Traditional social media platforms collect your personal information,
              track your behavior, sell your data to advertisers, and can delete
              your content or ban your account at any time without explanation.
            </p>
            <p>
              DChain Social changes this completely. Every post, like, comment, and
              tip is recorded on the Ethereum blockchain — making it permanent,
              transparent, and censorship-resistant. Your wallet is your identity.
              No emails, no passwords, no personal data collected. Ever.
            </p>
            <p>
              We built this project to demonstrate that decentralized social media
              is not just possible — it is the future. Content creators can earn
              ETH directly through tips without any middleman taking a cut.
              Your content truly belongs to you.
            </p>
          </div>

          {/* Features */}
          <div className="about-section">
            <h2>✨ Features</h2>
            <div className="about-features-grid">
              <div className="about-feature-card">
                <div className="about-feature-icon">📝</div>
                <div className="about-feature-title">Multi-Media Posts</div>
                <div className="about-feature-desc">Share text, images, videos, and audio files</div>
              </div>
              <div className="about-feature-card">
                <div className="about-feature-icon">💰</div>
                <div className="about-feature-title">ETH Tipping</div>
                <div className="about-feature-desc">Tip creators directly with cryptocurrency</div>
              </div>
              <div className="about-feature-card">
                <div className="about-feature-icon">❤️</div>
                <div className="about-feature-title">On-Chain Likes</div>
                <div className="about-feature-desc">Every like is permanently recorded</div>
              </div>
              <div className="about-feature-card">
                <div className="about-feature-icon">💬</div>
                <div className="about-feature-title">Comments</div>
                <div className="about-feature-desc">Engage in blockchain-verified discussions</div>
              </div>
              <div className="about-feature-card">
                <div className="about-feature-icon">👤</div>
                <div className="about-feature-title">User Profiles</div>
                <div className="about-feature-desc">Unique usernames and avatars on-chain</div>
              </div>
              <div className="about-feature-card">
                <div className="about-feature-icon">🔒</div>
                <div className="about-feature-title">No Censorship</div>
                <div className="about-feature-desc">Nobody can delete your content</div>
              </div>
              <div className="about-feature-card">
                <div className="about-feature-icon">🌓</div>
                <div className="about-feature-title">Dark & Light Mode</div>
                <div className="about-feature-desc">Beautiful UI in both themes</div>
              </div>
              <div className="about-feature-card">
                <div className="about-feature-icon">📱</div>
                <div className="about-feature-title">Responsive</div>
                <div className="about-feature-desc">Works on mobile and desktop</div>
              </div>
            </div>
          </div>

          {/* How It Works */}
          <div className="about-section">
            <h2>🔧 How It Works</h2>
            <p>
              <strong>1. Connect Your Wallet</strong> — Install MetaMask browser extension
              and connect it to our platform. Your wallet address becomes your unique identity.
            </p>
            <p>
              <strong>2. Create Your Profile</strong> — Choose a unique username, add a bio,
              and optionally upload a profile picture. All stored on the blockchain.
            </p>
            <p>
              <strong>3. Start Posting</strong> — Share text, images, videos, or audio.
              Media files are stored on IPFS (InterPlanetary File System), and post
              data is recorded on the Ethereum blockchain.
            </p>
            <p>
              <strong>4. Engage & Earn</strong> — Like posts, leave comments, and tip
              creators with ETH. Tips go directly to the creator's wallet — no middleman.
            </p>
          </div>

          {/* Tech Stack */}
          <div className="about-section">
            <h2>🛠️ Technology Stack</h2>
            <ul className="about-tech-list">
              <li>
                <FaCubes />
                <span>Solidity ^0.8.19</span>
                <span className="about-tech-badge">Smart Contract</span>
              </li>
              <li>
                <FaEthereum />
                <span>Ethereum Blockchain</span>
                <span className="about-tech-badge">Network</span>
              </li>
              <li>
                <FaCode />
                <span>React 18</span>
                <span className="about-tech-badge">Frontend</span>
              </li>
              <li>
                <FaDatabase />
                <span>IPFS via Pinata</span>
                <span className="about-tech-badge">Storage</span>
              </li>
              <li>
                <FaGlobe />
                <span>Web3.js</span>
                <span className="about-tech-badge">Blockchain API</span>
              </li>
              <li>
                <FaLock />
                <span>MetaMask</span>
                <span className="about-tech-badge">Authentication</span>
              </li>
              <li>
                <FaPalette />
                <span>Custom CSS with Theme System</span>
                <span className="about-tech-badge">Styling</span>
              </li>
              <li>
                <FaShieldAlt />
                <span>Truffle Suite</span>
                <span className="about-tech-badge">Development</span>
              </li>
            </ul>
          </div>

          {/* Principles */}
          <div className="about-section">
            <h2>🌍 Our Principles</h2>
            <p>
              <FaShieldAlt style={{ marginRight: '8px', color: 'var(--accent-primary)' }} />
              <strong>Privacy First</strong> — We collect zero personal data. No tracking,
              no analytics, no cookies. Your wallet is your only identifier.
            </p>
            <p>
              <FaUsers style={{ marginRight: '8px', color: 'var(--accent-primary)' }} />
              <strong>User Ownership</strong> — You own your content, your data, and your
              identity. No corporation can claim ownership of what you create.
            </p>
            <p>
              <FaGlobe style={{ marginRight: '8px', color: 'var(--accent-primary)' }} />
              <strong>Open & Transparent</strong> — All transactions are publicly verifiable
              on the blockchain. The smart contract code is open source.
            </p>
            <p>
              <FaHeart style={{ marginRight: '8px', color: 'var(--accent-primary)' }} />
              <strong>Creator Economy</strong> — Content creators earn directly from their
              audience through ETH tips with zero platform fees.
            </p>
          </div>

        </div>
      </div>
    );
  }
}

export default About;