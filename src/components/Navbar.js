import React, { Component } from 'react';
import Identicon from 'identicon.js';
import { FaWallet, FaUserCircle, FaHome } from 'react-icons/fa';
import { getIpfsUrl } from '../pinata';

class Navbar extends Component {
  render() {
    const { account, username, avatarHash, onProfileClick, onHomeClick } = this.props;
    const avatarUrl = avatarHash ? getIpfsUrl(avatarHash) : null;

    return (
      <nav className="navbar-dchain">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
          <a
            className="navbar-brand-dchain"
            href="/"
            onClick={(e) => { e.preventDefault(); onHomeClick && onHomeClick(); }}
          >
            <div className="brand-icon">⛓️</div>
            DChain Social
          </a>

          <div className="wallet-info">
            {account && (
              <>
                <button
                  onClick={onHomeClick}
                  className="media-btn"
                  title="Home Feed"
                  style={{ color: '#74b9ff' }}
                >
                  <FaHome size={18} />
                </button>

                <button
                  onClick={() => onProfileClick && onProfileClick(account)}
                  className="media-btn"
                  style={{ color: '#a29bfe' }}
                  title="My Profile"
                >
                  <FaUserCircle size={18} />
                  <span style={{ fontSize: '0.8rem' }}>
                    {username || 'Profile'}
                  </span>
                </button>

                <span className="wallet-address">
                  <FaWallet style={{ marginRight: '6px' }} />
                  {account.substring(0, 6)}...{account.substring(38)}
                </span>

                {avatarUrl ? (
                  <img
                    className="wallet-identicon"
                    width="32"
                    height="32"
                    src={avatarUrl}
                    alt="Account"
                    style={{ objectFit: 'cover', borderRadius: '50%' }}
                  />
                ) : (
                  <img
                    className="wallet-identicon"
                    width="32"
                    height="32"
                    src={`data:image/png;base64,${new Identicon(account, 32).toString()}`}
                    alt="Account"
                  />
                )}
              </>
            )}
          </div>
        </div>
      </nav>
    );
  }
}

export default Navbar;