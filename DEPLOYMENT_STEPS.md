# 🚀 Deployment Steps: Vercel + Railway

## Overview
Deploy your unified The Framework™ portal to production with Vercel (frontend) + Railway (backend).

## Step 1: Deploy Backend to Railway

### 1.1 Create Railway Account
1. Go to https://railway.app
2. Sign up with GitHub
3. Create a new project

### 1.2 Deploy Backend
```bash
# In back-to-life-f-server directory
cd ../back-to-life-f-server

# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login

# Initialize Railway project
railway init

# Deploy to Railway
railway up
```

### 1.3 Add PostgreSQL Database
1. Railway Dashboard → New Service → Database
2. Select PostgreSQL
3. Connect to your app service

### 1.4 Set Environment Variables
In Railway Dashboard → Variables, add:
```env
DATABASE_URL="postgresql://user:pass@railway-host:5432/framework_db"
EMAIL_PROVIDER=gmail
EMAIL_USER=spencerbarberchiro@gmail.com
EMAIL_PASS=your_app_password
EMAIL_FROM=spencerbarberchiro@gmail.com
JWT_SECRET=your_production_jwt_secret
ALLOWED_ORIGINS=https://the-framework.vercel.app
```

### 1.5 Run Database Migrations
```bash
railway run npx prisma migrate deploy
railway run npx prisma generate
```

### 1.6 Get Railway URL
- Copy your Railway app URL (e.g., https://framework-api.railway.app)
- This will be your API endpoint

## Step 2: Deploy Frontend to Vercel

### 2.1 Create Vercel Account
1. Go to https://vercel.com
2. Sign up with GitHub
3. Import your repository

### 2.2 Deploy Unified Portal
```bash
# In back-to-life-unified directory
cd ../back-to-life-unified

# Install Vercel CLI
npm install -g vercel

# Deploy to Vercel
vercel --prod
```

### 2.3 Set Environment Variables
In Vercel Dashboard → Settings → Environment Variables, add:
```env
NEXT_PUBLIC_API_URL=https://your-railway-app.railway.app
NEXT_PUBLIC_APP_URL=https://the-framework.vercel.app
```

### 2.4 Update Portal Links
Update the portal pages to use production URLs:
- `/intake` → Your production intake form URL
- `/patient` → Your production patient portal URL  
- `/clinician` → Your production clinician portal URL

## Step 3: Get Your Free URL

### 3.1 Recommended URL
**Primary URL**: `https://the-framework.vercel.app`
- **Cost**: $0
- **Professional**: Clean and branded
- **Easy**: No setup required
- **Perfect**: For QR codes and handouts

### 3.2 Alternative Free URLs
If the above is taken, try:
- `https://framework-recovery.vercel.app`
- `https://theframework-app.vercel.app`
- `https://framework-portal.vercel.app`

### 3.3 No Domain Setup Required
- Vercel handles everything
- Instant deployment
- Automatic HTTPS
- Global CDN included

## Step 4: Generate QR Code

### 4.1 QR Code Generator
1. Go to https://qr-code-generator.com
2. Enter your URL: https://the-framework.vercel.app
3. Download the QR code

### 4.2 Office Materials
Print QR codes for:
- Reception desk
- Treatment rooms
- Business cards
- Patient handouts

## Step 5: Test Production

### 5.1 Test User Journey
1. Scan QR code → Landing page
2. Click "Begin Your Framework" → Intake form
3. Complete intake → Welcome email
4. Access patient portal → Full experience

### 5.2 Test All Features
- ✅ Intake form submission
- ✅ Email delivery
- ✅ Patient portal access
- ✅ Clinician portal access
- ✅ Database connectivity
- ✅ Mobile responsiveness

## Step 6: Monitor & Maintain

### 6.1 Vercel Analytics
- Performance monitoring
- User analytics
- Error tracking

### 6.2 Railway Monitoring
- Application logs
- Database performance
- Resource usage

## Cost Breakdown

### Monthly Costs
- **Vercel**: $0 (free tier)
- **Railway**: $5-20 (depending on usage)
- **Total**: $5-20/month

### Free Tier Limits
- **Vercel**: 100GB bandwidth, 100GB storage
- **Railway**: $5 credit, 500 hours

## Troubleshooting

### Common Issues
1. **CORS Errors**: Check ALLOWED_ORIGINS in Railway
2. **Database Connection**: Verify DATABASE_URL in Railway
3. **Email Issues**: Check Gmail app password
4. **Build Errors**: Check Vercel build logs

### Support
- Vercel: https://vercel.com/support
- Railway: https://railway.app/support

## Next Steps After Deployment

1. **Update all localhost URLs** to production URLs
2. **Test email functionality** in production
3. **Configure monitoring** and alerts
4. **Set up backups** for database
5. **Create documentation** for users

## Success Checklist

- [ ] Backend deployed to Railway
- [ ] Database connected and migrated
- [ ] Frontend deployed to Vercel
- [ ] Free URL obtained (the-framework.vercel.app)
- [ ] Environment variables set
- [ ] QR code generated and printed
- [ ] User journey tested end-to-end
- [ ] Email functionality working
- [ ] Mobile responsiveness verified
- [ ] Monitoring configured

Your The Framework™ portal is now live at https://the-framework.vercel.app! 🎉 