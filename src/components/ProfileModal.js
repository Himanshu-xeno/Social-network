import React, { Component } from 'react';
import { FaUserCircle, FaTimes, FaCamera } from 'react-icons/fa';

class ProfileModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: props.currentUsername || '',
      bio: props.currentProfile?.bio || '',
      saving: false,
      imageLoaded: false
    };
  }

  // 🚀 SUPERFAST PROFILE PIC
  getIPFSUrl = (hash) => {
    if (!hash) return '';
    return `https://gateway.pinata.cloud/ipfs/${hash}`;
  }

  handleSave = async () => {
    const { username, bio } = this.state;
    if (username.trim()) {
      this.setState({ saving: true });
      try {
        await this.props.onSave(username.trim(), bio.trim());
        this.setState({ saving: false });
      } catch (error) {
        this.setState({ saving: false });
        alert('Failed to save profile: ' + error.message);
      }
    }
  }

  formatAddress = (address) => {
    if (!address) return '';
    return `${address.substring(0, 6)}...${address.substring(38)}`;
  }

  render() {
    const { onClose, currentProfile = {}, currentAccount = '' } = this.props;
    const { username, bio, saving, imageLoaded } = this.state;

    return (
      <div className="profile-modal-overlay" onClick={onClose}>
        <div className="profile-modal-container" onClick={(e) => e.stopPropagation()}>

          {/* Modal Header */}
          <div className="profile-modal-header">
            <h2 className="profile-modal-title">✨ Edit Profile</h2>
            <button className="profile-modal-close" onClick={onClose}>
              <FaTimes />
            </button>
          </div>

          {/* Scrollable Content */}
          <div className="profile-modal-scroll">
            <div className="profile-modal-content">

              {/* LEFT SIDE - Big Profile Image */}
              <div className="profile-image-section">
                <div className="big-profile-container">
                  {currentProfile.avatarHash && !imageLoaded && (
                    <div className="profile-loading">
                      <div className="profile-spinner"></div>
                    </div>
                  )}

                  {currentProfile.avatarHash ? (
                    <img
                      src={this.getIPFSUrl(currentProfile.avatarHash)}
                      alt="Profile"
                      className={`big-profile-image ${imageLoaded ? 'loaded' : 'loading'}`}
                      onLoad={() => this.setState({ imageLoaded: true })}
                      loading="eager"
                    />
                  ) : (
                    <div className="big-profile-placeholder">
                      <FaUserCircle className="big-profile-icon" />
                    </div>
                  )}

                  <div className="profile-camera-overlay">
                    <FaCamera />
                    <span>Change Photo</span>
                  </div>
                </div>

                {/* User Address */}
                <div className="profile-address-display">
                  <span className="address-label">Wallet Address</span>
                  <span className="address-value">{this.formatAddress(currentAccount)}</span>
                </div>
              </div>

              {/* RIGHT SIDE - Form Content */}
              <div className="profile-form-section">

                <div className="current-profile-info">
                  <h3 className="current-username">
                    {currentProfile.username || 'No username set'}
                  </h3>
                  <p className="profile-status">
                    {currentProfile.username ? 'Profile set up' : 'Complete your profile'}
                  </p>
                </div>

                <div className="profile-edit-form">
                  <div className="form-group">
                    <label className="form-label">Display Name</label>
                    <input
                      className="profile-input"
                      type="text"
                      placeholder="Enter your display name"
                      value={username}
                      onChange={(e) => this.setState({ username: e.target.value.replace(/[^a-zA-Z0-9_\s]/g, '') })}
                      maxLength={30}
                      autoFocus
                    />
                    <span className="char-counter">
                      {30 - username.length} characters remaining
                    </span>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Bio</label>
                    <textarea
                      className="profile-textarea"
                      placeholder="Tell us about yourself..."
                      value={bio}
                      onChange={(e) => this.setState({ bio: e.target.value })}
                      maxLength={160}
                      rows={3}
                    />
                    <span className="char-counter">
                      {160 - bio.length} characters remaining
                    </span>
                  </div>

                  <div className="profile-info-box">
                    <div className="info-icon">💡</div>
                    <div className="info-text">
                      <strong>Your identity on the blockchain</strong>
                      <p>This information will be stored permanently and visible to all users. Choose wisely!</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Fixed Footer - Action Buttons always visible */}
          <div className="profile-modal-footer">
            <div className="profile-actions">
              <button
                className="profile-btn secondary"
                onClick={onClose}
                disabled={saving}
              >
                Cancel
              </button>
              <button
                className="profile-btn primary"
                onClick={this.handleSave}
                disabled={!username.trim() || saving}
              >
                {saving ? (
                  <>
                    <div className="btn-spinner"></div>
                    Saving...
                  </>
                ) : (
                  'Save Profile'
                )}
              </button>
            </div>
          </div>

        </div>
      </div>
    );
  }
}

export default ProfileModal;