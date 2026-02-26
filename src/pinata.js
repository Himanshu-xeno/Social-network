// import axios from 'axios';

// // ============================================
// // PINATA CONFIGURATION
// // ============================================
// // 1. Go to https://app.pinata.cloud
// // 2. Sign up for free
// // 3. Go to API Keys section
// // 4. Create a new API key (enable all permissions)
// // 5. Copy your API Key and Secret below
// // ============================================

// const PINATA_API_KEY = '48dc8d27494d796d9e69';
// const PINATA_SECRET_KEY = '6e33348d5c488746fa8a0042aed7a9c430acd70a6f277ad7937b5e9d4d351a7b';

// const pinataBaseUrl = 'https://api.pinata.cloud';

// export const uploadToPinata = async (file) => {
//   const url = `${pinataBaseUrl}/pinning/pinFileToIPFS`;

//   const formData = new FormData();
//   formData.append('file', file);

//   const metadata = JSON.stringify({
//     name: file.name,
//     keyvalues: {
//       app: 'DChainSocial'
//     }
//   });
//   formData.append('pinataMetadata', metadata);

//   const options = JSON.stringify({
//     cidVersion: 0,
//   });
//   formData.append('pinataOptions', options);

//   try {
//     const response = await axios.post(url, formData, {
//       maxBodyLength: 'Infinity',
//       headers: {
//         'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
//         'pinata_api_key': PINATA_API_KEY,
//         'pinata_secret_api_key': PINATA_SECRET_KEY
//       }
//     });

//     return response.data.IpfsHash;
//   } catch (error) {
//     console.error('Error uploading to Pinata:', error);
//     throw error;
//   }
// };

// export const getIpfsUrl = (hash) => {
//   if (!hash) return '';
//   return `https://gateway.pinata.cloud/ipfs/${hash}`;
// };



import axios from 'axios';

// ============================================
// PINATA SETUP INSTRUCTIONS:
// ============================================
// 1. Go to https://app.pinata.cloud
// 2. Create FREE account
// 3. Go to "API Keys" in sidebar
// 4. Click "+ New Key"
// 5. Toggle ON all permissions
// 6. Name it "DChainSocial"
// 7. Click "Create Key"
// 8. Copy API Key and Secret below
// 9. NEVER share these keys publicly
// ============================================

const PINATA_API_KEY = '48dc8d27494d796d9e69';
const PINATA_SECRET_KEY = '6e33348d5c488746fa8a0042aed7a9c430acd70a6f277ad7937b5e9d4d351a7b';

// You can also use environment variables (recommended for deployment):
// Create a .env file in root with:
// REACT_APP_PINATA_API_KEY=your_key
// REACT_APP_PINATA_SECRET_KEY=your_secret

const getApiKey = () => process.env.REACT_APP_PINATA_API_KEY || PINATA_API_KEY;
const getSecretKey = () => process.env.REACT_APP_PINATA_SECRET_KEY || PINATA_SECRET_KEY;

export const uploadToPinata = async (file) => {
  const url = 'https://api.pinata.cloud/pinning/pinFileToIPFS';

  const formData = new FormData();
  formData.append('file', file);

  const metadata = JSON.stringify({
    name: `dchain-${Date.now()}-${file.name}`,
    keyvalues: {
      app: 'DChainSocial',
      type: file.type
    }
  });
  formData.append('pinataMetadata', metadata);

  const options = JSON.stringify({
    cidVersion: 0,
  });
  formData.append('pinataOptions', options);

  try {
    const response = await axios.post(url, formData, {
      maxBodyLength: Infinity,
      headers: {
        'Content-Type': `multipart/form-data`,
        'pinata_api_key': getApiKey(),
        'pinata_secret_api_key': getSecretKey()
      }
    });

    console.log('IPFS Upload Success:', response.data.IpfsHash);
    return response.data.IpfsHash;
  } catch (error) {
    console.error('IPFS Upload Error:', error.response?.data || error.message);
    throw new Error('Failed to upload to IPFS. Check your Pinata API keys.');
  }
};

export const getIpfsUrl = (hash) => {
  if (!hash || hash === '') return '';
  // Using multiple gateways for reliability
  return `https://gateway.pinata.cloud/ipfs/${hash}`;
};

export const getIpfsUrlFallback = (hash) => {
  if (!hash || hash === '') return '';
  return `https://ipfs.io/ipfs/${hash}`;
};

export const testPinataConnection = async () => {
  try {
    const response = await axios.get('https://api.pinata.cloud/data/testAuthentication', {
      headers: {
        'pinata_api_key': getApiKey(),
        'pinata_secret_api_key': getSecretKey()
      }
    });
    return response.status === 200;
  } catch (error) {
    return false;
  }
};