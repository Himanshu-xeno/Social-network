import React, { Component } from 'react';
import Web3 from 'web3';
import './App.css';
import SocialNetwork from '../abis/SocialNetwork.json';
import Navbar from './Navbar';
import Main from './Main';
import WelcomeScreen from './WelcomeScreen';
import UserProfile from './UserProfile';
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
      userCount: 0,
      loading: true,
      uploading: false,
      uploadStatus: '',
      hasProfile: false,
      username: '',
      bio: '',
      avatarHash: '',

      // Navigation
      currentView: 'feed',
      viewingProfileAddress: null,
      viewingProfile: null
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

        window.ethereum.on('accountsChanged', (accounts) => {
          this.setState({ account: accounts[0] || '', loading: true });
          this.loadBlockchainData();
        });

        window.ethereum.on('chainChanged', () => {
          window.location.reload();
        });
      } catch (error) {
        console.error('MetaMask error:', error);
        toast.error('Please connect MetaMask to continue.');
      }
    } else {
      toast.error('Please install MetaMask browser extension!');
    }
  }

  async loadBlockchainData() {
    try {
      const web3 = window.web3;
      if (!web3) return;

      const accounts = await web3.eth.getAccounts();
      if (accounts.length === 0) {
        toast.warn('Please connect a MetaMask account.');
        this.setState({ loading: false });
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

        // Check if user has profile
        const profileData = await socialNetwork.methods.getProfile(accounts[0]).call();
        const hasProfile = profileData.exists || profileData[6];

        if (hasProfile) {
          this.setState({
            hasProfile: true,
            username: profileData.username || profileData[0],
            bio: profileData.bio || profileData[1],
            avatarHash: profileData.avatarHash || profileData[2]
          });
        } else {
          this.setState({ hasProfile: false });
        }

        // Load user count
        const userCount = await socialNetwork.methods.getUserCount().call();
        this.setState({ userCount: Number(userCount) });

        await this.loadPosts(socialNetwork, accounts[0]);
      } else {
        toast.error('Contract not found. Make sure you are on the correct network.');
        this.setState({ loading: false });
      }
    } catch (error) {
      console.error('Load failed:', error);
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
        if (post.exists) {
          posts.push(post);
          profileAddresses.add(post.author);

          const liked = await socialNetwork.methods.hasLiked(i, currentAccount).call();
          postLikes[i.toString()] = liked;

          const commentIds = await socialNetwork.methods.getPostComments(i).call();
          let commentsArr = [];
          for (let j = 0; j < commentIds.length; j++) {
            const comment = await socialNetwork.methods.comments(Number(commentIds[j])).call();
            commentsArr.push(comment);
            profileAddresses.add(comment.author);
          }
          postComments[i.toString()] = commentsArr;
        }
      }

      // Load all profiles
      let profiles = {};
      for (const addr of profileAddresses) {
        try {
          const pData = await socialNetwork.methods.getProfile(addr).call();
          if (pData.exists || pData[6]) {
            profiles[addr] = {
              username: pData.username || pData[0],
              bio: pData.bio || pData[1],
              avatarHash: pData.avatarHash || pData[2],
              postCount: pData.userPostCount || pData[3],
              totalTipsReceived: pData.totalTipsReceived || pData[4],
              joinedAt: pData.joinedAt || pData[5]
            };
          }
        } catch (e) {
          console.warn('Could not load profile for', addr);
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

  // ======= PROFILE FUNCTIONS =======

  checkUsername = async (username) => {
    try {
      const available = await this.state.socialNetwork.methods.isUsernameAvailable(username).call();
      return available;
    } catch (error) {
      console.error('Username check failed:', error);
      return false;
    }
  }

  createProfile = async (username, bio, avatarHash) => {
    this.setState({ uploading: true, uploadStatus: 'Creating your profile on the blockchain...' });

    try {
      await this.state.socialNetwork.methods
        .createProfile(username, bio, avatarHash)
        .send({ from: this.state.account })
        .on('transactionHash', () => {
          this.setState({ uploadStatus: 'Transaction submitted...' });
        });

      toast.success('🎉 Welcome to DChain Social!');
      this.setState({
        uploading: false,
        uploadStatus: '',
        hasProfile: true,
        username,
        bio,
        avatarHash
      });

      await this.loadPosts(this.state.socialNetwork, this.state.account);
    } catch (error) {
      console.error('Profile creation failed:', error);
      toast.error('Profile creation failed. Please try again.');
      this.setState({ uploading: false, uploadStatus: '' });
      throw error;
    }
  }

  updateProfile = async (username, bio, avatarHash) => {
    this.setState({ uploading: true, uploadStatus: 'Updating profile...' });

    try {
      await this.state.socialNetwork.methods
        .updateProfile(username, bio, avatarHash)
        .send({ from: this.state.account });

      toast.success('✨ Profile updated!');
      this.setState({
        uploading: false,
        uploadStatus: '',
        username,
        bio,
        avatarHash
      });

      await this.loadPosts(this.state.socialNetwork, this.state.account);
    } catch (error) {
      console.error('Profile update failed:', error);
      toast.error('Profile update failed.');
      this.setState({ uploading: false, uploadStatus: '' });
      throw error;
    }
  }

  // ======= POST FUNCTIONS =======

  createPost = async (content, mediaFile, mediaType) => {
    let mediaHash = '';

    if (mediaFile) {
      this.setState({ uploading: true, uploadStatus: 'Uploading file to IPFS...' });
      try {
        mediaHash = await uploadToPinata(mediaFile);
        this.setState({ uploadStatus: 'File uploaded! Confirming transaction...' });
        toast.info('📤 File uploaded to IPFS!');
      } catch (error) {
        toast.error('IPFS upload failed. Check Pinata API keys.');
        this.setState({ uploading: false, uploadStatus: '' });
        throw error;
      }
    }

    const finalType = mediaFile ? mediaType : 'text';
    this.setState({ uploading: true, uploadStatus: 'Confirming transaction in MetaMask...' });

    try {
      await this.state.socialNetwork.methods
        .createPost(content || '', mediaHash, finalType)
        .send({ from: this.state.account })
        .on('transactionHash', () => {
          this.setState({ uploadStatus: 'Transaction submitted...' });
        });

      toast.success('🎉 Post published!');
      this.setState({ uploading: false, uploadStatus: '' });
      await this.loadPosts(this.state.socialNetwork, this.state.account);
    } catch (error) {
      toast.error('Post creation failed.');
      this.setState({ uploading: false, uploadStatus: '' });
      throw error;
    }
  }

  tipPost = async (id, tipAmount) => {
    try {
      await this.state.socialNetwork.methods
        .tipPost(id)
        .send({ from: this.state.account, value: tipAmount });
      toast.success('💰 Tip sent!');
      await this.loadPosts(this.state.socialNetwork, this.state.account);
    } catch (error) {
      toast.error('Tip failed.');
    }
  }

  likePost = async (id) => {
    try {
      await this.state.socialNetwork.methods.likePost(id).send({ from: this.state.account });
      toast.success('❤️ Liked!');
      await this.loadPosts(this.state.socialNetwork, this.state.account);
    } catch (error) {
      toast.error('Like failed.');
    }
  }

  unlikePost = async (id) => {
    try {
      await this.state.socialNetwork.methods.unlikePost(id).send({ from: this.state.account });
      toast.info('💔 Unliked.');
      await this.loadPosts(this.state.socialNetwork, this.state.account);
    } catch (error) {
      toast.error('Unlike failed.');
    }
  }

  addComment = async (postId, content) => {
    try {
      await this.state.socialNetwork.methods.addComment(postId, content).send({ from: this.state.account });
      toast.success('💬 Comment added!');
      await this.loadPosts(this.state.socialNetwork, this.state.account);
    } catch (error) {
      toast.error('Comment failed.');
    }
  }

  // ======= NAVIGATION =======

  goToProfile = async (address) => {
    try {
      const profileData = await this.state.socialNetwork.methods.getProfile(address).call();
      if (profileData.exists || profileData[6]) {
        this.setState({
          currentView: 'profile',
          viewingProfileAddress: address,
          viewingProfile: {
            username: profileData.username || profileData[0],
            bio: profileData.bio || profileData[1],
            avatarHash: profileData.avatarHash || profileData[2],
            postCount: profileData.userPostCount || profileData[3],
            totalTipsReceived: profileData.totalTipsReceived || profileData[4],
            joinedAt: profileData.joinedAt || profileData[5]
          }
        });
      } else {
        toast.warn('This user has not created a profile yet.');
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  }

  goToFeed = () => {
    this.setState({
      currentView: 'feed',
      viewingProfileAddress: null,
      viewingProfile: null
    });
  }

  // ======= RENDER =======

  render() {
    const {
      account, posts, loading, uploading, uploadStatus,
      hasProfile, username, bio, avatarHash,
      currentView, viewingProfileAddress, viewingProfile,
      postLikes, postComments, profiles, userCount
    } = this.state;

    return (
      <div>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          theme="dark"
        />

        {/* Upload Overlay */}
        {uploading && (
          <div className="upload-overlay">
            <div className="upload-modal">
              <div className="spinner"></div>
              <p className="upload-status">{uploadStatus}</p>
              <p className="upload-substatus">Please confirm in MetaMask</p>
            </div>
          </div>
        )}

        {loading ? (
          <div className="loading-container">
            <div className="spinner"></div>
            <p className="loading-text">Connecting to blockchain...</p>
            <p className="loading-subtext">
              Make sure Ganache is running and MetaMask is connected
            </p>
          </div>
        ) : !hasProfile ? (
          /* WELCOME / SIGNUP SCREEN */
          <WelcomeScreen
            account={account}
            checkUsername={this.checkUsername}
            onCreateProfile={this.createProfile}
          />
        ) : (
          /* MAIN APP */
          <>
            <Navbar
              account={account}
              username={username}
              avatarHash={avatarHash}
              onProfileClick={this.goToProfile}
              onHomeClick={this.goToFeed}
            />

            {currentView === 'feed' && (
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
                userCount={userCount}
                onProfileClick={this.goToProfile}
              />
            )}

            {currentView === 'profile' && viewingProfile && (
              <UserProfile
                profile={viewingProfile}
                userAddress={viewingProfileAddress}
                posts={posts}
                isOwnProfile={viewingProfileAddress?.toLowerCase() === account?.toLowerCase()}
                onBack={this.goToFeed}
                onUpdateProfile={this.updateProfile}
                tipPost={this.tipPost}
                likePost={this.likePost}
                unlikePost={this.unlikePost}
                addComment={this.addComment}
                postLikes={postLikes}
                postComments={postComments}
                profiles={profiles}
              />
            )}
          </>
        )}
      </div>
    );
  }
}

export default App;