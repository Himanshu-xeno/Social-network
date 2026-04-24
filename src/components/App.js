// // // import React, { Component } from 'react';
// // // import Web3 from 'web3';
// // // import './App.css';
// // // import SocialNetwork from '../abis/SocialNetwork.json';
// // // import Navbar from './Navbar';
// // // import Main from './Main';
// // // import WelcomeScreen from './WelcomeScreen';
// // // import UserProfile from './UserProfile';
// // // import About from './About';
// // // import { uploadToPinata } from '../pinata';
// // // import { ToastContainer, toast } from 'react-toastify';

// // // class App extends Component {
// // //   constructor(props) {
// // //     super(props);
// // //     this.state = {
// // //       account: '',
// // //       socialNetwork: null,
// // //       postCount: 0,
// // //       posts: [],
// // //       postLikes: {},
// // //       postComments: {},
// // //       profiles: {},
// // //       userCount: 0,
// // //       loading: true,
// // //       uploading: false,
// // //       uploadStatus: '',
// // //       hasProfile: false,
// // //       username: '',
// // //       bio: '',
// // //       avatarHash: '',
// // //       currentView: 'feed',
// // //       viewingProfileAddress: null,
// // //       viewingProfile: null
// // //     };
// // //   }

// // //   async componentDidMount() {
// // //     await this.loadWeb3();
// // //     await this.loadBlockchainData();
// // //   }

// // //   async loadWeb3() {
// // //     if (window.ethereum) {
// // //       const web3 = new Web3(window.ethereum);
// // //       window.web3 = web3;
// // //       try {
// // //         await window.ethereum.request({ method: 'eth_requestAccounts' });
// // //         window.ethereum.on('accountsChanged', (accounts) => {
// // //           this.setState({ account: accounts[0] || '', loading: true, currentView: 'feed' });
// // //           this.loadBlockchainData();
// // //         });
// // //         window.ethereum.on('chainChanged', () => window.location.reload());
// // //       } catch (error) {
// // //         toast.error('Please connect MetaMask to continue.');
// // //       }
// // //     } else {
// // //       toast.error('Please install MetaMask browser extension!');
// // //       this.setState({ loading: false });
// // //     }
// // //   }

// // //   async loadBlockchainData() {
// // //     try {
// // //       const web3 = window.web3;
// // //       if (!web3) { this.setState({ loading: false }); return; }

// // //       const accounts = await web3.eth.getAccounts();
// // //       if (accounts.length === 0) {
// // //         toast.warn('No accounts found. Connect MetaMask.');
// // //         this.setState({ loading: false });
// // //         return;
// // //       }

// // //       this.setState({ account: accounts[0] });
// // //       const networkId = await web3.eth.net.getId();
// // //       const networkData = SocialNetwork.networks[networkId];

// // //       if (networkData) {
// // //         const socialNetwork = new web3.eth.Contract(SocialNetwork.abi, networkData.address);
// // //         this.setState({ socialNetwork });

// // //         const profileData = await socialNetwork.methods.getProfile(accounts[0]).call();
// // //         const hasProfile = profileData.exists || profileData[6];

// // //         if (hasProfile) {
// // //           this.setState({
// // //             hasProfile: true,
// // //             username: profileData.username || profileData[0],
// // //             bio: profileData.bio || profileData[1],
// // //             avatarHash: profileData.avatarHash || profileData[2]
// // //           });
// // //         } else {
// // //           this.setState({ hasProfile: false, loading: false });
// // //           return;
// // //         }

// // //         const userCount = await socialNetwork.methods.getUserCount().call();
// // //         this.setState({ userCount: Number(userCount) });
// // //         await this.loadPosts(socialNetwork, accounts[0]);
// // //       } else {
// // //         toast.error('Smart contract not found. Check your network in MetaMask.');
// // //         this.setState({ loading: false });
// // //       }
// // //     } catch (error) {
// // //       console.error('Load failed:', error);
// // //       toast.error('Failed to load blockchain data.');
// // //       this.setState({ loading: false });
// // //     }
// // //   }

// // //   async loadPosts(socialNetwork, currentAccount) {
// // //     try {
// // //       const postCount = await socialNetwork.methods.postCount().call();
// // //       this.setState({ postCount: Number(postCount) });

// // //       let posts = [], postLikes = {}, postComments = {};
// // //       let profileAddresses = new Set();

// // //       for (let i = 1; i <= Number(postCount); i++) {
// // //         const post = await socialNetwork.methods.posts(i).call();
// // //         if (post.exists) {
// // //           posts.push(post);
// // //           profileAddresses.add(post.author);
// // //           const liked = await socialNetwork.methods.hasLiked(i, currentAccount).call();
// // //           postLikes[i.toString()] = liked;

// // //           const commentIds = await socialNetwork.methods.getPostComments(i).call();
// // //           let commentsArr = [];
// // //           for (let j = 0; j < commentIds.length; j++) {
// // //             const comment = await socialNetwork.methods.comments(Number(commentIds[j])).call();
// // //             commentsArr.push(comment);
// // //             profileAddresses.add(comment.author);
// // //           }
// // //           postComments[i.toString()] = commentsArr;
// // //         }
// // //       }

// // //       let profiles = {};
// // //       for (const addr of profileAddresses) {
// // //         try {
// // //           const pData = await socialNetwork.methods.getProfile(addr).call();
// // //           if (pData.exists || pData[6]) {
// // //             profiles[addr] = {
// // //               username: pData.username || pData[0],
// // //               bio: pData.bio || pData[1],
// // //               avatarHash: pData.avatarHash || pData[2],
// // //               postCount: pData.userPostCount || pData[3],
// // //               totalTipsReceived: pData.totalTipsReceived || pData[4],
// // //               joinedAt: pData.joinedAt || pData[5]
// // //             };
// // //           }
// // //         } catch (e) { /* skip */ }
// // //       }

// // //       const userCount = await socialNetwork.methods.getUserCount().call();

// // //       this.setState({ posts, postLikes, postComments, profiles, userCount: Number(userCount), loading: false });
// // //     } catch (error) {
// // //       console.error('Error loading posts:', error);
// // //       this.setState({ loading: false });
// // //     }
// // //   }

// // //   checkUsername = async (username) => {
// // //     try {
// // //       return await this.state.socialNetwork.methods.isUsernameAvailable(username).call();
// // //     } catch (error) { return false; }
// // //   }

// // //   createProfile = async (username, bio, avatarHash) => {
// // //     this.setState({ uploading: true, uploadStatus: 'Creating profile on blockchain...' });
// // //     try {
// // //       await this.state.socialNetwork.methods.createProfile(username, bio, avatarHash)
// // //         .send({ from: this.state.account })
// // //         .on('transactionHash', () => this.setState({ uploadStatus: 'Transaction submitted...' }));

// // //       toast.success('🎉 Welcome to DChain Social!');
// // //       this.setState({ uploading: false, uploadStatus: '', hasProfile: true, username, bio, avatarHash });
// // //       await this.loadPosts(this.state.socialNetwork, this.state.account);
// // //     } catch (error) {
// // //       toast.error('Profile creation failed.');
// // //       this.setState({ uploading: false, uploadStatus: '' });
// // //       throw error;
// // //     }
// // //   }

// // //   updateProfile = async (username, bio, avatarHash) => {
// // //     this.setState({ uploading: true, uploadStatus: 'Updating profile...' });
// // //     try {
// // //       await this.state.socialNetwork.methods.updateProfile(username, bio, avatarHash)
// // //         .send({ from: this.state.account });
// // //       toast.success('✨ Profile updated!');
// // //       this.setState({ uploading: false, uploadStatus: '', username, bio, avatarHash });
// // //       await this.loadPosts(this.state.socialNetwork, this.state.account);
// // //     } catch (error) {
// // //       toast.error('Profile update failed.');
// // //       this.setState({ uploading: false, uploadStatus: '' });
// // //       throw error;
// // //     }
// // //   }

// // //   createPost = async (content, mediaFile, mediaType) => {
// // //     let mediaHash = '';
// // //     if (mediaFile) {
// // //       this.setState({ uploading: true, uploadStatus: 'Uploading to IPFS...' });
// // //       try {
// // //         mediaHash = await uploadToPinata(mediaFile);
// // //         this.setState({ uploadStatus: 'File uploaded! Confirming...' });
// // //         toast.info('📤 File uploaded to IPFS!');
// // //       } catch (error) {
// // //         toast.error('IPFS upload failed. Check Pinata keys.');
// // //         this.setState({ uploading: false, uploadStatus: '' });
// // //         throw error;
// // //       }
// // //     }

