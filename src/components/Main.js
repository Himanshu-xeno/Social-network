// import React, { Component } from 'react';
// import CreatePost from './CreatePost';
// import PostCard from './PostCard';
// import { FaGlobeAmericas, FaImage, FaVideo, FaMusic, FaFileAlt, FaFire, FaUsers } from 'react-icons/fa';

// class Main extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       filter: 'all',
//       sortBy: 'newest'
//     };
//   }

//   getFilteredPosts = () => {
//     const { posts } = this.props;
//     const { filter, sortBy } = this.state;

//     let filtered = [...posts];

//     if (filter !== 'all') {
//       filtered = filtered.filter(post => {
//         const type = post.mediaType || 'text';
//         if (filter === 'text') return type === 'text' || type === '';
//         return type === filter;
//       });
//     }

//     switch (sortBy) {
//       case 'newest':
//         filtered.sort((a, b) => Number(b.timestamp) - Number(a.timestamp));
//         break;
//       case 'mostTipped':
//         filtered.sort((a, b) => Number(b.tipAmount) - Number(a.tipAmount));
//         break;
//       case 'mostLiked':
//         filtered.sort((a, b) => Number(b.likeCount) - Number(a.likeCount));
//         break;
//       default:
//         break;
//     }

//     return filtered;
//   }

//   getTotalTips = () => {
//     const { posts } = this.props;
//     if (!posts || posts.length === 0) return '0';
//     const total = posts.reduce((sum, post) => sum + Number(post.tipAmount || 0), 0);
//     if (total === 0) return '0';
//     return parseFloat(window.web3.utils.fromWei(total.toString(), 'Ether')).toFixed(4);
//   }

//   render() {
//     const {
//       posts, account, createPost, tipPost, likePost, unlikePost,
//       addComment, postLikes, postComments, profiles, userCount,
//       onProfileClick
//     } = this.props;
//     const { filter, sortBy } = this.state;
//     const filteredPosts = this.getFilteredPosts();

//     return (
//       <div className="main-content">
//         <div className="content-container">

//           {/* Stats */}
//           <div className="stats-bar">
//             <div className="stat-item">
//               <span className="stat-value">{posts.length}</span>
//               <span className="stat-label">Posts</span>
//             </div>
//             <div className="stat-item">
//               <span className="stat-value">
//                 <FaUsers style={{ marginRight: '4px', fontSize: '0.9rem' }} />
//                 {userCount || 0}
//               </span>
//               <span className="stat-label">Users</span>
//             </div>
//             <div className="stat-item">
//               <span className="stat-value">{this.getTotalTips()}</span>
//               <span className="stat-label">ETH Tipped</span>
//             </div>
//             <div className="stat-item">
//               <span className="stat-value">
//                 {posts.reduce((sum, p) => sum + Number(p.likeCount || 0), 0)}
//               </span>
//               <span className="stat-label">Likes</span>
//             </div>
//           </div>

//           {/* Create Post */}
//           <CreatePost account={account} createPost={createPost} />

//           {/* Filters */}
//           <div className="filter-bar">
//             {[
//               { key: 'all', label: 'All', icon: <FaGlobeAmericas /> },
//               { key: 'text', label: 'Text', icon: <FaFileAlt /> },
//               { key: 'image', label: 'Images', icon: <FaImage /> },
//               { key: 'video', label: 'Videos', icon: <FaVideo /> },
//               { key: 'audio', label: 'Audio', icon: <FaMusic /> },
//             ].map(f => (
//               <button
//                 key={f.key}
//                 className={`filter-btn ${filter === f.key ? 'active' : ''}`}
//                 onClick={() => this.setState({ filter: f.key })}
//               >
//                 {f.icon} &nbsp;{f.label}
//               </button>
//             ))}
//           </div>

//           {/* Sort */}
//           <div className="sort-bar">
//             <span className="sort-label"><FaFire /> Sort:</span>
//             <select
//               className="sort-select"
//               value={sortBy}
//               onChange={(e) => this.setState({ sortBy: e.target.value })}
//             >
//               <option value="newest">🕐 Newest</option>
//               <option value="mostTipped">💰 Most Tipped</option>
//               <option value="mostLiked">❤️ Most Liked</option>
//             </select>
//           </div>

//           {/* Posts */}
//           {filteredPosts.length === 0 ? (
//             <div className="no-posts">
//               <div className="no-posts-icon">📭</div>
//               <h3>No posts yet</h3>
//               <p>Be the first to share something!</p>
//             </div>
//           ) : (
//             filteredPosts.map((post, index) => (
//               <PostCard
//                 key={post.id?.toString() || index}
//                 post={post}
//                 tipPost={tipPost}
//                 likePost={likePost}
//                 unlikePost={unlikePost}
//                 addComment={addComment}
//                 hasLiked={postLikes[post.id?.toString()] || false}
//                 comments={postComments[post.id?.toString()] || []}
//                 profiles={profiles}
//                 onProfileClick={onProfileClick}
//               />
//             ))
//           )}
//         </div>
//       </div>
//     );
//   }
// }

