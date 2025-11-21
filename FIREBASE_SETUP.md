# Firebase Setup Guide

This guide will help you set up Firebase for your portfolio project.

## Prerequisites

1. A Firebase account (sign up at [firebase.google.com](https://firebase.google.com))
2. A Firebase project created in the Firebase Console

## Step 1: Get Your Firebase Configuration

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project (or create a new one)
3. Click the gear icon ⚙️ next to "Project Overview"
4. Select "Project settings"
5. Scroll down to "Your apps" section
6. If you don't have a web app yet, click the `</>` icon to add a web app
7. Copy the configuration values from the Firebase SDK setup

## Step 2: Enable Realtime Database

1. In Firebase Console, go to "Realtime Database" in the left sidebar
2. Click "Create Database"
3. Choose a location (e.g., `asia-southeast1` for Asia)
4. Start in **test mode** for development (or use the dev rules provided)
5. Copy the database URL (it will look like: `https://your-project-id-default-rtdb.region.firebasedatabase.app`)

## Step 3: Set Up Database Rules

1. In Firebase Console, go to "Realtime Database" > "Rules"
2. For development, use the rules from `realtime-db-rules-dev.json`:

```json
{
  "rules": {
    ".read": "now < 1765558800000",
    ".write": "now < 1765558800000"
  }
}
```

**Note:** These rules allow read/write access until May 2025. For production, use the rules from `realtime-db-rules-production.json`.

3. Click "Publish" to save the rules

## Step 4: Create .env.local File

1. In your project root directory, create a file named `.env.local`
2. Add the following environment variables with your Firebase values:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key-here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your-measurement-id
```

**Important:** 
- Replace all `your-*-here` values with your actual Firebase configuration values
- Add `NEXT_PUBLIC_FIREBASE_DATABASE_URL` with your database URL from Firebase Console

## Step 5: Restart Your Dev Server

After creating `.env.local`, you **must** restart your development server:

```bash
# Stop the current server (Ctrl+C)
# Then restart it
npm run dev
```

**Why?** Next.js only loads environment variables when the server starts. Changes to `.env.local` won't be picked up without a restart.

## Step 6: Verify Connection

1. Open your browser and navigate to `http://localhost:3000/admin/debug`
2. Check the Firebase Configuration Debug page
3. All values should show "✅ Set" and Database should be "✅ Initialized"

Alternatively, go to `http://localhost:3000/admin/migrate` to see the connection status.

## Troubleshooting

### "Firebase is not initialized"

- **Check:** Is `.env.local` in the project root?
- **Check:** Did you restart the dev server after creating `.env.local`?
- **Check:** Are all environment variables prefixed with `NEXT_PUBLIC_`?
- **Check:** Browser console for specific missing variables

### "Permission Denied" Error

- **Check:** Realtime Database rules are set correctly
- **Check:** Rules are published (not just saved)
- **Check:** You're using dev rules for development

### "Network Error" or Connection Timeout

- **Check:** Realtime Database is enabled in Firebase Console
- **Check:** Database URL is set correctly in `.env.local` file
- **Check:** Your internet connection is working
- **Check:** Firebase project is active (not deleted/suspended)

### Environment Variables Not Loading

- **Check:** File is named exactly `.env.local` (not `.env` or `.env.local.txt`)
- **Check:** File is in the project root (same directory as `package.json`)
- **Check:** Variables start with `NEXT_PUBLIC_` (required for client-side access in Next.js)
- **Check:** No spaces around the `=` sign in `.env.local`
- **Check:** Dev server was restarted after creating/editing `.env.local`

## Security Notes

- **Never commit `.env.local` to git** - it's already in `.gitignore`
- **Never share your Firebase API keys publicly**
- Use development rules only for local development
- Use production rules for deployed applications

## Next Steps

Once Firebase is connected:
1. Visit `/admin/migrate` to migrate initial data to Firebase
2. Visit `/admin` to manage your portfolio content
3. Your portfolio will now load data from Firebase instead of hardcoded values

