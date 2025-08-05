// API Configuration - FINAL VERSION - FORCE PRODUCTION
const getApiUrl = () => {
  // Check if Vite environment variable is available
  const viteApiUrl = import.meta.env.VITE_API_URL;
  console.log('🔍 Vite Environment Check:');
  console.log('  - VITE_API_URL from env:', viteApiUrl);
  console.log('  - Is defined:', !!viteApiUrl);
  
  // FORCE PRODUCTION URL - NO LOCALHOST EVER
  const productionUrl = 'https://backend-production-3545.up.railway.app';
  
  // Only use localhost if we're actually on localhost
  if (window.location.hostname === 'localhost') {
    console.log('🔧 Development mode on localhost, using localhost:3001');
    return 'http://localhost:3001';
  }
  
  // EVERYTHING ELSE USES PRODUCTION - GUARANTEED
  console.log('🚀 FINAL VERSION: Using production URL:', productionUrl);
  console.log('  - Hostname:', window.location.hostname);
  console.log('  - Host:', window.location.host);
  console.log('  - FINAL VERSION: This MUST work now!');
  
  return productionUrl;
};

export const API_URL = getApiUrl();

// Force debug logging - FINAL VERSION
console.log('🔍 FINAL VERSION API Configuration:');
console.log('  - Build timestamp:', new Date().toISOString());
console.log('  - HOSTNAME:', window.location.hostname);
console.log('  - HOST:', window.location.host);
console.log('  - Final API_URL:', API_URL);
console.log('  - VITE_API_URL available:', !!import.meta.env.VITE_API_URL);
console.log('  - FINAL VERSION: If you see this, it worked!');

// Add a unique identifier
window.BTL_BUILD_VERSION = 'FINAL-v5.1-' + Date.now();

// Global test function for debugging
window.testApiConfig = () => {
  console.log('🧪 API Configuration Test - FINAL VERSION:');
  console.log('  - API_URL:', API_URL);
  console.log('  - VITE_API_URL:', import.meta.env.VITE_API_URL);
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
  console.log('🧪 Environment Test - FINAL VERSION:');
  console.log('  - Is Localhost:', window.location.hostname === 'localhost');
  console.log('  - Final API URL:', API_URL);
  console.log('  - VITE_API_URL:', import.meta.env.VITE_API_URL);
  console.log('  - Build Version:', window.BTL_BUILD_VERSION);
  
  return {
    IS_LOCALHOST: window.location.hostname === 'localhost',
    FINAL_API_URL: API_URL,
    VITE_API_URL: import.meta.env.VITE_API_URL,
    HOSTNAME: window.location.hostname,
    HOST: window.location.host,
    BUILD_VERSION: window.BTL_BUILD_VERSION
  };
};