// // //     const finalType = mediaFile ? mediaType : 'text';
// // //     this.setState({ uploading: true, uploadStatus: 'Confirm in MetaMask...' });

// // //     try {
// // //       await this.state.socialNetwork.methods.createPost(content || '', mediaHash, finalType)
// // //         .send({ from: this.state.account })
// // //         .on('transactionHash', () => this.setState({ uploadStatus: 'Transaction submitted...' }));
// // //       toast.success('🎉 Post published!');
// // //       this.setState({ uploading: false, uploadStatus: '' });
// // //       await this.loadPosts(this.state.socialNetwork, this.state.account);
// // //     } catch (error) {
// // //       toast.error('Post creation failed.');
// // //       this.setState({ uploading: false, uploadStatus: '' });
// // //       throw error;
// // //     }
// // //   }

// // //   tipPost = async (id, tipAmount) => {
// // //     try {
// // //       await this.state.socialNetwork.methods.tipPost(id).send({ from: this.state.account, value: tipAmount });
// // //       toast.success('💰 Tip sent!');
// // //       await this.loadPosts(this.state.socialNetwork, this.state.account);
// // //     } catch (error) { toast.error('Tip failed.'); }
// // //   }

// // //   likePost = async (id) => {
// // //     try {
// // //       await this.state.socialNetwork.methods.likePost(id).send({ from: this.state.account });
// // //       toast.success('❤️ Liked!');
// // //       await this.loadPosts(this.state.socialNetwork, this.state.account);
// // //     } catch (error) { toast.error('Like failed.'); }
// // //   }

// // //   unlikePost = async (id) => {
// // //     try {
// // //       await this.state.socialNetwork.methods.unlikePost(id).send({ from: this.state.account });
// // //       toast.info('💔 Unliked.');
// // //       await this.loadPosts(this.state.socialNetwork, this.state.account);
// // //     } catch (error) { toast.error('Unlike failed.'); }
// // //   }

// // //   addComment = async (postId, content) => {
// // //     try {
// // //       await this.state.socialNetwork.methods.addComment(postId, content).send({ from: this.state.account });
// // //       toast.success('💬 Comment added!');
// // //       await this.loadPosts(this.state.socialNetwork, this.state.account);
// // //     } catch (error) { toast.error('Comment failed.'); }
// // //   }

// // //   goToProfile = async (address) => {
// // //     try {
// // //       const profileData = await this.state.socialNetwork.methods.getProfile(address).call();
// // //       if (profileData.exists || profileData[6]) {
// // //         this.setState({
// // //           currentView: 'profile',
// // //           viewingProfileAddress: address,
// // //           viewingProfile: {
// // //             username: profileData.username || profileData[0],
// // //             bio: profileData.bio || profileData[1],
// // //             avatarHash: profileData.avatarHash || profileData[2],
// // //             postCount: profileData.userPostCount || profileData[3],
// // //             totalTipsReceived: profileData.totalTipsReceived || profileData[4],
// // //             joinedAt: profileData.joinedAt || profileData[5]
// // //           }
// // //         });
// // //         window.scrollTo(0, 0);
// // //       } else {
// // //         toast.warn('This user has no profile yet.');
// // //       }
// // //     } catch (error) { console.error('Profile load error:', error); }
// // //   }

// // //   goToFeed = () => {
// // //     this.setState({ currentView: 'feed', viewingProfileAddress: null, viewingProfile: null });
// // //     window.scrollTo(0, 0);
// // //   }

// // //   goToAbout = () => {
// // //     this.setState({ currentView: 'about' });
// // //     window.scrollTo(0, 0);
// // //   }

// // //   render() {
// // //     const {
// // //       account, posts, loading, uploading, uploadStatus,
// // //       hasProfile, username, bio, avatarHash,
// // //       currentView, viewingProfileAddress, viewingProfile,
// // //       postLikes, postComments, profiles, userCount
// // //     } = this.state;

// // //     return (
// // //       <div>
// // //         <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false}
// // //           newestOnTop closeOnClick theme="colored" />

// // //         {uploading && (
// // //           <div className="upload-overlay">
// // //             <div className="upload-modal">
// // //               <div className="spinner"></div>
// // //               <p className="upload-status">{uploadStatus}</p>
// // //               <p className="upload-substatus">Please confirm in MetaMask</p>
// // //             </div>
// // //           </div>
// // //         )}

// // //         {loading ? (
// // //           <div className="loading-container">
// // //             <div className="spinner"></div>
// // //             <p className="loading-text">Connecting to blockchain...</p>
// // //             <p className="loading-subtext">Make sure Ganache is running & MetaMask is connected</p>
// // //           </div>
// // //         ) : !hasProfile ? (
// // //           <WelcomeScreen
// // //             account={account}
// // //             checkUsername={this.checkUsername}
// // //             onCreateProfile={this.createProfile}
// // //           />
// // //         ) : (
// // //           <>
// // //             <Navbar
// // //               account={account}
// // //               username={username}
// // //               avatarHash={avatarHash}
// // //               currentView={currentView}
// // //               onProfileClick={this.goToProfile}
// // //               onHomeClick={this.goToFeed}
// // //               onAboutClick={this.goToAbout}
// // //             />

// // //             {currentView === 'feed' && (
// // //               <Main
// // //                 account={account} posts={posts}
// // //                 createPost={this.createPost} tipPost={this.tipPost}
// // //                 likePost={this.likePost} unlikePost={this.unlikePost}
// // //                 addComment={this.addComment}
// // //                 postLikes={postLikes} postComments={postComments}
// // //                 profiles={profiles} userCount={userCount}
// // //                 onProfileClick={this.goToProfile}
// // //               />
// // //             )}

// // //             {currentView === 'profile' && viewingProfile && (
// // //               <UserProfile
// // //                 profile={viewingProfile} userAddress={viewingProfileAddress}
// // //                 posts={posts}
// // //                 isOwnProfile={viewingProfileAddress?.toLowerCase() === account?.toLowerCase()}
// // //                 onBack={this.goToFeed} onUpdateProfile={this.updateProfile}
// // //                 tipPost={this.tipPost} likePost={this.likePost}
// // //                 unlikePost={this.unlikePost} addComment={this.addComment}
// // //                 postLikes={postLikes} postComments={postComments}
// // //                 profiles={profiles} onProfileClick={this.goToProfile}
// // //               />
// // //             )}

// // //             {currentView === 'about' && <About />}
// // //           </>
// // //         )}
// // //       </div>
// // //     );
// // //   }
// // // }

// // // export default App;






// // // import React, { Component } from 'react';
// // // import Web3 from 'web3';
// // // import './App.css';
// // // import SocialNetwork from '../abis/SocialNetwork.json';
// // // import Navbar from './Navbar';
// // // import Main from './Main';
// // // import WelcomeScreen from './WelcomeScreen';
// // // import UserProfile from './UserProfile';
// // // import About from './About';
// // // import { uploadToPinata } from '../pinata';
// // // import { ToastContainer, toast } from 'react-toastify';

// // // class App extends Component {
// // //   constructor(props) {
// // //     super(props);
// // //     this.state = {
// // //       account: '',
// // //       socialNetwork: null,
// // //       postCount: 0,
// // //       posts: [],
// // //       postLikes: {},
// // //       postComments: {},
// // //       profiles: {},
// // //       userCount: 0,
// // //       loading: true,
// // //       uploading: false,
// // //       uploadStatus: '',
// // //       hasProfile: false,
// // //       username: '',
// // //       bio: '',
// // //       avatarHash: '',
// // //       currentView: 'feed',
// // //       viewingProfileAddress: null,
// // //       viewingProfile: null
// // //     };
// // //   }

// // //   async componentDidMount() {
// // //     await this.loadWeb3();
// // //     await this.loadBlockchainData();
// // //   }

// // //   async loadWeb3() {
// // //     if (window.ethereum) {
// // //       const web3 = new Web3(window.ethereum);
// // //       window.web3 = web3;
// // //       try {
// // //         await window.ethereum.request({ method: 'eth_requestAccounts' });
// // //         window.ethereum.on('accountsChanged', (accounts) => {
// // //           this.setState({ account: accounts[0] || '', loading: true, currentView: 'feed' });
// // //           this.loadBlockchainData();
// // //         });
// // //         window.ethereum.on('chainChanged', () => window.location.reload());
// // //       } catch (error) {
// // //         toast.error('Please connect MetaMask to continue.');
// // //       }
// // //     } else {
// // //       toast.error('Please install MetaMask browser extension!');
// // //       this.setState({ loading: false });
// // //     }
// // //   }

// // //   async loadBlockchainData() {
// // //     try {
// // //       const web3 = window.web3;
// // //       if (!web3) { this.setState({ loading: false }); return; }

