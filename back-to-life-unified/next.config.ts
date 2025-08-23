import type { NextConfig } from "next";

// Read once and strip trailing slash to avoid `//` in destinations
const API = (process.env.NEXT_PUBLIC_API_BASE || '').replace(/\/+$/, '');

if (!API) {
  // Build-time hint in Vercel logs if you forgot the env var
  // (build still succeeds so previews work locally)
  // eslint-disable-next-line no-console
  console.warn('⚠️  NEXT_PUBLIC_API_BASE is not set — API rewrites will be empty.');
}

const nextConfig: NextConfig = {
  // Rewrites proxy browser requests from the dashboard domain → Railway API
  async rewrites() {
    if (!API) return [];

    return [
      // Generic API
      { source: '/api/:path*', destination: `${API}/api/:path*` },

      // Known non-/api endpoints you call from the client
      { source: '/patients', destination: `${API}/patients` },
      { source: '/patients/:path*', destination: `${API}/patients/:path*` },
      { source: '/conversations', destination: `${API}/conversations` },
      { source: '/conversations/:path*', destination: `${API}/conversations/:path*` },

      // If you're calling these directly
      { source: '/api/messages/:path*', destination: `${API}/api/messages/:path*` },
      { source: '/api/notes/:path*', destination: `${API}/api/notes/:path*` },
    ];
  },
};

export default nextConfig;
