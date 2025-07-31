# 📧 Email Setup Guide for Back to Life

## Gmail Configuration

Your system is now configured to send welcome emails using your Gmail account (`spencerbarberchiro@gmail.com`).

### Step 1: Generate Gmail App Password

1. **Go to your Google Account settings**: https://myaccount.google.com/
2. **Navigate to Security** → **2-Step Verification** (enable if not already)
3. **Go to App passwords** (under 2-Step Verification)
4. **Generate a new app password**:
   - Select app: "Mail"
   - Select device: "Other (Custom name)"
   - Enter name: "Back to Life App"
   - Click "Generate"
5. **Copy the 16-character password** (e.g., `abcd efgh ijkl mnop`)

### Step 2: Update Environment Variables

Add these lines to your `.env` file in the `back-to-life-f-server` directory:

```env
# Email Configuration (Gmail)
EMAIL_PROVIDER=gmail
EMAIL_USER=spencerbarberchiro@gmail.com
EMAIL_PASS=your_16_character_app_password_here
EMAIL_FROM=spencerbarberchiro@gmail.com
```

**Replace `your_16_character_app_password_here` with the actual app password from Step 1.**

### Step 3: Restart the Backend Server

After updating the .env file, restart your backend server:

```bash
# Stop the current server (Ctrl+C)
# Then restart it
cd back-to-life-f-server
npm run dev
```

### Step 4: Test Email Sending

1. **Complete an intake form** at http://localhost:5173
2. **Check the backend logs** for email confirmation:
   ```
   ✅ Welcome email sent to patient@example.com
   ```
3. **Check the patient's email** for the welcome message

## Email Templates

The system uses these email templates based on the patient's phase:

- **RESET Phase**: Welcome message for new patients
- **EDUCATE Phase**: For patients making progress
- **REBUILD Phase**: For patients ready to strengthen

## Troubleshooting

### If emails aren't sending:

1. **Check the backend logs** for error messages
2. **Verify your app password** is correct
3. **Ensure 2-Step Verification is enabled** on your Gmail account
4. **Check spam folder** - emails might be filtered

### Common Error Messages:

- `Invalid login`: Wrong app password
- `Username and Password not accepted`: 2-Step Verification not enabled
- `Authentication failed`: Check EMAIL_USER and EMAIL_PASS in .env

## Security Notes

- ✅ **App passwords are secure** - they're specifically for applications
- ✅ **No access to your main Gmail account** - only sending emails
- ✅ **Can be revoked anytime** from Google Account settings
- ✅ **Works with 2-Step Verification enabled**

## What Patients Will See

When a patient completes the intake form, they'll receive an email from `spencerbarberchiro@gmail.com` with:

- Welcome message personalized with their name
- Their current recovery phase (RESET/EDUCATE/REBUILD)
- Link to set up their patient portal account
- Professional Back to Life branding

---

**Need help?** Check the backend console logs for detailed error messages. 