// // import React, { Component } from 'react';
// // import Identicon from 'identicon.js';
// // import { FaHeart, FaRegHeart, FaEthereum, FaComment, FaMusic } from 'react-icons/fa';
// // import { getIpfsUrl } from '../pinata';

// // class PostCard extends Component {
// //   constructor(props) {
// //     super(props);
// //     this.state = {
// //       showTip: false,
// //       showComments: false,
// //       tipAmount: '',
// //       commentText: '',
// //       lightbox: false
// //     };
// //   }

// //   toggleTip = () => {
// //     this.setState(prev => ({ showTip: !prev.showTip, showComments: false }));
// //   }

// //   toggleComments = () => {
// //     this.setState(prev => ({ showComments: !prev.showComments, showTip: false }));
// //   }

// //   handleTip = () => {
// //     const { tipAmount } = this.state;
// //     const { post } = this.props;
// //     if (!tipAmount || parseFloat(tipAmount) <= 0) return;
// //     const tipWei = window.web3.utils.toWei(tipAmount, 'Ether');
// //     this.props.tipPost(post.id, tipWei);
// //     this.setState({ tipAmount: '', showTip: false });
// //   }

// //   handleQuickTip = (amount) => {
// //     const { post } = this.props;
// //     const tipWei = window.web3.utils.toWei(amount, 'Ether');
// //     this.props.tipPost(post.id, tipWei);
// //     this.setState({ showTip: false });
// //   }

// //   handleLike = () => {
// //     const { post, hasLiked } = this.props;
// //     if (hasLiked) {
// //       this.props.unlikePost(post.id);
// //     } else {
// //       this.props.likePost(post.id);
// //     }
// //   }

// //   handleComment = () => {
// //     const { commentText } = this.state;
// //     const { post } = this.props;
// //     if (!commentText.trim()) return;
// //     this.props.addComment(post.id, commentText);
// //     this.setState({ commentText: '' });
// //   }

// //   formatTime = (timestamp) => {
// //     const date = new Date(Number(timestamp) * 1000);
// //     const now = new Date();
// //     const diff = Math.floor((now - date) / 1000);
// //     if (diff < 60) return 'Just now';
// //     if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
// //     if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
// //     if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
// //     return date.toLocaleDateString();
// //   }

// //   formatEth = (wei) => {
// //     if (!wei || wei === '0') return '0';
// //     const eth = window.web3.utils.fromWei(wei.toString(), 'Ether');
// //     return parseFloat(eth).toFixed(4);
// //   }

// //   getMediaTypeBadge = (type) => {
// //     const badges = {
// //       image: { cls: 'badge-image', label: '📷 Image' },
// //       video: { cls: 'badge-video', label: '🎬 Video' },
// //       audio: { cls: 'badge-audio', label: '🎵 Audio' },
// //       text: { cls: 'badge-text', label: '📝 Text' }
// //     };
// //     const badge = badges[type] || badges.text;
// //     return <span className={`post-media-type-badge ${badge.cls}`}>{badge.label}</span>;
// //   }

// //   renderMedia = () => {
// //     const { post } = this.props;
// //     if (!post.mediaHash || post.mediaHash === '') return null;

// //     const url = getIpfsUrl(post.mediaHash);

// //     return (
// //       <div className="post-media">
// //         {post.mediaType === 'image' && (
// //           <img
// //             src={url}
// //             alt="Post"
// //             onClick={() => this.setState({ lightbox: true })}
// //             onError={(e) => { e.target.style.display = 'none'; }}
// //           />
// //         )}
// //         {post.mediaType === 'video' && (
// //           <video src={url} controls preload="metadata"
// //             onError={(e) => { e.target.style.display = 'none'; }}
// //           />
// //         )}
// //         {post.mediaType === 'audio' && (
// //           <div className="audio-container">
// //             <FaMusic className="audio-icon" />
// //             <audio src={url} controls style={{ width: '100%' }}
// //               onError={(e) => { e.target.parentElement.style.display = 'none'; }}
// //             />
// //           </div>
// //         )}
// //       </div>
// //     );
// //   }

// //   render() {
// //     const { post, hasLiked, comments, profiles, onProfileClick } = this.props;
// //     const { showTip, showComments, tipAmount, commentText, lightbox } = this.state;

