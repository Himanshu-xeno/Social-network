// import React, { Component } from 'react';
// import { FaCamera, FaCheck, FaTimes, FaSpinner, FaArrowLeft, FaSun, FaMoon } from 'react-icons/fa';
// import { uploadToPinata } from '../pinata';
// import { ThemeContext } from '../ThemeContext';

// class CreateProfile extends Component {
//   static contextType = ThemeContext;

//   constructor(props) {
//     super(props);
//     this.state = {
//       step: 1,
//       username: '',
//       bio: '',
//       avatarFile: null,
//       avatarPreview: null,
//       usernameAvailable: null,
//       checkingUsername: false,
//       submitting: false,
//       error: ''
//     };
//     this.usernameTimer = null;
//   }

//   handleUsernameChange = (e) => {
//     const username = e.target.value.replace(/[^a-zA-Z0-9_]/g, '');
//     this.setState({ username, usernameAvailable: null, error: '' });

//     if (this.usernameTimer) clearTimeout(this.usernameTimer);

//     if (username.length >= 3) {
//       this.setState({ checkingUsername: true });
//       this.usernameTimer = setTimeout(() => this.checkUsername(username), 500);
//     }
//   }

//   checkUsername = async (username) => {
//     try {
//       const available = await this.props.checkUsername(username);
//       this.setState({
//         usernameAvailable: available,
//         checkingUsername: false
//       });
//     } catch (error) {
//       this.setState({ checkingUsername: false });
//     }
//   }

//   handleAvatarSelect = () => {
//     const input = document.createElement('input');
//     input.type = 'file';
//     input.accept = 'image/*';
//     input.onchange = (e) => {
//       const file = e.target.files[0];
//       if (file) {
//         if (file.size > 5 * 1024 * 1024) {
//           this.setState({ error: 'Avatar must be less than 5MB' });
//           return;
//         }
//         const preview = URL.createObjectURL(file);
//         this.setState({
//           avatarFile: file,
//           avatarPreview: preview,
//           error: ''
//         });
//       }
//     };
//     input.click();
//   }

//   removeAvatar = () => {
//     if (this.state.avatarPreview) {
//       URL.revokeObjectURL(this.state.avatarPreview);
//     }
//     this.setState({ avatarFile: null, avatarPreview: null });
//   }

//   goToStep2 = () => {
//     if (this.state.username.length >= 3 && this.state.usernameAvailable) {
//       this.setState({ step: 2 });
//     }
//   }

//   handleSubmit = async () => {
//     const { username, bio, avatarFile } = this.state;
//     this.setState({ submitting: true, error: '' });

//     try {
//       let avatarHash = '';
//       if (avatarFile) {
//         avatarHash = await uploadToPinata(avatarFile);
//       }
//       await this.props.onCreateProfile(username, bio, avatarHash);
//     } catch (error) {
//       this.setState({
//         error: 'Failed to create profile. Please try again.',
//         submitting: false
//       });
//     }
//   }

//   renderStep1 = () => {
//     const { username, usernameAvailable, checkingUsername } = this.state;

//     return (
//       <div className="signup-step">
//         <div className="signup-progress">
//           <div className="signup-progress-bar">
//             <div className="signup-progress-fill" style={{ width: '50%' }}></div>
//           </div>
//           <span className="signup-progress-text">Step 1 of 2</span>
//         </div>

//         <h2 className="signup-step-title">Choose Your Username</h2>
//         <p className="signup-step-desc">
//           Pick a unique username that represents you on the blockchain
//         </p>

//         <div className="signup-input-group">
//           <label className="signup-label">Username</label>
//           <div className="signup-input-wrapper">
//             <span className="signup-input-prefix">@</span>
//             <input
//               className="signup-input"
//               type="text"
//               placeholder="your_username"
//               value={username}
//               onChange={this.handleUsernameChange}
//               maxLength={30}
//               autoFocus
//             />
//             <div className="signup-input-status">
//               {checkingUsername && <FaSpinner className="spinning" />}
//               {!checkingUsername && usernameAvailable === true && (
//                 <FaCheck style={{ color: 'var(--success)' }} />
//               )}
//               {!checkingUsername && usernameAvailable === false && (
//                 <FaTimes style={{ color: 'var(--danger)' }} />
//               )}
//             </div>
//           </div>

//           {usernameAvailable === false && (
//             <p className="signup-error">Username is already taken</p>
//           )}
//           {username.length > 0 && username.length < 3 && (
//             <p className="signup-hint">Minimum 3 characters</p>
//           )}
//           {usernameAvailable === true && (
//             <p className="signup-success">Username is available! ✓</p>
//           )}
//         </div>

//         <button
//           className="signup-next-btn"
//           onClick={this.goToStep2}
//           disabled={!usernameAvailable || username.length < 3}
//         >
//           Continue →
//         </button>
//       </div>
//     );
//   }

//   renderStep2 = () => {
//     const { username, bio, avatarPreview, submitting, error } = this.state;