// export default Main;






















// import React, { Component } from 'react';
// import CreatePost from './CreatePost';
// import PostCard from './PostCard';
// import { FaGlobeAmericas, FaImage, FaVideo, FaMusic, FaFileAlt, FaFire, FaUsers, FaPlus } from 'react-icons/fa';

// class Main extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       filter: 'all',
//       sortBy: 'newest',
//       showCreateModal: false
//     };
//   }

//   toggleCreateModal = () => {
//     this.setState(prev => ({ showCreateModal: !prev.showCreateModal }));
//   }

//   getFilteredPosts = () => {
//     const { posts } = this.props;
//     const { filter, sortBy } = this.state;

//     let filtered = [...posts];

//     if (filter !== 'all') {
//       filtered = filtered.filter(post => {
//         const type = post.mediaType || 'text';
//         if (filter === 'text') return type === 'text' || type === '';
//         return type === filter;
//       });
//     }

//     switch (sortBy) {
//       case 'newest':
//         filtered.sort((a, b) => Number(b.timestamp) - Number(a.timestamp));
//         break;
//       case 'mostTipped':
//         filtered.sort((a, b) => Number(b.tipAmount) - Number(a.tipAmount));
//         break;
//       case 'mostLiked':
//         filtered.sort((a, b) => Number(b.likeCount) - Number(a.likeCount));
//         break;
//       default:
//         break;
//     }

//     return filtered;
//   }

//   getTotalTips = () => {
//     const { posts } = this.props;
//     if (!posts || posts.length === 0) return '0';
//     const total = posts.reduce((sum, post) => sum + Number(post.tipAmount || 0), 0);
//     if (total === 0) return '0';
//     return parseFloat(window.web3.utils.fromWei(total.toString(), 'Ether')).toFixed(4);
//   }

//   render() {
//     const {
//       posts, account, createPost, tipPost, likePost, unlikePost,
//       addComment, postLikes, postComments, profiles, userCount,
//       onProfileClick
//     } = this.props;

//     const { filter, sortBy, showCreateModal } = this.state;
//     const filteredPosts = this.getFilteredPosts();

//     return (
//       <div className="modern-main">
//         {/* Stats Bar */}
//         <div className="modern-stats-container">
//           <div className="modern-stats-bar">
//             <div className="stat-item">
//               <div className="stat-icon">📝</div>
//               <div className="stat-content">
//                 <span className="stat-value">{posts.length}</span>
//                 <span className="stat-label">Posts</span>
//               </div>
//             </div>

//             <div className="stat-item">
//               <div className="stat-icon">👥</div>
//               <div className="stat-content">
//                 <span className="stat-value">{userCount || 0}</span>
//                 <span className="stat-label">Users</span>
//               </div>
//             </div>

//             <div className="stat-item">
//               <div className="stat-icon">💰</div>
//               <div className="stat-content">
//                 <span className="stat-value">{this.getTotalTips()}</span>
//                 <span className="stat-label">ETH Tipped</span>
//               </div>
//             </div>

//             <div className="stat-item">
//               <div className="stat-icon">❤️</div>
//               <div className="stat-content">
//                 <span className="stat-value">
//                   {posts.reduce((sum, p) => sum + Number(p.likeCount || 0), 0)}
//                 </span>
//                 <span className="stat-label">Likes</span>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Feed Container */}
//         <div className="modern-feed-container">
//           {/* Filters */}
//           <div className="modern-filter-section">
//             <div className="filter-tabs">
//               {[
//                 { key: 'all', label: 'All', icon: <FaGlobeAmericas /> },
//                 { key: 'text', label: 'Text', icon: <FaFileAlt /> },
//                 { key: 'image', label: 'Images', icon: <FaImage /> },
//                 { key: 'video', label: 'Videos', icon: <FaVideo /> },
//                 { key: 'audio', label: 'Audio', icon: <FaMusic /> },
//               ].map(f => (
//                 <button
//                   key={f.key}
//                   className={`filter-tab ${filter === f.key ? 'active' : ''}`}
//                   onClick={() => this.setState({ filter: f.key })}
//                 >
//                   {f.icon}
//                   <span>{f.label}</span>
//                 </button>
//               ))}
//             </div>

//             <div className="sort-dropdown">
//               <FaFire className="sort-icon" />
//               <select
//                 className="sort-select"
//                 value={sortBy}
//                 onChange={(e) => this.setState({ sortBy: e.target.value })}
//               >
//                 <option value="newest">🕐 Newest</option>
//                 <option value="mostTipped">💰 Most Tipped</option>
//                 <option value="mostLiked">❤️ Most Liked</option>
//               </select>
//             </div>
//           </div>

