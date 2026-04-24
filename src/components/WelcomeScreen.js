// // import React, { Component } from 'react';
// // import { FaCamera, FaCheck, FaTimes, FaSpinner, FaSun, FaMoon } from 'react-icons/fa';
// // import { uploadToPinata } from '../pinata';
// // import { ThemeContext } from '../ThemeContext';

// // class WelcomeScreen extends Component {
// //   static contextType = ThemeContext;

// //   constructor(props) {
// //     super(props);
// //     this.state = {
// //       step: 1,
// //       username: '',
// //       bio: '',
// //       avatarFile: null,
// //       avatarPreview: null,
// //       usernameAvailable: null,
// //       checkingUsername: false,
// //       submitting: false,
// //       error: ''
// //     };
// //     this.usernameTimer = null;
// //   }

// //   handleUsernameChange = (e) => {
// //     const username = e.target.value.replace(/[^a-zA-Z0-9_]/g, '');
// //     this.setState({ username, usernameAvailable: null, error: '' });
// //     if (this.usernameTimer) clearTimeout(this.usernameTimer);
// //     if (username.length >= 3) {
// //       this.setState({ checkingUsername: true });
// //       this.usernameTimer = setTimeout(() => this.checkUsername(username), 500);
// //     }
// //   }

// //   checkUsername = async (username) => {
// //     try {
// //       const available = await this.props.checkUsername(username);
// //       this.setState({ usernameAvailable: available, checkingUsername: false });
// //     } catch (error) {
// //       this.setState({ checkingUsername: false });
// //     }
// //   }

// //   handleAvatarSelect = () => {
// //     const input = document.createElement('input');
// //     input.type = 'file';
// //     input.accept = 'image/*';
// //     input.onchange = (e) => {
// //       const file = e.target.files[0];
// //       if (file) {
// //         if (file.size > 5 * 1024 * 1024) {
// //           this.setState({ error: 'Avatar must be less than 5MB' });
// //           return;
// //         }
// //         const preview = URL.createObjectURL(file);
// //         this.setState({ avatarFile: file, avatarPreview: preview, error: '' });
// //       }
// //     };
// //     input.click();
// //   }

// //   removeAvatar = () => {
// //     if (this.state.avatarPreview) URL.revokeObjectURL(this.state.avatarPreview);
// //     this.setState({ avatarFile: null, avatarPreview: null });
// //   }

// //   goToStep2 = () => {
// //     if (this.state.username.length >= 3 && this.state.usernameAvailable) {
// //       this.setState({ step: 2 });
// //     }
// //   }

// //   handleSubmit = async () => {
// //     const { username, bio, avatarFile } = this.state;
// //     this.setState({ submitting: true, error: '' });
// //     try {
// //       let avatarHash = '';
// //       if (avatarFile) {
// //         avatarHash = await uploadToPinata(avatarFile);
// //       }
// //       await this.props.onCreateProfile(username, bio, avatarHash);
// //     } catch (error) {
// //       this.setState({ error: 'Failed to create profile. Please try again.', submitting: false });
// //     }
// //   }

// //   renderStep1 = () => {
// //     const { username, usernameAvailable, checkingUsername } = this.state;
// //     return (
// //       <div className="welcome-step">
// //         <div className="welcome-step-number">Step 1 of 2</div>
// //         <h2 className="welcome-step-title">Choose Your Identity</h2>
// //         <p className="welcome-step-desc">Pick a unique username for the blockchain.</p>
// //         <div className="welcome-input-group">
// //           <label className="welcome-label">Username</label>
// //           <div className="welcome-input-wrapper">
// //             <span className="welcome-input-prefix">@</span>
// //             <input className="welcome-input" type="text" placeholder="satoshi_nakamoto"
// //               value={username} onChange={this.handleUsernameChange} maxLength={30} autoFocus />
// //             <div className="welcome-input-status">
// //               {checkingUsername && <FaSpinner className="spinning" />}
// //               {!checkingUsername && usernameAvailable === true && <FaCheck style={{ color: 'var(--success)' }} />}
// //               {!checkingUsername && usernameAvailable === false && <FaTimes style={{ color: 'var(--danger)' }} />}
// //             </div>
// //           </div>
// //           {usernameAvailable === false && <p className="welcome-error">Username is already taken</p>}
// //           {username.length > 0 && username.length < 3 && <p className="welcome-hint">Minimum 3 characters</p>}
// //           {usernameAvailable === true && <p className="welcome-success">Username is available! ✓</p>}
// //         </div>
// //         <button className="welcome-next-btn" onClick={this.goToStep2}
// //           disabled={!usernameAvailable || username.length < 3}>Continue →</button>
// //       </div>
// //     );
// //   }

