import React, { Component } from 'react';
import Web3 from 'web3';
import './App.css';
import SocialNetwork from '../abis/SocialNetwork.json';
import Navbar from './Navbar';
import Main from './Main';
import ConnectWallet from './ConnectWallet';
import CreateProfile from './CreateProfile';
import UserProfile from './UserProfile';
import About from './About';
import { uploadToPinata } from '../pinata';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // Wallet State
      account: null,
      web3: null,
      socialNetwork: null,

      // Authentication State
      isLoggedIn: false,
      hasProfile: false,

      // User Profile Data
      user: {
        username: '',
        bio: '',
        avatarHash: '',
        postCount: 0,
        totalTipsReceived: '0',
        joinedAt: 0
      },

      // App Data
      posts: [],
      postLikes: {},
      postComments: {},
      profiles: {},
      userCount: 0,

      // UI State
      loading: false,
      uploading: false,
      uploadStatus: '',
      currentView: 'feed',
      viewingProfileAddress: null,
      viewingProfile: null,

      // App State: 'connect' | 'signup' | 'app'
      appState: 'connect'
    };
  }

  componentDidMount() {
    this.initializeWeb3Listeners();
  }

  componentWillUnmount() {
    this.removeWeb3Listeners();
  }

  initializeWeb3Listeners() {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', this.handleAccountsChanged);
      window.ethereum.on('chainChanged', this.handleChainChanged);
      window.ethereum.on('disconnect', this.handleDisconnect);
    }
  }

  removeWeb3Listeners() {
    if (window.ethereum) {
      window.ethereum.removeListener('accountsChanged', this.handleAccountsChanged);
      window.ethereum.removeListener('chainChanged', this.handleChainChanged);
      window.ethereum.removeListener('disconnect', this.handleDisconnect);
    }
  }

  handleAccountsChanged = (accounts) => {
    if (accounts.length === 0) {
      toast.info('Wallet disconnected');
      this.logout();
    } else if (accounts[0] !== this.state.account) {
      toast.info('Account switched. Please reconnect.');
      this.logout();
    }
  }

  handleChainChanged = () => {
    window.location.reload();
  }

  handleDisconnect = () => {
    toast.warn('Wallet disconnected');
    this.logout();
  }

  connectWallet = async () => {
    if (!window.ethereum) {
      toast.error('MetaMask is not installed! Please install it to continue.');
      window.open('https://metamask.io/download/', '_blank');
      return;
    }

    this.setState({ loading: true });

    try {
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });

      if (accounts.length === 0) {
        toast.error('No accounts found. Please unlock MetaMask.');
        this.setState({ loading: false });
        return;
      }

      const account = accounts[0];
      const web3 = new Web3(window.ethereum);

      // ✅ FIX: Set global web3 instance
      window.web3 = web3;

      this.setState({ account, web3 });

      await this.initializeBlockchain(account, web3);

    } catch (error) {
      console.error('Wallet connection failed:', error);

      if (error.code === 4001) {
        toast.error('Connection rejected. Please approve the connection request.');
      } else {
        toast.error('Failed to connect wallet. Please try again.');
      }

      this.setState({ loading: false });
    }
  }

  initializeBlockchain = async (account, web3) => {
    try {
      const networkId = await web3.eth.net.getId();
      const networkData = SocialNetwork.networks[networkId];

      if (!networkData) {
        toast.error('Smart contract not deployed to detected network. Please switch to the correct network.');
        this.setState({ loading: false });
        return;
      }

      const socialNetwork = new web3.eth.Contract(
        SocialNetwork.abi,
        networkData.address
      );

      this.setState({ socialNetwork });

      await this.checkUserProfile(account, socialNetwork);

    } catch (error) {
      console.error('Blockchain initialization failed:', error);
      toast.error('Failed to connect to blockchain. Please check your network.');
      this.setState({ loading: false });
    }
  }

  checkUserProfile = async (account, socialNetwork) => {
    try {
      const profileData = await socialNetwork.methods.getProfile(account).call();
      const hasProfile = profileData.exists || profileData[6];

      if (hasProfile) {
        const user = {
          username: profileData.username || profileData[0],
          bio: profileData.bio || profileData[1],
          avatarHash: profileData.avatarHash || profileData[2],
          postCount: profileData.userPostCount || profileData[3],
          totalTipsReceived: profileData.totalTipsReceived || profileData[4],
          joinedAt: profileData.joinedAt || profileData[5]
        };

        this.setState({
          hasProfile: true,
          user,
          appState: 'app',
          isLoggedIn: true
        });

        await this.loadAppData(socialNetwork, account);

        toast.success(`Welcome back, ${user.username}! 🎉`);

      } else {
        this.setState({
          hasProfile: false,
          appState: 'signup',
          loading: false
        });

        toast.info('Welcome! Please create your profile to continue.');
      }

    } catch (error) {
      console.error('Profile check failed:', error);
      toast.error('Failed to load profile data.');
      this.setState({ loading: false });
    }
  }

  loadAppData = async (socialNetwork, account) => {
    try {
      const userCount = await socialNetwork.methods.getUserCount().call();
      this.setState({ userCount: Number(userCount) });

      await this.loadPosts(socialNetwork, account);

      this.setState({ loading: false });

    } catch (error) {
      console.error('Failed to load app data:', error);
      toast.error('Failed to load feed data.');
      this.setState({ loading: false });
    }
  }

  loadPosts = async (socialNetwork, currentAccount) => {
    try {
      const postCount = await socialNetwork.methods.postCount().call();

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
          console.warn(`Failed to load profile for ${addr}`);
        }
      }

      this.setState({ posts, postLikes, postComments, profiles });

    } catch (error) {
      console.error('Error loading posts:', error);
    }
  }

  checkUsername = async (username) => {
    try {
      return await this.state.socialNetwork.methods.isUsernameAvailable(username).call();
    } catch (error) {
      console.error('Username check failed:', error);
      return false;
    }
  }

  createProfile = async (username, bio, avatarHash) => {
    this.setState({
      uploading: true,
      uploadStatus: 'Creating your profile on blockchain...'
    });

    try {
      await this.state.socialNetwork.methods
        .createProfile(username, bio, avatarHash)
        .send({ from: this.state.account })
        .on('transactionHash', (hash) => {
          this.setState({ uploadStatus: 'Transaction submitted. Waiting for confirmation...' });
        });

      const user = {
        username,
        bio,
        avatarHash,
        postCount: 0,
        totalTipsReceived: '0',
        joinedAt: Math.floor(Date.now() / 1000)
      };

      this.setState({
        user,
        hasProfile: true,
        isLoggedIn: true,
        appState: 'app',
        uploading: false,
        uploadStatus: ''
      });

      await this.loadAppData(this.state.socialNetwork, this.state.account);

      toast.success(`🎉 Welcome to DChain Social, ${username}!`);

    } catch (error) {
      console.error('Profile creation failed:', error);

      if (error.code === 4001) {
        toast.error('Transaction rejected.');
      } else {
        toast.error('Failed to create profile. Please try again.');
      }

      this.setState({ uploading: false, uploadStatus: '' });
      throw error;
    }
  }

  updateProfile = async (username, bio, avatarHash) => {
    this.setState({
      uploading: true,
      uploadStatus: 'Updating profile...'
    });

    try {
      await this.state.socialNetwork.methods
        .updateProfile(username, bio, avatarHash)
        .send({ from: this.state.account });

      const updatedUser = {
        ...this.state.user,
        username,
        bio,
        avatarHash
      };

      this.setState({
        user: updatedUser,
        uploading: false,
        uploadStatus: ''
      });

      await this.loadPosts(this.state.socialNetwork, this.state.account);

      toast.success('✨ Profile updated successfully!');

    } catch (error) {
      console.error('Profile update failed:', error);
      toast.error('Failed to update profile.');
      this.setState({ uploading: false, uploadStatus: '' });
      throw error;
    }
  }

  createPost = async (content, mediaFile, mediaType) => {
    let mediaHash = '';

    if (mediaFile) {
      this.setState({ uploading: true, uploadStatus: 'Uploading media to IPFS...' });

      try {
        mediaHash = await uploadToPinata(mediaFile);
        this.setState({ uploadStatus: 'Media uploaded! Creating post...' });
        toast.info('📤 Media uploaded to IPFS successfully!');
      } catch (error) {
        console.error('IPFS upload failed:', error);
        toast.error('Media upload failed. Please check your Pinata configuration.');
        this.setState({ uploading: false, uploadStatus: '' });
        throw error;
      }
    }

    const finalType = mediaFile ? mediaType : 'text';
    this.setState({ uploading: true, uploadStatus: 'Please confirm transaction in MetaMask...' });

    try {
      await this.state.socialNetwork.methods
        .createPost(content || '', mediaHash, finalType)
        .send({ from: this.state.account })
        .on('transactionHash', () => {
          this.setState({ uploadStatus: 'Transaction submitted...' });
        });

      toast.success('🎉 Post published successfully!');
      this.setState({ uploading: false, uploadStatus: '' });

      await this.loadPosts(this.state.socialNetwork, this.state.account);

    } catch (error) {
      console.error('Post creation failed:', error);

      if (error.code === 4001) {
        toast.error('Transaction rejected.');
      } else {
        toast.error('Failed to create post.');
      }

      this.setState({ uploading: false, uploadStatus: '' });
      throw error;
    }
  }

  // ✅ FIX: Complete Tip Function Rewrite
  tipPost = async (id, tipAmount) => {
    console.log('🔹 Tipping post:', { id, tipAmount, type: typeof id });

    try {
      // Convert id to number if it's a string
      const postId = typeof id === 'string' ? parseInt(id) : id;

      // Validate post ID
      if (!postId || postId < 1) {
        toast.error('Invalid post ID');
        return;
      }

      // Validate tip amount
      if (!tipAmount || tipAmount === '0') {
        toast.error('Invalid tip amount');
        return;
      }

      console.log('🔹 Sending tip transaction:', {
        postId,
        from: this.state.account,
        value: tipAmount
      });

      // Send transaction
      const receipt = await this.state.socialNetwork.methods
        .tipPost(postId)
        .send({
          from: this.state.account,
          value: tipAmount
        });

      console.log('✅ Tip successful:', receipt);

      toast.success('💰 Tip sent successfully!');

      // ✅ FIX: Reload posts immediately to reflect new tip amount
      await this.loadPosts(this.state.socialNetwork, this.state.account);

    } catch (error) {
      console.error('❌ Tip failed:', error);

      if (error.code === 4001) {
        toast.error('Transaction rejected.');
      } else if (error.message.includes('Cannot tip your own post')) {
        toast.error('You cannot tip your own post.');
      } else if (error.message.includes('Post does not exist')) {
        toast.error('Post not found.');
      } else {
        toast.error('Failed to send tip. Please try again.');
      }
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
      if (error.code !== 4001) {
        toast.error('Failed to like post.');
      }
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
      if (error.code !== 4001) {
        toast.error('Failed to unlike post.');
      }
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
      if (error.code !== 4001) {
        toast.error('Failed to add comment.');
      }
    }
  }

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
        window.scrollTo(0, 0);
      } else {
        toast.warn('This user has no profile yet.');
      }
    } catch (error) {
      console.error('Profile load error:', error);
      toast.error('Failed to load profile.');
    }
  }

  goToFeed = () => {
    this.setState({
      currentView: 'feed',
      viewingProfileAddress: null,
      viewingProfile: null
    });
    window.scrollTo(0, 0);
  }

  goToAbout = () => {
    this.setState({ currentView: 'about' });
    window.scrollTo(0, 0);
  }

  logout = () => {
    this.setState({
      account: null,
      web3: null,
      socialNetwork: null,
      isLoggedIn: false,
      hasProfile: false,
      user: {
        username: '',
        bio: '',
        avatarHash: '',
        postCount: 0,
        totalTipsReceived: '0',
        joinedAt: 0
      },
      posts: [],
      postLikes: {},
      postComments: {},
      profiles: {},
      userCount: 0,
      loading: false,
      uploading: false,
      uploadStatus: '',
      currentView: 'feed',
      viewingProfileAddress: null,
      viewingProfile: null,
      appState: 'connect'
    });

    // ✅ FIX: Clear global web3
    window.web3 = null;

    toast.info('👋 Logged out successfully');
    window.scrollTo(0, 0);
  }

  render() {
    const {
      account,
      user,
      appState,
      posts,
      loading,
      uploading,
      uploadStatus,
      currentView,
      viewingProfileAddress,
      viewingProfile,
      postLikes,
      postComments,
      profiles,
      userCount
    } = this.state;

    return (
      <div className="app-root">
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />

        {uploading && (
          <div className="upload-overlay">
            <div className="upload-modal">
              <div className="spinner"></div>
              <p className="upload-status">{uploadStatus}</p>
              <p className="upload-substatus">Please wait...</p>
            </div>
          </div>
        )}

        {loading && (
          <div className="loading-overlay">
            <div className="loading-content">
              <div className="spinner-large"></div>
              <p className="loading-text">Loading...</p>
            </div>
          </div>
        )}

        {appState === 'connect' && (
          <ConnectWallet onConnect={this.connectWallet} />
        )}

        {appState === 'signup' && (
          <CreateProfile
            account={account}
            checkUsername={this.checkUsername}
            onCreateProfile={this.createProfile}
            onLogout={this.logout}
          />
        )}

        {appState === 'app' && (
          <>
            <Navbar
              account={account}
              username={user.username}
              avatarHash={user.avatarHash}
              currentView={currentView}
              onProfileClick={this.goToProfile}
              onHomeClick={this.goToFeed}
              onAboutClick={this.goToAbout}
              onLogout={this.logout}
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
                onProfileClick={this.goToProfile}
              />
            )}

            {currentView === 'about' && <About />}
          </>
        )}
      </div>
    );
  }
}

export default App;