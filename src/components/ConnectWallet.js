import React, { Component } from 'react';
import { FaWallet, FaShieldAlt, FaLock, FaBolt, FaSun, FaMoon } from 'react-icons/fa';
import { ThemeContext } from '../ThemeContext';
import './ConnectWallet.css';

class ConnectWallet extends Component {
  static contextType = ThemeContext;

  render() {
    const { onConnect } = this.props;
    const { theme, toggleTheme } = this.context;

    return (
      <div className="connect-wallet-screen">
        {/* Animated Background */}
        <div className="connect-bg">
          <div className="connect-orb orb-1"></div>
          <div className="connect-orb orb-2"></div>
          <div className="connect-orb orb-3"></div>
          <div className="connect-grid"></div>
        </div>

        {/* Theme Toggle */}
        <button
          className="connect-theme-toggle"
          onClick={toggleTheme}
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <FaSun size={20} /> : <FaMoon size={20} />}
        </button>

        {/* Main Content */}
        <div className="connect-container">
          <div className="connect-content">
            {/* Logo & Title */}
            <div className="connect-header">
              <div className="connect-logo">
                <span className="connect-logo-icon">⛓️</span>
              </div>
              <h1 className="connect-title">DChain Social</h1>
              <p className="connect-tagline">
                The decentralized social network where you own your content
              </p>
            </div>

            {/* Illustration */}
            <div className="connect-illustration">
              <div className="connect-wallet-icon">
                <FaWallet size={80} />
              </div>
              <div className="connect-pulse-ring"></div>
            </div>

            {/* Main CTA */}
            <div className="connect-cta">
              <h2 className="connect-subtitle">Connect Your Wallet to Continue</h2>
              <p className="connect-description">
                Sign in or create an account using your Web3 wallet. <br />
                No passwords, no email required.
              </p>

              <button className="connect-btn" onClick={onConnect}>
                <FaWallet size={20} />
                <span>Connect with MetaMask</span>
              </button>

              <p className="connect-hint">
                Don't have MetaMask?{' '}
                <a
                  href="https://metamask.io/download/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="connect-link"
                >
                  Get it here
                </a>
              </p>
            </div>

            {/* Features */}
            <div className="connect-features">
              <div className="connect-feature">
                <div className="connect-feature-icon">
                  <FaLock />
                </div>
                <div className="connect-feature-content">
                  <h3>Secure & Private</h3>
                  <p>Your keys, your data</p>
                </div>
              </div>

              <div className="connect-feature">
                <div className="connect-feature-icon">
                  <FaShieldAlt />
                </div>
                <div className="connect-feature-content">
                  <h3>Decentralized</h3>
                  <p>No central authority</p>
                </div>
              </div>

              <div className="connect-feature">
                <div className="connect-feature-icon">
                  <FaBolt />
                </div>
                <div className="connect-feature-content">
                  <h3>Instant Access</h3>
                  <p>Connect in seconds</p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="connect-footer">
              <p>Powered by Ethereum & IPFS</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ConnectWallet;