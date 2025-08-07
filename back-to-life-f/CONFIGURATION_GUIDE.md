# Back to Life Intake Form - Live Configuration Guide

## 🚀 Setting Up Live URLs

The intake form has been updated to use environment variables for backend and patient portal URLs. This allows it to work in both development and production environments.

### Required Environment Variables

Create a `.env` file in the `back-to-life-f/` directory with the following variables:

```bash
# Live Backend API URL (replace with your actual live backend URL)
VITE_API_URL=https://your-live-backend-url.com

# Live Patient Portal URL (replace with your actual live patient portal URL)
VITE_PATIENT_PORTAL_URL=https://your-live-patient-portal-url.com
```

### Example Configuration

If your live backend is running on Railway or similar service:

```bash
# Example for Railway deployment
VITE_API_URL=https://back-to-life-backend-production.up.railway.app

# Example for Vercel patient portal
VITE_PATIENT_PORTAL_URL=https://back-to-life-patient-portal.vercel.app
```

### For Vercel Deployment

If you're deploying the intake form to Vercel, add these environment variables in your Vercel dashboard:

1. Go to your Vercel project dashboard
2. Navigate to Settings → Environment Variables
3. Add the following variables:
   - `VITE_API_URL` = Your live backend URL
   - `VITE_PATIENT_PORTAL_URL` = Your live patient portal URL

### Testing the Configuration

1. **Start the intake form:**
   ```bash
   cd back-to-life-f
   npm run dev
   ```

2. **Test form submission:**
   - Fill out the intake form
   - Submit the form
   - Check browser console for API calls to your live backend
   - Verify redirect to your live patient portal

### Troubleshooting

If you get connection errors:

1. **Check backend URL:**
   - Verify `VITE_API_URL` points to your live backend
   - Test the backend health endpoint: `{VITE_API_URL}/health`

2. **Check patient portal URL:**
   - Verify `VITE_PATIENT_PORTAL_URL` points to your live patient portal
   - Test the portal URL in browser

3. **CORS issues:**
   - Ensure your live backend has CORS configured for your intake form domain
   - Check backend CORS configuration in `back-to-life-f-server/src/app.ts`

### Current Status

✅ **Updated Components:**
- `src/api/axios.js` - Now uses `VITE_API_URL`
- `src/components/MultiStepForm.jsx` - Now uses both environment variables

✅ **Ready for:**
- Development with localhost
- Production with live URLs
- Vercel deployment
- Railway backend integration

### Next Steps

1. Set your actual live URLs in the `.env` file
2. Test the intake form submission
3. Verify patient portal redirect works
4. Deploy to your preferred hosting platform 