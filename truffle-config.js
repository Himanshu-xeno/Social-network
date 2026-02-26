module.exports = {
  networks: {
    // Local Ganache
    development: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "1337",
      gas: 6721975,
      gasPrice: 20000000000
    },

    // Sepolia Testnet (FREE - uses test ETH)
    // To use: 
    // 1. Get free Sepolia ETH from https://sepoliafaucet.com
    // 2. Get free Infura/Alchemy API key
    // 3. Uncomment below and fill in details
    
    // sepolia: {
    //   provider: () => new HDWalletProvider(
    //     'YOUR_METAMASK_SEED_PHRASE',
    //     'https://sepolia.infura.io/v3/YOUR_INFURA_PROJECT_ID'
    //   ),
    //   network_id: 11155111,
    //   gas: 5500000,
    //   confirmations: 2,
    //   timeoutBlocks: 200,
    //   skipDryRun: true
    // }
  },
  contracts_directory: './src/contracts/',
  contracts_build_directory: './src/abis/',
  compilers: {
    solc: {
      version: "0.8.19",
      settings: {
        optimizer: {
          enabled: true,
          runs: 200
        },
        evmVersion: "london"
      }
    }
  }
};