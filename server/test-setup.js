const axios = require('axios');

// Test setup 2FA
async function testSetup() {
  try {
    console.log('Testing 2FA setup...');
    // Use the adminId from the previous test
    const response = await axios.post('http://localhost:3000/api/auth/setup', {
      adminId: 2,
      token: '123456' // This is a dummy token and will fail verification
    });
    console.log('Setup response:', response.data);
  } catch (error) {
    console.error('Setup error:', error.response?.data || error.message);
    console.log('Full error details:', error);
  }
}

testSetup(); 