// Keep backend traffic on the dashboard origin. Vercel and the local dev
// server proxy /backend to Railway, allowing the practitioner session cookie
// to remain first-party under strict browser privacy settings.
export const API_URL = '/backend';

window.BTL_BUILD_VERSION = 'SECURE-COOKIE-' + Date.now();
