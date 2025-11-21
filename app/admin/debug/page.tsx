'use client'

import { useEffect, useState } from 'react'
import { db } from '@/lib/firebase/config'

export default function DebugPage() {
  const [info, setInfo] = useState<string>('Checking...')

  useEffect(() => {
    const checkConfig = () => {
      const config = {
        apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
        authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
        measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
        databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL || 'https://parkpoom-git-blog-default-rtdb.asia-southeast1.firebasedatabase.app',
      }

      let debugInfo = 'Firebase Configuration Debug:\n\n'
      debugInfo += 'Environment Variables:\n'
      debugInfo += `  NEXT_PUBLIC_FIREBASE_API_KEY: ${config.apiKey ? '✅ Set' : '❌ Missing'}\n`
      debugInfo += `  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: ${config.authDomain ? '✅ Set' : '❌ Missing'}\n`
      debugInfo += `  NEXT_PUBLIC_FIREBASE_PROJECT_ID: ${config.projectId ? '✅ Set' : '❌ Missing'}\n`
      debugInfo += `  NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: ${config.storageBucket ? '✅ Set' : '❌ Missing'}\n`
      debugInfo += `  NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: ${config.messagingSenderId ? '✅ Set' : '❌ Missing'}\n`
      debugInfo += `  NEXT_PUBLIC_FIREBASE_APP_ID: ${config.appId ? '✅ Set' : '❌ Missing'}\n`
      debugInfo += `  NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID: ${config.measurementId ? '✅ Set' : '❌ Missing'}\n`
      debugInfo += `  Database URL: ${config.databaseURL ? '✅ Set (hardcoded)' : '❌ Missing'}\n\n`
      
      debugInfo += `Database instance: ${db ? '✅ Initialized' : '❌ Not initialized'}\n\n`

      if (db) {
        debugInfo += '✅ Database is initialized correctly.\n'
        debugInfo += 'You can proceed with data migration.\n'
      } else {
        const missingVars: string[] = []
        if (!config.apiKey) missingVars.push('NEXT_PUBLIC_FIREBASE_API_KEY')
        if (!config.authDomain) missingVars.push('NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN')
        if (!config.projectId) missingVars.push('NEXT_PUBLIC_FIREBASE_PROJECT_ID')
        if (!config.storageBucket) missingVars.push('NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET')
        if (!config.messagingSenderId) missingVars.push('NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID')
        if (!config.appId) missingVars.push('NEXT_PUBLIC_FIREBASE_APP_ID')
        if (!config.measurementId) missingVars.push('NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID')
        
        debugInfo += '❌ Database is NOT initialized.\n\n'
        if (missingVars.length > 0) {
          debugInfo += `Missing variables:\n${missingVars.map(v => `  - ${v}`).join('\n')}\n\n`
        }
        debugInfo += 'Possible causes:\n'
        debugInfo += '  1. .env.local file missing or incomplete\n'
        debugInfo += '  2. Dev server not restarted after creating .env.local\n'
        debugInfo += '  3. Environment variables not prefixed with NEXT_PUBLIC_\n'
        debugInfo += '  4. Running on server-side (should be client-side only)\n\n'
        debugInfo += 'To fix:\n'
        debugInfo += '  1. Create .env.local in project root\n'
        debugInfo += '  2. Add all missing variables from Firebase Console\n'
        debugInfo += '  3. Restart dev server: npm run dev\n'
      }

      setInfo(debugInfo)
    }

    checkConfig()
  }, [])

  return (
    <div className="min-h-screen bg-primary-bg dark:bg-dark-bg p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-primary-text dark:text-dark-text">Firebase Debug</h1>
        <div className="bg-gray-50 dark:bg-slate-800 p-6 rounded-lg">
          <pre className="text-sm text-primary-text dark:text-dark-text whitespace-pre-wrap font-mono">
            {info}
          </pre>
        </div>
      </div>
    </div>
  )
}