//     return (
//       <div className="signup-step">
//         <div className="signup-progress">
//           <div className="signup-progress-bar">
//             <div className="signup-progress-fill" style={{ width: '100%' }}></div>
//           </div>
//           <span className="signup-progress-text">Step 2 of 2</span>
//         </div>

//         <h2 className="signup-step-title">Complete Your Profile</h2>
//         <p className="signup-step-desc">
//           Add a profile picture and bio (you can change these later)
//         </p>

//         <div className="signup-avatar-section">
//           <div className="signup-avatar-picker" onClick={this.handleAvatarSelect}>
//             {avatarPreview ? (
//               <img src={avatarPreview} alt="Avatar" className="signup-avatar-img" />
//             ) : (
//               <div className="signup-avatar-placeholder">
//                 <FaCamera size={28} />
//                 <span>Add Photo</span>
//               </div>
//             )}
//           </div>
//           {avatarPreview && (
//             <button className="signup-avatar-remove" onClick={this.removeAvatar}>
//               Remove
//             </button>
//           )}
//         </div>

//         <div className="signup-input-group">
//           <label className="signup-label">Username</label>
//           <input
//             className="signup-input"
//             type="text"
//             value={`@${username}`}
//             disabled
//             style={{ opacity: 0.7 }}
//           />
//         </div>

//         <div className="signup-input-group">
//           <label className="signup-label">Bio (Optional)</label>
//           <textarea
//             className="signup-textarea"
//             placeholder="Tell the world about yourself..."
//             value={bio}
//             onChange={(e) => this.setState({ bio: e.target.value })}
//             maxLength={160}
//             rows={3}
//           />
//           <div className="signup-char-count">{bio.length}/160</div>
//         </div>

//         {error && <p className="signup-error">{error}</p>}

//         <div className="signup-btn-group">
//           <button
//             className="signup-back-btn"
//             onClick={() => this.setState({ step: 1 })}
//             disabled={submitting}
//           >
//             ← Back
//           </button>
//           <button
//             className="signup-submit-btn"
//             onClick={this.handleSubmit}
//             disabled={submitting}
//           >
//             {submitting ? (
//               <>
//                 <FaSpinner className="spinning" /> Creating...
//               </>
//             ) : (
//               'Create Profile 🚀'
//             )}
//           </button>
//         </div>
//       </div>
//     );
//   }

//   render() {
//     const { account, onBack } = this.props;
//     const { step } = this.state;
//     const { theme, toggleTheme } = this.context;

//     return (
//       <div className="signup-screen">
//         <div className="signup-background">
//           <div className="signup-orb orb-1"></div>
//           <div className="signup-orb orb-2"></div>
//           <div className="signup-orb orb-3"></div>
//         </div>

//         <div className="signup-container">
//           <button
//             className="signup-theme-toggle"
//             onClick={toggleTheme}
//             title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
//           >
//             {theme === 'dark' ? <FaSun size={20} /> : <FaMoon size={20} />}
//           </button>

//           <div className="signup-card">
//             <button className="signup-back-link" onClick={onBack}>
//               <FaArrowLeft /> Back
//             </button>

//             <div className="signup-header">
//               <div className="signup-logo">⛓️</div>
//               <h1 className="signup-title">Create Your Profile</h1>
//               <p className="signup-subtitle">Join the decentralized social revolution</p>
//             </div>

//             <div className="signup-wallet-info">
//               <span className="signup-wallet-label">Connected Wallet:</span>
//               <span className="signup-wallet-address">
//                 {account.substring(0, 8)}...{account.substring(36)}
//               </span>
//             </div>

//             {step === 1 && this.renderStep1()}
//             {step === 2 && this.renderStep2()}

//             <div className="signup-footer">
//               <p>🔒 Your profile is stored permanently on the blockchain</p>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }
// }

// export default CreateProfile;












import React, { Component } from 'react';
import { FaCamera, FaCheck, FaTimes, FaSpinner, FaArrowLeft, FaSun, FaMoon } from 'react-icons/fa';
import { uploadToPinata } from '../pinata';
import { ThemeContext } from '../ThemeContext';
import './CreateProfile.css';

class CreateProfile extends Component {
  static contextType = ThemeContext;

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

  componentWillUnmount() {
    if (this.usernameTimer) {
      clearTimeout(this.usernameTimer);
    }
    if (this.state.avatarPreview) {
      URL.revokeObjectURL(this.state.avatarPreview);
    }
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
      this.setState({
        usernameAvailable: available,
        checkingUsername: false
      });
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
        this.setState({
          avatarFile: file,
          avatarPreview: preview,
          error: ''
        });
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
    if (this.state.username.length >= 3 && this.state.usernameAvailable) {
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
      this.setState({
        error: 'Failed to create profile. Please try again.',
        submitting: false
      });
    }
  }

