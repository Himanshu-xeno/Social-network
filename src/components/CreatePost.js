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
  }

  componentWillUnmount() {
    if (this.state.mediaPreview) {
      URL.revokeObjectURL(this.state.mediaPreview);
    }
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

  renderMediaPreview = () => {
    const { mediaPreview, mediaType, mediaFile } = this.state;
    if (!mediaPreview) return null;

    return (
      <div className="modal-media-preview">
        <button className="remove-media-btn" onClick={this.removeMedia}>
          <FaTimes />
        </button>

        {mediaType === 'image' && (
          <img src={mediaPreview} alt="Preview" />
        )}

        {mediaType === 'video' && (
          <video src={mediaPreview} controls />
        )}

        {mediaType === 'audio' && (
          <div className="audio-preview">
            <FaMusic size={40} />
            <audio src={mediaPreview} controls />
          </div>
        )}

        <div className="file-info">
          📎 {mediaFile.name} ({(mediaFile.size / (1024 * 1024)).toFixed(2)} MB)
        </div>
      </div>
    );
  }

  render() {
    const { account } = this.props;
    const { content, posting, mediaFile } = this.state;
    const canPost = (content.trim().length > 0 || mediaFile) &&
      content.length <= 500 && !posting;

    return (
      <div className="modal-create-post">
        <div className="create-post-top">
          <div className="user-avatar">
            {account && (
              <img
                src={`data:image/png;base64,${new Identicon(account, 42).toString()}`}
                alt="You"
              />
            )}
          </div>
          <textarea
            className="modal-post-textarea"
            placeholder="What's on your mind?"
            value={content}
            onChange={this.handleContentChange}
            maxLength={500}
            disabled={posting}
            rows={4}
            autoFocus
          />
        </div>

        <div className="char-counter">
          <span className={content.length > 450 ? 'warning' : ''}>
            {content.length}/500
          </span>
        </div>

        {this.renderMediaPreview()}

        {posting && (
          <div className="posting-indicator">
            <div className="spinner-small"></div>
            <span>Uploading to IPFS & blockchain...</span>
          </div>
        )}

        <div className="modal-post-actions">
          <div className="media-buttons-row">
            <button
              className="media-option-btn"
              onClick={() => this.handleFileSelect('image/*', 'image')}
              disabled={posting}
              title="Add Image"
            >
              <FaImage />
              <span>Photo</span>
            </button>

            <button
              className="media-option-btn"
              onClick={() => this.handleFileSelect('video/*', 'video')}
              disabled={posting}
              title="Add Video"
            >
              <FaVideo />
              <span>Video</span>
            </button>

            <button
              className="media-option-btn"
              onClick={() => this.handleFileSelect('audio/*', 'audio')}
              disabled={posting}
              title="Add Audio"
            >
              <FaMusic />
              <span>Audio</span>
            </button>
          </div>

          <button
            className="modal-post-btn"
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