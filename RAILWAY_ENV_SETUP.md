# Railway Environment Variables Setup

## Required Environment Variables for Railway Backend

Add these environment variables in your Railway dashboard:

### Database
```
DATABASE_URL=your_postgresql_connection_string
```

### JWT Authentication
```
JWT_SECRET=back-to-life-jwt-secret-2024-production-secure-key
SETUP_SECRET=back-to-life-setup-secret-2024-production-secure-key
```

### Email Configuration
```
EMAIL_USER=your-gmail-address@gmail.com
EMAIL_PASS=your-gmail-app-password
```

### CORS Origins (Frontend URLs)
```
FRONTEND_URL=https://backtolife.vercel.app
PATIENT_PORTAL_URL=https://patientportalupdate.vercel.app
CLINICIAN_DASHBOARD_URL=https://clinician.backtolife.vercel.app
```

### Patient Portal URL (for setup links)
```
PATIENT_PORTAL_URL=https://patientportalupdate.vercel.app
```

## How to Add Environment Variables in Railway:

1. Go to your Railway dashboard
2. Select your backend service
3. Click on "Variables" tab
4. Add each variable above
5. Redeploy the service

## Testing the Setup:

After setting environment variables, test with:
```bash
node test-auth-flow.js
```

## Common Issues:

1. **500 Errors**: Usually missing JWT_SECRET or DATABASE_URL
2. **CORS Errors**: Missing frontend URLs in CORS configuration
3. **Login Failures**: JWT token generation issues
4. **Email Failures**: Missing email credentials

## Verification Steps:

1. Health check should return "OK"
2. Test route should work
3. Patient portal routes should be accessible
4. Login should generate proper JWT tokens 