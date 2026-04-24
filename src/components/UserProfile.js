import React, { Component } from 'react';
import Identicon from 'identicon.js';
import { FaArrowLeft, FaEthereum, FaEdit, FaCalendar, FaFire } from 'react-icons/fa';
import { getIpfsUrl, uploadToPinata } from '../pinata';
import PostCard from './PostCard';
import ProfileModal from './ProfileModal';

class UserProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showProfileModal: false,
      saving: false,
      imageLoaded: false,
      sortBy: 'newest' // Added sort functionality like Main.js
    };
  }

  getIPFSUrl = (hash) => {
    if (!hash) return '';
    return `https://gateway.pinata.cloud/ipfs/${hash}`;
  }

  startEditing = () => {
    this.setState({ showProfileModal: true });
  }

  handleProfileSave = async (username, bio) => {
    const { profile } = this.props;
    this.setState({ saving: true });
    try {
      await this.props.onUpdateProfile(username, bio, profile.avatarHash || '');
      this.setState({ showProfileModal: false, saving: false });
    } catch (error) {
      console.error('Profile update failed:', error);
      this.setState({ saving: false });
    }
  }

  formatEth = (wei) => {
    if (!wei || wei === '0') return '0';
    return parseFloat(window.web3.utils.fromWei(wei.toString(), 'ether')).toFixed(4);
  }

  formatDate = (timestamp) => {
    if (!timestamp) return 'Recently';
    return new Date(Number(timestamp) * 1000).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  formatAddress = (address) => {
    if (!address) return '';
    return `${address.substring(0, 6)}...${address.substring(38)}`;
  }

  // Added sorting function like Main.js
  getSortedUserPosts = () => {
    const { posts, userAddress } = this.props;
    const { sortBy } = this.state;

    let userPosts = posts.filter(
      p => p.author.toLowerCase() === userAddress.toLowerCase()
    );

    switch (sortBy) {
      case 'newest':
        userPosts.sort((a, b) => Number(b.timestamp) - Number(a.timestamp));
        break;
      case 'mostTipped':
        userPosts.sort((a, b) => Number(b.tipAmount) - Number(a.tipAmount));
        break;
      case 'mostLiked':
        userPosts.sort((a, b) => Number(b.likeCount) - Number(a.likeCount));
        break;
      default:
        break;
    }

    return userPosts;
  }

  render() {
    const {
      profile, userAddress, posts, isOwnProfile, onBack,
      tipPost, likePost, unlikePost, addComment,
      postLikes, postComments, profiles
    } = this.props;
    const { showProfileModal, imageLoaded, sortBy } = this.state;

    const userPosts = this.getSortedUserPosts();
    const avatarUrl = profile.avatarHash ? this.getIPFSUrl(profile.avatarHash) : null;
    const totalLikes = userPosts.reduce((sum, p) => sum + Number(p.likeCount || 0), 0);

    return (
      <div className="main-content">
        <div className="content-container">

          {/* ── Back Button ── */}
          <button className="back-btn" onClick={onBack}>
            <FaArrowLeft /> Back to Feed
          </button>

          {/* ── Profile Card ── */}
          <div className="user-profile-card">
            <div className="user-profile-content">

              {/* LEFT — Avatar column */}
              <div className="user-profile-image-section">
                <div className="user-big-profile-container">

                  {/* Loading skeleton */}
                  {avatarUrl && !imageLoaded && (
                    <div className="user-profile-loading">
                      <div className="user-profile-spinner"></div>
                    </div>
                  )}

                  {/* Avatar image or identicon */}
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt="Profile"
                      className={`user-big-profile-image ${imageLoaded ? 'loaded' : 'loading'}`}
                      onLoad={() => this.setState({ imageLoaded: true })}
                      loading="eager"
                    />
                  ) : (
                    <img
                      src={`data:image/png;base64,${new Identicon(userAddress, 200).toString()}`}
                      alt="Profile"
                      className="user-big-profile-image loaded"
                    />
                  )}

                  {/* Edit overlay — own profile only */}
                  {isOwnProfile && (
                    <div
                      className="user-profile-edit-overlay"
                      onClick={this.startEditing}
                    >
                      <FaEdit />
                      <span>Edit</span>
                    </div>
                  )}
                </div>

                {/* Truncated wallet address */}
                <div className="user-profile-address-display">
                  <span className="user-address-label">Wallet</span>
                  <span className="user-address-value">
                    {this.formatAddress(userAddress)}
                  </span>
                </div>
              </div>

              {/* RIGHT — Info column */}
              <div className="user-profile-info-section">

                {/* Name row + edit button */}
                <div className="user-profile-header">
                  <h1 className="user-profile-name">
                    {profile.username || 'Anonymous'}
                  </h1>
                  {isOwnProfile && (
                    <button
                      className="user-profile-edit-btn"
                      onClick={this.startEditing}
                    >
                      <FaEdit /> Edit Profile
                    </button>
                  )}
                </div>

                {/* Bio */}
                {profile.bio && (
                  <p className="user-profile-bio">{profile.bio}</p>
                )}

                {/* Joined date */}
                <div className="user-profile-meta">
                  <span className="user-profile-joined">
                    <FaCalendar />
                    Joined {this.formatDate(profile.joinedAt)}
                  </span>
                </div>

                {/* Stats row */}
                <div className="user-profile-stats">
                  <div className="user-stat-card">
                    <div className="user-stat-number">{userPosts.length}</div>
                    <div className="user-stat-label">Posts</div>
                  </div>
                  <div className="user-stat-card">
                    <div className="user-stat-number">
                      <FaEthereum className="user-eth-icon" />
                      {this.formatEth(profile.totalTipsReceived)}
                    </div>
                    <div className="user-stat-label">ETH Earned</div>
                  </div>
                  <div className="user-stat-card">
                    <div className="user-stat-number">{totalLikes}</div>
                    <div className="user-stat-label">Likes</div>
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* ── Posts Section Header ── */}
          <div className="user-profile-posts-header">
            <h3 className="user-posts-title">
              Posts by {profile.username || 'this user'}
              <span className="user-posts-count-badge">{userPosts.length}</span>
            </h3>

            {/* Sort Bar - Same as Main.js */}
            {userPosts.length > 0 && (
              <div className="sort-bar">
                <span className="sort-label"><FaFire /> Sort:</span>
                <select
                  className="sort-select"
                  value={sortBy}
                  onChange={(e) => this.setState({ sortBy: e.target.value })}
                >
                  <option value="newest">🕐 Newest</option>
                  <option value="mostTipped">💰 Most Tipped</option>
                  <option value="mostLiked">❤️ Most Liked</option>
                </select>
              </div>
            )}
          </div>

          {/* Posts - Same layout as Main.js */}
          {userPosts.length === 0 ? (
            <div className="no-posts">
              <div className="no-posts-icon">📝</div>
              <h3>{isOwnProfile ? "You haven't posted yet" : "No posts yet"}</h3>
              {isOwnProfile && (
                <p>Share your first thought with the world!</p>
              )}
            </div>
          ) : (
            userPosts.map((post, index) => (
              <PostCard
                key={post.id?.toString() || index}
                post={post}
                tipPost={tipPost}
                likePost={likePost}
                unlikePost={unlikePost}
                addComment={addComment}
                hasLiked={postLikes[post.id?.toString()] || false}
                comments={postComments[post.id?.toString()] || []}
                profiles={profiles}
                onProfileClick={() => { }}
              />
            ))
          )}

        </div>

        {/* Profile edit modal */}
        {showProfileModal && (
          <ProfileModal
            onClose={() => this.setState({ showProfileModal: false })}
            onSave={this.handleProfileSave}
            currentUsername={profile.username || ''}
            currentProfile={profile}
            currentAccount={userAddress}
          />
        )}
      </div>
    );
  }
}

export default UserProfile;