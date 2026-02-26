import React, { Component } from 'react';
import { FaCamera, FaCheck, FaTimes, FaSpinner } from 'react-icons/fa';
import { uploadToPinata, getIpfsUrl } from '../pinata';

class WelcomeScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      step: 1,
      username: '',
      bio: '',
      avatarFile: null,
      avatarPreview: null,
      usernameAvailable: null,
      checkingUsername: false,
      submitting: false,
      error: ''
    };
    this.usernameTimer = null;
  }

  handleUsernameChange = (e) => {
    const username = e.target.value.replace(/[^a-zA-Z0-9_]/g, '');
    this.setState({ username, usernameAvailable: null, error: '' });

    if (this.usernameTimer) clearTimeout(this.usernameTimer);

    if (username.length >= 3) {
      this.setState({ checkingUsername: true });
      this.usernameTimer = setTimeout(() => this.checkUsername(username), 500);
    }
  }

  checkUsername = async (username) => {
    try {
      const available = await this.props.checkUsername(username);
      this.setState({ usernameAvailable: available, checkingUsername: false });
    } catch (error) {
      this.setState({ checkingUsername: false });
    }
  }

  handleAvatarSelect = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        if (file.size > 5 * 1024 * 1024) {
          this.setState({ error: 'Avatar must be less than 5MB' });
          return;
        }
        const preview = URL.createObjectURL(file);
        this.setState({ avatarFile: file, avatarPreview: preview, error: '' });
      }
    };
    input.click();
  }

  removeAvatar = () => {
    if (this.state.avatarPreview) {
      URL.revokeObjectURL(this.state.avatarPreview);
    }
    this.setState({ avatarFile: null, avatarPreview: null });
  }

  goToStep2 = () => {
    const { username, usernameAvailable } = this.state;
    if (username.length >= 3 && usernameAvailable) {
      this.setState({ step: 2 });
    }
  }

  handleSubmit = async () => {
    const { username, bio, avatarFile } = this.state;
    this.setState({ submitting: true, error: '' });

    try {
      let avatarHash = '';
      if (avatarFile) {
        avatarHash = await uploadToPinata(avatarFile);
      }

      await this.props.onCreateProfile(username, bio, avatarHash);
    } catch (error) {
      console.error('Profile creation failed:', error);
      this.setState({
        error: 'Failed to create profile. Please try again.',
        submitting: false
      });
    }
  }

  renderStep1 = () => {
    const { username, usernameAvailable, checkingUsername, error } = this.state;

    return (
      <div className="welcome-step">
        <div className="welcome-step-number">1 / 2</div>
        <h2 className="welcome-step-title">Choose Your Identity</h2>
        <p className="welcome-step-desc">
          Pick a unique username. This will be your identity on the blockchain.
        </p>

        <div className="welcome-input-group">
          <label className="welcome-label">Username</label>
          <div className="welcome-input-wrapper">
            <span className="welcome-input-prefix">@</span>
            <input
              className="welcome-input"
              type="text"
              placeholder="satoshi_nakamoto"
              value={username}
              onChange={this.handleUsernameChange}
              maxLength={30}
              autoFocus
            />
            <div className="welcome-input-status">
              {checkingUsername && <FaSpinner className="spinning" />}
              {!checkingUsername && usernameAvailable === true && (
                <FaCheck style={{ color: '#00cec9' }} />
              )}
              {!checkingUsername && usernameAvailable === false && (
                <FaTimes style={{ color: '#ff6b6b' }} />
              )}
            </div>
          </div>
          {usernameAvailable === false && (
            <p className="welcome-error">Username is already taken</p>
          )}
          {username.length > 0 && username.length < 3 && (
            <p className="welcome-hint">Minimum 3 characters</p>
          )}
          {usernameAvailable === true && (
            <p className="welcome-success">Username is available!</p>
          )}
        </div>

        {error && <p className="welcome-error">{error}</p>}

        <button
          className="welcome-next-btn"
          onClick={this.goToStep2}
          disabled={!usernameAvailable || username.length < 3}
        >
          Continue →
        </button>
      </div>
    );
  }

  renderStep2 = () => {
    const { username, bio, avatarPreview, submitting, error } = this.state;

    return (
      <div className="welcome-step">
        <div className="welcome-step-number">2 / 2</div>
        <h2 className="welcome-step-title">Complete Your Profile</h2>
        <p className="welcome-step-desc">
          Add a photo and bio. You can always change these later.
        </p>

        <div className="welcome-avatar-section">
          <div
            className="welcome-avatar-picker"
            onClick={this.handleAvatarSelect}
          >
            {avatarPreview ? (
              <img src={avatarPreview} alt="Avatar" className="welcome-avatar-img" />
            ) : (
              <div className="welcome-avatar-placeholder">
                <FaCamera size={24} />
                <span>Add Photo</span>
              </div>
            )}
          </div>
          {avatarPreview && (
            <button className="welcome-avatar-remove" onClick={this.removeAvatar}>
              Remove
            </button>
          )}
        </div>

        <div className="welcome-input-group">
          <label className="welcome-label">Display Name</label>
          <input
            className="welcome-input full"
            type="text"
            value={username}
            disabled
            style={{ opacity: 0.7 }}
          />
        </div>

        <div className="welcome-input-group">
          <label className="welcome-label">Bio (optional)</label>
          <textarea
            className="welcome-textarea"
            placeholder="Tell the world about yourself..."
            value={bio}
            onChange={(e) => this.setState({ bio: e.target.value })}
            maxLength={160}
            rows={3}
          />
          <div className="welcome-char-count">{bio.length}/160</div>
        </div>

        {error && <p className="welcome-error">{error}</p>}

        <div className="welcome-btn-group">
          <button
            className="welcome-back-btn"
            onClick={() => this.setState({ step: 1 })}
            disabled={submitting}
          >
            ← Back
          </button>
          <button
            className="welcome-submit-btn"
            onClick={this.handleSubmit}
            disabled={submitting}
          >
            {submitting ? (
              <>
                <FaSpinner className="spinning" /> Creating Profile...
              </>
            ) : (
              'Create Profile 🚀'
            )}
          </button>
        </div>
      </div>
    );
  }

  render() {
    const { account } = this.props;
    const { step } = this.state;

    return (
      <div className="welcome-container">
        <div className="welcome-background">
          <div className="welcome-orb orb-1"></div>
          <div className="welcome-orb orb-2"></div>
          <div className="welcome-orb orb-3"></div>
        </div>

        <div className="welcome-card">
          <div className="welcome-header">
            <div className="welcome-logo">⛓️</div>
            <h1 className="welcome-title">Welcome to DChain Social</h1>
            <p className="welcome-subtitle">
              The decentralized social network where you own your content
            </p>
          </div>

          <div className="welcome-wallet-info">
            <span className="welcome-wallet-label">Connected Wallet:</span>
            <span className="welcome-wallet-address">
              {account ? `${account.substring(0, 8)}...${account.substring(36)}` : 'Not connected'}
            </span>
          </div>

          {step === 1 && this.renderStep1()}
          {step === 2 && this.renderStep2()}

          <div className="welcome-footer">
            <p>🔒 Your profile is stored permanently on the blockchain</p>
            <p>🌐 No passwords needed - MetaMask is your key</p>
          </div>
        </div>
      </div>
    );
  }
}

export default WelcomeScreen;