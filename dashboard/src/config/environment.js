// Environment Configuration Debug
export const ENV_DEBUG = {
  VITE_API_URL: import.meta.env.VITE_API_URL,
  PROD: import.meta.env.PROD,
  MODE: import.meta.env.MODE,
  HOSTNAME: typeof window !== 'undefined' ? window.location.hostname : 'server',
  HOST: typeof window !== 'undefined' ? window.location.host : 'server',
  PORT: typeof window !== 'undefined' ? window.location.port : 'server',
  USER_AGENT: typeof window !== 'undefined' ? window.navigator.userAgent : 'server',
  IS_LOCALHOST: typeof window !== 'undefined' ? window.location.hostname === 'localhost' : false,
  IS_VERCEL: typeof window !== 'undefined' ? window.location.host.includes('vercel.app') : false,
  IS_RAILWAY: typeof window !== 'undefined' ? window.location.host.includes('railway.app') : false,
  IS_NETLIFY: typeof window !== 'undefined' ? window.location.host.includes('netlify.app') : false,
};

// Log environment info
console.log('🌍 Environment Debug Info:', ENV_DEBUG);

// Export a function to test the environment
export const testEnvironment = () => {
  console.log('🧪 Environment Test:');
  console.log('  - Is Production:', import.meta.env.PROD);
  console.log('  - Is Localhost:', ENV_DEBUG.IS_LOCALHOST);
  console.log('  - Is Vercel:', ENV_DEBUG.IS_VERCEL);
  console.log('  - Is Railway:', ENV_DEBUG.IS_RAILWAY);
  console.log('  - Is Netlify:', ENV_DEBUG.IS_NETLIFY);
  console.log('  - API URL from env:', import.meta.env.VITE_API_URL);
  
  return ENV_DEBUG;
}; 