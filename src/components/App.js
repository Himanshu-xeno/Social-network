import React, { Component } from 'react';
import Web3 from 'web3';
import './App.css';
import SocialNetwork from '../abis/SocialNetwork.json';
import Navbar from './Navbar';
import Main from './Main';
import WelcomeScreen from './WelcomeScreen';
import UserProfile from './UserProfile';
import About from './About';
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
          this.setState({ account: accounts[0] || '', loading: true, currentView: 'feed' });
          this.loadBlockchainData();
        });
        window.ethereum.on('chainChanged', () => window.location.reload());
      } catch (error) {
        toast.error('Please connect MetaMask to continue.');
      }
    } else {
      toast.error('Please install MetaMask browser extension!');
      this.setState({ loading: false });
    }
  }

  async loadBlockchainData() {
    try {
      const web3 = window.web3;
      if (!web3) { this.setState({ loading: false }); return; }

      const accounts = await web3.eth.getAccounts();
      if (accounts.length === 0) {
        toast.warn('No accounts found. Connect MetaMask.');
        this.setState({ loading: false });
        return;
      }

      this.setState({ account: accounts[0] });
      const networkId = await web3.eth.net.getId();
      const networkData = SocialNetwork.networks[networkId];

      if (networkData) {
        const socialNetwork = new web3.eth.Contract(SocialNetwork.abi, networkData.address);
        this.setState({ socialNetwork });

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
          this.setState({ hasProfile: false, loading: false });
          return;
        }

        const userCount = await socialNetwork.methods.getUserCount().call();
        this.setState({ userCount: Number(userCount) });
        await this.loadPosts(socialNetwork, accounts[0]);
      } else {
        toast.error('Smart contract not found. Check your network in MetaMask.');
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

      let posts = [], postLikes = {}, postComments = {};
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
        } catch (e) { /* skip */ }
      }

      const userCount = await socialNetwork.methods.getUserCount().call();

      this.setState({ posts, postLikes, postComments, profiles, userCount: Number(userCount), loading: false });
    } catch (error) {
      console.error('Error loading posts:', error);
      this.setState({ loading: false });
    }
  }

  checkUsername = async (username) => {
    try {
      return await this.state.socialNetwork.methods.isUsernameAvailable(username).call();
    } catch (error) { return false; }
  }

  createProfile = async (username, bio, avatarHash) => {
    this.setState({ uploading: true, uploadStatus: 'Creating profile on blockchain...' });
    try {
      await this.state.socialNetwork.methods.createProfile(username, bio, avatarHash)
        .send({ from: this.state.account })
        .on('transactionHash', () => this.setState({ uploadStatus: 'Transaction submitted...' }));

      toast.success('🎉 Welcome to DChain Social!');
      this.setState({ uploading: false, uploadStatus: '', hasProfile: true, username, bio, avatarHash });
      await this.loadPosts(this.state.socialNetwork, this.state.account);
    } catch (error) {
      toast.error('Profile creation failed.');
      this.setState({ uploading: false, uploadStatus: '' });
      throw error;
    }
  }

  updateProfile = async (username, bio, avatarHash) => {
    this.setState({ uploading: true, uploadStatus: 'Updating profile...' });
    try {
      await this.state.socialNetwork.methods.updateProfile(username, bio, avatarHash)
        .send({ from: this.state.account });
      toast.success('✨ Profile updated!');
      this.setState({ uploading: false, uploadStatus: '', username, bio, avatarHash });
      await this.loadPosts(this.state.socialNetwork, this.state.account);
    } catch (error) {
      toast.error('Profile update failed.');
      this.setState({ uploading: false, uploadStatus: '' });
      throw error;
    }
  }

  createPost = async (content, mediaFile, mediaType) => {
    let mediaHash = '';
    if (mediaFile) {
      this.setState({ uploading: true, uploadStatus: 'Uploading to IPFS...' });
      try {
        mediaHash = await uploadToPinata(mediaFile);
        this.setState({ uploadStatus: 'File uploaded! Confirming...' });
        toast.info('📤 File uploaded to IPFS!');
      } catch (error) {
        toast.error('IPFS upload failed. Check Pinata keys.');
        this.setState({ uploading: false, uploadStatus: '' });
        throw error;
      }
    }

    const finalType = mediaFile ? mediaType : 'text';
    this.setState({ uploading: true, uploadStatus: 'Confirm in MetaMask...' });

    try {
      await this.state.socialNetwork.methods.createPost(content || '', mediaHash, finalType)
        .send({ from: this.state.account })
        .on('transactionHash', () => this.setState({ uploadStatus: 'Transaction submitted...' }));
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
      await this.state.socialNetwork.methods.tipPost(id).send({ from: this.state.account, value: tipAmount });
      toast.success('💰 Tip sent!');
      await this.loadPosts(this.state.socialNetwork, this.state.account);
    } catch (error) { toast.error('Tip failed.'); }
  }

  likePost = async (id) => {
    try {
      await this.state.socialNetwork.methods.likePost(id).send({ from: this.state.account });
      toast.success('❤️ Liked!');
      await this.loadPosts(this.state.socialNetwork, this.state.account);
    } catch (error) { toast.error('Like failed.'); }
  }

  unlikePost = async (id) => {
    try {
      await this.state.socialNetwork.methods.unlikePost(id).send({ from: this.state.account });
      toast.info('💔 Unliked.');
      await this.loadPosts(this.state.socialNetwork, this.state.account);
    } catch (error) { toast.error('Unlike failed.'); }
  }

  addComment = async (postId, content) => {
    try {
      await this.state.socialNetwork.methods.addComment(postId, content).send({ from: this.state.account });
      toast.success('💬 Comment added!');
      await this.loadPosts(this.state.socialNetwork, this.state.account);
    } catch (error) { toast.error('Comment failed.'); }
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
    } catch (error) { console.error('Profile load error:', error); }
  }

  goToFeed = () => {
    this.setState({ currentView: 'feed', viewingProfileAddress: null, viewingProfile: null });
    window.scrollTo(0, 0);
  }

  goToAbout = () => {
    this.setState({ currentView: 'about' });
    window.scrollTo(0, 0);
  }

  render() {
    const {
      account, posts, loading, uploading, uploadStatus,
      hasProfile, username, bio, avatarHash,
      currentView, viewingProfileAddress, viewingProfile,
      postLikes, postComments, profiles, userCount
    } = this.state;

    return (
      <div>
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false}
          newestOnTop closeOnClick theme="colored" />

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
            <p className="loading-subtext">Make sure Ganache is running & MetaMask is connected</p>
          </div>
        ) : !hasProfile ? (
          <WelcomeScreen
            account={account}
            checkUsername={this.checkUsername}
            onCreateProfile={this.createProfile}
          />
        ) : (
          <>
            <Navbar
              account={account}
              username={username}
              avatarHash={avatarHash}
              currentView={currentView}
              onProfileClick={this.goToProfile}
              onHomeClick={this.goToFeed}
              onAboutClick={this.goToAbout}
            />

            {currentView === 'feed' && (
              <Main
                account={account} posts={posts}
                createPost={this.createPost} tipPost={this.tipPost}
                likePost={this.likePost} unlikePost={this.unlikePost}
                addComment={this.addComment}
                postLikes={postLikes} postComments={postComments}
                profiles={profiles} userCount={userCount}
                onProfileClick={this.goToProfile}
              />
            )}

            {currentView === 'profile' && viewingProfile && (
              <UserProfile
                profile={viewingProfile} userAddress={viewingProfileAddress}
                posts={posts}
                isOwnProfile={viewingProfileAddress?.toLowerCase() === account?.toLowerCase()}
                onBack={this.goToFeed} onUpdateProfile={this.updateProfile}
                tipPost={this.tipPost} likePost={this.likePost}
                unlikePost={this.unlikePost} addComment={this.addComment}
                postLikes={postLikes} postComments={postComments}
                profiles={profiles} onProfileClick={this.goToProfile}
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