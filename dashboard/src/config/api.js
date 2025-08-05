// API Configuration - ULTIMATE NUCLEAR OPTION v3.0 - FORCE VITE REBUILD - TIMESTAMP: 2024-08-04-23:21
const getApiUrl = () => {
  // FORCE PRODUCTION URL - NO EXCEPTIONS - BUILD CACHE BUSTER
  const productionUrl = 'https://backend-production-3545.up.railway.app';
  
  // Only use localhost if we're actually on localhost AND the URL contains localhost
  if (window.location.hostname === 'localhost') {
    console.log('🔧 Development mode on localhost, using localhost:3001');
    return 'http://localhost:3001';
  }
  
  // EVERYTHING ELSE USES PRODUCTION - NO EXCEPTIONS - CACHE BUSTER v2.0
  console.log('🚀 ULTIMATE NUCLEAR v2.0: Using production URL:', productionUrl);
  console.log('  - Hostname:', window.location.hostname);
  console.log('  - Host:', window.location.host);
  console.log('  - CACHE BUSTER: This should force new build');
  
  return productionUrl;
  
};

export const API_URL = getApiUrl();

// Force debug logging - CACHE BUSTER VERSION 3.0
console.log('🔍 ULTIMATE NUCLEAR v3.0 API Configuration - CACHE BUSTER:');
console.log('  - Build timestamp:', new Date().toISOString());
console.log('  - HOSTNAME:', window.location.hostname);
console.log('  - HOST:', window.location.host);
console.log('  - Final API_URL:', API_URL);
console.log('  - CACHE BUSTER v3.0: If you see this, new build worked!');

// Add a unique identifier to force bundle change
window.BTL_BUILD_VERSION = 'v3.0-' + Date.now();

// Global test function for debugging
window.testApiConfig = () => {
  console.log('🧪 API Configuration Test:');
  console.log('  - API_URL:', API_URL);
  console.log('  - Will make test request to:', `${API_URL}/patients`);
  
  fetch(`${API_URL}/patients`)
    .then(response => {
      console.log('✅ Test request successful:', response.status);
      return response.json();
    })
    .then(data => {
      console.log('✅ Test data received:', data.length, 'patients');
    })
    .catch(error => {
      console.error('❌ Test request failed:', error);
    });
};

// Global environment test function
window.testEnvironment = () => {
  console.log('🧪 Environment Test:');
  console.log('  - Is Localhost:', window.location.hostname === 'localhost');
  console.log('  - Final API URL:', API_URL);
  
  return {
    IS_LOCALHOST: window.location.hostname === 'localhost',
    FINAL_API_URL: API_URL,
    HOSTNAME: window.location.hostname,
    HOST: window.location.host
  };
};