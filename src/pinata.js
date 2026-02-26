import axios from 'axios';

// ============================================
// PINATA CONFIGURATION
// ============================================
// 1. Go to https://app.pinata.cloud
// 2. Sign up for free
// 3. Go to API Keys section
// 4. Create a new API key (enable all permissions)
// 5. Copy your API Key and Secret below
// ============================================

const PINATA_API_KEY = '48dc8d27494d796d9e69';
const PINATA_SECRET_KEY = '6e33348d5c488746fa8a0042aed7a9c430acd70a6f277ad7937b5e9d4d351a7b';

const pinataBaseUrl = 'https://api.pinata.cloud';

export const uploadToPinata = async (file) => {
  const url = `${pinataBaseUrl}/pinning/pinFileToIPFS`;

  const formData = new FormData();
  formData.append('file', file);

  const metadata = JSON.stringify({
    name: file.name,
    keyvalues: {
      app: 'DChainSocial'
    }
  });
  formData.append('pinataMetadata', metadata);

  const options = JSON.stringify({
    cidVersion: 0,
  });
  formData.append('pinataOptions', options);

  try {
    const response = await axios.post(url, formData, {
      maxBodyLength: 'Infinity',
      headers: {
        'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
        'pinata_api_key': PINATA_API_KEY,
        'pinata_secret_api_key': PINATA_SECRET_KEY
      }
    });

    return response.data.IpfsHash;
  } catch (error) {
    console.error('Error uploading to Pinata:', error);
    throw error;
  }
};

export const getIpfsUrl = (hash) => {
  if (!hash) return '';
  return `https://gateway.pinata.cloud/ipfs/${hash}`;
};