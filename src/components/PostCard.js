import React, { Component } from 'react';
import { FaHeart, FaRegHeart, FaComment, FaCoins, FaUserCircle } from 'react-icons/fa';

class PostCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showComments: false,
      commentText: '',
      showTipModal: false,
      customTipAmount: '',
      imageLoaded: false,
      imageError: false,
      errorShown: false
    };
  }

  // 🚀 SUPERFAST IPFS with Multiple Gateways
  getIPFSUrl = (hash) => {
    if (!hash) return '';
    const gateways = [
      `https://gateway.pinata.cloud/ipfs/${hash}`,
      `https://cloudflare-ipfs.com/ipfs/${hash}`,
      `https://ipfs.io/ipfs/${hash}`
    ];
    return gateways[0];
  }

  handleQuickTip = async (ethAmount) => {
    if (this.state.errorShown) return;

    try {
      const { post, tipPost } = this.props;
      const tipAmountWei = window.web3.utils.toWei(ethAmount.toString(), 'ether');
      await tipPost(post.id, tipAmountWei);
      this.setState({ showTipModal: false, customTipAmount: '', errorShown: false });
    } catch (error) {
      if (!this.state.errorShown) {
        this.setState({ errorShown: true });
        alert('Failed to send tip: ' + error.message);
        setTimeout(() => this.setState({ errorShown: false }), 2000);
      }
    }
  }

  handleCustomTip = async () => {
    if (this.state.errorShown) return;

    try {
      const { customTipAmount } = this.state;
      const { post, tipPost } = this.props;

      if (!customTipAmount || parseFloat(customTipAmount) <= 0) {
        alert('Please enter a valid tip amount');
        return;
      }

      const tipAmountWei = window.web3.utils.toWei(customTipAmount, 'ether');
      await tipPost(post.id, tipAmountWei);
      this.setState({ showTipModal: false, customTipAmount: '', errorShown: false });
    } catch (error) {
      if (!this.state.errorShown) {
        this.setState({ errorShown: true });
        alert('Failed to send tip: ' + error.message);
        setTimeout(() => this.setState({ errorShown: false }), 2000);
      }
    }
  }

  toggleComments = () => {
    this.setState(prev => ({ showComments: !prev.showComments }));
  }

  handleComment = async (e) => {
    e.preventDefault();
    if (this.state.errorShown) return;

    const { commentText } = this.state;
    const { post, addComment } = this.props;

    if (!commentText.trim()) return;

    try {
      await addComment(post.id, commentText);
      this.setState({ commentText: '', errorShown: false });
    } catch (error) {
      if (!this.state.errorShown) {
        this.setState({ errorShown: true });
        console.error('Comment error:', error);
        setTimeout(() => this.setState({ errorShown: false }), 2000);
      }
    }
  }

  handleLike = async () => {
    if (this.state.errorShown) return;

    const { post, likePost, unlikePost, hasLiked } = this.props;
    try {
      if (hasLiked) {
        await unlikePost(post.id);
      } else {
        await likePost(post.id);
      }
      this.setState({ errorShown: false });
    } catch (error) {
      if (!this.state.errorShown) {
        this.setState({ errorShown: true });
        console.error('Like error:', error);
        setTimeout(() => this.setState({ errorShown: false }), 2000);
      }
    }
  }

  formatAddress = (address) => {
    if (!address) return '';
    return `${address.substring(0, 6)}...${address.substring(38)}`;
  }

  // 🕒 PERFECT TIME FORMATTING
  formatTimeAgo = (timestamp) => {
    const now = Date.now();
    const commentTime = Number(timestamp) * 1000;
    const diffMs = now - commentTime;
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMinutes < 1) return 'now';
    if (diffMinutes < 60) return `${diffMinutes}m`;
    if (diffHours < 24) return `${diffHours}h`;
    if (diffDays < 7) return `${diffDays}d`;

    return new Date(commentTime).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  }

  // 👤 GET USER DISPLAY NAME (NO "Anonymous")
  getUserDisplayName = (address, profile) => {
    if (profile?.username) {
      return profile.username;
    }
    return this.formatAddress(address);
  }

  handleImageError = () => {
    const { imageError } = this.state;
    if (!imageError) {
      this.setState({ imageError: true, imageLoaded: false });
    }
  }

  // 📸 INSTAGRAM-STYLE MEDIA RENDERING
  renderMedia = (post) => {
    if (!post.mediaHash) return null;

    const { imageLoaded, imageError } = this.state;
    const mediaUrl = this.getIPFSUrl(post.mediaHash);

    switch (post.mediaType) {
      case 'image':
        return (
          <div className="instagram-media-container">
            {/* Loading State */}
            {!imageLoaded && !imageError && (
              <div className="instagram-loading">
                <div className="loading-shimmer"></div>
                <div className="loading-spinner">
                  <div className="spinner-ring"></div>
                </div>
              </div>
            )}

            {/* Error State */}
            {imageError && (
              <div className="instagram-error">
                <div className="error-icon">📷</div>
                <p>Couldn't load photo</p>
                <button
                  className="retry-button"
                  onClick={() => this.setState({ imageError: false, imageLoaded: false })}
                >
                  Try again
                </button>
              </div>
            )}

            {/* Instagram-Style Image */}
            {!imageError && (
              <img
                src={mediaUrl}
                alt="Post"
                className={`instagram-image ${imageLoaded ? 'loaded' : 'loading'}`}
                onLoad={() => this.setState({ imageLoaded: true })}
                onError={this.handleImageError}
                loading="lazy"
              />
            )}
          </div>
        );

      case 'video':
        return (
          <div className="instagram-media-container">
            <video
              controls
              className="instagram-video"
              preload="metadata"
              poster="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect width='100%25' height='100%25' fill='%23f0f0f0'/%3E%3Ctext x='50%25' y='50%25' font-size='16' text-anchor='middle' dy='.3em'%3E🎥%3C/text%3E%3C/svg%3E"
            >
              <source src={mediaUrl} />
              Your browser doesn't support video.
            </video>
            <div className="video-overlay">
              <div className="play-button">▶</div>
            </div>
          </div>
        );

      case 'audio':
        return (
          <div className="instagram-audio-container">
            <div className="audio-visual">
              <div className="audio-icon">🎵</div>
              <div className="audio-waves">
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
            <audio controls className="instagram-audio">
              <source src={mediaUrl} />
              Your browser doesn't support audio.
            </audio>
          </div>
        );

      default:
        return null;
    }
  }

  render() {
    const { post, hasLiked, comments, profiles, onProfileClick } = this.props;
    const { showComments, commentText, showTipModal, customTipAmount } = this.state;

    const profile = profiles?.[post.author] || {};
    const tipAmountEth = post.tipAmount
      ? parseFloat(window.web3.utils.fromWei(post.tipAmount.toString(), 'ether')).toFixed(4)
      : '0';

    return (
      <div className="post-card">
        {/* Post Header */}
        <div className="post-header">
          <div
            className="post-author-info"
            onClick={() => onProfileClick && onProfileClick(post.author)}
          >
            {profile.avatarHash ? (
              <img
                src={this.getIPFSUrl(profile.avatarHash)}
                alt="Avatar"
                className="post-avatar"
                loading="lazy"
              />
            ) : (
              <FaUserCircle className="post-avatar-icon" />
            )}
            <div className="post-author-details">
              <div className="post-author-name">
                {this.getUserDisplayName(post.author, profile)}
              </div>
              <div className="post-author-address">
                {this.formatAddress(post.author)}
              </div>
            </div>
          </div>
          <div className="post-timestamp">
            {this.formatTimeAgo(post.timestamp)}
          </div>
        </div>

        {/* Instagram-Style Media */}
        {this.renderMedia(post)}

        {/* Post Content (Text Below Image) */}
        {post.content && (
          <div className="post-content">
            <p className="post-text">{post.content}</p>
          </div>
        )}

        {/* Post Actions */}
        <div className="post-actions">
          <button
            className={`action-btn ${hasLiked ? 'liked' : ''}`}
            onClick={this.handleLike}
          >
            {hasLiked ? <FaHeart /> : <FaRegHeart />}
            <span>{Number(post.likeCount || 0)}</span>
          </button>

          <button
            className="action-btn"
            onClick={this.toggleComments}
          >
            <FaComment />
            <span>{comments.length}</span>
          </button>

          <button
            className="action-btn tip-btn"
            onClick={() => this.setState({ showTipModal: true })}
          >
            <FaCoins />
            <span>{tipAmountEth} ETH</span>
          </button>
        </div>

        {/* Tip Modal */}
        {showTipModal && (
          <div className="tip-modal-overlay" onClick={() => this.setState({ showTipModal: false })}>
            <div className="tip-modal" onClick={(e) => e.stopPropagation()}>
              <div className="tip-modal-header">
                <h3>💰 Send a Tip</h3>
                <button
                  className="tip-modal-close"
                  onClick={() => this.setState({ showTipModal: false })}
                >
                  ✕
                </button>
              </div>

              <div className="tip-modal-body">
                <p className="tip-modal-description">
                  Support this content creator with ETH
                </p>

                <div className="quick-tip-buttons">
                  <button
                    className="quick-tip-btn"
                    onClick={() => this.handleQuickTip(0.001)}
                  >
                    <span className="tip-amount">0.001 ETH</span>
                    <span className="tip-label">Small</span>
                  </button>
                  <button
                    className="quick-tip-btn"
                    onClick={() => this.handleQuickTip(0.01)}
                  >
                    <span className="tip-amount">0.01 ETH</span>
                    <span className="tip-label">Medium</span>
                  </button>
                  <button
                    className="quick-tip-btn"
                    onClick={() => this.handleQuickTip(0.1)}
                  >
                    <span className="tip-amount">0.1 ETH</span>
                    <span className="tip-label">Large</span>
                  </button>
                </div>

                <div className="custom-tip-section">
                  <label className="custom-tip-label">Custom Amount (ETH)</label>
                  <div className="custom-tip-input-group">
                    <input
                      type="number"
                      step="0.001"
                      min="0"
                      placeholder="0.0"
                      value={customTipAmount}
                      onChange={(e) => this.setState({ customTipAmount: e.target.value })}
                      className="custom-tip-input"
                    />
                    <button
                      className="custom-tip-send-btn"
                      onClick={this.handleCustomTip}
                    >
                      Send
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Perfect Comments Section */}
        {showComments && (
          <div className="comments-section">
            <form onSubmit={this.handleComment} className="comment-form">
              <div className="comment-form-container">
                <div className="comment-input-wrapper">
                  <input
                    type="text"
                    placeholder="Add a comment..."
                    value={commentText}
                    onChange={(e) => this.setState({ commentText: e.target.value })}
                    className="comment-input"
                    maxLength={280}
                  />
                  <button
                    type="submit"
                    className="comment-submit-btn"
                    disabled={!commentText.trim()}
                  >
                    Post
                  </button>
                </div>
                <div className="comment-char-count">
                  {commentText.length}/280
                </div>
              </div>
            </form>

            <div className="comments-container">
              {comments.length === 0 ? (
                <div className="no-comments">
                  <div className="no-comments-icon">💭</div>
                  <p>No comments yet</p>
                  <span>Be the first to share your thoughts!</span>
                </div>
              ) : (
                <div className="comments-list">
                  <div className="comments-count">
                    {comments.length} {comments.length === 1 ? 'comment' : 'comments'}
                  </div>

                  {comments.map((comment, index) => {
                    const commenterProfile = profiles?.[comment.commenter] || {};
                    const displayName = this.getUserDisplayName(comment.commenter, commenterProfile);

                    return (
                      <div key={index} className="comment-item">
                        <div
                          className="comment-avatar-container"
                          onClick={() => onProfileClick && onProfileClick(comment.commenter)}
                        >
                          {commenterProfile.avatarHash ? (
                            <img
                              src={this.getIPFSUrl(commenterProfile.avatarHash)}
                              alt={`${displayName}'s avatar`}
                              className="comment-avatar"
                              loading="lazy"
                            />
                          ) : (
                            <FaUserCircle className="comment-avatar-icon" />
                          )}
                        </div>

                        <div className="comment-content">
                          <div className="comment-bubble">
                            <div className="comment-meta">
                              <span
                                className="comment-author-name"
                                onClick={() => onProfileClick && onProfileClick(comment.commenter)}
                              >
                                {displayName}
                              </span>
                              <span className="comment-time">
                                {this.formatTimeAgo(comment.timestamp)}
                              </span>
                            </div>
                            <p className="comment-text">{comment.content}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default PostCard;