  renderStep1 = () => {
    const { username, usernameAvailable, checkingUsername } = this.state;

    return (
      <div className="profile-step">
        <div className="profile-progress">
          <div className="profile-progress-bar">
            <div className="profile-progress-fill" style={{ width: '50%' }}></div>
          </div>
          <span className="profile-progress-text">Step 1 of 2</span>
        </div>

        <h2 className="profile-step-title">Choose Your Username</h2>
        <p className="profile-step-desc">
          Pick a unique username that represents you on the blockchain
        </p>

        <div className="profile-input-group">
          <label className="profile-label">Username</label>
          <div className="profile-input-wrapper">
            <span className="profile-input-prefix">@</span>
            <input
              className="profile-input"
              type="text"
              placeholder="your_username"
              value={username}
              onChange={this.handleUsernameChange}
              maxLength={30}
              autoFocus
            />
            <div className="profile-input-status">
              {checkingUsername && <FaSpinner className="spinning" />}
              {!checkingUsername && usernameAvailable === true && (
                <FaCheck style={{ color: 'var(--success)' }} />
              )}
              {!checkingUsername && usernameAvailable === false && (
                <FaTimes style={{ color: 'var(--danger)' }} />
              )}
            </div>
          </div>

          {usernameAvailable === false && (
            <p className="profile-error">Username is already taken</p>
          )}
          {username.length > 0 && username.length < 3 && (
            <p className="profile-hint">Minimum 3 characters</p>
          )}
          {usernameAvailable === true && (
            <p className="profile-success">Username is available! ✓</p>
          )}
        </div>

        <button
          className="profile-next-btn"
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
      <div className="profile-step">
        <div className="profile-progress">
          <div className="profile-progress-bar">
            <div className="profile-progress-fill" style={{ width: '100%' }}></div>
          </div>
          <span className="profile-progress-text">Step 2 of 2</span>
        </div>

        <h2 className="profile-step-title">Complete Your Profile</h2>
        <p className="profile-step-desc">
          Add a profile picture and bio (you can change these later)
        </p>

        <div className="profile-avatar-section">
          <div className="profile-avatar-picker" onClick={this.handleAvatarSelect}>
            {avatarPreview ? (
              <img src={avatarPreview} alt="Avatar" className="profile-avatar-img" />
            ) : (
              <div className="profile-avatar-placeholder">
                <FaCamera size={28} />
                <span>Add Photo</span>
              </div>
            )}
          </div>
          {avatarPreview && (
            <button className="profile-avatar-remove" onClick={this.removeAvatar}>
              Remove
            </button>
          )}
        </div>

        <div className="profile-input-group">
          <label className="profile-label">Username</label>
          <input
            className="profile-input"
            type="text"
            value={`@${username}`}
            disabled
            style={{ opacity: 0.7 }}
          />
        </div>

        <div className="profile-input-group">
          <label className="profile-label">Bio (Optional)</label>
          <textarea
            className="profile-textarea"
            placeholder="Tell the world about yourself..."
            value={bio}
            onChange={(e) => this.setState({ bio: e.target.value })}
            maxLength={160}
            rows={3}
          />
          <div className="profile-char-count">{bio.length}/160</div>
        </div>

        {error && <p className="profile-error">{error}</p>}

        <div className="profile-btn-group">
          <button
            className="profile-back-btn"
            onClick={() => this.setState({ step: 1 })}
            disabled={submitting}
          >
            ← Back
          </button>
          <button
            className="profile-submit-btn"
            onClick={this.handleSubmit}
            disabled={submitting}
          >
            {submitting ? (
              <>
                <FaSpinner className="spinning" /> Creating...
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
    const { account, onLogout } = this.props;
    const { step } = this.state;
    const { theme, toggleTheme } = this.context;

    return (
      <div className="create-profile-screen">
        {/* Animated Background */}
        <div className="profile-bg">
          <div className="profile-orb orb-1"></div>
          <div className="profile-orb orb-2"></div>
          <div className="profile-orb orb-3"></div>
        </div>

        {/* Theme Toggle */}
        <button
          className="profile-theme-toggle"
          onClick={toggleTheme}
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <FaSun size={20} /> : <FaMoon size={20} />}
        </button>

        {/* Main Container */}
        <div className="profile-container">
          <div className="profile-card">
            {/* Back Button */}
            <button className="profile-back-link" onClick={onLogout}>
              <FaArrowLeft /> Back
            </button>

            {/* Header */}
            <div className="profile-header">
              <div className="profile-logo">⛓️</div>
              <h1 className="profile-title">Create Your Profile</h1>
              <p className="profile-subtitle">Join the decentralized social revolution</p>
            </div>

            {/* Wallet Info */}
            <div className="profile-wallet-info">
              <span className="profile-wallet-label">Connected Wallet:</span>
              <span className="profile-wallet-address">
                {account.substring(0, 8)}...{account.substring(36)}
              </span>
            </div>

            {/* Steps */}
            {step === 1 && this.renderStep1()}
            {step === 2 && this.renderStep2()}

            {/* Footer */}
            <div className="profile-footer">
              <p>🔒 Your profile is stored permanently on the blockchain</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default CreateProfile;