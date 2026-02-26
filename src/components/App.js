import React, { Component } from 'react';
import Web3 from 'web3';
import './App.css';
import SocialNetwork from '../abis/SocialNetwork.json';
import Navbar from './Navbar';
import Main from './Main';
import ProfileModal from './ProfileModal';
import { uploadToPinata } from '../pinata';
import { ToastContainer, toast } from 'react-toastify';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      account: '',
      socialNetwork: null,
      postCount: 0,
      posts: [],
      postLikes: {},
      postComments: {},
      profiles: {},
      loading: true,
      uploading: false,
      uploadStatus: '',
      showProfileModal: false,
      username: ''
    };
  }

  async componentDidMount() {
    await this.loadWeb3();
    await this.loadBlockchainData();
  }

  async loadWeb3() {
    if (window.ethereum) {
      const web3 = new Web3(window.ethereum);
      window.web3 = web3;

      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });

        // Listen for account changes
        window.ethereum.on('accountsChanged', (accounts) => {
          this.setState({ account: accounts[0] || '' });
          this.loadBlockchainData();
        });

        // Listen for network changes
        window.ethereum.on('chainChanged', () => {
          window.location.reload();
        });

      } catch (error) {
        console.error('MetaMask connection failed:', error);
        toast.error('MetaMask connection failed. Please try again.');
      }
    } else {
      toast.error('Please install MetaMask to use DChain Social!');
    }
  }

  async loadBlockchainData() {
    try {
      const web3 = window.web3;
      if (!web3) return;

      const accounts = await web3.eth.getAccounts();
      if (accounts.length === 0) {
        toast.warn('No accounts found. Please connect MetaMask.');
        return;
      }

      this.setState({ account: accounts[0] });

      const networkId = await web3.eth.net.getId();
      const networkData = SocialNetwork.networks[networkId];

      if (networkData) {
        const socialNetwork = new web3.eth.Contract(
          SocialNetwork.abi,
          networkData.address
        );
        this.setState({ socialNetwork });

        await this.loadPosts(socialNetwork, accounts[0]);

        // Load user profile
        const profileData = await socialNetwork.methods.getProfile(accounts[0]).call();
        if (profileData[2]) { // exists
          this.setState({ username: profileData[0] });
        }

      } else {
        toast.error('Smart contract not found on this network. Please switch to the correct network in MetaMask.');
        this.setState({ loading: false });
      }
    } catch (error) {
      console.error('Blockchain load failed:', error);
      toast.error('Failed to load blockchain data.');
      this.setState({ loading: false });
    }
  }

  async loadPosts(socialNetwork, currentAccount) {
    try {
      const postCount = await socialNetwork.methods.postCount().call();
      this.setState({ postCount: Number(postCount) });

      let posts = [];
      let postLikes = {};
      let postComments = {};
      let profileAddresses = new Set();

      for (let i = 1; i <= Number(postCount); i++) {
        const post = await socialNetwork.methods.posts(i).call();
        posts.push(post);
        profileAddresses.add(post.author);

        // Check if current user liked
        const liked = await socialNetwork.methods.hasLiked(i, currentAccount).call();
        postLikes[i.toString()] = liked;

        // Load comments
        const commentIds = await socialNetwork.methods.getPostComments(i).call();
        let commentsArr = [];
        for (let j = 0; j < commentIds.length; j++) {
          const comment = await socialNetwork.methods.comments(Number(commentIds[j])).call();
          commentsArr.push(comment);
          profileAddresses.add(comment.author);
        }
        postComments[i.toString()] = commentsArr;
      }

      // Load profiles
      let profiles = {};
      for (const addr of profileAddresses) {
        const profileData = await socialNetwork.methods.getProfile(addr).call();
        if (profileData[2]) {
          profiles[addr] = { username: profileData[0], avatarHash: profileData[1] };
        }
      }

      this.setState({
        posts,
        postLikes,
        postComments,
        profiles,
        loading: false
      });

    } catch (error) {
      console.error('Error loading posts:', error);
      this.setState({ loading: false });
    }
  }

  createPost = async (content, mediaFile, mediaType) => {
    let mediaHash = '';

    if (mediaFile) {
      this.setState({ uploading: true, uploadStatus: 'Uploading file to IPFS...' });

      try {
        mediaHash = await uploadToPinata(mediaFile);
        this.setState({ uploadStatus: 'File uploaded! Confirming transaction...' });
        toast.success('File uploaded to IPFS successfully!');
      } catch (error) {
        console.error('IPFS upload failed:', error);
        toast.error('Failed to upload file to IPFS. Please check your Pinata API keys.');
        this.setState({ uploading: false, uploadStatus: '' });
        throw error;
      }
    }

    const finalType = mediaFile ? mediaType : 'text';

    this.setState({ uploading: true, uploadStatus: 'Waiting for transaction confirmation...' });

    try {
      await this.state.socialNetwork.methods
        .createPost(content || '', mediaHash, finalType)
        .send({ from: this.state.account })
        .on('transactionHash', () => {
          this.setState({ uploadStatus: 'Transaction submitted! Waiting for confirmation...' });
        });

      toast.success('🎉 Post published on the blockchain!');
      this.setState({ uploading: false, uploadStatus: '' });

      // Reload posts
      await this.loadPosts(this.state.socialNetwork, this.state.account);

    } catch (error) {
      console.error('Transaction failed:', error);
      toast.error('Transaction failed or was rejected.');
      this.setState({ uploading: false, uploadStatus: '' });
      throw error;
    }
  }

  tipPost = async (id, tipAmount) => {
    try {
      await this.state.socialNetwork.methods
        .tipPost(id)
        .send({ from: this.state.account, value: tipAmount });

      toast.success('💰 Tip sent successfully!');
      await this.loadPosts(this.state.socialNetwork, this.state.account);
    } catch (error) {
      console.error('Tip failed:', error);
      toast.error('Tip transaction failed.');
    }
  }

  likePost = async (id) => {
    try {
      await this.state.socialNetwork.methods
        .likePost(id)
        .send({ from: this.state.account });

      toast.success('❤️ Post liked!');
      await this.loadPosts(this.state.socialNetwork, this.state.account);
    } catch (error) {
      console.error('Like failed:', error);
      toast.error('Like transaction failed.');
    }
  }

  unlikePost = async (id) => {
    try {
      await this.state.socialNetwork.methods
        .unlikePost(id)
        .send({ from: this.state.account });

      toast.info('💔 Post unliked.');
      await this.loadPosts(this.state.socialNetwork, this.state.account);
    } catch (error) {
      console.error('Unlike failed:', error);
      toast.error('Unlike transaction failed.');
    }
  }

  addComment = async (postId, content) => {
    try {
      await this.state.socialNetwork.methods
        .addComment(postId, content)
        .send({ from: this.state.account });

      toast.success('💬 Comment added!');
      await this.loadPosts(this.state.socialNetwork, this.state.account);
    } catch (error) {
      console.error('Comment failed:', error);
      toast.error('Comment transaction failed.');
    }
  }

  updateProfile = async (username) => {
    try {
      await this.state.socialNetwork.methods
        .updateProfile(username, '')
        .send({ from: this.state.account });

      toast.success('✨ Profile updated!');
      this.setState({ username, showProfileModal: false });
      await this.loadPosts(this.state.socialNetwork, this.state.account);
    } catch (error) {
      console.error('Profile update failed:', error);
      toast.error('Profile update failed.');
    }
  }

  render() {
    const {
      account, posts, loading, uploading, uploadStatus,
      showProfileModal, username, postLikes, postComments, profiles
    } = this.state;

    return (
      <div>
        <ToastContainer
          position="top-right"
          autoClose={4000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
        />

        <Navbar
          account={account}
          username={username}
          onProfileClick={() => this.setState({ showProfileModal: true })}
        />

        {/* Upload Overlay */}
        {uploading && (
          <div className="upload-overlay">
            <div className="upload-modal">
              <div className="spinner"></div>
              <p className="upload-status">{uploadStatus}</p>
              <p className="upload-substatus">Please confirm the transaction in MetaMask</p>
            </div>
          </div>
        )}

        {/* Profile Modal */}
        {showProfileModal && (
          <ProfileModal
            currentUsername={username}
            onSave={this.updateProfile}
            onClose={() => this.setState({ showProfileModal: false })}
          />
        )}

        {/* Main Content */}
        {loading ? (
          <div className="loading-container">
            <div className="spinner"></div>
            <p className="loading-text">Connecting to the blockchain...</p>
            <p className="loading-subtext">Make sure Ganache is running and MetaMask is connected</p>
          </div>
        ) : (
          <Main
            account={account}
            posts={posts}
            createPost={this.createPost}
            tipPost={this.tipPost}
            likePost={this.likePost}
            unlikePost={this.unlikePost}
            addComment={this.addComment}
            postLikes={postLikes}
            postComments={postComments}
            profiles={profiles}
          />
        )}
      </div>
    );
  }
}

export default App;