// // //       const accounts = await web3.eth.getAccounts();
// // //       if (accounts.length === 0) {
// // //         toast.warn('No accounts found. Connect MetaMask.');
// // //         this.setState({ loading: false });
// // //         return;
// // //       }

// // //       this.setState({ account: accounts[0] });
// // //       const networkId = await web3.eth.net.getId();
// // //       const networkData = SocialNetwork.networks[networkId];

// // //       if (networkData) {
// // //         const socialNetwork = new web3.eth.Contract(SocialNetwork.abi, networkData.address);
// // //         this.setState({ socialNetwork });

// // //         const profileData = await socialNetwork.methods.getProfile(accounts[0]).call();
// // //         const hasProfile = profileData.exists || profileData[6];

// // //         if (hasProfile) {
// // //           this.setState({
// // //             hasProfile: true,
// // //             username: profileData.username || profileData[0],
// // //             bio: profileData.bio || profileData[1],
// // //             avatarHash: profileData.avatarHash || profileData[2]
// // //           });
// // //         } else {
// // //           this.setState({ hasProfile: false, loading: false });
// // //           return;
// // //         }

// // //         const userCount = await socialNetwork.methods.getUserCount().call();
// // //         this.setState({ userCount: Number(userCount) });
// // //         await this.loadPosts(socialNetwork, accounts[0]);
// // //       } else {
// // //         toast.error('Smart contract not found. Check your network in MetaMask.');
// // //         this.setState({ loading: false });
// // //       }
// // //     } catch (error) {
// // //       console.error('Load failed:', error);
// // //       toast.error('Failed to load blockchain data.');
// // //       this.setState({ loading: false });
// // //     }
// // //   }

// // //   async loadPosts(socialNetwork, currentAccount) {
// // //     try {
// // //       const postCount = await socialNetwork.methods.postCount().call();
// // //       this.setState({ postCount: Number(postCount) });

// // //       let posts = [], postLikes = {}, postComments = {};
// // //       let profileAddresses = new Set();

// // //       for (let i = 1; i <= Number(postCount); i++) {
// // //         const post = await socialNetwork.methods.posts(i).call();
// // //         if (post.exists) {
// // //           posts.push(post);
// // //           profileAddresses.add(post.author);
// // //           const liked = await socialNetwork.methods.hasLiked(i, currentAccount).call();
// // //           postLikes[i.toString()] = liked;

// // //           const commentIds = await socialNetwork.methods.getPostComments(i).call();
// // //           let commentsArr = [];
// // //           for (let j = 0; j < commentIds.length; j++) {
// // //             const comment = await socialNetwork.methods.comments(Number(commentIds[j])).call();
// // //             commentsArr.push(comment);
// // //             profileAddresses.add(comment.author);
// // //           }
// // //           postComments[i.toString()] = commentsArr;
// // //         }
// // //       }

// // //       let profiles = {};
// // //       for (const addr of profileAddresses) {
// // //         try {
// // //           const pData = await socialNetwork.methods.getProfile(addr).call();
// // //           if (pData.exists || pData[6]) {
// // //             profiles[addr] = {
// // //               username: pData.username || pData[0],
// // //               bio: pData.bio || pData[1],
// // //               avatarHash: pData.avatarHash || pData[2],
// // //               postCount: pData.userPostCount || pData[3],
// // //               totalTipsReceived: pData.totalTipsReceived || pData[4],
// // //               joinedAt: pData.joinedAt || pData[5]
// // //             };
// // //           }
// // //         } catch (e) { /* skip */ }
// // //       }

// // //       const userCount = await socialNetwork.methods.getUserCount().call();

// // //       this.setState({ posts, postLikes, postComments, profiles, userCount: Number(userCount), loading: false });
// // //     } catch (error) {
// // //       console.error('Error loading posts:', error);
// // //       this.setState({ loading: false });
// // //     }
// // //   }

// // //   checkUsername = async (username) => {
// // //     try {
// // //       return await this.state.socialNetwork.methods.isUsernameAvailable(username).call();
// // //     } catch (error) { return false; }
// // //   }

// // //   createProfile = async (username, bio, avatarHash) => {
// // //     this.setState({ uploading: true, uploadStatus: 'Creating profile on blockchain...' });
// // //     try {
// // //       await this.state.socialNetwork.methods.createProfile(username, bio, avatarHash)
// // //         .send({ from: this.state.account })
// // //         .on('transactionHash', () => this.setState({ uploadStatus: 'Transaction submitted...' }));

// // //       toast.success('🎉 Welcome to DChain Social!');
// // //       this.setState({ uploading: false, uploadStatus: '', hasProfile: true, username, bio, avatarHash });
// // //       await this.loadPosts(this.state.socialNetwork, this.state.account);
// // //     } catch (error) {
// // //       toast.error('Profile creation failed.');
// // //       this.setState({ uploading: false, uploadStatus: '' });
// // //       throw error;
// // //     }
// // //   }

// // //   updateProfile = async (username, bio, avatarHash) => {
// // //     this.setState({ uploading: true, uploadStatus: 'Updating profile...' });
// // //     try {
// // //       await this.state.socialNetwork.methods.updateProfile(username, bio, avatarHash)
// // //         .send({ from: this.state.account });
// // //       toast.success('✨ Profile updated!');
// // //       this.setState({ uploading: false, uploadStatus: '', username, bio, avatarHash });
// // //       await this.loadPosts(this.state.socialNetwork, this.state.account);
// // //     } catch (error) {
// // //       toast.error('Profile update failed.');
// // //       this.setState({ uploading: false, uploadStatus: '' });
// // //       throw error;
// // //     }
// // //   }

// // //   createPost = async (content, mediaFile, mediaType) => {
// // //     let mediaHash = '';
// // //     if (mediaFile) {
// // //       this.setState({ uploading: true, uploadStatus: 'Uploading to IPFS...' });
// // //       try {
// // //         mediaHash = await uploadToPinata(mediaFile);
// // //         this.setState({ uploadStatus: 'File uploaded! Confirming...' });
// // //         toast.info('📤 File uploaded to IPFS!');
// // //       } catch (error) {
// // //         toast.error('IPFS upload failed. Check Pinata keys.');
// // //         this.setState({ uploading: false, uploadStatus: '' });
// // //         throw error;
// // //       }
// // //     }

// // //     const finalType = mediaFile ? mediaType : 'text';
// // //     this.setState({ uploading: true, uploadStatus: 'Confirm in MetaMask...' });

// // //     try {
// // //       await this.state.socialNetwork.methods.createPost(content || '', mediaHash, finalType)
// // //         .send({ from: this.state.account })
// // //         .on('transactionHash', () => this.setState({ uploadStatus: 'Transaction submitted...' }));
// // //       toast.success('🎉 Post published!');
// // //       this.setState({ uploading: false, uploadStatus: '' });
// // //       await this.loadPosts(this.state.socialNetwork, this.state.account);
// // //     } catch (error) {
// // //       toast.error('Post creation failed.');
// // //       this.setState({ uploading: false, uploadStatus: '' });
// // //       throw error;
// // //     }
// // //   }

// // //   tipPost = async (id, tipAmount) => {
// // //     try {
// // //       await this.state.socialNetwork.methods.tipPost(id).send({ from: this.state.account, value: tipAmount });
// // //       toast.success('💰 Tip sent!');
// // //       await this.loadPosts(this.state.socialNetwork, this.state.account);
// // //     } catch (error) { toast.error('Tip failed.'); }
// // //   }

// // //   likePost = async (id) => {
// // //     try {
// // //       await this.state.socialNetwork.methods.likePost(id).send({ from: this.state.account });
// // //       toast.success('❤️ Liked!');
// // //       await this.loadPosts(this.state.socialNetwork, this.state.account);
// // //     } catch (error) { toast.error('Like failed.'); }
// // //   }

// // //   unlikePost = async (id) => {
// // //     try {
// // //       await this.state.socialNetwork.methods.unlikePost(id).send({ from: this.state.account });
// // //       toast.info('💔 Unliked.');
// // //       await this.loadPosts(this.state.socialNetwork, this.state.account);
// // //     } catch (error) { toast.error('Unlike failed.'); }
// // //   }

// // //   addComment = async (postId, content) => {
// // //     try {
// // //       await this.state.socialNetwork.methods.addComment(postId, content).send({ from: this.state.account });
// // //       toast.success('💬 Comment added!');
// // //       await this.loadPosts(this.state.socialNetwork, this.state.account);
// // //     } catch (error) { toast.error('Comment failed.'); }
// // //   }

