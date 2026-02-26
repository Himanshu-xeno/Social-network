import React, { Component } from 'react';
import Identicon from 'identicon.js';
import { FaImage, FaVideo, FaMusic, FaTimes } from 'react-icons/fa';

class CreatePost extends Component {
  constructor(props) {
    super(props);
    this.state = {
      content: '',
      mediaFile: null,
      mediaPreview: null,
      mediaType: 'text',
      posting: false
    };
    this.fileInputRef = React.createRef();
  }

  handleContentChange = (e) => {
    this.setState({ content: e.target.value });
  }

  handleFileSelect = (acceptType, mediaType) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = acceptType;
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        // File size check (50MB max)
        if (file.size > 50 * 1024 * 1024) {
          alert('File too large. Maximum size is 50MB.');
          return;
        }

        const preview = URL.createObjectURL(file);
        this.setState({
          mediaFile: file,
          mediaPreview: preview,
          mediaType: mediaType
        });
      }
    };
    input.click();
  }

  removeMedia = () => {
    if (this.state.mediaPreview) {
      URL.revokeObjectURL(this.state.mediaPreview);
    }
    this.setState({
      mediaFile: null,
      mediaPreview: null,
      mediaType: 'text'
    });
  }

  handleSubmit = async () => {
    const { content, mediaFile, mediaType } = this.state;

    if (!content.trim() && !mediaFile) return;

    this.setState({ posting: true });

    try {
      await this.props.createPost(content, mediaFile, mediaType);
      this.setState({
        content: '',
        mediaFile: null,
        mediaPreview: null,
        mediaType: 'text',
        posting: false
      });
    } catch (error) {
      console.error('Post creation failed:', error);
      this.setState({ posting: false });
    }
  }

  getCharCountClass = () => {
    const len = this.state.content.length;
    if (len > 450) return 'char-counter danger';
    if (len > 400) return 'char-counter warning';
    return 'char-counter';
  }

  renderMediaPreview = () => {
    const { mediaPreview, mediaType, mediaFile } = this.state;
    if (!mediaPreview) return null;

    return (
      <div className="media-preview">
        <button className="remove-media" onClick={this.removeMedia}>
          <FaTimes />
        </button>

        {mediaType === 'image' && (
          <img src={mediaPreview} alt="Preview" />
        )}

        {mediaType === 'video' && (
          <video src={mediaPreview} controls />
        )}

        {mediaType === 'audio' && (
          <div style={{ padding: '20px' }}>
            <audio src={mediaPreview} controls style={{ width: '100%' }} />
          </div>
        )}

        <div className="file-name">
          📎 {mediaFile.name} ({(mediaFile.size / (1024 * 1024)).toFixed(2)} MB)
        </div>
      </div>
    );
  }

  render() {
    const { account } = this.props;
    const { content, posting, mediaFile } = this.state;
    const canPost = (content.trim().length > 0 || mediaFile) && content.length <= 500 && !posting;

    return (
      <div className="create-post-card">
        <div className="create-post-header">
          <div className="identicon-wrapper">
            {account && (
              <img
                src={`data:image/png;base64,${new Identicon(account, 42).toString()}`}
                alt="You"
              />
            )}
          </div>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            What's on your mind?
          </span>
        </div>

        <textarea
          className="post-textarea"
          placeholder="Share something with the decentralized world..."
          value={content}
          onChange={this.handleContentChange}
          maxLength={500}
          disabled={posting}
        />

        <div className={this.getCharCountClass()}>
          {content.length}/500
        </div>

        {this.renderMediaPreview()}

        {posting && (
          <div className="posting-indicator">
            <div className="mini-spinner"></div>
            Uploading to IPFS & submitting to blockchain...
          </div>
        )}

        <div className="media-actions">
          <div className="media-buttons">
            <button
              className="media-btn image-btn"
              onClick={() => this.handleFileSelect('image/*', 'image')}
              disabled={posting}
              title="Add Image"
            >
              <FaImage className="icon" />
              <span>Image</span>
            </button>

            <button
              className="media-btn video-btn"
              onClick={() => this.handleFileSelect('video/*', 'video')}
              disabled={posting}
              title="Add Video"
            >
              <FaVideo className="icon" />
              <span>Video</span>
            </button>

            <button
              className="media-btn audio-btn"
              onClick={() => this.handleFileSelect('audio/*', 'audio')}
              disabled={posting}
              title="Add Audio"
            >
              <FaMusic className="icon" />
              <span>Audio</span>
            </button>
          </div>

          <button
            className="post-submit-btn"
            onClick={this.handleSubmit}
            disabled={!canPost}
          >
            {posting ? 'Posting...' : 'Post'}
          </button>
        </div>
      </div>
    );
  }
}

export default CreatePost;