import React, { Component } from 'react';
import Identicon from 'identicon.js';
import { FaArrowLeft, FaEthereum, FaEdit, FaCamera } from 'react-icons/fa';
import { getIpfsUrl, uploadToPinata } from '../pinata';
import PostCard from './PostCard';

class UserProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editing: false,
      newUsername: '',
      newBio: '',
      newAvatarFile: null,
      newAvatarPreview: null,
      saving: false
    };
  }

  startEditing = () => {
    const { profile } = this.props;
    this.setState({
      editing: true,
      newUsername: profile.username || '',
      newBio: profile.bio || ''
    });
  }

  cancelEditing = () => {
    if (this.state.newAvatarPreview) {
      URL.revokeObjectURL(this.state.newAvatarPreview);
    }
    this.setState({
      editing: false,
      newAvatarFile: null,
      newAvatarPreview: null
    });
  }

  handleAvatarChange = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file && file.size <= 5 * 1024 * 1024) {
        const preview = URL.createObjectURL(file);
        this.setState({ newAvatarFile: file, newAvatarPreview: preview });
      }
    };
    input.click();
  }

  handleSave = async () => {
    const { newUsername, newBio, newAvatarFile } = this.state;
    this.setState({ saving: true });

    try {
      let avatarHash = this.props.profile.avatarHash || '';
      if (newAvatarFile) {
        avatarHash = await uploadToPinata(newAvatarFile);
      }

      await this.props.onUpdateProfile(newUsername, newBio, avatarHash);

      if (this.state.newAvatarPreview) {
        URL.revokeObjectURL(this.state.newAvatarPreview);
      }
      this.setState({ editing: false, saving: false, newAvatarFile: null, newAvatarPreview: null });
    } catch (error) {
      this.setState({ saving: false });
    }
  }

  formatEth = (wei) => {
    if (!wei || wei === '0') return '0';
    return parseFloat(window.web3.utils.fromWei(wei.toString(), 'Ether')).toFixed(4);
  }

  formatDate = (timestamp) => {
    if (!timestamp) return '';
    return new Date(Number(timestamp) * 1000).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  render() {
    const { profile, userAddress, posts, isOwnProfile, onBack,
            tipPost, likePost, unlikePost, addComment, postLikes, postComments, profiles } = this.props;
    const { editing, newUsername, newBio, newAvatarPreview, saving } = this.state;

    const userPosts = posts.filter(p => p.author.toLowerCase() === userAddress.toLowerCase());
    const avatarUrl = profile.avatarHash ? getIpfsUrl(profile.avatarHash) : null;
    const displayAvatar = newAvatarPreview || avatarUrl;

    return (
      <div className="main-content">
        <div className="content-container">
          <button className="back-btn" onClick={onBack}>
            <FaArrowLeft /> Back to Feed
          </button>

          <div className="profile-card">
            <div className="profile-cover"></div>

            <div className="profile-info-section">
              <div className="profile-avatar-large">
                {displayAvatar ? (
                  <img src={displayAvatar} alt="Avatar" />
                ) : (
                  <img
                    src={`data:image/png;base64,${new Identicon(userAddress, 120).toString()}`}
                    alt="Avatar"
                  />
                )}
                {editing && (
                  <button className="profile-avatar-edit" onClick={this.handleAvatarChange}>
                    <FaCamera />
                  </button>
                )}
              </div>

              {editing ? (
                <div className="profile-edit-form">
                  <input
                    className="modal-input"
                    type="text"
                    value={newUsername}
                    onChange={(e) => this.setState({ newUsername: e.target.value.replace(/[^a-zA-Z0-9_]/g, '') })}
                    placeholder="Username"
                    maxLength={30}
                  />
                  <textarea
                    className="modal-input"
                    value={newBio}
                    onChange={(e) => this.setState({ newBio: e.target.value })}
                    placeholder="Write your bio..."
                    maxLength={160}
                    rows={3}
                    style={{ resize: 'vertical' }}
                  />
                  <div className="profile-edit-actions">
                    <button className="modal-btn secondary" onClick={this.cancelEditing} disabled={saving}>
                      Cancel
                    </button>
                    <button className="modal-btn primary" onClick={this.handleSave} disabled={saving || !newUsername.trim()}>
                      {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="profile-details">
                  <div className="profile-name-row">
                    <h2 className="profile-display-name">{profile.username}</h2>
                    {isOwnProfile && (
                      <button className="profile-edit-btn" onClick={this.startEditing}>
                        <FaEdit /> Edit
                      </button>
                    )}
                  </div>
                  <p className="profile-address">{userAddress}</p>
                  {profile.bio && <p className="profile-bio">{profile.bio}</p>}
                  <p className="profile-joined">Joined {this.formatDate(profile.joinedAt)}</p>
                </div>
              )}

              <div className="profile-stats-row">
                <div className="profile-stat">
                  <span className="profile-stat-value">{userPosts.length}</span>
                  <span className="profile-stat-label">Posts</span>
                </div>
                <div className="profile-stat">
                  <span className="profile-stat-value">
                    <FaEthereum /> {this.formatEth(profile.totalTipsReceived)}
                  </span>
                  <span className="profile-stat-label">ETH Earned</span>
                </div>
                <div className="profile-stat">
                  <span className="profile-stat-value">
                    {userPosts.reduce((sum, p) => sum + Number(p.likeCount || 0), 0)}
                  </span>
                  <span className="profile-stat-label">Likes Received</span>
                </div>
              </div>
            </div>
          </div>

          <h3 style={{ color: 'var(--text-secondary)', margin: '24px 0 16px', fontSize: '1rem' }}>
            Posts by {profile.username} ({userPosts.length})
          </h3>

          {userPosts.length === 0 ? (
            <div className="no-posts">
              <div className="no-posts-icon">📝</div>
              <h3>{isOwnProfile ? "You haven't posted yet" : "No posts yet"}</h3>
              <p>{isOwnProfile ? "Share your first thought with the world!" : ""}</p>
            </div>
          ) : (
            userPosts
              .sort((a, b) => Number(b.timestamp) - Number(a.timestamp))
              .map((post, index) => (
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
                  onProfileClick={() => {}}
                />
              ))
          )}
        </div>
      </div>
    );
  }
}

export default UserProfile;