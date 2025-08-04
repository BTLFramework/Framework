// API Configuration
const getApiUrl = () => {
  // Try environment variable first
  if (import.meta.env.VITE_API_URL) {
    console.log('🌐 Using VITE_API_URL:', import.meta.env.VITE_API_URL);
    return import.meta.env.VITE_API_URL;
  }
  
  // Check if we're in production
  const isProduction = window.location.host.includes('vercel.app');
  
  if (isProduction) {
    // Production backend URL
    const productionUrl = 'https://backend-production-3545.up.railway.app';
    console.log('🚀 Using production URL:', productionUrl);
    return productionUrl;
  }
  
  // Development fallback
  console.log('🔧 Using development URL: localhost:3001');
  return 'http://localhost:3001';
};

export const API_URL = getApiUrl();