// // //   goToProfile = async (address) => {
// // //     try {
// // //       const profileData = await this.state.socialNetwork.methods.getProfile(address).call();
// // //       if (profileData.exists || profileData[6]) {
// // //         this.setState({
// // //           currentView: 'profile',
// // //           viewingProfileAddress: address,
// // //           viewingProfile: {
// // //             username: profileData.username || profileData[0],
// // //             bio: profileData.bio || profileData[1],
// // //             avatarHash: profileData.avatarHash || profileData[2],
// // //             postCount: profileData.userPostCount || profileData[3],
// // //             totalTipsReceived: profileData.totalTipsReceived || profileData[4],
// // //             joinedAt: profileData.joinedAt || profileData[5]
// // //           }
// // //         });
// // //         window.scrollTo(0, 0);
// // //       } else {
// // //         toast.warn('This user has no profile yet.');
// // //       }
// // //     } catch (error) { console.error('Profile load error:', error); }
// // //   }

// // //   goToFeed = () => {
// // //     this.setState({ currentView: 'feed', viewingProfileAddress: null, viewingProfile: null });
// // //     window.scrollTo(0, 0);
// // //   }

// // //   goToAbout = () => {
// // //     this.setState({ currentView: 'about' });
// // //     window.scrollTo(0, 0);
// // //   }

// // //   logout = () => {
// // //     this.setState({
// // //       account: '',
// // //       socialNetwork: null,
// // //       postCount: 0,
// // //       posts: [],
// // //       postLikes: {},
// // //       postComments: {},
// // //       profiles: {},
// // //       userCount: 0,
// // //       loading: false,
// // //       uploading: false,
// // //       uploadStatus: '',
// // //       hasProfile: false,
// // //       username: '',
// // //       bio: '',
// // //       avatarHash: '',
// // //       currentView: 'feed',
// // //       viewingProfileAddress: null,
// // //       viewingProfile: null
// // //     });

// // //     toast.info('👋 Logged out successfully');
// // //     window.scrollTo(0, 0);
// // //   }

// // //   render() {
// // //     const {
// // //       account, posts, loading, uploading, uploadStatus,
// // //       hasProfile, username, bio, avatarHash,
// // //       currentView, viewingProfileAddress, viewingProfile,
// // //       postLikes, postComments, profiles, userCount
// // //     } = this.state;

// // //     return (
// // //       <div>
// // //         <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false}
// // //           newestOnTop closeOnClick theme="colored" />

// // //         {uploading && (
// // //           <div className="upload-overlay">
// // //             <div className="upload-modal">
// // //               <div className="spinner"></div>
// // //               <p className="upload-status">{uploadStatus}</p>
// // //               <p className="upload-substatus">Please confirm in MetaMask</p>
// // //             </div>
// // //           </div>
// // //         )}

// // //         {loading ? (
// // //           <div className="loading-container">
// // //             <div className="spinner"></div>
// // //             <p className="loading-text">Connecting to blockchain...</p>
// // //             <p className="loading-subtext">Make sure Ganache is running & MetaMask is connected</p>
// // //           </div>
// // //         ) : !account || !hasProfile ? (
// // //           <WelcomeScreen
// // //             account={account}
// // //             checkUsername={this.checkUsername}
// // //             onCreateProfile={this.createProfile}
// // //           />
// // //         ) : (
// // //           <>
// // //             <Navbar
// // //               account={account}
// // //               username={username}
// // //               avatarHash={avatarHash}
// // //               currentView={currentView}
// // //               onProfileClick={this.goToProfile}
// // //               onHomeClick={this.goToFeed}
// // //               onAboutClick={this.goToAbout}
// // //               onLogout={this.logout}
// // //             />

// // //             {currentView === 'feed' && (
// // //               <Main
// // //                 account={account} posts={posts}
// // //                 createPost={this.createPost} tipPost={this.tipPost}
// // //                 likePost={this.likePost} unlikePost={this.unlikePost}
// // //                 addComment={this.addComment}
// // //                 postLikes={postLikes} postComments={postComments}
// // //                 profiles={profiles} userCount={userCount}
// // //                 onProfileClick={this.goToProfile}
// // //               />
// // //             )}

// // //             {currentView === 'profile' && viewingProfile && (
// // //               <UserProfile
// // //                 profile={viewingProfile} userAddress={viewingProfileAddress}
// // //                 posts={posts}
// // //                 isOwnProfile={viewingProfileAddress?.toLowerCase() === account?.toLowerCase()}
// // //                 onBack={this.goToFeed} onUpdateProfile={this.updateProfile}
// // //                 tipPost={this.tipPost} likePost={this.likePost}
// // //                 unlikePost={this.unlikePost} addComment={this.addComment}
// // //                 postLikes={postLikes} postComments={postComments}
// // //                 profiles={profiles} onProfileClick={this.goToProfile}
// // //               />
// // //             )}

// // //             {currentView === 'about' && <About />}
// // //           </>
// // //         )}
// // //       </div>
// // //     );
// // //   }
// // // }

// // // export default App;










// // import React, { Component } from 'react';
// // import Web3 from 'web3';
// // import './App.css';
// // import SocialNetwork from '../abis/SocialNetwork.json';
// // import Navbar from './Navbar';
// // import Main from './Main';
// // import WelcomeScreen from './WelcomeScreen';
// // import UserProfile from './UserProfile';
// // import About from './About';
// // import { uploadToPinata } from '../pinata';
// // import { ToastContainer, toast } from 'react-toastify';

// // class App extends Component {
// //   constructor(props) {
// //     super(props);
// //     this.state = {
// //       account: '',
// //       socialNetwork: null,
// //       postCount: 0,
// //       posts: [],
// //       postLikes: {},
// //       postComments: {},
// //       profiles: {},
// //       userCount: 0,
// //       loading: true,
// //       uploading: false,
// //       uploadStatus: '',
// //       hasProfile: false,
// //       isLoggedIn: false,  // NEW: Separate login state
// //       username: '',
// //       bio: '',
// //       avatarHash: '',
// //       currentView: 'feed',
// //       viewingProfileAddress: null,
// //       viewingProfile: null
// //     };
// //   }

// //   async componentDidMount() {
// //     await this.loadWeb3();
// //     await this.loadBlockchainData();
// //   }

// //   async loadWeb3() {
// //     if (window.ethereum) {
// //       const web3 = new Web3(window.ethereum);
// //       window.web3 = web3;
// //       try {
// //         await window.ethereum.request({ method: 'eth_requestAccounts' });
// //         window.ethereum.on('accountsChanged', (accounts) => {
// //           // When account changes, reset login state
// //           this.setState({
// //             account: accounts[0] || '',
// //             loading: true,
// //             currentView: 'feed',
// //             isLoggedIn: false  // Force re-login on account change
// //           });
// //           this.loadBlockchainData();
// //         });
// //         window.ethereum.on('chainChanged', () => window.location.reload());
// //       } catch (error) {
// //         toast.error('Please connect MetaMask to continue.');
// //       }
// //     } else {
// //       toast.error('Please install MetaMask browser extension!');
// //       this.setState({ loading: false });
// //     }
// //   }

// //   async loadBlockchainData() {
// //     try {
// //       const web3 = window.web3;
// //       if (!web3) {
// //         this.setState({ loading: false });
// //         return;
// //       }

// //       const accounts = await web3.eth.getAccounts();
// //       if (accounts.length === 0) {
// //         toast.warn('No accounts found. Connect MetaMask.');
// //         this.setState({ loading: false, account: '' });
// //         return;
// //       }

// //       this.setState({ account: accounts[0] });
// //       const networkId = await web3.eth.net.getId();
// //       const networkData = SocialNetwork.networks[networkId];

// //       if (networkData) {
// //         const socialNetwork = new web3.eth.Contract(SocialNetwork.abi, networkData.address);
// //         this.setState({ socialNetwork });

// //         const profileData = await socialNetwork.methods.getProfile(accounts[0]).call();
// //         const hasProfile = profileData.exists || profileData[6];

// //         if (hasProfile) {
// //           this.setState({
// //             hasProfile: true,
// //             username: profileData.username || profileData[0],
// //             bio: profileData.bio || profileData[1],
// //             avatarHash: profileData.avatarHash || profileData[2]
// //           });
// //         } else {
// //           this.setState({ hasProfile: false, loading: false });
// //           return;
// //         }

// //         const userCount = await socialNetwork.methods.getUserCount().call();
// //         this.setState({ userCount: Number(userCount) });
// //         await this.loadPosts(socialNetwork, accounts[0]);
// //       } else {
// //         toast.error('Smart contract not found. Check your network in MetaMask.');
// //         this.setState({ loading: false });
// //       }
// //     } catch (error) {
// //       console.error('Load failed:', error);
// //       toast.error('Failed to load blockchain data.');
// //       this.setState({ loading: false });
// //     }
// //   }

