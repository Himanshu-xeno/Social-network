// import React, { Component } from 'react';
// import Web3 from 'web3';
// import Identicon from 'identicon.js';
// import './App.css';
// import SocialNetwork from '../abis/SocialNetwork.json'
// import Navbar from './Navbar'
// import Main from './Main'

// class App extends Component {

//   async componentWillMount() {
//     await this.loadWeb3()
//     await this.loadBlockchainData()
//   }

//   async loadWeb3() {
//     if (window.ethereum) {
//       window.web3 = new Web3(window.ethereum)
//       await window.ethereum.enable()
//     }
//     else if (window.web3) {
//       window.web3 = new Web3(window.web3.currentProvider)
//     }
//     else {
//       window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
//     }
//   }

//   async loadBlockchainData() {
//     const web3 = window.web3
//     // Load account
//     const accounts = await web3.eth.getAccounts()
//     this.setState({ account: accounts[0] })
//     // Network ID
//     const networkId = await web3.eth.net.getId()
//     const networkData = SocialNetwork.networks[networkId]
//     if(networkData) {
//       const socialNetwork = web3.eth.Contract(SocialNetwork.abi, networkData.address)
//       this.setState({ socialNetwork })
//       const postCount = await socialNetwork.methods.postCount().call()
//       this.setState({ postCount })
//       // Load Posts
//       for (var i = 1; i <= postCount; i++) {
//         const post = await socialNetwork.methods.posts(i).call()
//         this.setState({
//           posts: [...this.state.posts, post]
//         })
//       }
//       // Sort posts. Show highest tipped posts first
//       this.setState({
//         posts: this.state.posts.sort((a,b) => b.tipAmount - a.tipAmount )
//       })
//       this.setState({ loading: false})
//     } else {
//       window.alert('SocialNetwork contract not deployed to detected network.')
//     }
//   }

//   createPost(content) {
//     this.setState({ loading: true })
//     this.state.socialNetwork.methods.createPost(content).send({ from: this.state.account })
//     .once('receipt', (receipt) => {
//       this.setState({ loading: false })
//     })
//   }

//   tipPost(id, tipAmount) {
//     this.setState({ loading: true })
//     this.state.socialNetwork.methods.tipPost(id).send({ from: this.state.account, value: tipAmount })
//     .once('receipt', (receipt) => {
//       this.setState({ loading: false })
//     })
//   }

//   constructor(props) {
//     super(props)
//     this.state = {
//       account: '',
//       socialNetwork: null,
//       postCount: 0,
//       posts: [],
//       loading: true
//     }

//     this.createPost = this.createPost.bind(this)
//     this.tipPost = this.tipPost.bind(this)
//   }

//   render() {
//     return (
//       <div>
//         <Navbar account={this.state.account} />
//         { this.state.loading
//           ? <div id="loader" className="text-center mt-5"><p>Loading...</p></div>
//           : <Main
//               posts={this.state.posts}
//               createPost={this.createPost}
//               tipPost={this.tipPost}
//             />
//         }
//       </div>
//     );
//   }
// }

// export default App;



// import React, { Component } from 'react'
// import Web3 from 'web3'
// import './App.css'
// import SocialNetwork from '../abis/SocialNetwork.json'
// import Navbar from './Navbar'
// import Main from './Main'

// class App extends Component {

//   constructor(props) {
//     super(props)
//     this.state = {
//       account: '',
//       socialNetwork: null,
//       postCount: 0,
//       posts: [],
//       loading: true
//     }

//     this.createPost = this.createPost.bind(this)
//     this.tipPost = this.tipPost.bind(this)
//   }

//   async componentDidMount() {
//     await this.loadWeb3()
//     await this.loadBlockchainData()
//   }

//   async loadWeb3() {
//     if (window.ethereum) {
//       window.web3 = new Web3(window.ethereum)
//       try {
//         await window.ethereum.request({
//           method: 'eth_requestAccounts'
//         })
//       } catch (error) {
//         console.error("User denied account access", error)
//       }
//     } else if (window.web3) {
//       window.web3 = new Web3(window.web3.currentProvider)
//     } else {
//       window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
//     }
//   }

//   async loadBlockchainData() {
//     try {
//       const web3 = window.web3