// //   renderStep2 = () => {
// //     const { username, bio, avatarPreview, submitting, error } = this.state;
// //     return (
// //       <div className="welcome-step">
// //         <div className="welcome-step-number">Step 2 of 2</div>
// //         <h2 className="welcome-step-title">Complete Your Profile</h2>
// //         <p className="welcome-step-desc">Add a photo and bio. You can change these later.</p>
// //         <div className="welcome-avatar-section">
// //           <div className="welcome-avatar-picker" onClick={this.handleAvatarSelect}>
// //             {avatarPreview ? (
// //               <img src={avatarPreview} alt="Avatar" className="welcome-avatar-img" />
// //             ) : (
// //               <div className="welcome-avatar-placeholder"><FaCamera size={24} /><span>Add Photo</span></div>
// //             )}
// //           </div>
// //           {avatarPreview && <button className="welcome-avatar-remove" onClick={this.removeAvatar}>Remove</button>}
// //         </div>
// //         <div className="welcome-input-group">
// //           <label className="welcome-label">Display Name</label>
// //           <input className="welcome-input full" type="text" value={`@${username}`} disabled style={{ opacity: 0.7 }} />
// //         </div>
// //         <div className="welcome-input-group">
// //           <label className="welcome-label">Bio (optional)</label>
// //           <textarea className="welcome-textarea" placeholder="Tell the world about yourself..."
// //             value={bio} onChange={(e) => this.setState({ bio: e.target.value })} maxLength={160} rows={3} />
// //           <div className="welcome-char-count">{bio.length}/160</div>
// //         </div>
// //         {error && <p className="welcome-error">{error}</p>}
// //         <div className="welcome-btn-group">
// //           <button className="welcome-back-btn" onClick={() => this.setState({ step: 1 })} disabled={submitting}>← Back</button>
// //           <button className="welcome-submit-btn" onClick={this.handleSubmit} disabled={submitting}>
// //             {submitting ? <><FaSpinner className="spinning" /> Creating...</> : 'Create Profile 🚀'}
// //           </button>
// //         </div>
// //       </div>
// //     );
// //   }

// //   render() {
// //     const { account } = this.props;
// //     const { step } = this.state;
// //     const { theme, toggleTheme } = this.context;

// //     return (
// //       <div className="welcome-container">
// //         <div className="welcome-background">
// //           <div className="welcome-orb orb-1"></div>
// //           <div className="welcome-orb orb-2"></div>
// //           <div className="welcome-orb orb-3"></div>
// //         </div>
// //         <div className="welcome-card">
// //           <div className="welcome-theme-toggle">
// //             <button className="theme-toggle" onClick={toggleTheme}
// //               title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}>
// //               {theme === 'dark' ? <FaSun /> : <FaMoon />}
// //             </button>
// //           </div>
// //           <div className="welcome-header">
// //             <div className="welcome-logo">⛓️</div>
// //             <h1 className="welcome-title">Welcome to DChain Social</h1>
// //             <p className="welcome-subtitle">The decentralized social network where you own your content</p>
// //           </div>
// //           <div className="welcome-wallet-info">
// //             <span className="welcome-wallet-label">Connected Wallet:</span>
// //             <span className="welcome-wallet-address">
// //               {account ? `${account.substring(0, 8)}...${account.substring(36)}` : 'Not connected'}
// //             </span>
// //           </div>
// //           {step === 1 && this.renderStep1()}
// //           {step === 2 && this.renderStep2()}
// //           <div className="welcome-footer">
// //             <p>🔒 Your profile is stored permanently on the blockchain</p>
// //             <p>🌐 No passwords needed — MetaMask is your key</p>
// //           </div>
// //         </div>
// //       </div>
// //     );
// //   }
// // }

