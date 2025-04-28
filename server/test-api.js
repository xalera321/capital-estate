const axios = require('axios');

// Test login
async function testLogin() {
  try {
    console.log('Testing login...');
    const response = await axios.post('http://localhost:3000/api/auth/login', {
      email: 'admin@capitalestate.com',
      password: 'Admin123!'
    });
    console.log('Login response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Login error:', error.response?.data || error.message);
  }
}

// Test setup 2FA
async function testSetup2FA(adminId, token) {
  try {
    console.log('Testing 2FA setup...');
    const response = await axios.post('http://localhost:3000/api/auth/setup', {
      adminId,
      token
    });
    console.log('Setup response:', response.data);
  } catch (error) {
    console.error('Setup error:', error.response?.data || error.message);
  }
}

// Run tests
async function runTests() {
  const loginData = await testLogin();
  
  if (loginData && loginData.needsSetup) {
    console.log('Found setup data, would need real token to continue test');
    console.log('Admin ID:', loginData.adminId);
    console.log('Secret:', loginData.secret);
    // Mock token - in real scenario you'd need a valid token from Google Authenticator
    // testSetup2FA(loginData.adminId, '123456');
  }
}

runTests(); 