//       const accounts = await web3.eth.getAccounts()
//       if (accounts.length === 0) {
//         return
//       }

//       this.setState({ account: accounts[0] })

//       const networkId = await web3.eth.net.getId()
//       const networkData = SocialNetwork.networks[networkId]

//       if(networkData) {

//         const socialNetwork = new web3.eth.Contract(
//           SocialNetwork.abi,
//           networkData.address
//         )

//         this.setState({ socialNetwork })

//         const postCount = await socialNetwork.methods.postCount().call()
//         this.setState({ postCount })

//         let posts = []

//         for (let i = 1; i <= postCount; i++) {
//           const post = await socialNetwork.methods.posts(i).call()
//           posts.push(post)
//         }

//         posts.sort((a,b) => b.tipAmount - a.tipAmount)

//         this.setState({
//           posts: posts,
//           loading: false
//         })

//       } else {
//         window.alert('SocialNetwork contract not deployed to detected network.')
//       }

//     } catch (error) {
//       console.error("Blockchain load failed:", error)
//     }
//   }

//   createPost(content) {
//     this.setState({ loading: true })
//     this.state.socialNetwork.methods.createPost(content)
//       .send({ from: this.state.account })
//       .once('receipt', () => {
//         this.setState({ loading: false })
//       })
//   }

//   tipPost(id, tipAmount) {
//     this.setState({ loading: true })
//     this.state.socialNetwork.methods.tipPost(id)
//       .send({ from: this.state.account, value: tipAmount })
//       .once('receipt', () => {
//         this.setState({ loading: false })
//       })
//   }

//   render() {
//     return (
//       <div>
//         <Navbar account={this.state.account} />
//         { this.state.loading
//           ? <div id="loader" className="text-center mt-5">
//               <p>Loading...</p>
//             </div>
//           : <Main
//               posts={this.state.posts}
//               createPost={this.createPost}
//               tipPost={this.tipPost}
//             />
//         }
//       </div>
//     )
//   }
// }

// export default App



// import React, { Component } from 'react'
// import Web3 from 'web3'
// import './App.css'
// import SocialNetwork from '../abis/SocialNetwork.json'
// import Navbar from './Navbar'
// import Main from './Main'

// class App extends Component {

//   constructor(props) {
//     super(props)
//     this.state = {
//       account: '',
//       socialNetwork: null,
//       postCount: 0,
//       posts: [],
//       loading: true,
//       web3: null
//     }

//     this.createPost = this.createPost.bind(this)
//     this.tipPost = this.tipPost.bind(this)
//   }

//   async componentDidMount() {
//     await this.loadWeb3()
//     await this.loadBlockchainData()
//   }

//   async loadWeb3() {
//     if (window.ethereum) {
//       // Create web3 instance using window.ethereum ONLY
//       const web3 = new Web3(window.ethereum)
//       this.setState({ web3 })

//       try {
//         await window.ethereum.request({
//           method: 'eth_requestAccounts'
//         })
//         console.log("MetaMask connected successfully")
//       } catch (error) {
//         if (error.code === -32002) {
//           console.warn("MetaMask request already pending. Please open MetaMask and approve.")
//           // Wait and retry
//           await new Promise(resolve => setTimeout(resolve, 3000))
//           try {
//             const accounts = await window.ethereum.request({
//               method: 'eth_accounts'
//             })
//             if (accounts.length > 0) {
//               console.log("Found accounts:", accounts)
//             }
//           } catch (retryError) {
//             console.error("Retry failed:", retryError)
//           }
//         } else {
//           console.error("User denied account access", error)
//         }
//       }
//     } else {
//       window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
//     }
//   }

//   async loadBlockchainData() {
//     try {
//       const { web3 } = this.state
//       if (!web3) {
//         console.warn("Web3 not initialized")
//         return
//       }

//       const accounts = await web3.eth.getAccounts()
//       if (accounts.length === 0) {
//         console.warn("No accounts found. Please connect MetaMask.")
//         return
//       }

//       this.setState({ account: accounts[0] })

//       const networkId = await web3.eth.net.getId()
//       const networkData = SocialNetwork.networks[networkId]

//       if (networkData) {
//         const socialNetwork = new web3.eth.Contract(
//           SocialNetwork.abi,
//           networkData.address
//         )

//         this.setState({ socialNetwork })

