# Environment Variables Required for Back-to-Life Server

## Critical Variables (Must Have)

### Authentication
- `JWT_SECRET` - Secret key for JWT token signing/verification
- `SETUP_SECRET` - Secret key for account creation and setup

### Database
- `DATABASE_URL` - PostgreSQL connection string
- `NODE_ENV` - Environment (production/development)

### Server
- `PORT` - Server port (default: 8080)
- `JWT_SECRET` - Authentication secret
- `SETUP_SECRET` - Setup security secret

### Welcome Email (required for production onboarding)
- `EMAIL_PROVIDER` - Set to `resend` in Railway production (HTTPS; Railway Hobby blocks SMTP)
- `RESEND_API_KEY` - Secret Resend API key used to send welcome emails
- `EMAIL_FROM` - Verified sender shown to patients, for example `Back to Life <welcome@updates.example.com>`
- `EMAIL_USER` / `EMAIL_PASS` - Optional SMTP credentials for non-Railway environments only
- `PATIENT_PORTAL_URL` - Public patient portal URL used in secure setup links

## Optional Variables
- `CORS_ORIGIN` - Allowed origins for CORS
- `LOG_LEVEL` - Logging level

## How to Set in Railway:
1. Go to Railway Dashboard → Your Project → Variables
2. Add each variable with the exact name and value
3. Railway will auto-redeploy after adding variables

## Backup Plan:
- Keep this file updated with any new variables
- Document the purpose of each variable
- Test deployment after any platform updates

## Current Values (Generated):
- JWT_SECRET: 067ab2801453eda64bfcbf33c52920061320907ffa2839b4bfc26a95bde807b5
- SETUP_SECRET: 9b10d81b24a920bd996a9ed3973cfd5e
