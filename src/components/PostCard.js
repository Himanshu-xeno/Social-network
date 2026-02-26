import React, { Component } from 'react';
import Identicon from 'identicon.js';
import { FaHeart, FaRegHeart, FaEthereum, FaComment, FaMusic } from 'react-icons/fa';
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

  toggleTip = () => {
    this.setState(prev => ({ showTip: !prev.showTip, showComments: false }));
  }

  toggleComments = () => {
    this.setState(prev => ({ showComments: !prev.showComments, showTip: false }));
  }

  handleTip = () => {
    const { tipAmount } = this.state;
    const { post } = this.props;
    if (!tipAmount || parseFloat(tipAmount) <= 0) return;

    const tipWei = window.web3.utils.toWei(tipAmount, 'Ether');
    this.props.tipPost(post.id, tipWei);
    this.setState({ tipAmount: '', showTip: false });
  }

  handleQuickTip = (amount) => {
    const { post } = this.props;
    const tipWei = window.web3.utils.toWei(amount, 'Ether');
    this.props.tipPost(post.id, tipWei);
    this.setState({ showTip: false });
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
    return date.toLocaleDateString();
  }

  formatEth = (wei) => {
    if (!wei || wei === '0') return '0';
    const eth = window.web3.utils.fromWei(wei.toString(), 'Ether');
    return parseFloat(eth).toFixed(4);
  }

  getMediaTypeBadge = (type) => {
    const badges = {
      image: { class: 'badge-image', label: '📷 Image' },
      video: { class: 'badge-video', label: '🎬 Video' },
      audio: { class: 'badge-audio', label: '🎵 Audio' },
      text: { class: 'badge-text', label: '📝 Text' }
    };
    const badge = badges[type] || badges.text;
    return <span className={`post-media-type-badge ${badge.class}`}>{badge.label}</span>;
  }

  renderMedia = () => {
    const { post } = this.props;
    if (!post.mediaHash || post.mediaHash === '') return null;

    const url = getIpfsUrl(post.mediaHash);
    const mediaType = post.mediaType;

    return (
      <div className="post-media">
        {mediaType === 'image' && (
          <img
            src={url}
            alt="Post media"
            onClick={() => this.setState({ lightbox: true })}
            onError={(e) => { e.target.style.display = 'none'; }}
          />
        )}

        {mediaType === 'video' && (
          <video
            src={url}
            controls
            preload="metadata"
            onError={(e) => { e.target.style.display = 'none'; }}
          />
        )}

        {mediaType === 'audio' && (
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

  renderLightbox = () => {
    const { post } = this.props;
    if (!this.state.lightbox || !post.mediaHash) return null;

    return (
      <div
        className="lightbox-overlay"
        onClick={() => this.setState({ lightbox: false })}
      >
        <img src={getIpfsUrl(post.mediaHash)} alt="Full size" />
      </div>
    );
  }

  render() {
    const { post, hasLiked, comments, profiles } = this.props;
    const { showTip, showComments, tipAmount, commentText } = this.state;

    const authorProfile = profiles[post.author];
    const authorName = authorProfile && authorProfile.username
      ? authorProfile.username
      : `${post.author.substring(0, 6)}...${post.author.substring(38)}`;

    return (
      <div className="post-card">
        {/* Header */}
        <div className="post-header">
          <div className="post-author-info">
            <div className="post-identicon">
              <img
                src={`data:image/png;base64,${new Identicon(post.author, 40).toString()}`}
                alt="Author"
              />
            </div>
            <div className="author-details">
              <div className="author-name">{authorName}</div>
              <div className="author-address">
                {post.author.substring(0, 10)}...{post.author.substring(36)}
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
            <span className="post-time">{this.formatTime(post.timestamp)}</span>
            {this.getMediaTypeBadge(post.mediaType || 'text')}
          </div>
        </div>

        {/* Content */}
        <div className="post-content">
          {post.content && <p className="post-text">{post.content}</p>}
          {this.renderMedia()}
        </div>

        {/* Stats */}
        <div className="post-stats">
          <span>
            <FaHeart style={{ color: post.likeCount > 0 ? '#ff6b6b' : 'inherit' }} />
            {post.likeCount?.toString() || '0'} likes
          </span>
          <span>
            <FaComment /> {post.commentCount?.toString() || '0'} comments
          </span>
          <span className="tip-display">
            <FaEthereum /> {this.formatEth(post.tipAmount)} ETH
          </span>
        </div>

        {/* Actions */}
        <div className="post-actions">
          <button
            className={`action-btn like-btn ${hasLiked ? 'liked' : ''}`}
            onClick={this.handleLike}
          >
            {hasLiked ? <FaHeart className="icon" /> : <FaRegHeart className="icon" />}
            {hasLiked ? 'Liked' : 'Like'}
          </button>

          <button className="action-btn comment-btn" onClick={this.toggleComments}>
            <FaComment className="icon" />
            Comment
          </button>

          <button className="action-btn tip-btn" onClick={this.toggleTip}>
            <FaEthereum className="icon" />
            Tip
          </button>
        </div>

        {/* Tip Section */}
        {showTip && (
          <div className="tip-section">
            <div className="tip-quick-btns">
              <button className="tip-quick-btn" onClick={() => this.handleQuickTip('0.01')}>0.01</button>
              <button className="tip-quick-btn" onClick={() => this.handleQuickTip('0.05')}>0.05</button>
              <button className="tip-quick-btn" onClick={() => this.handleQuickTip('0.1')}>0.1</button>
            </div>
            <input
              className="tip-input"
              type="number"
              step="0.01"
              min="0"
              placeholder="Custom ETH amount"
              value={tipAmount}
              onChange={(e) => this.setState({ tipAmount: e.target.value })}
            />
            <button className="tip-send-btn" onClick={this.handleTip}>
              Send Tip
            </button>
          </div>
        )}

        {/* Comments Section */}
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
                Post
              </button>
            </div>

            {comments && comments.map((comment, index) => (
              <div className="comment-item" key={index}>
                <div className="comment-identicon">
                  <img
                    src={`data:image/png;base64,${new Identicon(comment.author, 28).toString()}`}
                    alt="Commenter"
                  />
                </div>
                <div className="comment-body">
                  <div className="comment-author">
                    {comment.author.substring(0, 8)}...{comment.author.substring(38)}
                  </div>
                  <div className="comment-text">{comment.content}</div>
                  <div className="comment-time">{this.formatTime(comment.timestamp)}</div>
                </div>
              </div>
            ))}

            {(!comments || comments.length === 0) && (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textAlign: 'center', padding: '8px' }}>
                No comments yet. Be the first!
              </p>
            )}
          </div>
        )}

        {/* Lightbox */}
        {this.renderLightbox()}
      </div>
    );
  }
}

export default PostCard;