//         const postCount = await socialNetwork.methods.postCount().call()
//         this.setState({ postCount })

//         let posts = []

//         for (let i = 1; i <= postCount; i++) {
//           const post = await socialNetwork.methods.posts(i).call()
//           posts.push(post)
//         }else {
//       window.alert('SocialNetwork contract not deployed to detected network.')
//     }
//   } catch (error) {
//     console.error("Blockchain load failed:", error)
//   }

//         posts.sort((a, b) => b.tipAmount - a.tipAmount)

//         this.setState({
//           posts: posts,
//           loading: false
//         })
//       } else {
//         window.alert('SocialNetwork contract not deployed to detected network.')
//       }
//     } catch (error) {
//       console.error("Blockchain load failed:", error)
//     }
//   }

//   createPost(content) {
//     this.setState({ loading: true })
//     this.state.socialNetwork.methods.createPost(content)
//       .send({ from: this.state.account })
//       .once('receipt', () => {
//         this.setState({ loading: false })
//       })
//   }

//   tipPost(id, tipAmount) {
//     this.setState({ loading: true })
//     this.state.socialNetwork.methods.tipPost(id)
//       .send({ from: this.state.account, value: tipAmount })
//       .once('receipt', () => {
//         this.setState({ loading: false })
//       })
//   }

//   render() {
//     return (
//       <div>
//         <Navbar account={this.state.account} />
//         {this.state.loading
//           ? <div id="loader" className="text-center mt-5">
//               <p>Loading...</p>
//             </div>
//           : <Main
//               posts={this.state.posts}
//               createPost={this.createPost}
//               tipPost={this.tipPost}
//               web3={this.state.web3}
//             />
//         }
//       </div>
//     )
//   }
// }

// export default App





// import React, { Component } from 'react'
// import Web3 from 'web3'
// import './App.css'
// import SocialNetwork from '../abis/SocialNetwork.json'
// import Navbar from './Navbar'
// import Main from './Main'

// class App extends Component {

//   constructor(props) {
//     super(props)
//     this.state = {
//       account: '',
//       socialNetwork: null,
//       postCount: 0,
//       posts: [],
//       loading: true
//     }

//     this.createPost = this.createPost.bind(this)
//     this.tipPost = this.tipPost.bind(this)
//   }

//   async componentDidMount() {
//     await this.loadWeb3()
//     await this.loadBlockchainData()
//   }

//   async loadWeb3() {
//     if (window.ethereum) {
//       const web3 = new Web3(window.ethereum)
//       window.web3 = web3

//       try {
//         await window.ethereum.request({
//           method: 'eth_requestAccounts'
//         })
//         console.log("MetaMask connected")
//       } catch (error) {
//         console.error("MetaMask connection failed:", error)
//       }

//     } else {
//       window.alert('Non-Ethereum browser detected. Please install MetaMask!')
//     }
//   }

//   async loadBlockchainData() {
//     try {
//       const web3 = window.web3
//       if (!web3) return

//       const accounts = await web3.eth.getAccounts()
//       if (accounts.length === 0) return

//       this.setState({ account: accounts[0] })

//       const networkId = await web3.eth.net.getId()
//       const networkData = SocialNetwork.networks[networkId]

//       if (!networkData) {
//         window.alert('SocialNetwork contract not deployed to detected network.')
//         return
//       }

//       const socialNetwork = new web3.eth.Contract(
//         SocialNetwork.abi,
//         networkData.address
//       )

//       this.setState({ socialNetwork })

//       const postCount = await socialNetwork.methods.postCount().call()
//       this.setState({ postCount })

//       let posts = []

//       for (let i = 1; i <= postCount; i++) {
//         const post = await socialNetwork.methods.posts(i).call()
//         posts.push(post)
//       }

//       posts.sort((a, b) => b.tipAmount - a.tipAmount)

//       this.setState({
//         posts: posts,
//         loading: false
//       })

//     } catch (error) {
//       console.error("Blockchain load failed:", error)
//     }
//   }

//   createPost(content) {
//     this.setState({ loading: true })

//     this.state.socialNetwork.methods.createPost(content)
//       .send({ from: this.state.account })
//       .once('receipt', () => {
//         this.setState({ loading: false })
//       })
//   }

//   tipPost(id, tipAmount) {
//     this.setState({ loading: true })

