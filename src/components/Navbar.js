import React, { Component } from 'react';
import Identicon from 'identicon.js';
import { FaWallet, FaUserCircle } from 'react-icons/fa';

class Navbar extends Component {
  render() {
    const { account, username, onProfileClick } = this.props;

    return (
      <nav className="navbar-dchain">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
          <a className="navbar-brand-dchain" href="/" onClick={(e) => e.preventDefault()}>
            <div className="brand-icon">⛓️</div>
            DChain Social
          </a>

          <div className="wallet-info">
            {account && (
              <>
                <button
                  onClick={onProfileClick}
                  className="media-btn"
                  style={{ color: '#a29bfe' }}
                  title="Edit Profile"
                >
                  <FaUserCircle size={18} />
                  <span style={{ fontSize: '0.8rem' }}>
                    {username || 'Set Profile'}
                  </span>
                </button>

                <span className="wallet-address">
                  <FaWallet style={{ marginRight: '6px' }} />
                  {account.substring(0, 6)}...{account.substring(38)}
                </span>

                <img
                  className="wallet-identicon"
                  width="32"
                  height="32"
                  src={`data:image/png;base64,${new Identicon(account, 32).toString()}`}
                  alt="Account"
                />
              </>
            )}
          </div>
        </div>
      </nav>
    );
  }
}

export default Navbar;