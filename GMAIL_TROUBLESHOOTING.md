# 🔧 Gmail Authentication Troubleshooting

## Current Error
```
535-5.7.8 Username and Password not accepted
```

## Quick Fix Steps

### Step 1: Enable 2-Step Verification
1. Go to https://myaccount.google.com/security
2. Click on "2-Step Verification"
3. Follow the setup process
4. **This is required for app passwords**

### Step 2: Generate New App Password
1. Go to https://myaccount.google.com/apppasswords
2. Select "Mail" as the app
3. Select "Other (Custom name)"
4. Enter: "Back to Life App"
5. Click "Generate"
6. **Copy the new 16-character password**

### Step 3: Update .env File
Replace the current EMAIL_PASS in your .env file:
```env
EMAIL_PASS=your_new_16_character_password
```

### Step 4: Test Again
Run the test script:
```bash
node test-email.js
```

## Alternative: Use Gmail OAuth2 (More Secure)

If app passwords continue to fail, we can switch to OAuth2:

1. **Enable Gmail API** in Google Cloud Console
2. **Create OAuth2 credentials**
3. **Use refresh tokens** instead of app passwords

## Common Issues

### "Username and Password not accepted"
- ✅ Enable 2-Step Verification first
- ✅ Generate app password after 2-Step Verification
- ✅ Use the exact 16-character password (no spaces)

### "Less secure app access"
- ❌ Don't enable "Less secure app access"
- ✅ Use app passwords instead

### "App password not working"
- ✅ Regenerate app password
- ✅ Check for typos in .env file
- ✅ Ensure 2-Step Verification is enabled

## Test Command
```bash
node -e "const { sendWelcomeEmail } = require('./src/services/emailService'); sendWelcomeEmail({firstName: 'Test', email: 'spencerbarber@me.com', phase: 'RESET', setupLink: 'http://localhost:3000/setup'}).then(console.log).catch(console.error);"
```

---
**Need help?** Check your Gmail security settings and ensure 2-Step Verification is enabled before generating app passwords. 