//     this.state.socialNetwork.methods.tipPost(id)
//       .send({ from: this.state.account, value: tipAmount })
//       .once('receipt', () => {
//         this.setState({ loading: false })
//       })
//   }

//   render() {
//     return (
//       <div>
//         <Navbar account={this.state.account} />

//         { this.state.loading
//           ? (
//             <div id="loader" className="text-center mt-5">
//               <p>Loading...</p>
//             </div>
//           )
//           : (
//             <Main
//               posts={this.state.posts}
//               createPost={this.createPost}
//               tipPost={this.tipPost}
//             />
//           )
//         }

//       </div>
//     )
//   }
// }

// export default App




import React, { Component } from 'react'
import Web3 from 'web3'
import './App.css'
import SocialNetwork from '../abis/SocialNetwork.json'
import Navbar from './Navbar'
import Main from './Main'

class App extends Component {

  constructor(props) {
    super(props)
    this.state = {
      account: '',
      socialNetwork: null,
      postCount: 0,
      posts: [],
      loading: true
    }

    this.createPost = this.createPost.bind(this)
    this.tipPost = this.tipPost.bind(this)
  }

  async componentDidMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
  }

  async loadWeb3() {
    if (window.ethereum) {
      const web3 = new Web3(window.ethereum)
      window.web3 = web3

      try {
        await window.ethereum.request({
          method: 'eth_requestAccounts'
        })
        console.log("DEBUG: MetaMask connected")
      } catch (error) {
        console.error("DEBUG: MetaMask connection failed:", error)
      }

    } else {
      window.alert('Non-Ethereum browser detected. Please install MetaMask!')
    }
  }

  async loadBlockchainData() {
    try {
      const web3 = window.web3

      if (!web3) {
        console.log("DEBUG: web3 is null")
        return
      }

      console.log("DEBUG: web3 loaded")

      const accounts = await web3.eth.getAccounts()
      console.log("DEBUG: accounts =", accounts)

      if (accounts.length === 0) {
        console.log("DEBUG: No accounts found")
        return
      }

      this.setState({ account: accounts[0] })

      const networkId = await web3.eth.net.getId()
      console.log("DEBUG: MetaMask Network ID =", networkId)
      console.log("DEBUG: Contract Networks =", SocialNetwork.networks)

      const networkData = SocialNetwork.networks[networkId]
      console.log("DEBUG: networkData =", networkData)

      if (networkData) {

        console.log("DEBUG: Contract address =", networkData.address)

        const socialNetwork = new web3.eth.Contract(
          SocialNetwork.abi,
          networkData.address
        )

        this.setState({ socialNetwork })

        const postCount = await socialNetwork.methods.postCount().call()
        console.log("DEBUG: postCount =", postCount)

        this.setState({ postCount })

        let posts = []

        for (let i = 1; i <= postCount; i++) {
          const post = await socialNetwork.methods.posts(i).call()
          posts.push(post)
        }

        posts.sort((a, b) => b.tipAmount - a.tipAmount)

        this.setState({
          posts: posts,
          loading: false
        })

        console.log("DEBUG: App loaded successfully!")

      } else {
        console.error("DEBUG: Contract NOT found for network", networkId)
        window.alert('SocialNetwork contract not deployed to detected network.')
      }

    } catch (error) {
      console.error("DEBUG: Blockchain load failed:", error)
    }
  }

  createPost(content) {
    this.setState({ loading: true })

    this.state.socialNetwork.methods.createPost(content)
      .send({ from: this.state.account })
      .once('receipt', () => {
        this.setState({ loading: false })
      })
  }

  tipPost(id, tipAmount) {
    this.setState({ loading: true })

    this.state.socialNetwork.methods.tipPost(id)
      .send({ from: this.state.account, value: tipAmount })
      .once('receipt', () => {
        this.setState({ loading: false })
      })
  }

  render() {
    return (
      <div>
        <Navbar account={this.state.account} />

        { this.state.loading
          ? (
            <div id="loader" className="text-center mt-5">
              <p>Loading...</p>
            </div>
          )
          : (
            <Main
              posts={this.state.posts}
              createPost={this.createPost}
              tipPost={this.tipPost}
            />
          )
        }

      </div>
    )
  }
}

export default App