# 🔧 Gmail Setup Checklist

## Current Status: ❌ Authentication Failing

**Error:** `535-5.7.8 Username and Password not accepted`

## Step-by-Step Fix:

### 1. ✅ Enable 2-Step Verification (REQUIRED)
- Go to: https://myaccount.google.com/security
- Click "2-Step Verification"
- Follow setup process
- **This is mandatory for app passwords**

### 2. ✅ Generate App Password (After 2-Step Verification)
- Go to: https://myaccount.google.com/apppasswords
- Select "Mail" as app
- Select "Other (Custom name)"
- Enter: "Back to Life App"
- Click "Generate"
- **Copy the 16-character password**

### 3. ✅ Update .env File
```env
EMAIL_PASS=your_new_16_character_password
```

### 4. ✅ Test Email
```bash
node test-email.js
```

## Alternative: Use Gmail OAuth2 (More Secure)

If app passwords continue to fail, we can switch to OAuth2:

1. **Create Google Cloud Project**
2. **Enable Gmail API**
3. **Generate OAuth2 credentials**
4. **Use OAuth2 authentication**

## Quick Test: Check 2-Step Verification Status

Visit: https://myaccount.google.com/security
- If "2-Step Verification" shows "On" → Generate new app password
- If "2-Step Verification" shows "Off" → Enable it first

## Current Configuration:
- **Email Provider**: Gmail
- **Username**: spencerbarberchiro@gmail.com
- **App Password**: okyl npyw cvyl wnrb
- **Status**: ❌ Authentication Failed 