// //     const authorProfile = profiles[post.author];
// //     const authorName = authorProfile && authorProfile.username
// //       ? authorProfile.username
// //       : `${post.author.substring(0, 6)}...${post.author.substring(38)}`;

// //     const authorAvatar = authorProfile && authorProfile.avatarHash
// //       ? getIpfsUrl(authorProfile.avatarHash)
// //       : null;

// //     return (
// //       <div className="post-card">
// //         {/* Header */}
// //         <div className="post-header">
// //           <div
// //             className="post-author-info"
// //             style={{ cursor: 'pointer' }}
// //             onClick={() => onProfileClick && onProfileClick(post.author)}
// //           >
// //             <div className="post-identicon">
// //               {authorAvatar ? (
// //                 <img src={authorAvatar} alt="Author" style={{ objectFit: 'cover' }} />
// //               ) : (
// //                 <img
// //                   src={`data:image/png;base64,${new Identicon(post.author, 40).toString()}`}
// //                   alt="Author"
// //                 />
// //               )}
// //             </div>
// //             <div className="author-details">
// //               <div className="author-name">{authorName}</div>
// //               <div className="author-address">
// //                 {post.author.substring(0, 10)}...{post.author.substring(36)}
// //               </div>
// //             </div>
// //           </div>
// //           <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
// //             <span className="post-time">{this.formatTime(post.timestamp)}</span>
// //             {this.getMediaTypeBadge(post.mediaType || 'text')}
// //           </div>
// //         </div>

// //         {/* Content */}
// //         <div className="post-content">
// //           {post.content && <p className="post-text">{post.content}</p>}
// //           {this.renderMedia()}
// //         </div>

// //         {/* Stats */}
// //         <div className="post-stats">
// //           <span>
// //             <FaHeart style={{ color: Number(post.likeCount) > 0 ? '#ff6b6b' : 'inherit' }} />
// //             {post.likeCount?.toString() || '0'} likes
// //           </span>
// //           <span><FaComment /> {post.commentCount?.toString() || '0'} comments</span>
// //           <span className="tip-display">
// //             <FaEthereum /> {this.formatEth(post.tipAmount)} ETH
// //           </span>
// //         </div>

// //         {/* Actions */}
// //         <div className="post-actions">
// //           <button className={`action-btn like-btn ${hasLiked ? 'liked' : ''}`} onClick={this.handleLike}>
// //             {hasLiked ? <FaHeart className="icon" /> : <FaRegHeart className="icon" />}
// //             {hasLiked ? 'Liked' : 'Like'}
// //           </button>
// //           <button className="action-btn comment-btn" onClick={this.toggleComments}>
// //             <FaComment className="icon" /> Comment
// //           </button>
// //           <button className="action-btn tip-btn" onClick={this.toggleTip}>
// //             <FaEthereum className="icon" /> Tip
// //           </button>
// //         </div>

// //         {/* Tip Section */}
// //         {showTip && (
// //           <div className="tip-section">
// //             <div className="tip-quick-btns">
// //               <button className="tip-quick-btn" onClick={() => this.handleQuickTip('0.01')}>0.01 ETH</button>
// //               <button className="tip-quick-btn" onClick={() => this.handleQuickTip('0.05')}>0.05 ETH</button>
// //               <button className="tip-quick-btn" onClick={() => this.handleQuickTip('0.1')}>0.1 ETH</button>
// //             </div>
// //             <input
// //               className="tip-input"
// //               type="number"
// //               step="0.01"
// //               min="0"
// //               placeholder="Custom amount (ETH)"
// //               value={tipAmount}
// //               onChange={(e) => this.setState({ tipAmount: e.target.value })}
// //             />
// //             <button className="tip-send-btn" onClick={this.handleTip}>Send</button>
// //           </div>
// //         )}

