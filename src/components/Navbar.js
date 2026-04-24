import React, { Component } from 'react';
import Identicon from 'identicon.js';
import { FaWallet, FaUserCircle, FaHome, FaInfoCircle, FaSun, FaMoon, FaSignOutAlt } from 'react-icons/fa';
import { getIpfsUrl } from '../pinata';
import { ThemeContext } from '../ThemeContext';

class Navbar extends Component {
  static contextType = ThemeContext;

  render() {
    const { account, username, avatarHash, onProfileClick, onHomeClick, onAboutClick, onLogout, currentView } = this.props;
    const { theme, toggleTheme } = this.context;
    const avatarUrl = avatarHash ? getIpfsUrl(avatarHash) : null;

    // Shortened wallet address
    const shortenedAddress = account
      ? `${account.substring(0, 6)}...${account.substring(38)}`
      : '';

    return (
      <nav className="navbar-dchain">
        <div className="navbar-inner">
          <div className="navbar-left">
            <a
              className="navbar-brand-dchain"
              href="/"
              onClick={(e) => {
                e.preventDefault();
                onHomeClick && onHomeClick();
              }}
            >
              <div className="brand-icon">⛓️</div>
              <span className="brand-text">DChain Social</span>
            </a>
          </div>

          <div className="navbar-right">
            {account && (
              <>
                <button
                  className={`nav-btn ${currentView === 'feed' ? 'active' : ''}`}
                  onClick={onHomeClick}
                  title="Home Feed"
                >
                  <FaHome size={16} />
                  <span>Home</span>
                </button>

                <button
                  className={`nav-btn ${currentView === 'about' ? 'active' : ''}`}
                  onClick={onAboutClick}
                  title="About"
                >
                  <FaInfoCircle size={16} />
                  <span>About</span>
                </button>

                <button
                  className={`nav-btn ${currentView === 'profile' ? 'active' : ''}`}
                  onClick={() => onProfileClick && onProfileClick(account)}
                  title="My Profile"
                >
                  <FaUserCircle size={16} />
                  <span>{username || 'Profile'}</span>
                </button>

                <span className="wallet-address" title={account}>
                  <FaWallet />
                  {shortenedAddress}
                </span>

                {avatarUrl ? (
                  <img
                    className="wallet-identicon"
                    width="32"
                    height="32"
                    src={avatarUrl}
                    alt="You"
                    style={{ objectFit: 'cover', borderRadius: '50%' }}
                  />
                ) : (
                  <img
                    className="wallet-identicon"
                    width="32"
                    height="32"
                    src={`data:image/png;base64,${new Identicon(account, 32).toString()}`}
                    alt="You"
                  />
                )}

                <button
                  className="nav-btn logout-btn"
                  onClick={onLogout}
                  title="Logout"
                >
                  <FaSignOutAlt size={16} />
                  <span>Logout</span>
                </button>
              </>
            )}

            <button
              className="theme-toggle"
              onClick={toggleTheme}
              title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              {theme === 'dark' ? <FaSun /> : <FaMoon />}
            </button>
          </div>
        </div>

        {/* Hint for account switching
        {account && (
          <div className="navbar-hint">
            💡 Tip: Switch accounts in MetaMask to use a different wallet
          </div>
        )} */}
      </nav>
    );
  }
}

export default Navbar;