// // export default WelcomeScreen;












// // import React, { Component } from 'react';
// // import { FaCamera, FaCheck, FaTimes, FaSpinner, FaSun, FaMoon } from 'react-icons/fa';
// // import { uploadToPinata } from '../pinata';
// // import { ThemeContext } from '../ThemeContext';

// // class WelcomeScreen extends Component {
// //   static contextType = ThemeContext;

// //   constructor(props) {
// //     super(props);
// //     this.state = {
// //       step: 1,
// //       username: '',
// //       bio: '',
// //       avatarFile: null,
// //       avatarPreview: null,
// //       usernameAvailable: null,
// //       checkingUsername: false,
// //       submitting: false,
// //       error: ''
// //     };
// //     this.usernameTimer = null;
// //   }

// //   handleUsernameChange = (e) => {
// //     const username = e.target.value.replace(/[^a-zA-Z0-9_]/g, '');
// //     this.setState({ username, usernameAvailable: null, error: '' });
// //     if (this.usernameTimer) clearTimeout(this.usernameTimer);
// //     if (username.length >= 3) {
// //       this.setState({ checkingUsername: true });
// //       this.usernameTimer = setTimeout(() => this.checkUsername(username), 500);
// //     }
// //   }

// //   checkUsername = async (username) => {
// //     try {
// //       const available = await this.props.checkUsername(username);
// //       this.setState({ usernameAvailable: available, checkingUsername: false });
// //     } catch (error) {
// //       this.setState({ checkingUsername: false });
// //     }
// //   }

// //   handleAvatarSelect = () => {
// //     const input = document.createElement('input');
// //     input.type = 'file';
// //     input.accept = 'image/*';
// //     input.onchange = (e) => {
// //       const file = e.target.files[0];
// //       if (file) {
// //         if (file.size > 5 * 1024 * 1024) {
// //           this.setState({ error: 'Avatar must be less than 5MB' });
// //           return;
// //         }
// //         const preview = URL.createObjectURL(file);
// //         this.setState({ avatarFile: file, avatarPreview: preview, error: '' });
// //       }
// //     };
// //     input.click();
// //   }

// //   removeAvatar = () => {
// //     if (this.state.avatarPreview) URL.revokeObjectURL(this.state.avatarPreview);
// //     this.setState({ avatarFile: null, avatarPreview: null });
// //   }

// //   goToStep2 = () => {
// //     if (this.state.username.length >= 3 && this.state.usernameAvailable) {
// //       this.setState({ step: 2 });
// //     }
// //   }

// //   handleSubmit = async () => {
// //     const { username, bio, avatarFile } = this.state;
// //     this.setState({ submitting: true, error: '' });
// //     try {
// //       let avatarHash = '';
// //       if (avatarFile) {
// //         avatarHash = await uploadToPinata(avatarFile);
// //       }
// //       await this.props.onCreateProfile(username, bio, avatarHash);
// //     } catch (error) {
// //       this.setState({ error: 'Failed to create profile. Please try again.', submitting: false });
// //     }
// //   }