// //         {/* Comments */}
// //         {showComments && (
// //           <div className="comment-section">
// //             <div className="comment-input-wrapper">
// //               <input
// //                 className="comment-input"
// //                 type="text"
// //                 placeholder="Write a comment..."
// //                 value={commentText}
// //                 onChange={(e) => this.setState({ commentText: e.target.value })}
// //                 onKeyPress={(e) => e.key === 'Enter' && this.handleComment()}
// //               />
// //               <button className="comment-submit-btn" onClick={this.handleComment}>Post</button>
// //             </div>
// //             {comments && comments.map((comment, idx) => {
// //               const commenterProfile = profiles[comment.author];
// //               const commenterName = commenterProfile?.username ||
// //                 `${comment.author.substring(0, 8)}...${comment.author.substring(38)}`;
// //               return (
// //                 <div className="comment-item" key={idx}>
// //                   <div className="comment-identicon">
// //                     {commenterProfile?.avatarHash ? (
// //                       <img src={getIpfsUrl(commenterProfile.avatarHash)} alt="Commenter" style={{ objectFit: 'cover' }} />
// //                     ) : (
// //                       <img
// //                         src={`data:image/png;base64,${new Identicon(comment.author, 28).toString()}`}
// //                         alt="Commenter"
// //                       />
// //                     )}
// //                   </div>
// //                   <div className="comment-body">
// //                     <div className="comment-author">{commenterName}</div>
// //                     <div className="comment-text">{comment.content}</div>
// //                     <div className="comment-time">{this.formatTime(comment.timestamp)}</div>
// //                   </div>
// //                 </div>
// //               );
// //             })}
// //             {(!comments || comments.length === 0) && (
// //               <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textAlign: 'center', padding: '8px' }}>
// //                 No comments yet. Be the first!
// //               </p>
// //             )}
// //           </div>
// //         )}

// //         {/* Lightbox */}
// //         {lightbox && post.mediaHash && (
// //           <div className="lightbox-overlay" onClick={() => this.setState({ lightbox: false })}>
// //             <img src={getIpfsUrl(post.mediaHash)} alt="Full" />
// //           </div>
// //         )}
// //       </div>
// //     );
// //   }
// // }

// // export default PostCard;



















// import React, { Component } from 'react';
// import Identicon from 'identicon.js';
// import { FaHeart, FaRegHeart, FaEthereum, FaComment, FaMusic, FaPaperPlane } from 'react-icons/fa';
// import { getIpfsUrl } from '../pinata';

// class PostCard extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       showTip: false,
//       showComments: false,
//       tipAmount: '',
//       commentText: '',
//       lightbox: false
//     };
//   }

//   toggleTip = () => {
//     this.setState(prev => ({
//       showTip: !prev.showTip,
//       showComments: false
//     }));
//   }

//   toggleComments = () => {
//     this.setState(prev => ({
//       showComments: !prev.showComments,
//       showTip: false
//     }));
//   }

//   handleTip = () => {
//     const { tipAmount } = this.state;
//     const { post } = this.props;
//     if (!tipAmount || parseFloat(tipAmount) <= 0) return;
//     const tipWei = window.web3.utils.toWei(tipAmount, 'Ether');
//     this.props.tipPost(post.id, tipWei);
//     this.setState({ tipAmount: '', showTip: false });
//   }

//   handleQuickTip = (amount) => {
//     const { post } = this.props;
//     const tipWei = window.web3.utils.toWei(amount, 'Ether');
//     this.props.tipPost(post.id, tipWei);
//     this.setState({ showTip: false });
//   }

//   handleLike = () => {
//     const { post, hasLiked } = this.props;
//     if (hasLiked) {
//       this.props.unlikePost(post.id);
//     } else {
//       this.props.likePost(post.id);
//     }
//   }

//   handleComment = () => {
//     const { commentText } = this.state;
//     const { post } = this.props;
//     if (!commentText.trim()) return;
//     this.props.addComment(post.id, commentText);
//     this.setState({ commentText: '' });
//   }

//   formatTime = (timestamp) => {
//     const date = new Date(Number(timestamp) * 1000);
//     const now = new Date();
//     const diff = Math.floor((now - date) / 1000);

//     if (diff < 60) return 'Just now';
//     if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
//     if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
//     if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;

//     return date.toLocaleDateString('en-US', {
//       month: 'short',
//       day: 'numeric'
//     });
//   }

//   formatEth = (wei) => {
//     if (!wei || wei === '0') return '0';
//     const eth = window.web3.utils.fromWei(wei.toString(), 'Ether');
//     return parseFloat(eth).toFixed(4);
//   }

//   renderMedia = () => {
//     const { post } = this.props;
//     if (!post.mediaHash || post.mediaHash === '') return null;

//     const url = getIpfsUrl(post.mediaHash);

