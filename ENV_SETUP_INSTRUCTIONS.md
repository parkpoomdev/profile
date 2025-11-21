# Quick Setup: Create .env.local File

Based on your Firebase configuration, create a `.env.local` file in your project root with the following content:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyA6aC2Vu7M6Zg_iN9rTSYPo3Z1qFCrP-tY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=parkpoom-git-blog.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=parkpoom-git-blog
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=parkpoom-git-blog.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=944209763664
NEXT_PUBLIC_FIREBASE_APP_ID=1:944209763664:web:17d38846da5e7eb9c62055
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-31XR0YZBSN
NEXT_PUBLIC_FIREBASE_DATABASE_URL=https://parkpoom-git-blog-default-rtdb.asia-southeast1.firebasedatabase.app
```

## Steps:

1. **Create the file**: In your project root (same folder as `package.json`), create a file named `.env.local`

2. **Copy the content above** into the file

3. **Save the file**

4. **Restart your dev server**:
   ```bash
   # Stop the current server (Ctrl+C)
   npm run dev
   ```

5. **Verify**:
   - Visit `http://localhost:3000/admin/debug` to see all variables are set
   - Visit `http://localhost:3000/admin/migrate` to check connection

## Important Notes:

- The `.env.local` file is already in `.gitignore`, so it won't be committed to git
- Make sure there are **no spaces** around the `=` sign
- Make sure there are **no quotes** around the values (unless the value itself contains spaces)
- After creating/editing `.env.local`, you **must restart** the dev server

## Troubleshooting "Invalid token in path" Error:

If you still see this error after setting up `.env.local`:

1. **Check Realtime Database Rules**:
   - Go to Firebase Console → Realtime Database → Rules
   - Make sure rules allow read access (use `realtime-db-rules-dev.json` for development)

2. **Verify Database URL**:
   - The database URL should match exactly: `https://parkpoom-git-blog-default-rtdb.asia-southeast1.firebasedatabase.app`
   - Check in Firebase Console → Realtime Database → Data tab

3. **Check Browser Console**:
   - Open browser DevTools (F12)
   - Look for any additional error messages
   - Check the Network tab for failed requests

4. **Try the debug page**:
   - Visit `/admin/debug` to see detailed configuration status