// //   renderStep1 = () => {
// //     const { username, usernameAvailable, checkingUsername } = this.state;
// //     return (
// //       <div className="welcome-step">
// //         <div className="welcome-step-number">Step 1 of 2</div>
// //         <h2 className="welcome-step-title">Choose Your Identity</h2>
// //         <p className="welcome-step-desc">Pick a unique username for the blockchain.</p>
// //         <div className="welcome-input-group">
// //           <label className="welcome-label">Username</label>
// //           <div className="welcome-input-wrapper">
// //             <span className="welcome-input-prefix">@</span>
// //             <input className="welcome-input" type="text" placeholder="satoshi_nakamoto"
// //               value={username} onChange={this.handleUsernameChange} maxLength={30} autoFocus />
// //             <div className="welcome-input-status">
// //               {checkingUsername && <FaSpinner className="spinning" />}
// //               {!checkingUsername && usernameAvailable === true && <FaCheck style={{ color: 'var(--success)' }} />}
// //               {!checkingUsername && usernameAvailable === false && <FaTimes style={{ color: 'var(--danger)' }} />}
// //             </div>
// //           </div>
// //           {usernameAvailable === false && <p className="welcome-error">Username is already taken</p>}
// //           {username.length > 0 && username.length < 3 && <p className="welcome-hint">Minimum 3 characters</p>}
// //           {usernameAvailable === true && <p className="welcome-success">Username is available! ✓</p>}
// //         </div>
// //         <button className="welcome-next-btn" onClick={this.goToStep2}
// //           disabled={!usernameAvailable || username.length < 3}>Continue →</button>
// //       </div>
// //     );
// //   }

// //   renderStep2 = () => {
// //     const { username, bio, avatarPreview, submitting, error } = this.state;
// //     return (
// //       <div className="welcome-step">
// //         <div className="welcome-step-number">Step 2 of 2</div>
// //         <h2 className="welcome-step-title">Complete Your Profile</h2>
// //         <p className="welcome-step-desc">Add a photo and bio. You can change these later.</p>
// //         <div className="welcome-avatar-section">
// //           <div className="welcome-avatar-picker" onClick={this.handleAvatarSelect}>
// //             {avatarPreview ? (
// //               <img src={avatarPreview} alt="Avatar" className="welcome-avatar-img" />
// //             ) : (
// //               <div className="welcome-avatar-placeholder"><FaCamera size={24} /><span>Add Photo</span></div>
// //             )}
// //           </div>
// //           {avatarPreview && <button className="welcome-avatar-remove" onClick={this.removeAvatar}>Remove</button>}
// //         </div>
// //         <div className="welcome-input-group">
// //           <label className="welcome-label">Display Name</label>
// //           <input className="welcome-input full" type="text" value={`@${username}`} disabled style={{ opacity: 0.7 }} />
// //         </div>
// //         <div className="welcome-input-group">
// //           <label className="welcome-label">Bio (optional)</label>
// //           <textarea className="welcome-textarea" placeholder="Tell the world about yourself..."
// //             value={bio} onChange={(e) => this.setState({ bio: e.target.value })} maxLength={160} rows={3} />
// //           <div className="welcome-char-count">{bio.length}/160</div>
// //         </div>
// //         {error && <p className="welcome-error">{error}</p>}
// //         <div className="welcome-btn-group">
// //           <button className="welcome-back-btn" onClick={() => this.setState({ step: 1 })} disabled={submitting}>← Back</button>
// //           <button className="welcome-submit-btn" onClick={this.handleSubmit} disabled={submitting}>
// //             {submitting ? <><FaSpinner className="spinning" /> Creating...</> : 'Create Profile 🚀'}
// //           </button>
// //         </div>
// //       </div>
// //     );
// //   }

// //   render() {
// //     const { account } = this.props;
// //     const { step } = this.state;
// //     const { theme, toggleTheme } = this.context;

// //     if (!account) {
// //       return (
// //         <div className="welcome-container">
// //           <div className="welcome-background">
// //             <div className="welcome-orb orb-1"></div>
// //             <div className="welcome-orb orb-2"></div>
// //             <div className="welcome-orb orb-3"></div>
// //           </div>
// //           <div className="welcome-card">
// //             <div className="welcome-theme-toggle">
// //               <button className="theme-toggle" onClick={toggleTheme}
// //                 title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}>
// //                 {theme === 'dark' ? <FaSun /> : <FaMoon />}
// //               </button>
// //             </div>
// //             <div className="welcome-header">
// //               <div className="welcome-logo">⛓️</div>
// //               <h1 className="welcome-title">Welcome to DChain Social</h1>
// //               <p className="welcome-subtitle">The decentralized social network where you own your content</p>
// //             </div>
// //             <div className="welcome-wallet-info" style={{ textAlign: 'center', marginTop: '2rem', padding: '1.5rem' }}>
// //               <p style={{ fontSize: '1.1rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>
// //                 Please connect your wallet to continue
// //               </p>
// //               <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
// //                 🦊 Make sure MetaMask is installed and unlocked
// //               </p>
// //             </div>
// //             <div className="welcome-footer">
// //               <p>🔒 Your profile is stored permanently on the blockchain</p>
// //               <p>🌐 No passwords needed — MetaMask is your key</p>
// //             </div>
// //           </div>
// //         </div>
// //       );
// //     }