//     return (
//       <div className="modern-post-media">
//         {post.mediaType === 'image' && (
//           <img
//             src={url}
//             alt="Post media"
//             onClick={() => this.setState({ lightbox: true })}
//             onError={(e) => { e.target.style.display = 'none'; }}
//           />
//         )}
//         {post.mediaType === 'video' && (
//           <video
//             src={url}
//             controls
//             preload="metadata"
//             onError={(e) => { e.target.style.display = 'none'; }}
//           />
//         )}
//         {post.mediaType === 'audio' && (
//           <div className="modern-audio-player">
//             <FaMusic className="audio-icon" />
//             <audio
//               src={url}
//               controls
//               onError={(e) => { e.target.parentElement.style.display = 'none'; }}
//             />
//           </div>
//         )}
//       </div>
//     );
//   }

//   render() {
//     const { post, hasLiked, comments, profiles, onProfileClick } = this.props;
//     const { showTip, showComments, tipAmount, commentText, lightbox } = this.state;

//     const authorProfile = profiles[post.author];
//     const authorName = authorProfile?.username ||
//       `${post.author.substring(0, 6)}...${post.author.substring(38)}`;
//     const authorAvatar = authorProfile?.avatarHash ?
//       getIpfsUrl(authorProfile.avatarHash) : null;

//     return (
//       <div className="modern-post-card">
//         {/* Post Header */}
//         <div className="modern-post-header">
//           <div
//             className="post-author-section"
//             onClick={() => onProfileClick && onProfileClick(post.author)}
//           >
//             <div className="modern-avatar">
//               {authorAvatar ? (
//                 <img src={authorAvatar} alt={authorName} />
//               ) : (
//                 <img
//                   src={`data:image/png;base64,${new Identicon(post.author, 40).toString()}`}
//                   alt={authorName}
//                 />
//               )}
//             </div>
//             <div className="author-info">
//               <div className="author-name">{authorName}</div>
//               <div className="post-time">{this.formatTime(post.timestamp)}</div>
//             </div>
//           </div>

//           {post.mediaType && post.mediaType !== 'text' && (
//             <span className={`media-badge badge-${post.mediaType}`}>
//               {post.mediaType === 'image' && '📷'}
//               {post.mediaType === 'video' && '🎬'}
//               {post.mediaType === 'audio' && '🎵'}
//             </span>
//           )}
//         </div>

//         {/* Post Content */}
//         <div className="modern-post-body">
//           {post.content && (
//             <p className="post-content-text">{post.content}</p>
//           )}
//           {this.renderMedia()}
//         </div>

//         {/* Post Stats */}
//         <div className="modern-post-stats">
//           <div className="stat-group">
//             <span className="stat-item">
//               <FaHeart className="stat-icon liked" />
//               {post.likeCount?.toString() || '0'}
//             </span>
//             <span className="stat-item">
//               <FaComment className="stat-icon" />
//               {post.commentCount?.toString() || '0'}
//             </span>
//           </div>
//           <span className="stat-item tip-stat">
//             <FaEthereum className="stat-icon" />
//             {this.formatEth(post.tipAmount)} ETH
//           </span>
//         </div>

//         {/* Post Actions */}
//         <div className="modern-post-actions">
//           <button
//             className={`action-btn ${hasLiked ? 'active-like' : ''}`}
//             onClick={this.handleLike}
//           >
//             {hasLiked ? <FaHeart /> : <FaRegHeart />}
//             <span>{hasLiked ? 'Liked' : 'Like'}</span>
//           </button>

//           <button
//             className={`action-btn ${showComments ? 'active' : ''}`}
//             onClick={this.toggleComments}
//           >
//             <FaComment />
//             <span>Comment</span>
//           </button>

//           <button
//             className={`action-btn ${showTip ? 'active' : ''}`}
//             onClick={this.toggleTip}
//           >
//             <FaEthereum />
//             <span>Tip</span>
//           </button>
//         </div>

//         {/* Tip Section */}
//         {showTip && (
//           <div className="modern-tip-section">
//             <div className="quick-tip-buttons">
//               <button onClick={() => this.handleQuickTip('0.01')}>
//                 0.01 ETH
//               </button>
//               <button onClick={() => this.handleQuickTip('0.05')}>
//                 0.05 ETH
//               </button>
//               <button onClick={() => this.handleQuickTip('0.1')}>
//                 0.1 ETH
//               </button>
//             </div>
//             <div className="custom-tip-input">
//               <input
//                 type="number"
//                 step="0.01"
//                 min="0"
//                 placeholder="Custom amount"
//                 value={tipAmount}
//                 onChange={(e) => this.setState({ tipAmount: e.target.value })}
//               />
//               <button onClick={this.handleTip}>
//                 <FaPaperPlane /> Send
//               </button>
//             </div>
//           </div>
//         )}

