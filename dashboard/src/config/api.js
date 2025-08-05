import { ENV_DEBUG, testEnvironment } from './environment.js';

// API Configuration - Nuclear Option
const getApiUrl = () => {
  // Try environment variable first (highest priority)
  if (import.meta.env.VITE_API_URL) {
    console.log('🌐 Using VITE_API_URL:', import.meta.env.VITE_API_URL);
    return import.meta.env.VITE_API_URL;
  }
  
  // NUCLEAR OPTION: If we're not on localhost, use production URL
  if (window.location.hostname !== 'localhost') {
    const productionUrl = 'https://backend-production-3545.up.railway.app';
    console.log('🚀 NUCLEAR: Using production URL (not localhost):', productionUrl);
    return productionUrl;
  }
  
  // Only use localhost for actual local development
  console.log('🔧 Using development URL: localhost:3001');
  return 'http://localhost:3001';
};

export const API_URL = getApiUrl();

// Force debug logging
console.log('🔍 NUCLEAR API Configuration Debug:');
console.log('  - VITE_API_URL:', import.meta.env.VITE_API_URL);
console.log('  - PROD:', import.meta.env.PROD);
console.log('  - MODE:', import.meta.env.MODE);
console.log('  - HOSTNAME:', window.location.hostname);
console.log('  - HOST:', window.location.host);
console.log('  - Final API_URL:', API_URL);
console.log('  - Environment Debug:', ENV_DEBUG);

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
window.testEnvironment = testEnvironment;