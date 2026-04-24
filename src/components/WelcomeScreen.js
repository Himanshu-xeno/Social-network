import React, { Component } from 'react';
import Identicon from 'identicon.js';
import { FaArrowLeft, FaSun, FaMoon, FaArrowRight } from 'react-icons/fa';
import { getIpfsUrl } from '../pinata';
import { ThemeContext } from '../ThemeContext';

class WelcomeScreen extends Component {
  static contextType = ThemeContext;

  render() {
    const { account, username, avatarHash, onLogin, onBack } = this.props;
    const { theme, toggleTheme } = this.context;
    const avatarUrl = avatarHash ? getIpfsUrl(avatarHash) : null;

    return (
      <div className="welcome-screen">
        <div className="welcome-background">
          <div className="welcome-orb orb-1"></div>
          <div className="welcome-orb orb-2"></div>
          <div className="welcome-orb orb-3"></div>
        </div>

        <div className="welcome-container">
          <button
            className="welcome-theme-toggle"
            onClick={toggleTheme}
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? <FaSun size={20} /> : <FaMoon size={20} />}
          </button>

          <div className="welcome-card">
            <button className="welcome-back-link" onClick={onBack}>
              <FaArrowLeft /> Back
            </button>

            <div className="welcome-header">
              <div className="welcome-logo">⛓️</div>
              <h1 className="welcome-title">Welcome Back!</h1>
              <p className="welcome-subtitle">Continue to DChain Social</p>
            </div>

            <div className="welcome-profile-section">
              <div className="welcome-avatar-large">
                {avatarUrl ? (
                  <img src={avatarUrl} alt={username} />
                ) : (
                  <img
                    src={`data:image/png;base64,${new Identicon(account, 120).toString()}`}
                    alt={username}
                  />
                )}
              </div>
              <h2 className="welcome-username">@{username}</h2>
              <p className="welcome-wallet-address">
                {account.substring(0, 10)}...{account.substring(34)}
              </p>
            </div>

            <button className="welcome-login-btn" onClick={onLogin}>
              <span>Continue as @{username}</span>
              <FaArrowRight />
            </button>

            <div className="welcome-footer">
              <p>🔒 Secure blockchain authentication</p>
              <p>🌐 Your data, your control</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default WelcomeScreen;