//         {/* Comments Section */}
//         {showComments && (
//           <div className="modern-comments-section">
//             <div className="comment-input-container">
//               <input
//                 type="text"
//                 placeholder="Write a comment..."
//                 value={commentText}
//                 onChange={(e) => this.setState({ commentText: e.target.value })}
//                 onKeyPress={(e) => e.key === 'Enter' && this.handleComment()}
//               />
//               <button onClick={this.handleComment}>
//                 <FaPaperPlane />
//               </button>
//             </div>

//             <div className="comments-list">
//               {comments && comments.length > 0 ? (
//                 comments.map((comment, idx) => {
//                   const commenterProfile = profiles[comment.author];
//                   const commenterName = commenterProfile?.username ||
//                     `${comment.author.substring(0, 8)}...`;
//                   const commenterAvatar = commenterProfile?.avatarHash ?
//                     getIpfsUrl(commenterProfile.avatarHash) : null;

//                   return (
//                     <div className="comment-item" key={idx}>
//                       <div className="comment-avatar">
//                         {commenterAvatar ? (
//                           <img src={commenterAvatar} alt={commenterName} />
//                         ) : (
//                           <img
//                             src={`data:image/png;base64,${new Identicon(comment.author, 28).toString()}`}
//                             alt={commenterName}
//                           />
//                         )}
//                       </div>
//                       <div className="comment-content">
//                         <div className="comment-header">
//                           <span className="commenter-name">{commenterName}</span>
//                           <span className="comment-time">
//                             {this.formatTime(comment.timestamp)}
//                           </span>
//                         </div>
//                         <p className="comment-text">{comment.content}</p>
//                       </div>
//                     </div>
//                   );
//                 })
//               ) : (
//                 <p className="no-comments">No comments yet. Be the first!</p>
//               )}
//             </div>
//           </div>
//         )}

//         {/* Lightbox */}
//         {lightbox && post.mediaHash && (
//           <div
//             className="modern-lightbox"
//             onClick={() => this.setState({ lightbox: false })}
//           >
//             <img src={getIpfsUrl(post.mediaHash)} alt="Full size" />
//           </div>
//         )}
//       </div>
//     );
//   }
// }

// export default PostCard;


















import React, { Component } from 'react';
import Identicon from 'identicon.js';
import Web3 from 'web3'; // ADD THIS IMPORT
import { FaHeart, FaRegHeart, FaEthereum, FaComment, FaMusic, FaPaperPlane } from 'react-icons/fa';
import { getIpfsUrl } from '../pinata';

class PostCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showTip: false,
      showComments: false,
      tipAmount: '',
      commentText: '',
      lightbox: false
    };
  }

  // Helper to get Web3 instance safely
  getWeb3 = () => {
    if (window.web3) {
      return window.web3;
    } else if (window.ethereum) {
      return new Web3(window.ethereum);
    }
    return null;
  }

  toggleTip = () => {
    this.setState(prev => ({
      showTip: !prev.showTip,
      showComments: false,
      tipAmount: ''
    }));
  }

  toggleComments = () => {
    this.setState(prev => ({
      showComments: !prev.showComments,
      showTip: false
    }));
  }

  handleTip = async () => {
    const { tipAmount } = this.state;
    const { post, tipPost } = this.props;

    // Get Web3 instance
    const web3 = this.getWeb3();
    if (!web3) {
      alert('Please connect your wallet first');
      return;
    }

    // Validation
    if (!tipAmount || tipAmount === '' || parseFloat(tipAmount) <= 0) {
      alert('Please enter a valid tip amount');
      return;
    }

    try {
      const tipWei = web3.utils.toWei(tipAmount.toString(), 'Ether');
      await tipPost(post.id, tipWei);
      this.setState({ tipAmount: '', showTip: false });
    } catch (error) {
      console.error('Tip error:', error);
      alert('Failed to send tip. Please try again.');
    }
  }

  handleQuickTip = async (amount) => {
    const { post, tipPost } = this.props;

    // Get Web3 instance
    const web3 = this.getWeb3();
    if (!web3) {
      alert('Please connect your wallet first');
      return;
    }

    try {
      const tipWei = web3.utils.toWei(amount.toString(), 'Ether');
      await tipPost(post.id, tipWei);
      this.setState({ showTip: false });
    } catch (error) {
      console.error('Quick tip error:', error);
      alert('Failed to send tip. Please try again.');
    }
  }

  handleLike = () => {
    const { post, hasLiked } = this.props;
    if (hasLiked) {
      this.props.unlikePost(post.id);
    } else {
      this.props.likePost(post.id);
    }
  }

  handleComment = () => {
    const { commentText } = this.state;
    const { post } = this.props;
    if (!commentText.trim()) return;
    this.props.addComment(post.id, commentText);
    this.setState({ commentText: '' });
  }

  formatTime = (timestamp) => {
    const date = new Date(Number(timestamp) * 1000);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000);

    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;

    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  }

  formatEth = (wei) => {
    if (!wei || wei === '0') return '0';
    try {
      const web3 = this.getWeb3();
      if (!web3) return '0';
      const eth = web3.utils.fromWei(wei.toString(), 'Ether');
      return parseFloat(eth).toFixed(4);
    } catch (error) {
      return '0';
    }
  }

  getMediaTypeBadge = (type) => {
    const badges = {
      image: { cls: 'badge-image', label: '📷' },
      video: { cls: 'badge-video', label: '🎬' },
      audio: { cls: 'badge-audio', label: '🎵' },
      text: { cls: 'badge-text', label: '📝' }
    };
    const badge = badges[type] || badges.text;
    return <span className={`post-media-badge ${badge.cls}`}>{badge.label}</span>;
  }

  renderMedia = () => {
    const { post } = this.props;
    if (!post.mediaHash || post.mediaHash === '') return null;

    const url = getIpfsUrl(post.mediaHash);

    return (
      <div className="post-media">
        {post.mediaType === 'image' && (
          <img
            src={url}
            alt="Post media"
            onClick={() => this.setState({ lightbox: true })}
            onError={(e) => { e.target.style.display = 'none'; }}
          />
        )}
        {post.mediaType === 'video' && (
          <video
            src={url}
            controls
            preload="metadata"
            onError={(e) => { e.target.style.display = 'none'; }}
          />
        )}
        {post.mediaType === 'audio' && (
          <div className="audio-container">
            <FaMusic className="audio-icon" />
            <audio
              src={url}
              controls
              style={{ width: '100%' }}
              onError={(e) => { e.target.parentElement.style.display = 'none'; }}
            />
          </div>
        )}
      </div>
    );
  }

  render() {
    const { post, hasLiked, comments, profiles, onProfileClick } = this.props;
    const { showTip, showComments, tipAmount, commentText, lightbox } = this.state;

    const authorProfile = profiles[post.author];
    const authorName = authorProfile && authorProfile.username
      ? authorProfile.username
      : `${post.author.substring(0, 6)}...${post.author.substring(38)}`;

    const authorAvatar = authorProfile && authorProfile.avatarHash
      ? getIpfsUrl(authorProfile.avatarHash)
      : null;

    return (
      <div className="post-card">
        {/* Header */}
        <div className="post-header">
          <div
            className="post-author-info"
            style={{ cursor: 'pointer' }}
            onClick={() => onProfileClick && onProfileClick(post.author)}
          >
            <div className="post-identicon">
              {authorAvatar ? (
                <img src={authorAvatar} alt="Author" style={{ objectFit: 'cover' }} />
              ) : (
                <img
                  src={`data:image/png;base64,${new Identicon(post.author, 40).toString()}`}
                  alt="Author"
                />
              )}
            </div>
            <div className="author-details">
              <div className="author-name">{authorName}</div>
              <div className="post-time">{this.formatTime(post.timestamp)}</div>
            </div>
          </div>
          {this.getMediaTypeBadge(post.mediaType || 'text')}
        </div>

        {/* Content */}
        <div className="post-content">
          {post.content && <p className="post-text">{post.content}</p>}
          {this.renderMedia()}
        </div>

        {/* Stats */}
        <div className="post-stats">
          <span className="stat-item">
            <FaHeart style={{ color: Number(post.likeCount) > 0 ? '#ff6b6b' : 'inherit' }} />
            {post.likeCount?.toString() || '0'}
          </span>
          <span className="stat-item">
            <FaComment /> {post.commentCount?.toString() || '0'}
          </span>
          <span className="stat-item tip-stat">
            <FaEthereum /> {this.formatEth(post.tipAmount)}
          </span>
        </div>

        {/* Actions */}
        <div className="post-actions">
          <button
            className={`action-btn ${hasLiked ? 'liked' : ''}`}
            onClick={this.handleLike}
          >
            {hasLiked ? <FaHeart className="icon" /> : <FaRegHeart className="icon" />}
            <span>{hasLiked ? 'Liked' : 'Like'}</span>
          </button>
          <button
            className={`action-btn ${showComments ? 'active' : ''}`}
            onClick={this.toggleComments}
          >
            <FaComment className="icon" />
            <span>Comment</span>
          </button>
          <button
            className={`action-btn tip-action ${showTip ? 'active' : ''}`}
            onClick={this.toggleTip}
          >
            <FaEthereum className="icon" />
            <span>Tip</span>
          </button>
        </div>

        {/* Tip Section */}
        {showTip && (
          <div className="tip-section-compact">
            <div className="tip-section-header">
              <span className="tip-section-title">💰 Send a Tip</span>
              <button className="tip-close-btn" onClick={this.toggleTip}>✕</button>
            </div>

            <div className="quick-tips">
              <button onClick={() => this.handleQuickTip('0.01')}>
                <FaEthereum /> 0.01
              </button>
              <button onClick={() => this.handleQuickTip('0.05')}>
                <FaEthereum /> 0.05
              </button>
              <button onClick={() => this.handleQuickTip('0.1')}>
                <FaEthereum /> 0.1
              </button>
            </div>

            <div className="custom-tip">
              <input
                type="number"
                step="0.01"
                min="0.001"
                placeholder="Custom amount (ETH)"
                value={tipAmount}
                onChange={(e) => this.setState({ tipAmount: e.target.value })}
                onKeyPress={(e) => e.key === 'Enter' && this.handleTip()}
              />
              <button onClick={this.handleTip} disabled={!tipAmount || parseFloat(tipAmount) <= 0}>
                <FaPaperPlane /> Send
              </button>
            </div>
          </div>
        )}

        {/* Comments */}
        {showComments && (
          <div className="comment-section">
            <div className="comment-input-wrapper">
              <input
                className="comment-input"
                type="text"
                placeholder="Write a comment..."
                value={commentText}
                onChange={(e) => this.setState({ commentText: e.target.value })}
                onKeyPress={(e) => e.key === 'Enter' && this.handleComment()}
              />
              <button className="comment-submit-btn" onClick={this.handleComment}>
                <FaPaperPlane />
              </button>
            </div>

            <div className="comments-list">
              {comments && comments.length > 0 ? (
                comments.map((comment, idx) => {
                  const commenterProfile = profiles[comment.author];
                  const commenterName = commenterProfile?.username ||
                    `${comment.author.substring(0, 8)}...${comment.author.substring(38)}`;
                  const commenterAvatar = commenterProfile?.avatarHash ?
                    getIpfsUrl(commenterProfile.avatarHash) : null;

                  return (
                    <div className="comment-item" key={idx}>
                      <div className="comment-identicon">
                        {commenterAvatar ? (
                          <img src={commenterAvatar} alt="Commenter" style={{ objectFit: 'cover' }} />
                        ) : (
                          <img
                            src={`data:image/png;base64,${new Identicon(comment.author, 28).toString()}`}
                            alt="Commenter"
                          />
                        )}
                      </div>
                      <div className="comment-body">
                        <div className="comment-author">{commenterName}</div>
                        <div className="comment-text">{comment.content}</div>
                        <div className="comment-time">{this.formatTime(comment.timestamp)}</div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="no-comments">No comments yet. Be the first!</p>
              )}
            </div>
          </div>
        )}

        {/* Lightbox */}
        {lightbox && post.mediaHash && (
          <div className="lightbox-overlay" onClick={() => this.setState({ lightbox: false })}>
            <img src={getIpfsUrl(post.mediaHash)} alt="Full size" />
          </div>
        )}
      </div>
    );
  }
}

export default PostCard;