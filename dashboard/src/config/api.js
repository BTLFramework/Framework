// API Configuration - Railway Backend
const getApiUrl = () => {
  console.log('🚀 Railway Backend Configuration');
  console.log('🔥 Timestamp:', new Date().toISOString());
  
  // Check if Vite environment variable is available
  const viteApiUrl = import.meta.env.VITE_API_URL;
  console.log('🔍 Vite Environment Check:');
  console.log('  - VITE_API_URL from env:', viteApiUrl);
  console.log('  - Is defined:', !!viteApiUrl);
  
  // Prefer environment variable, but hard-override known stale domains
  if (viteApiUrl) {
    // Known bad/stale domain that causes 404s for clinician routes
    const STALE_BACKEND = 'https://backend-production-3545.up.railway.app';
    const CORRECT_BACKEND = 'https://framework-production-92f5.up.railway.app';

    if (viteApiUrl.trim() === STALE_BACKEND) {
      console.warn('⚠️ Detected stale VITE_API_URL; overriding to', CORRECT_BACKEND);
      return CORRECT_BACKEND;
    }

    // In production on Vercel, always prefer the framework backend
    const isVercelHosted = typeof window !== 'undefined' && window.location.hostname.includes('vercel.app');
    if (isVercelHosted && !viteApiUrl.includes('framework-production-92f5.up.railway.app')) {
      console.warn('⚠️ Vercel production detected. Forcing framework backend. Was:', viteApiUrl);
      return CORRECT_BACKEND;
    }

    console.log('🚀 Using VITE_API_URL from environment:', viteApiUrl);
    return viteApiUrl;
  }
  
  // Fallback to Railway production URL
  const railwayUrl = 'https://framework-production-92f5.up.railway.app';
  console.log('🚀 Using Railway production URL:', railwayUrl);
  return railwayUrl;
};

export const API_URL = getApiUrl();

// Railway deployment logging
console.log('🔍 Railway API Configuration:');
console.log('  - Build timestamp:', new Date().toISOString());
console.log('  - HOSTNAME:', window.location.hostname);
console.log('  - HOST:', window.location.host);
console.log('  - Final API_URL:', API_URL);
console.log('  - VITE_API_URL available:', !!import.meta.env.VITE_API_URL);
console.log('  - Railway Backend: Ready!');

// Add a unique identifier
window.BTL_BUILD_VERSION = 'RAILWAY-v1.0-' + Date.now();

// Global test function for debugging
window.testApiConfig = () => {
  console.log('🧪 Railway API Configuration Test:');
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
  console.log('🧪 Railway Environment Test:');
  console.log('  - Is Localhost:', window.location.hostname === 'localhost');
  console.log('  - Railway API URL:', API_URL);
  console.log('  - VITE_API_URL:', import.meta.env.VITE_API_URL);
  console.log('  - Build Version:', window.BTL_BUILD_VERSION);
  
  return {
    IS_LOCALHOST: window.location.hostname === 'localhost',
    RAILWAY_API_URL: API_URL,
    VITE_API_URL: import.meta.env.VITE_API_URL,
    HOSTNAME: window.location.hostname,
    HOST: window.location.host,
    BUILD_VERSION: window.BTL_BUILD_VERSION
  };
};