// //     return (
// //       <div className="welcome-container">
// //         <div className="welcome-background">
// //           <div className="welcome-orb orb-1"></div>
// //           <div className="welcome-orb orb-2"></div>
// //           <div className="welcome-orb orb-3"></div>
// //         </div>
// //         <div className="welcome-card">
// //           <div className="welcome-theme-toggle">
// //             <button className="theme-toggle" onClick={toggleTheme}
// //               title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}>
// //               {theme === 'dark' ? <FaSun /> : <FaMoon />}
// //             </button>
// //           </div>
// //           <div className="welcome-header">
// //             <div className="welcome-logo">⛓️</div>
// //             <h1 className="welcome-title">Welcome to DChain Social</h1>
// //             <p className="welcome-subtitle">The decentralized social network where you own your content</p>
// //           </div>
// //           <div className="welcome-wallet-info">
// //             <span className="welcome-wallet-label">Connected Wallet:</span>
// //             <span className="welcome-wallet-address">
// //               {account ? `${account.substring(0, 8)}...${account.substring(36)}` : 'Not connected'}
// //             </span>
// //           </div>
// //           {step === 1 && this.renderStep1()}
// //           {step === 2 && this.renderStep2()}
// //           <div className="welcome-footer">
// //             <p>🔒 Your profile is stored permanently on the blockchain</p>
// //             <p>🌐 No passwords needed — MetaMask is your key</p>
// //           </div>
// //         </div>
// //       </div>
// //     );
// //   }
// // }

// // export default WelcomeScreen;











// import React, { Component } from 'react';
// import { FaCamera, FaCheck, FaTimes, FaSpinner, FaSun, FaMoon, FaWallet } from 'react-icons/fa';
// import { uploadToPinata } from '../pinata';
// import { ThemeContext } from '../ThemeContext';

// class WelcomeScreen extends Component {
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
//       this.setState({ usernameAvailable: available, checkingUsername: false });
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
//         this.setState({ avatarFile: file, avatarPreview: preview, error: '' });
//       }
//     };
//     input.click();
//   }

//   removeAvatar = () => {
//     if (this.state.avatarPreview) URL.revokeObjectURL(this.state.avatarPreview);
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
//       this.setState({ error: 'Failed to create profile. Please try again.', submitting: false });
//     }
//   }

//   handleLogin = () => {
//     this.props.onLogin();
//   }

//   renderStep1 = () => {
//     const { username, usernameAvailable, checkingUsername } = this.state;
//     return (
//       <div className="welcome-step">
//         <div className="welcome-step-number">Step 1 of 2</div>
//         <h2 className="welcome-step-title">Choose Your Identity</h2>
//         <p className="welcome-step-desc">Pick a unique username for the blockchain.</p>
//         <div className="welcome-input-group">
//           <label className="welcome-label">Username</label>
//           <div className="welcome-input-wrapper">
//             <span className="welcome-input-prefix">@</span>
//             <input className="welcome-input" type="text" placeholder="satoshi_nakamoto"
//               value={username} onChange={this.handleUsernameChange} maxLength={30} autoFocus />
//             <div className="welcome-input-status">
//               {checkingUsername && <FaSpinner className="spinning" />}
//               {!checkingUsername && usernameAvailable === true && <FaCheck style={{ color: 'var(--success)' }} />}
//               {!checkingUsername && usernameAvailable === false && <FaTimes style={{ color: 'var(--danger)' }} />}
//             </div>
//           </div>
//           {usernameAvailable === false && <p className="welcome-error">Username is already taken</p>}
//           {username.length > 0 && username.length < 3 && <p className="welcome-hint">Minimum 3 characters</p>}
//           {usernameAvailable === true && <p className="welcome-success">Username is available! ✓</p>}
//         </div>
//         <button className="welcome-next-btn" onClick={this.goToStep2}
//           disabled={!usernameAvailable || username.length < 3}>Continue →</button>
//       </div>
//     );
//   }

