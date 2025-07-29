# Google OAuth Setup Instructions

This guide will help you set up Google OAuth authentication for the AgriLens application.

## Prerequisites

1. A Google Cloud Platform (GCP) account
2. Access to Google Cloud Console

## Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click on the project dropdown and select "New Project"
3. Enter your project name (e.g., "AgriLens Auth")
4. Click "Create"

## Step 2: Enable Google Identity API

1. In your Google Cloud Console, go to "APIs & Services" > "Library"
2. Search for "Google Identity API" or "Google+ API"
3. Click on "Google Identity Services API"
4. Click "Enable"

## Step 3: Create OAuth 2.0 Credentials

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth 2.0 Client IDs"
3. If prompted, configure the OAuth consent screen first:
   - Choose "External" user type
   - Fill in the required fields:
     - App name: "AgriLens"
     - User support email: Your email
     - Developer contact information: Your email
   - Add scopes: `email`, `profile`, `openid`
   - Add test users if in testing mode

4. For OAuth 2.0 Client ID:
   - Application type: "Web application"
   - Name: "AgriLens Web Client"
   - Authorized JavaScript origins:
     - `http://localhost:3000` (for development)
     - `http://localhost:3001` (for development - alternate port)
     - `http://localhost:3002` (for development - alternate port)
     - Your production domain (e.g., `https://yourdomain.com`)
   - Authorized redirect URIs:
     - `http://localhost:3000` (for development)
     - `http://localhost:3001` (for development - alternate port)
     - `http://localhost:3002` (for development - alternate port)
     - Your production domain

5. Click "Create"
6. Copy the "Client ID" (it will look like: `xxxxx.apps.googleusercontent.com`)

## Step 4: Update Environment Variables

1. Open the `.env.local` file in your project root
2. Replace `your-google-client-id-here.apps.googleusercontent.com` with your actual Client ID:

```env
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-actual-client-id.apps.googleusercontent.com
```

**Important**: 
- ❌ Do NOT include `http://` or `https://` in the Client ID
- ❌ Wrong: `http://123456789-abc.apps.googleusercontent.com`
- ✅ Correct: `123456789-abc.apps.googleusercontent.com`

## Step 5: Test the Integration

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Open your browser and go to `http://localhost:3000` (or the port shown in your terminal)
3. Try to log in or sign up using the "Continue with Google" button
4. The Google OAuth popup should appear
5. After authentication, you should be redirected back to your app

**Note**: If your dev server uses a different port (like 3001), make sure to add that port to your Google OAuth origins.

## Troubleshooting

### 🚨 **Quick Fix for Current Error**

If you're seeing: `"The given origin is not allowed for the given client ID"`

**Immediate Solution:**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to "APIs & Services" > "Credentials"
3. Click on your OAuth 2.0 Client ID
4. In "Authorized JavaScript origins", add:
   - `http://localhost:3002` (your current port)
5. Click "Save"
6. Wait 5-10 minutes for changes to take effect
7. Refresh your AgriLens page and try Google login again

### Common Issues:

1. **"The given client ID is not found" error**:
   - ❌ Check that your Client ID doesn't include `http://` or `https://`
   - ❌ Wrong format: `http://123456789-abc.apps.googleusercontent.com`
   - ✅ Correct format: `123456789-abc.apps.googleusercontent.com`
   - Verify the Client ID is correctly copied from Google Cloud Console
   - Make sure you're using the "Client ID" not the "Client Secret"
   - Restart your development server after changing the environment variable

2. **"This app isn't verified" warning**:
   - This is normal during development
   - Click "Advanced" > "Go to AgriLens (unsafe)" to proceed
   - For production, you'll need to verify your app with Google

3. **Origin not allowed error**:
   - Make sure your domain is added to "Authorized JavaScript origins"
   - Check that the domain matches exactly (include/exclude www, http/https)
   - **If using port 3002**: Add `http://localhost:3002` to authorized origins
   - **Common ports to add**: `http://localhost:3000`, `http://localhost:3001`, `http://localhost:3002`

4. **Popup blocked**:
   - Make sure popups are enabled in your browser
   - The fallback button should appear if popups fail

5. **Client ID not found**:
   - Verify your Client ID is correctly set in `.env.local`
   - Make sure the file is in the project root
   - Restart your development server after changing environment variables

### Backend Integration:

Make sure your backend API supports these endpoints:
- `POST /login/google` - For Google login
- `POST /signup/google` - For Google signup

Both endpoints should accept a `googleToken` parameter containing the JWT credential from Google.

## Security Notes

1. Keep your Client ID public (it's safe to expose)
2. Never expose your Client Secret in frontend code
3. Always validate Google tokens on your backend
4. Use HTTPS in production
5. Regularly rotate your OAuth credentials

## Production Deployment

When deploying to production:

1. Add your production domain to Google Cloud Console
2. Update the `NEXT_PUBLIC_GOOGLE_CLIENT_ID` environment variable
3. Consider enabling additional security features in Google Cloud Console
4. Submit your app for verification if you expect many users