//           {/* Posts Feed */}
//           <div className="modern-posts-feed">
//             {filteredPosts.length === 0 ? (
//               <div className="modern-empty-state">
//                 <div className="empty-icon">📭</div>
//                 <h3>No posts yet</h3>
//                 <p>Be the first to share something!</p>
//                 <button className="empty-cta-btn" onClick={this.toggleCreateModal}>
//                   Create First Post
//                 </button>
//               </div>
//             ) : (
//               filteredPosts.map((post, index) => (
//                 <PostCard
//                   key={post.id?.toString() || index}
//                   post={post}
//                   tipPost={tipPost}
//                   likePost={likePost}
//                   unlikePost={unlikePost}
//                   addComment={addComment}
//                   hasLiked={postLikes[post.id?.toString()] || false}
//                   comments={postComments[post.id?.toString()] || []}
//                   profiles={profiles}
//                   onProfileClick={onProfileClick}
//                 />
//               ))
//             )}
//           </div>
//         </div>

//         {/* Floating Action Button */}
//         <button
//           className="fab-button"
//           onClick={this.toggleCreateModal}
//           title="Create Post"
//         >
//           <FaPlus />
//         </button>

//         {/* Create Post Modal */}
//         {showCreateModal && (
//           <div className="modal-overlay" onClick={this.toggleCreateModal}>
//             <div className="modal-content" onClick={(e) => e.stopPropagation()}>
//               <div className="modal-header">
//                 <h2>Create New Post</h2>
//                 <button className="modal-close-btn" onClick={this.toggleCreateModal}>
//                   ✕
//                 </button>
//               </div>
//               <div className="modal-body">
//                 <CreatePost
//                   account={account}
//                   createPost={(content, mediaFile, mediaType) => {
//                     createPost(content, mediaFile, mediaType);
//                     this.toggleCreateModal();
//                   }}
//                 />
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     );
//   }
// }

// export default Main;











import React, { Component } from 'react';
import CreatePost from './CreatePost';
import PostCard from './PostCard';
import { FaGlobeAmericas, FaImage, FaVideo, FaMusic, FaFileAlt, FaFire, FaUsers, FaPlus } from 'react-icons/fa';

class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filter: 'all',
      sortBy: 'newest',
      showCreateModal: false
    };
  }

  toggleCreateModal = () => {
    this.setState(prev => ({ showCreateModal: !prev.showCreateModal }));
    // Prevent body scroll when modal is open
    if (!this.state.showCreateModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }

  componentWillUnmount() {
    // Cleanup: restore scroll on unmount
    document.body.style.overflow = 'auto';
  }

  getFilteredPosts = () => {
    const { posts } = this.props;
    const { filter, sortBy } = this.state;

    let filtered = [...posts];

    if (filter !== 'all') {
      filtered = filtered.filter(post => {
        const type = post.mediaType || 'text';
        if (filter === 'text') return type === 'text' || type === '';
        return type === filter;
      });
    }

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
    const total = posts.reduce((sum, post) => sum + Number(post.tipAmount || 0), 0);
    if (total === 0) return '0';
    return parseFloat(window.web3.utils.fromWei(total.toString(), 'Ether')).toFixed(4);
  }

  render() {
    const {
      posts, account, createPost, tipPost, likePost, unlikePost,
      addComment, postLikes, postComments, profiles, userCount,
      onProfileClick
    } = this.props;
    const { filter, sortBy, showCreateModal } = this.state;
    const filteredPosts = this.getFilteredPosts();

    return (
      <div className="main-content">
        <div className="content-container">

          {/* Stats */}
          <div className="stats-bar">
            <div className="stat-item">
              <span className="stat-value">{posts.length}</span>
              <span className="stat-label">Posts</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">
                <FaUsers style={{ marginRight: '4px', fontSize: '0.9rem' }} />
                {userCount || 0}
              </span>
              <span className="stat-label">Users</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{this.getTotalTips()}</span>
              <span className="stat-label">ETH Tipped</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">
                {posts.reduce((sum, p) => sum + Number(p.likeCount || 0), 0)}
              </span>
              <span className="stat-label">Likes</span>
            </div>
          </div>

          {/* Filters */}
          <div className="filter-bar">
            {[
              { key: 'all', label: 'All', icon: <FaGlobeAmericas /> },
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

          {/* Sort */}
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

          {/* Posts */}
          {filteredPosts.length === 0 ? (
            <div className="no-posts">
              <div className="no-posts-icon">📭</div>
              <h3>No posts yet</h3>
              <p>Be the first to share something!</p>
              <button className="create-first-post-btn" onClick={this.toggleCreateModal}>
                Create First Post
              </button>
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
                onProfileClick={onProfileClick}
              />
            ))
          )}
        </div>

        {/* Floating Action Button - Bottom Left */}
        <button
          className="fab-button"
          onClick={this.toggleCreateModal}
          title="Create New Post"
        >
          <FaPlus />
        </button>

        {/* Create Post Modal */}
        {showCreateModal && (
          <div className="modal-overlay" onClick={this.toggleCreateModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Create New Post</h2>
                <button className="modal-close-btn" onClick={this.toggleCreateModal}>
                  ✕
                </button>
              </div>
              <div className="modal-body">
                <CreatePost
                  account={account}
                  createPost={(content, mediaFile, mediaType) => {
                    createPost(content, mediaFile, mediaType);
                    this.toggleCreateModal();
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default Main;