//   renderStep2 = () => {
//     const { username, bio, avatarPreview, submitting, error } = this.state;
//     return (
//       <div className="welcome-step">
//         <div className="welcome-step-number">Step 2 of 2</div>
//         <h2 className="welcome-step-title">Complete Your Profile</h2>
//         <p className="welcome-step-desc">Add a photo and bio. You can change these later.</p>
//         <div className="welcome-avatar-section">
//           <div className="welcome-avatar-picker" onClick={this.handleAvatarSelect}>
//             {avatarPreview ? (
//               <img src={avatarPreview} alt="Avatar" className="welcome-avatar-img" />
//             ) : (
//               <div className="welcome-avatar-placeholder"><FaCamera size={24} /><span>Add Photo</span></div>
//             )}
//           </div>
//           {avatarPreview && <button className="welcome-avatar-remove" onClick={this.removeAvatar}>Remove</button>}
//         </div>
//         <div className="welcome-input-group">
//           <label className="welcome-label">Display Name</label>
//           <input className="welcome-input full" type="text" value={`@${username}`} disabled style={{ opacity: 0.7 }} />
//         </div>
//         <div className="welcome-input-group">
//           <label className="welcome-label">Bio (optional)</label>
//           <textarea className="welcome-textarea" placeholder="Tell the world about yourself..."
//             value={bio} onChange={(e) => this.setState({ bio: e.target.value })} maxLength={160} rows={3} />
//           <div className="welcome-char-count">{bio.length}/160</div>
//         </div>
//         {error && <p className="welcome-error">{error}</p>}
//         <div className="welcome-btn-group">
//           <button className="welcome-back-btn" onClick={() => this.setState({ step: 1 })} disabled={submitting}>← Back</button>
//           <button className="welcome-submit-btn" onClick={this.handleSubmit} disabled={submitting}>
//             {submitting ? <><FaSpinner className="spinning" /> Creating...</> : 'Create Profile 🚀'}
//           </button>
//         </div>
//       </div>
//     );
//   }

//   render() {
//     const { account, hasProfile, isWalletConnected } = this.props;
//     const { step } = this.state;
//     const { theme, toggleTheme } = this.context;

//     // SCENARIO 1: No wallet connected
//     if (!isWalletConnected || !account) {
//       return (
//         <div className="welcome-container">
//           <div className="welcome-background">
//             <div className="welcome-orb orb-1"></div>
//             <div className="welcome-orb orb-2"></div>
//             <div className="welcome-orb orb-3"></div>
//           </div>
//           <div className="welcome-card">
//             <div className="welcome-theme-toggle">
//               <button className="theme-toggle" onClick={toggleTheme}
//                 title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}>
//                 {theme === 'dark' ? <FaSun /> : <FaMoon />}
//               </button>
//             </div>
//             <div className="welcome-header">
//               <div className="welcome-logo">⛓️</div>
//               <h1 className="welcome-title">Welcome to DChain Social</h1>
//               <p className="welcome-subtitle">The decentralized social network where you own your content</p>
//             </div>
//             <div className="welcome-wallet-info" style={{ textAlign: 'center', marginTop: '2rem', padding: '1.5rem' }}>
//               <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🦊</div>
//               <p style={{ fontSize: '1.1rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>
//                 Connect Your Wallet to Continue
//               </p>
//               <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
//                 Make sure MetaMask is installed and unlocked
//               </p>
//               <button
//                 className="welcome-connect-btn"
//                 onClick={async () => {
//                   if (window.ethereum) {
//                     try {
//                       await window.ethereum.request({ method: 'eth_requestAccounts' });
//                       window.location.reload();
//                     } catch (error) {
//                       console.error('Connection failed:', error);
//                     }
//                   } else {
//                     window.open('https://metamask.io/download/', '_blank');
//                   }
//                 }}
//               >
//                 <FaWallet style={{ marginRight: '8px' }} />
//                 Connect Wallet
//               </button>
//             </div>
//             <div className="welcome-footer">
//               <p>🔒 Your profile is stored permanently on the blockchain</p>
//               <p>🌐 No passwords needed — MetaMask is your key</p>
//             </div>
//           </div>
//         </div>
//       );
//     }

