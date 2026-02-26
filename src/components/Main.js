import React, { Component } from 'react';
import CreatePost from './CreatePost';
import PostCard from './PostCard';
import { FaGlobeAmericas, FaImage, FaVideo, FaMusic, FaFileAlt, FaFire } from 'react-icons/fa';

class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filter: 'all',
      sortBy: 'newest'
    };
  }

  getFilteredPosts = () => {
    const { posts } = this.props;
    const { filter, sortBy } = this.state;

    let filtered = [...posts];

    // Filter
    if (filter !== 'all') {
      filtered = filtered.filter(post => {
        const type = post.mediaType || 'text';
        if (filter === 'text') return type === 'text' || type === '';
        return type === filter;
      });
    }

    // Sort
    switch (sortBy) {
      case 'newest':
        filtered.sort((a, b) => Number(b.timestamp) - Number(a.timestamp));
        break;
      case 'mostTipped':
        filtered.sort((a, b) => Number(b.tipAmount) - Number(a.tipAmount));
        break;
      case 'mostLiked':
        filtered.sort((a, b) => Number(b.likeCount) - Number(a.likeCount));
        break;
      default:
        break;
    }

    return filtered;
  }

  getTotalTips = () => {
    const { posts } = this.props;
    if (!posts || posts.length === 0) return '0';
    const total = posts.reduce((sum, post) => {
      return sum + Number(post.tipAmount || 0);
    }, 0);
    if (total === 0) return '0';
    return parseFloat(window.web3.utils.fromWei(total.toString(), 'Ether')).toFixed(4);
  }

  render() {
    const { posts, account, createPost, tipPost, likePost, unlikePost, addComment, postLikes, postComments, profiles } = this.props;
    const { filter, sortBy } = this.state;
    const filteredPosts = this.getFilteredPosts();

    return (
      <div className="main-content">
        <div className="content-container">

          {/* Stats Bar */}
          <div className="stats-bar">
            <div className="stat-item">
              <span className="stat-value">{posts.length}</span>
              <span className="stat-label">Total Posts</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{this.getTotalTips()}</span>
              <span className="stat-label">ETH Tipped</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">
                {posts.reduce((sum, p) => sum + Number(p.likeCount || 0), 0)}
              </span>
              <span className="stat-label">Total Likes</span>
            </div>
          </div>

          {/* Create Post */}
          <CreatePost
            account={account}
            createPost={createPost}
          />

          {/* Filter Bar */}
          <div className="filter-bar">
            {[
              { key: 'all', label: 'All Posts', icon: <FaGlobeAmericas /> },
              { key: 'text', label: 'Text', icon: <FaFileAlt /> },
              { key: 'image', label: 'Images', icon: <FaImage /> },
              { key: 'video', label: 'Videos', icon: <FaVideo /> },
              { key: 'audio', label: 'Audio', icon: <FaMusic /> },
            ].map(f => (
              <button
                key={f.key}
                className={`filter-btn ${filter === f.key ? 'active' : ''}`}
                onClick={() => this.setState({ filter: f.key })}
              >
                {f.icon} &nbsp;{f.label}
              </button>
            ))}
          </div>

          {/* Sort Bar */}
          <div className="sort-bar">
            <span className="sort-label">
              <FaFire style={{ marginRight: '4px' }} /> Sort by:
            </span>
            <select
              className="sort-select"
              value={sortBy}
              onChange={(e) => this.setState({ sortBy: e.target.value })}
            >
              <option value="newest">🕐 Newest First</option>
              <option value="mostTipped">💰 Most Tipped</option>
              <option value="mostLiked">❤️ Most Liked</option>
            </select>
          </div>

          {/* Posts Feed */}
          {filteredPosts.length === 0 ? (
            <div className="no-posts">
              <div className="no-posts-icon">📭</div>
              <h3>No posts yet</h3>
              <p>Be the first to share something with the community!</p>
            </div>
          ) : (
            filteredPosts.map((post, index) => (
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
              />
            ))
          )}
        </div>
      </div>
    );
  }
}

export default Main;