// //   async loadPosts(socialNetwork, currentAccount) {
// //     try {
// //       const postCount = await socialNetwork.methods.postCount().call();
// //       this.setState({ postCount: Number(postCount) });

// //       let posts = [], postLikes = {}, postComments = {};
// //       let profileAddresses = new Set();

// //       for (let i = 1; i <= Number(postCount); i++) {
// //         const post = await socialNetwork.methods.posts(i).call();
// //         if (post.exists) {
// //           posts.push(post);
// //           profileAddresses.add(post.author);
// //           const liked = await socialNetwork.methods.hasLiked(i, currentAccount).call();
// //           postLikes[i.toString()] = liked;

// //           const commentIds = await socialNetwork.methods.getPostComments(i).call();
// //           let commentsArr = [];
// //           for (let j = 0; j < commentIds.length; j++) {
// //             const comment = await socialNetwork.methods.comments(Number(commentIds[j])).call();
// //             commentsArr.push(comment);
// //             profileAddresses.add(comment.author);
// //           }
// //           postComments[i.toString()] = commentsArr;
// //         }
// //       }

// //       let profiles = {};
// //       for (const addr of profileAddresses) {
// //         try {
// //           const pData = await socialNetwork.methods.getProfile(addr).call();
// //           if (pData.exists || pData[6]) {
// //             profiles[addr] = {
// //               username: pData.username || pData[0],
// //               bio: pData.bio || pData[1],
// //               avatarHash: pData.avatarHash || pData[2],
// //               postCount: pData.userPostCount || pData[3],
// //               totalTipsReceived: pData.totalTipsReceived || pData[4],
// //               joinedAt: pData.joinedAt || pData[5]
// //             };
// //           }
// //         } catch (e) { /* skip */ }
// //       }

// //       const userCount = await socialNetwork.methods.getUserCount().call();

// //       this.setState({
// //         posts,
// //         postLikes,
// //         postComments,
// //         profiles,
// //         userCount: Number(userCount),
// //         loading: false
// //       });
// //     } catch (error) {
// //       console.error('Error loading posts:', error);
// //       this.setState({ loading: false });
// //     }
// //   }

// //   checkUsername = async (username) => {
// //     try {
// //       return await this.state.socialNetwork.methods.isUsernameAvailable(username).call();
// //     } catch (error) { return false; }
// //   }

// //   createProfile = async (username, bio, avatarHash) => {
// //     this.setState({ uploading: true, uploadStatus: 'Creating profile on blockchain...' });
// //     try {
// //       await this.state.socialNetwork.methods.createProfile(username, bio, avatarHash)
// //         .send({ from: this.state.account })
// //         .on('transactionHash', () => this.setState({ uploadStatus: 'Transaction submitted...' }));

// //       toast.success('🎉 Welcome to DChain Social!');
// //       this.setState({
// //         uploading: false,
// //         uploadStatus: '',
// //         hasProfile: true,
// //         isLoggedIn: true,  // NEW: Set logged in after profile creation
// //         username,
// //         bio,
// //         avatarHash
// //       });
// //       await this.loadPosts(this.state.socialNetwork, this.state.account);
// //     } catch (error) {
// //       toast.error('Profile creation failed.');
// //       this.setState({ uploading: false, uploadStatus: '' });
// //       throw error;
// //     }
// //   }

// //   // NEW: Login function for existing users
// //   login = async () => {
// //     if (!this.state.hasProfile) {
// //       toast.error('Please create a profile first');
// //       return;
// //     }

// //     this.setState({ loading: true });
// //     try {
// //       await this.loadPosts(this.state.socialNetwork, this.state.account);
// //       this.setState({ isLoggedIn: true, loading: false });
// //       toast.success(`👋 Welcome back, ${this.state.username}!`);
// //     } catch (error) {
// //       toast.error('Login failed');
// //       this.setState({ loading: false });
// //     }
// //   }

// //   updateProfile = async (username, bio, avatarHash) => {
// //     this.setState({ uploading: true, uploadStatus: 'Updating profile...' });
// //     try {
// //       await this.state.socialNetwork.methods.updateProfile(username, bio, avatarHash)
// //         .send({ from: this.state.account });
// //       toast.success('✨ Profile updated!');
// //       this.setState({ uploading: false, uploadStatus: '', username, bio, avatarHash });
// //       await this.loadPosts(this.state.socialNetwork, this.state.account);
// //     } catch (error) {
// //       toast.error('Profile update failed.');
// //       this.setState({ uploading: false, uploadStatus: '' });
// //       throw error;
// //     }
// //   }

// //   createPost = async (content, mediaFile, mediaType) => {
// //     let mediaHash = '';
// //     if (mediaFile) {
// //       this.setState({ uploading: true, uploadStatus: 'Uploading to IPFS...' });
// //       try {
// //         mediaHash = await uploadToPinata(mediaFile);
// //         this.setState({ uploadStatus: 'File uploaded! Confirming...' });
// //         toast.info('📤 File uploaded to IPFS!');
// //       } catch (error) {
// //         toast.error('IPFS upload failed. Check Pinata keys.');
// //         this.setState({ uploading: false, uploadStatus: '' });
// //         throw error;
// //       }
// //     }

// //     const finalType = mediaFile ? mediaType : 'text';
// //     this.setState({ uploading: true, uploadStatus: 'Confirm in MetaMask...' });

// //     try {
// //       await this.state.socialNetwork.methods.createPost(content || '', mediaHash, finalType)
// //         .send({ from: this.state.account })
// //         .on('transactionHash', () => this.setState({ uploadStatus: 'Transaction submitted...' }));
// //       toast.success('🎉 Post published!');
// //       this.setState({ uploading: false, uploadStatus: '' });
// //       await this.loadPosts(this.state.socialNetwork, this.state.account);
// //     } catch (error) {
// //       toast.error('Post creation failed.');
// //       this.setState({ uploading: false, uploadStatus: '' });
// //       throw error;
// //     }
// //   }

// //   tipPost = async (id, tipAmount) => {
// //     try {
// //       await this.state.socialNetwork.methods.tipPost(id).send({ from: this.state.account, value: tipAmount });
// //       toast.success('💰 Tip sent!');
// //       await this.loadPosts(this.state.socialNetwork, this.state.account);
// //     } catch (error) { toast.error('Tip failed.'); }
// //   }

// //   likePost = async (id) => {
// //     try {
// //       await this.state.socialNetwork.methods.likePost(id).send({ from: this.state.account });
// //       toast.success('❤️ Liked!');
// //       await this.loadPosts(this.state.socialNetwork, this.state.account);
// //     } catch (error) { toast.error('Like failed.'); }
// //   }

// //   unlikePost = async (id) => {
// //     try {
// //       await this.state.socialNetwork.methods.unlikePost(id).send({ from: this.state.account });
// //       toast.info('💔 Unliked.');
// //       await this.loadPosts(this.state.socialNetwork, this.state.account);
// //     } catch (error) { toast.error('Unlike failed.'); }
// //   }

// //   addComment = async (postId, content) => {
// //     try {
// //       await this.state.socialNetwork.methods.addComment(postId, content).send({ from: this.state.account });
// //       toast.success('💬 Comment added!');
// //       await this.loadPosts(this.state.socialNetwork, this.state.account);
// //     } catch (error) { toast.error('Comment failed.'); }
// //   }

// //   goToProfile = async (address) => {
// //     try {
// //       const profileData = await this.state.socialNetwork.methods.getProfile(address).call();
// //       if (profileData.exists || profileData[6]) {
// //         this.setState({
// //           currentView: 'profile',
// //           viewingProfileAddress: address,
// //           viewingProfile: {
// //             username: profileData.username || profileData[0],
// //             bio: profileData.bio || profileData[1],
// //             avatarHash: profileData.avatarHash || profileData[2],
// //             postCount: profileData.userPostCount || profileData[3],
// //             totalTipsReceived: profileData.totalTipsReceived || profileData[4],
// //             joinedAt: profileData.joinedAt || profileData[5]
// //           }
// //         });
// //         window.scrollTo(0, 0);
// //       } else {
// //         toast.warn('This user has no profile yet.');
// //       }
// //     } catch (error) { console.error('Profile load error:', error); }
// //   }

// //   goToFeed = () => {
// //     this.setState({ currentView: 'feed', viewingProfileAddress: null, viewingProfile: null });
// //     window.scrollTo(0, 0);
// //   }

// //   goToAbout = () => {
// //     this.setState({ currentView: 'about' });
// //     window.scrollTo(0, 0);
// //   }