//     // SCENARIO 2: Wallet connected, existing user (has profile)
//     if (hasProfile) {
//       return (
//         <div className="welcome-container">
//           <div className="welcome-background">
//             <div className="welcome-orb orb-1"></div>
//             <div className="welcome-orb orb-2"></div>
//             <div className="welcome-orb orb-3"></div>
//           </div>
//           <div className="welcome-card">
//             <div className="welcome-theme-toggle">
//               <button className="theme-toggle" onClick={toggleTheme}
//                 title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}>
//                 {theme === 'dark' ? <FaSun /> : <FaMoon />}
//               </button>
//             </div>
//             <div className="welcome-header">
//               <div className="welcome-logo">⛓️</div>
//               <h1 className="welcome-title">Welcome Back!</h1>
//               <p className="welcome-subtitle">Continue to DChain Social</p>
//             </div>
//             <div className="welcome-wallet-info">
//               <span className="welcome-wallet-label">Connected Wallet:</span>
//               <span className="welcome-wallet-address">
//                 {account.substring(0, 8)}...{account.substring(36)}
//               </span>
//             </div>
//             <div style={{ padding: '2rem 0', textAlign: 'center' }}>
//               <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>👋</div>
//               <p style={{ fontSize: '1.1rem', color: 'var(--text-primary)', marginBottom: '2rem' }}>
//                 Ready to dive back in?
//               </p>
//               <button className="welcome-submit-btn" onClick={this.handleLogin}>
//                 Enter DChain Social 🚀
//               </button>
//             </div>
//             <div className="welcome-footer">
//               <p>🔒 Secure blockchain authentication</p>
//               <p>🌐 Your data, your control</p>
//             </div>
//           </div>
//         </div>
//       );
//     }

//     // SCENARIO 3: Wallet connected, new user (create profile)
//     return (
//       <div className="welcome-container">
//         <div className="welcome-background">
//           <div className="welcome-orb orb-1"></div>
//           <div className="welcome-orb orb-2"></div>
//           <div className="welcome-orb orb-3"></div>
//         </div>
//         <div className="welcome-card">
//           <div className="welcome-theme-toggle">
//             <button className="theme-toggle" onClick={toggleTheme}
//               title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}>
//               {theme === 'dark' ? <FaSun /> : <FaMoon />}
//             </button>
//           </div>
//           <div className="welcome-header">
//             <div className="welcome-logo">⛓️</div>
//             <h1 className="welcome-title">Welcome to DChain Social</h1>
//             <p className="welcome-subtitle">The decentralized social network where you own your content</p>
//           </div>
//           <div className="welcome-wallet-info">
//             <span className="welcome-wallet-label">Connected Wallet:</span>
//             <span className="welcome-wallet-address">
//               {account.substring(0, 8)}...{account.substring(36)}
//             </span>
//           </div>
//           {step === 1 && this.renderStep1()}
//           {step === 2 && this.renderStep2()}
//           <div className="welcome-footer">
//             <p>🔒 Your profile is stored permanently on the blockchain</p>
//             <p>🌐 No passwords needed — MetaMask is your key</p>
//           </div>
//         </div>
//       </div>
//     );
//   }
// }

// export default WelcomeScreen;







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