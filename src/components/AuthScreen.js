import React, { Component } from 'react';
import { FaWallet, FaSun, FaMoon } from 'react-icons/fa';
import { ThemeContext } from '../ThemeContext';

class AuthScreen extends Component {
  static contextType = ThemeContext;

  render() {
    const { onConnectWallet } = this.props;
    const { theme, toggleTheme } = this.context;

    return (
      <div className="auth-screen">
        <div className="auth-background">
          <div className="auth-orb orb-1"></div>
          <div className="auth-orb orb-2"></div>
          <div className="auth-orb orb-3"></div>
        </div>

        <div className="auth-container">
          <button
            className="auth-theme-toggle"
            onClick={toggleTheme}
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? <FaSun size={20} /> : <FaMoon size={20} />}
          </button>

          <div className="auth-card">
            <div className="auth-header">
              <div className="auth-logo">
                <span className="auth-logo-icon">⛓️</span>
                <h1 className="auth-logo-text">DChain Social</h1>
              </div>
              <p className="auth-tagline">
                The decentralized social network where you own your content
              </p>
            </div>

            <div className="auth-content">
              <div className="auth-illustration">
                <div className="auth-illustration-icon">🦊</div>
                <h2 className="auth-title">Connect Your Wallet</h2>
                <p className="auth-description">
                  Sign in or create an account using your Web3 wallet
                </p>
              </div>

              <button className="auth-connect-btn" onClick={onConnectWallet}>
                <FaWallet size={20} />
                <span>Connect with MetaMask</span>
              </button>

              <div className="auth-features">
                <div className="auth-feature">
                  <span className="auth-feature-icon">🔒</span>
                  <span className="auth-feature-text">No passwords needed</span>
                </div>
                <div className="auth-feature">
                  <span className="auth-feature-icon">🌐</span>
                  <span className="auth-feature-text">True data ownership</span>
                </div>
                <div className="auth-feature">
                  <span className="auth-feature-icon">⚡</span>
                  <span className="auth-feature-text">Instant authentication</span>
                </div>
              </div>
            </div>

            <div className="auth-footer">
              <p className="auth-footer-text">
                New to Web3?
                <a
                  href="https://metamask.io/download/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="auth-footer-link"
                >
                  Get MetaMask
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default AuthScreen;