// //   // IMPROVED: Logout only resets session, NOT wallet connection
// //   logout = () => {
// //     this.setState({
// //       isLoggedIn: false,
// //       posts: [],
// //       postLikes: {},
// //       postComments: {},
// //       profiles: {},
// //       currentView: 'feed',
// //       viewingProfileAddress: null,
// //       viewingProfile: null
// //     });

// //     toast.info('👋 Logged out successfully');
// //     window.scrollTo(0, 0);
// //   }

// //   render() {
// //     const {
// //       account, posts, loading, uploading, uploadStatus,
// //       hasProfile, isLoggedIn, username, bio, avatarHash,
// //       currentView, viewingProfileAddress, viewingProfile,
// //       postLikes, postComments, profiles, userCount
// //     } = this.state;

// //     return (
// //       <div>
// //         <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false}
// //           newestOnTop closeOnClick theme="colored" />

// //         {uploading && (
// //           <div className="upload-overlay">
// //             <div className="upload-modal">
// //               <div className="spinner"></div>
// //               <p className="upload-status">{uploadStatus}</p>
// //               <p className="upload-substatus">Please confirm in MetaMask</p>
// //             </div>
// //           </div>
// //         )}

// //         {loading ? (
// //           <div className="loading-container">
// //             <div className="spinner"></div>
// //             <p className="loading-text">Connecting to blockchain...</p>
// //             <p className="loading-subtext">Make sure Ganache is running & MetaMask is connected</p>
// //           </div>
// //         ) : !account ? (
// //           // SCENARIO 1: No wallet connected
// //           <WelcomeScreen
// //             account={account}
// //             hasProfile={false}
// //             isWalletConnected={false}
// //             checkUsername={this.checkUsername}
// //             onCreateProfile={this.createProfile}
// //             onLogin={this.login}
// //           />
// //         ) : !isLoggedIn ? (
// //           // SCENARIO 2: Wallet connected but not logged in
// //           <WelcomeScreen
// //             account={account}
// //             hasProfile={hasProfile}
// //             isWalletConnected={true}
// //             checkUsername={this.checkUsername}
// //             onCreateProfile={this.createProfile}
// //             onLogin={this.login}
// //           />
// //         ) : (
// //           // SCENARIO 3: Logged in - show main app
// //           <>
// //             <Navbar
// //               account={account}
// //               username={username}
// //               avatarHash={avatarHash}
// //               currentView={currentView}
// //               onProfileClick={this.goToProfile}
// //               onHomeClick={this.goToFeed}
// //               onAboutClick={this.goToAbout}
// //               onLogout={this.logout}
// //             />

// //             {currentView === 'feed' && (
// //               <Main
// //                 account={account} posts={posts}
// //                 createPost={this.createPost} tipPost={this.tipPost}
// //                 likePost={this.likePost} unlikePost={this.unlikePost}
// //                 addComment={this.addComment}
// //                 postLikes={postLikes} postComments={postComments}
// //                 profiles={profiles} userCount={userCount}
// //                 onProfileClick={this.goToProfile}
// //               />
// //             )}

// //             {currentView === 'profile' && viewingProfile && (
// //               <UserProfile
// //                 profile={viewingProfile} userAddress={viewingProfileAddress}
// //                 posts={posts}
// //                 isOwnProfile={viewingProfileAddress?.toLowerCase() === account?.toLowerCase()}
// //                 onBack={this.goToFeed} onUpdateProfile={this.updateProfile}
// //                 tipPost={this.tipPost} likePost={this.likePost}
// //                 unlikePost={this.unlikePost} addComment={this.addComment}
// //                 postLikes={postLikes} postComments={postComments}
// //                 profiles={profiles} onProfileClick={this.goToProfile}
// //               />
// //             )}

// //             {currentView === 'about' && <About />}
// //           </>
// //         )}
// //       </div>
// //     );
// //   }
// // }

// // export default App;




















// import React, { Component } from 'react';
// import Web3 from 'web3';
// import './App.css';
// import SocialNetwork from '../abis/SocialNetwork.json';
// import Navbar from './Navbar';
// import Main from './Main';
// import AuthScreen from './AuthScreen';
// import CreateProfile from './CreateProfile';
// import WelcomeScreen from './WelcomeScreen';
// import UserProfile from './UserProfile';
// import About from './About';
// import { uploadToPinata } from '../pinata';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// class App extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       // Wallet & Web3
//       account: '',
//       socialNetwork: null,
//       isWalletConnected: false,

//       // Authentication State
//       authState: 'auth', // 'auth', 'signup', 'login', 'app'
//       isLoggedIn: false,
//       hasProfile: false,

//       // User Data
//       username: '',
//       bio: '',
//       avatarHash: '',

//       // App Data
//       postCount: 0,
//       posts: [],
//       postLikes: {},
//       postComments: {},
//       profiles: {},
//       userCount: 0,

//       // UI State
//       loading: false,
//       uploading: false,
//       uploadStatus: '',
//       currentView: 'feed',
//       viewingProfileAddress: null,
//       viewingProfile: null
//     };
//   }

//   // Initialize Web3 (but don't auto-connect)
//   async componentDidMount() {
//     if (window.ethereum) {
//       const web3 = new Web3(window.ethereum);
//       window.web3 = web3;

//       // Listen for account changes
//       window.ethereum.on('accountsChanged', (accounts) => {
//         if (accounts.length === 0) {
//           // User disconnected wallet
//           this.handleLogout();
//         } else {
//           // Account changed - force logout and return to auth
//           toast.info('Account changed. Please login again.');
//           this.handleLogout();
//         }
//       });

//       // Listen for chain changes
//       window.ethereum.on('chainChanged', () => {
//         window.location.reload();
//       });
//     }
//   }

//   // Connect wallet manually
//   connectWallet = async () => {
//     if (!window.ethereum) {
//       toast.error('Please install MetaMask browser extension!');
//       return;
//     }

//     this.setState({ loading: true });

//     try {
//       // Request account access
//       const accounts = await window.ethereum.request({
//         method: 'eth_requestAccounts'
//       });

//       if (accounts.length === 0) {
//         toast.error('No accounts found. Please unlock MetaMask.');
//         this.setState({ loading: false });
//         return;
//       }

//       const account = accounts[0];
//       this.setState({ account, isWalletConnected: true });

//       // Initialize blockchain connection
//       await this.initializeBlockchain(account);

//     } catch (error) {
//       console.error('Wallet connection failed:', error);
//       toast.error('Failed to connect wallet. Please try again.');
//       this.setState({ loading: false });
//     }
//   }

//   // Initialize blockchain and check for existing profile
//   initializeBlockchain = async (account) => {
//     try {
//       const web3 = window.web3;
//       const networkId = await web3.eth.net.getId();
//       const networkData = SocialNetwork.networks[networkId];

//       if (!networkData) {
//         toast.error('Smart contract not found. Check your network in MetaMask.');
//         this.setState({ loading: false });
//         return;
//       }

//       const socialNetwork = new web3.eth.Contract(
//         SocialNetwork.abi,
//         networkData.address
//       );

//       this.setState({ socialNetwork });

//       // Check if user has a profile
//       const profileData = await socialNetwork.methods.getProfile(account).call();
//       const hasProfile = profileData.exists || profileData[6];

//       if (hasProfile) {
//         // EXISTING USER - Go to login screen
//         this.setState({
//           hasProfile: true,
//           username: profileData.username || profileData[0],
//           bio: profileData.bio || profileData[1],
//           avatarHash: profileData.avatarHash || profileData[2],
//           authState: 'login',
//           loading: false
//         });
//         toast.success(`Welcome back, ${profileData.username || profileData[0]}!`);
//       } else {
//         // NEW USER - Go to signup screen
//         this.setState({
//           hasProfile: false,
//           authState: 'signup',
//           loading: false
//         });
//         toast.info('New here? Create your profile to get started!');
//       }

//     } catch (error) {
//       console.error('Blockchain initialization failed:', error);
//       toast.error('Failed to connect to blockchain.');
//       this.setState({ loading: false });
//     }
//   }

//   // Login (for existing users)
//   handleLogin = async () => {
//     this.setState({ loading: true });

//     try {
//       const userCount = await this.state.socialNetwork.methods.getUserCount().call();
//       this.setState({ userCount: Number(userCount) });

//       await this.loadPosts(this.state.socialNetwork, this.state.account);

//       this.setState({
//         authState: 'app',
//         isLoggedIn: true,
//         loading: false
//       });

//       toast.success(`🎉 Welcome back, ${this.state.username}!`);
//     } catch (error) {
//       console.error('Login failed:', error);
//       toast.error('Login failed. Please try again.');
//       this.setState({ loading: false });
//     }
//   }

