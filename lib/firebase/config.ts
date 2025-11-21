import { initializeApp, getApps, FirebaseApp } from 'firebase/app'
import { getDatabase, Database, ref, set, get, push, remove, update, onValue, off } from 'firebase/database'
import { getAuth, Auth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL || 'https://parkpoom-git-blog-default-rtdb.asia-southeast1.firebasedatabase.app',
}

let app: FirebaseApp | undefined
let db: Database | undefined
let auth: Auth | undefined

// Initialize Firebase only in browser environment
if (typeof window !== 'undefined') {
  // Validate config
  const missingVars: string[] = []
  if (!firebaseConfig.apiKey) missingVars.push('NEXT_PUBLIC_FIREBASE_API_KEY')
  if (!firebaseConfig.authDomain) missingVars.push('NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN')
  if (!firebaseConfig.projectId) missingVars.push('NEXT_PUBLIC_FIREBASE_PROJECT_ID')
  if (!firebaseConfig.storageBucket) missingVars.push('NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET')
  if (!firebaseConfig.messagingSenderId) missingVars.push('NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID')
  if (!firebaseConfig.appId) missingVars.push('NEXT_PUBLIC_FIREBASE_APP_ID')
  if (!firebaseConfig.measurementId) missingVars.push('NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID')

  if (missingVars.length > 0) {
    console.error('Firebase configuration is missing. Please check your .env.local file.')
    console.error('Missing environment variables:', missingVars.join(', '))
    console.error('\nTo fix this:')
    console.error('1. Create a .env.local file in the project root')
    console.error('2. Add the following variables:')
    missingVars.forEach(v => console.error(`   ${v}=your-value-here`))
    console.error('3. Restart your dev server (npm run dev)')
  } else {
    try {
      if (!getApps().length) {
        app = initializeApp(firebaseConfig)
      } else {
        app = getApps()[0]
      }
      db = getDatabase(app)
      
      // Initialize auth with error handling
      try {
        auth = getAuth(app)
        // Verify auth is properly configured
        if (auth) {
          console.log('Firebase Auth initialized successfully')
        }
      } catch (authError: any) {
        console.error('Firebase Auth initialization error:', authError)
        if (authError.code === 'auth/configuration-not-found') {
          console.error('⚠️ Firebase Authentication is not enabled in your Firebase Console!')
          console.error('Please enable Email/Password authentication:')
          console.error('1. Go to Firebase Console → Authentication')
          console.error('2. Click "Get started" if you see it')
          console.error('3. Go to "Sign-in method" tab')
          console.error('4. Enable "Email/Password" provider')
          console.error('5. Click "Save"')
        }
        // Don't set auth to undefined, let it be undefined so components can handle it
      }
    } catch (error) {
      console.error('Firebase initialization error:', error)
    }
  }
}

export { db, ref, set, get, push, remove, update, onValue, off }
export { auth }
export default app

