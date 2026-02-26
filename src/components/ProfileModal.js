import React, { Component } from 'react';

class ProfileModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: props.currentUsername || '',
    };
  }

  handleSave = () => {
    const { username } = this.state;
    if (username.trim()) {
      this.props.onSave(username.trim());
    }
  }

  render() {
    const { onClose } = this.props;
    const { username } = this.state;

    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <h2 className="modal-title">✨ Edit Profile</h2>

          <label style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '6px', display: 'block' }}>
            Display Name
          </label>
          <input
            className="modal-input"
            type="text"
            placeholder="Enter your display name"
            value={username}
            onChange={(e) => this.setState({ username: e.target.value })}
            maxLength={30}
            onKeyPress={(e) => e.key === 'Enter' && this.handleSave()}
          />

          <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '16px' }}>
            Your name will be stored on the blockchain and visible to everyone.
          </p>

          <div className="modal-actions">
            <button className="modal-btn secondary" onClick={onClose}>
              Cancel
            </button>
            <button
              className="modal-btn primary"
              onClick={this.handleSave}
              disabled={!username.trim()}
            >
              Save Profile
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default ProfileModal;