//   // Load all posts
//   async loadPosts(socialNetwork, currentAccount) {
//     try {
//       const postCount = await socialNetwork.methods.postCount().call();
//       this.setState({ postCount: Number(postCount) });

//       let posts = [], postLikes = {}, postComments = {};
//       let profileAddresses = new Set();

//       for (let i = 1; i <= Number(postCount); i++) {
//         const post = await socialNetwork.methods.posts(i).call();
//         if (post.exists) {
//           posts.push(post);
//           profileAddresses.add(post.author);

//           const liked = await socialNetwork.methods.hasLiked(i, currentAccount).call();
//           postLikes[i.toString()] = liked;

//           const commentIds = await socialNetwork.methods.getPostComments(i).call();
//           let commentsArr = [];
//           for (let j = 0; j < commentIds.length; j++) {
//             const comment = await socialNetwork.methods.comments(Number(commentIds[j])).call();
//             commentsArr.push(comment);
//             profileAddresses.add(comment.author);
//           }
//           postComments[i.toString()] = commentsArr;
//         }
//       }

//       let profiles = {};
//       for (const addr of profileAddresses) {
//         try {
//           const pData = await socialNetwork.methods.getProfile(addr).call();
//           if (pData.exists || pData[6]) {
//             profiles[addr] = {
//               username: pData.username || pData[0],
//               bio: pData.bio || pData[1],
//               avatarHash: pData.avatarHash || pData[2],
//               postCount: pData.userPostCount || pData[3],
//               totalTipsReceived: pData.totalTipsReceived || pData[4],
//               joinedAt: pData.joinedAt || pData[5]
//             };
//           }
//         } catch (e) { /* skip */ }
//       }

//       this.setState({
//         posts,
//         postLikes,
//         postComments,
//         profiles
//       });

//     } catch (error) {
//       console.error('Error loading posts:', error);
//     }
//   }

//   // Check username availability
//   checkUsername = async (username) => {
//     try {
//       return await this.state.socialNetwork.methods.isUsernameAvailable(username).call();
//     } catch (error) {
//       return false;
//     }
//   }

//   // Create profile (signup)
//   createProfile = async (username, bio, avatarHash) => {
//     this.setState({ uploading: true, uploadStatus: 'Creating profile on blockchain...' });

//     try {
//       await this.state.socialNetwork.methods
//         .createProfile(username, bio, avatarHash)
//         .send({ from: this.state.account })
//         .on('transactionHash', () => {
//           this.setState({ uploadStatus: 'Transaction submitted. Waiting for confirmation...' });
//         });

//       toast.success('🎉 Profile created successfully!');

//       this.setState({
//         uploading: false,
//         uploadStatus: '',
//         hasProfile: true,
//         username,
//         bio,
//         avatarHash
//       });

//       // Load posts and log in
//       const userCount = await this.state.socialNetwork.methods.getUserCount().call();
//       this.setState({ userCount: Number(userCount) });

//       await this.loadPosts(this.state.socialNetwork, this.state.account);

//       this.setState({
//         authState: 'app',
//         isLoggedIn: true
//       });

//     } catch (error) {
//       console.error('Profile creation failed:', error);
//       toast.error('Profile creation failed. Please try again.');
//       this.setState({ uploading: false, uploadStatus: '' });
//       throw error;
//     }
//   }

//   // Update profile
//   updateProfile = async (username, bio, avatarHash) => {
//     this.setState({ uploading: true, uploadStatus: 'Updating profile...' });

//     try {
//       await this.state.socialNetwork.methods
//         .updateProfile(username, bio, avatarHash)
//         .send({ from: this.state.account });

//       toast.success('✨ Profile updated!');
//       this.setState({
//         uploading: false,
//         uploadStatus: '',
//         username,
//         bio,
//         avatarHash
//       });

//       await this.loadPosts(this.state.socialNetwork, this.state.account);
//     } catch (error) {
//       toast.error('Profile update failed.');
//       this.setState({ uploading: false, uploadStatus: '' });
//       throw error;
//     }
//   }

//   // Create post
//   createPost = async (content, mediaFile, mediaType) => {
//     let mediaHash = '';

//     if (mediaFile) {
//       this.setState({ uploading: true, uploadStatus: 'Uploading to IPFS...' });
//       try {
//         mediaHash = await uploadToPinata(mediaFile);
//         this.setState({ uploadStatus: 'File uploaded! Creating post...' });
//         toast.info('📤 File uploaded to IPFS!');
//       } catch (error) {
//         toast.error('IPFS upload failed. Check Pinata keys.');
//         this.setState({ uploading: false, uploadStatus: '' });
//         throw error;
//       }
//     }

//     const finalType = mediaFile ? mediaType : 'text';
//     this.setState({ uploading: true, uploadStatus: 'Confirm transaction in MetaMask...' });

//     try {
//       await this.state.socialNetwork.methods
//         .createPost(content || '', mediaHash, finalType)
//         .send({ from: this.state.account })
//         .on('transactionHash', () => {
//           this.setState({ uploadStatus: 'Transaction submitted...' });
//         });

//       toast.success('🎉 Post published!');
//       this.setState({ uploading: false, uploadStatus: '' });
//       await this.loadPosts(this.state.socialNetwork, this.state.account);
//     } catch (error) {
//       toast.error('Post creation failed.');
//       this.setState({ uploading: false, uploadStatus: '' });
//       throw error;
//     }
//   }

//   // Tip post
//   tipPost = async (id, tipAmount) => {
//     try {
//       await this.state.socialNetwork.methods
//         .tipPost(id)
//         .send({ from: this.state.account, value: tipAmount });
//       toast.success('💰 Tip sent!');
//       await this.loadPosts(this.state.socialNetwork, this.state.account);
//     } catch (error) {
//       toast.error('Tip failed.');
//     }
//   }

//   // Like post
//   likePost = async (id) => {
//     try {
//       await this.state.socialNetwork.methods
//         .likePost(id)
//         .send({ from: this.state.account });
//       toast.success('❤️ Liked!');
//       await this.loadPosts(this.state.socialNetwork, this.state.account);
//     } catch (error) {
//       toast.error('Like failed.');
//     }
//   }

//   // Unlike post
//   unlikePost = async (id) => {
//     try {
//       await this.state.socialNetwork.methods
//         .unlikePost(id)
//         .send({ from: this.state.account });
//       toast.info('💔 Unliked.');
//       await this.loadPosts(this.state.socialNetwork, this.state.account);
//     } catch (error) {
//       toast.error('Unlike failed.');
//     }
//   }

//   // Add comment
//   addComment = async (postId, content) => {
//     try {
//       await this.state.socialNetwork.methods
//         .addComment(postId, content)
//         .send({ from: this.state.account });
//       toast.success('💬 Comment added!');
//       await this.loadPosts(this.state.socialNetwork, this.state.account);
//     } catch (error) {
//       toast.error('Comment failed.');
//     }
//   }

//   // Navigation
//   goToProfile = async (address) => {
//     try {
//       const profileData = await this.state.socialNetwork.methods.getProfile(address).call();
//       if (profileData.exists || profileData[6]) {
//         this.setState({
//           currentView: 'profile',
//           viewingProfileAddress: address,
//           viewingProfile: {
//             username: profileData.username || profileData[0],
//             bio: profileData.bio || profileData[1],
//             avatarHash: profileData.avatarHash || profileData[2],
//             postCount: profileData.userPostCount || profileData[3],
//             totalTipsReceived: profileData.totalTipsReceived || profileData[4],
//             joinedAt: profileData.joinedAt || profileData[5]
//           }
//         });
//         window.scrollTo(0, 0);
//       } else {
//         toast.warn('This user has no profile yet.');
//       }
//     } catch (error) {
//       console.error('Profile load error:', error);
//     }
//   }

//   goToFeed = () => {
//     this.setState({
//       currentView: 'feed',
//       viewingProfileAddress: null,
//       viewingProfile: null
//     });
//     window.scrollTo(0, 0);
//   }

//   goToAbout = () => {
//     this.setState({ currentView: 'about' });
//     window.scrollTo(0, 0);
//   }

//   // Logout
//   handleLogout = () => {
//     this.setState({
//       // Keep wallet connected but reset session
//       authState: 'auth',
//       isLoggedIn: false,
//       hasProfile: false,
//       username: '',
//       bio: '',
//       avatarHash: '',
//       posts: [],
//       postLikes: {},
//       postComments: {},
//       profiles: {},
//       currentView: 'feed',
//       viewingProfileAddress: null,
//       viewingProfile: null,
//       // Clear wallet connection
//       account: '',
//       isWalletConnected: false,
//       socialNetwork: null
//     });

//     toast.info('👋 Logged out successfully');
//     window.scrollTo(0, 0);
//   }

