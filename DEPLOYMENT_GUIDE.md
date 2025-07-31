# 🚀 Back to Life™ Deployment Guide

## Overview
Deploy your Back to Life™ system to production with Vercel (frontend) + Railway (backend).

## Architecture
```
🌐 Frontend (Vercel)
├── Patient Portal (Next.js) - https://backtolife.vercel.app
├── Intake Form (React) - https://intake.backtolife.vercel.app  
└── Clinician Portal (React) - https://clinician.backtolife.vercel.app

🔧 Backend (Railway)
├── API Server (Node.js) - https://api.backtolife.railway.app
└── PostgreSQL Database - Railway Managed

📧 Email Service
└── Gmail SMTP (configured) or SendGrid
```

## Step 1: Prepare for Deployment

### Environment Variables
Create production `.env` files:

**Backend (.env)**
```env
# Database
DATABASE_URL="postgresql://user:pass@railway-host:5432/back_to_life_db"

# Email (Production)
EMAIL_PROVIDER=gmail
EMAIL_USER=spencerbarberchiro@gmail.com
EMAIL_PASS=your_app_password
EMAIL_FROM=spencerbarberchiro@gmail.com

# JWT
JWT_SECRET=your_production_jwt_secret

# CORS
ALLOWED_ORIGINS=https://backtolife.vercel.app,https://intake.backtolife.vercel.app
```

**Frontend (.env.local)**
```env
NEXT_PUBLIC_API_URL=https://api.backtolife.railway.app
NEXT_PUBLIC_APP_URL=https://backtolife.vercel.app
```

## Step 2: Deploy Backend (Railway)

1. **Create Railway Account**
   - Go to https://railway.app
   - Sign up with GitHub

2. **Deploy Backend**
   ```bash
   # In back-to-life-f-server directory
   npm install -g @railway/cli
   railway login
   railway init
   railway up
   ```

3. **Add PostgreSQL**
   - Railway Dashboard → New Service → Database
   - Select PostgreSQL
   - Connect to your app

4. **Set Environment Variables**
   - Railway Dashboard → Variables
   - Add all backend .env variables

5. **Run Migrations**
   ```bash
   railway run npx prisma migrate deploy
   railway run npx prisma generate
   ```

## Step 3: Deploy Frontend (Vercel)

1. **Create Vercel Account**
   - Go to https://vercel.com
   - Sign up with GitHub

2. **Deploy Patient Portal**
   ```bash
   # In patientportalupdate directory
   npm install -g vercel
   vercel
   ```

3. **Deploy Intake Form**
   ```bash
   # In back-to-life-f directory
   vercel
   ```

4. **Deploy Clinician Portal**
   ```bash
   # In back-to-life-f 3 directory
   vercel
   ```

5. **Set Environment Variables**
   - Vercel Dashboard → Settings → Environment Variables
   - Add frontend .env variables

## Step 4: Configure Domains

### Custom Domain (Optional)
- **Patient Portal**: https://patient.backtolifeyeg.com
- **Intake Form**: https://intake.backtolifeyeg.com
- **Clinician Portal**: https://clinician.backtolifeyeg.com
- **API**: https://api.backtolifeyeg.com

### DNS Configuration
```
Type    Name    Value
A       patient backtolife.vercel.app
A       intake  backtolife.vercel.app
A       clinician backtolife.vercel.app
CNAME   api     railway.app
```

## Step 5: SSL/HTTPS Setup

### Vercel (Automatic)
- SSL certificates are automatically provisioned
- HTTPS redirects are enabled by default

### Railway (Automatic)
- SSL certificates are automatically provisioned
- Custom domains get SSL automatically

## Step 6: Email Configuration

### Option A: Gmail (Current Setup)
- Use existing Gmail app password
- Works for moderate email volume

### Option B: SendGrid (Recommended for Production)
1. Create SendGrid account
2. Verify domain (backtolifeyeg.com)
3. Update email service configuration
4. Higher deliverability rates

## Step 7: Monitoring & Analytics

### Vercel Analytics
- Built-in performance monitoring
- Real user metrics
- Error tracking

### Railway Monitoring
- Application logs
- Database performance
- Resource usage

## Step 8: Testing Production

1. **Test Intake Flow**
   - Complete intake form
   - Verify email delivery
   - Check patient creation

2. **Test Patient Portal**
   - Login with test patient
   - Verify all features work
   - Check mobile responsiveness

3. **Test Clinician Portal**
   - Login as clinician
   - Verify patient management
   - Check messaging system

## Cost Estimation

### Monthly Costs
- **Vercel**: $0-20 (depending on usage)
- **Railway**: $5-20 (depending on usage)
- **Domain**: $12/year
- **Email**: $0-15 (Gmail vs SendGrid)

**Total**: ~$20-50/month

## Security Checklist

- [ ] Environment variables secured
- [ ] CORS properly configured
- [ ] JWT secrets are strong
- [ ] Database backups enabled
- [ ] SSL certificates active
- [ ] Email authentication working
- [ ] Rate limiting implemented

## Go-Live Checklist

- [ ] All services deployed
- [ ] Database migrated
- [ ] Email working
- [ ] Domains configured
- [ ] SSL active
- [ ] Testing completed
- [ ] Monitoring active
- [ ] Backup strategy in place

## Next Steps

1. **Choose deployment platform** (Vercel + Railway recommended)
2. **Prepare environment variables**
3. **Deploy backend first**
4. **Deploy frontend applications**
5. **Configure domains and SSL**
6. **Test thoroughly**
7. **Go live!**

Ready to deploy? Let me know which option you prefer! 🚀 