//   render() {
//     const {
//       account, posts, loading, uploading, uploadStatus,
//       authState, username, bio, avatarHash,
//       currentView, viewingProfileAddress, viewingProfile,
//       postLikes, postComments, profiles, userCount
//     } = this.state;

//     return (
//       <div>
//         <ToastContainer
//           position="top-right"
//           autoClose={3000}
//           hideProgressBar={false}
//           newestOnTop
//           closeOnClick
//           theme="colored"
//         />

//         {/* Upload overlay */}
//         {uploading && (
//           <div className="upload-overlay">
//             <div className="upload-modal">
//               <div className="spinner"></div>
//               <p className="upload-status">{uploadStatus}</p>
//               <p className="upload-substatus">Please confirm in MetaMask</p>
//             </div>
//           </div>
//         )}

//         {/* Loading overlay */}
//         {loading && (
//           <div className="loading-container">
//             <div className="spinner"></div>
//             <p className="loading-text">Loading...</p>
//           </div>
//         )}

//         {/* Render based on authState */}
//         {authState === 'auth' && (
//           <AuthScreen onConnectWallet={this.connectWallet} />
//         )}

//         {authState === 'signup' && (
//           <CreateProfile
//             account={account}
//             checkUsername={this.checkUsername}
//             onCreateProfile={this.createProfile}
//             onBack={this.handleLogout}
//           />
//         )}

//         {authState === 'login' && (
//           <WelcomeScreen
//             account={account}
//             username={username}
//             avatarHash={avatarHash}
//             onLogin={this.handleLogin}
//             onBack={this.handleLogout}
//           />
//         )}

//         {authState === 'app' && (
//           <>
//             <Navbar
//               account={account}
//               username={username}
//               avatarHash={avatarHash}
//               currentView={currentView}
//               onProfileClick={this.goToProfile}
//               onHomeClick={this.goToFeed}
//               onAboutClick={this.goToAbout}
//               onLogout={this.handleLogout}
//             />

//             {currentView === 'feed' && (
//               <Main
//                 account={account}
//                 posts={posts}
//                 createPost={this.createPost}
//                 tipPost={this.tipPost}
//                 likePost={this.likePost}
//                 unlikePost={this.unlikePost}
//                 addComment={this.addComment}
//                 postLikes={postLikes}
//                 postComments={postComments}
//                 profiles={profiles}
//                 userCount={userCount}
//                 onProfileClick={this.goToProfile}
//               />
//             )}

//             {currentView === 'profile' && viewingProfile && (
//               <UserProfile
//                 profile={viewingProfile}
//                 userAddress={viewingProfileAddress}
//                 posts={posts}
//                 isOwnProfile={viewingProfileAddress?.toLowerCase() === account?.toLowerCase()}
//                 onBack={this.goToFeed}
//                 onUpdateProfile={this.updateProfile}
//                 tipPost={this.tipPost}
//                 likePost={this.likePost}
//                 unlikePost={this.unlikePost}
//                 addComment={this.addComment}
//                 postLikes={postLikes}
//                 postComments={postComments}
//                 profiles={profiles}
//                 onProfileClick={this.goToProfile}
//               />
//             )}

//             {currentView === 'about' && <About />}
//           </>
//         )}
//       </div>
//     );
//   }
// }

// export default App;

















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

  // ==========================================
  // LIFECYCLE & INITIALIZATION
  // ==========================================

  componentDidMount() {
    this.initializeWeb3Listeners();
  }

  componentWillUnmount() {
    this.removeWeb3Listeners();
  }

  initializeWeb3Listeners() {
    if (window.ethereum) {
      // Listen for account changes
      window.ethereum.on('accountsChanged', this.handleAccountsChanged);

      // Listen for chain changes
      window.ethereum.on('chainChanged', this.handleChainChanged);

      // Listen for disconnect
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

  // ==========================================
  // METAMASK EVENT HANDLERS
  // ==========================================

  handleAccountsChanged = (accounts) => {
    if (accounts.length === 0) {
      // User disconnected wallet
      toast.info('Wallet disconnected');
      this.logout();
    } else if (accounts[0] !== this.state.account) {
      // Account switched
      toast.info('Account switched. Please reconnect.');
      this.logout();
    }
  }

  handleChainChanged = () => {
    // Reload page on chain change (recommended by MetaMask)
    window.location.reload();
  }

  handleDisconnect = () => {
    toast.warn('Wallet disconnected');
    this.logout();
  }

  // ==========================================
  // WALLET CONNECTION
  // ==========================================

  connectWallet = async () => {
    if (!window.ethereum) {
      toast.error('MetaMask is not installed! Please install it to continue.');
      window.open('https://metamask.io/download/', '_blank');
      return;
    }

    this.setState({ loading: true });

    try {
      // Request account access
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

      this.setState({ account, web3 });

      // Initialize blockchain connection
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

  // ==========================================
  // BLOCKCHAIN INITIALIZATION
  // ==========================================

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

      // Check if user has a profile
      await this.checkUserProfile(account, socialNetwork);

    } catch (error) {
      console.error('Blockchain initialization failed:', error);
      toast.error('Failed to connect to blockchain. Please check your network.');
      this.setState({ loading: false });
    }
  }

  // ==========================================
  // PROFILE CHECK (LOGIN VS SIGNUP)
  // ==========================================

  checkUserProfile = async (account, socialNetwork) => {
    try {
      const profileData = await socialNetwork.methods.getProfile(account).call();
      const hasProfile = profileData.exists || profileData[6];

      if (hasProfile) {
        // EXISTING USER - Auto login
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

        // Load app data
        await this.loadAppData(socialNetwork, account);

        toast.success(`Welcome back, ${user.username}! 🎉`);

      } else {
        // NEW USER - Show signup
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

  // ==========================================
  // LOAD APP DATA
  // ==========================================

  loadAppData = async (socialNetwork, account) => {
    try {
      // Get user count
      const userCount = await socialNetwork.methods.getUserCount().call();
      this.setState({ userCount: Number(userCount) });

      // Load posts
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

      // Load all posts
      for (let i = 1; i <= Number(postCount); i++) {
        const post = await socialNetwork.methods.posts(i).call();

        if (post.exists) {
          posts.push(post);
          profileAddresses.add(post.author);

          // Check if current user liked this post
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
      }

      // Load all user profiles
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

  // ==========================================
  // PROFILE CREATION (SIGNUP)
  // ==========================================

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

      // Load app data
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

  // ==========================================
  // PROFILE UPDATE
  // ==========================================

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

  // ==========================================
  // POST OPERATIONS
  // ==========================================

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

  tipPost = async (id, tipAmount) => {
    try {
      await this.state.socialNetwork.methods
        .tipPost(id)
        .send({ from: this.state.account, value: tipAmount });

      toast.success('💰 Tip sent successfully!');
      await this.loadPosts(this.state.socialNetwork, this.state.account);

    } catch (error) {
      console.error('Tip failed:', error);
      if (error.code === 4001) {
        toast.error('Transaction rejected.');
      } else {
        toast.error('Failed to send tip.');
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

  // ==========================================
  // NAVIGATION
  // ==========================================

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

  // ==========================================
  // LOGOUT
  // ==========================================

  logout = () => {
    // Clear all state
    this.setState({
      // Reset wallet
      account: null,
      web3: null,
      socialNetwork: null,

      // Reset auth
      isLoggedIn: false,
      hasProfile: false,

      // Reset user
      user: {
        username: '',
        bio: '',
        avatarHash: '',
        postCount: 0,
        totalTipsReceived: '0',
        joinedAt: 0
      },

      // Reset app data
      posts: [],
      postLikes: {},
      postComments: {},
      profiles: {},
      userCount: 0,

      // Reset UI
      loading: false,
      uploading: false,
      uploadStatus: '',
      currentView: 'feed',
      viewingProfileAddress: null,
      viewingProfile: null,

      // Go back to connect screen
      appState: 'connect'
    });

    toast.info('👋 Logged out successfully');
    window.scrollTo(0, 0);
  }

  // ==========================================
  // RENDER
  // ==========================================

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

        {/* Upload Progress Overlay */}
        {uploading && (
          <div className="upload-overlay">
            <div className="upload-modal">
              <div className="spinner"></div>
              <p className="upload-status">{uploadStatus}</p>
              <p className="upload-substatus">Please wait...</p>
            </div>
          </div>
        )}

        {/* Loading Overlay */}
        {loading && (
          <div className="loading-overlay">
            <div className="loading-content">
              <div className="spinner-large"></div>
              <p className="loading-text">Loading...</p>
            </div>
          </div>
        )}

        {/* Render based on appState */}
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