'use client'

import { useState, useEffect } from 'react'
import { aboutService, workService, publicationService, blogService } from '@/lib/firebase/services'
import { db, ref, get } from '@/lib/firebase/config'

export default function MigratePage() {
  const [status, setStatus] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [isConnected, setIsConnected] = useState<boolean | null>(null)

  useEffect(() => {
    // Check Firebase connection
    const checkConnection = async () => {
      if (!db) {
        setIsConnected(false)
        // Check which env vars are missing
        const missingVars: string[] = []
        if (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY) missingVars.push('NEXT_PUBLIC_FIREBASE_API_KEY')
        if (!process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN) missingVars.push('NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN')
        if (!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) missingVars.push('NEXT_PUBLIC_FIREBASE_PROJECT_ID')
        if (!process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET) missingVars.push('NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET')
        if (!process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID) missingVars.push('NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID')
        if (!process.env.NEXT_PUBLIC_FIREBASE_APP_ID) missingVars.push('NEXT_PUBLIC_FIREBASE_APP_ID')
        if (!process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID) missingVars.push('NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID')

        let errorMsg = '❌ Firebase is not initialized.\n\n'
        if (missingVars.length > 0) {
          errorMsg += `Missing environment variables:\n${missingVars.map(v => `  - ${v}`).join('\n')}\n\n`
        }
        errorMsg += 'To fix this:\n'
        errorMsg += '1. Create a .env.local file in the project root\n'
        errorMsg += '2. Add all Firebase config values from Firebase Console\n'
        errorMsg += '3. Restart your dev server (npm run dev)\n'
        errorMsg += '4. Check browser console for detailed error messages'
        setStatus(errorMsg)
        return
      }

      try {
        // Test connection by trying to read from root (this tests if database is accessible)
        // Using root path which should always be valid
        const testRef = ref(db, '/')
        await get(testRef)
        // If we get here without error, connection is working
        setIsConnected(true)
        setStatus('✅ Firebase Realtime Database connected and ready')
      } catch (error) {
        setIsConnected(false)
        const errorMessage = error instanceof Error ? error.message : 'Unknown error'
        const errorCode = (error as any)?.code || ''
        console.error('Firebase connection error:', error)
        console.error('Error code:', errorCode)
        
        // Provide specific error messages
        if (errorMessage.includes('permission') || errorMessage.includes('PERMISSION_DENIED') || errorCode.includes('PERMISSION')) {
          setStatus(`❌ Permission Denied\n\nYour Realtime Database rules are blocking access.\n\nPlease:\n1. Go to Firebase Console → Realtime Database → Rules\n2. Copy rules from realtime-db-rules-dev.json\n3. Paste and publish\n\nError: ${errorMessage}`)
        } else if (errorMessage.includes('network') || errorMessage.includes('offline') || errorCode.includes('UNAVAILABLE')) {
          setStatus(`❌ Network Error\n\nCannot connect to Firebase Realtime Database.\n\nPlease check:\n- Internet connection\n- Realtime Database is enabled in Firebase Console\n- Database URL is correct\n\nError: ${errorMessage}`)
        } else if (errorMessage.includes('Invalid token') || errorMessage.includes('invalid')) {
          setStatus(`❌ Invalid Configuration\n\nThe error "Invalid token in path" usually means:\n1. Database URL might be incorrect\n2. Database might not be initialized properly\n3. There might be an issue with the Firebase config\n\nPlease check:\n- Your .env.local file has all correct values\n- Database URL matches your Firebase Console\n- Restart dev server after updating .env.local\n\nError: ${errorMessage}\n\nTry visiting /admin/debug to see your current configuration.`)
        } else {
          setStatus(`❌ Connection Error: ${errorMessage}\n\nPlease check:\n- Realtime Database is enabled in Firebase Console\n- Database rules allow read access\n- Internet connection is working\n- Your .env.local file is configured correctly\n\nError Code: ${errorCode || 'N/A'}`)
        }
      }
    }

    checkConnection()
  }, [])

  const migrateData = async () => {
    if (!db) {
      setStatus('❌ Firebase is not initialized. Please check your configuration.')
      return
    }

    setLoading(true)
    setStatus('Starting migration...\nChecking connection...')

    try {
      setStatus('✅ Connected to Firebase Realtime Database\nStarting migration...')

      // 1. Migrate About data
      setStatus('Migrating About data...')
      await aboutService.update({
        introduction: 'I am a doctoral student focused on developing digital systems that are purposeful, efficient, and visually coherent. My work bridges computational creativity with intuitive interface design, emphasizing clarity, usability, and data-driven insight.',
        specialization: 'Data Analytics and Visualisation in Information Technology',
        technicalSkills: 'My technical expertise encompasses web application development utilising Python, Node.js, and JavaScript, database management with SQL, and mobile application development with Java for Android platforms.',
      })
      setStatus('✅ About data migrated')

      // 2. Migrate Work items
      setStatus('Migrating Work items...')
      const workItems = [
        {
          year: '2023',
          title: 'Telehealth Monitoring System',
          description: 'A system utilizing AI and Data Science to deliver healthcare services to elderly and disabled patients remotely, enhancing accuracy in physical health monitoring.',
          link: '#',
        },
        {
          year: '2020',
          title: 'Mobile Workout Planner',
          description: 'A mobile application (dissertation project) for workout planning based on current weather and air quality conditions.',
          link: '#',
        },
        {
          year: '2014',
          title: 'Animated UI with WebGL',
          description: 'Cooperative education project at NECTEC focused on developing a 2D animated user interface using WebGL technology.',
          link: '#',
        },
      ]

      for (const item of workItems) {
        await workService.create(item)
      }
      setStatus('✅ Work items migrated')

      // 3. Migrate Publications
      setStatus('Migrating Publications...')
      const publications = [
        {
          date: '2024 (ICELTICs)',
          title: 'Data analytics and visualization in bimanual rehabilitation monitoring systems: A user-centered design approach to healthcare professionals decision support.',
          description: 'A user-centered design approach to healthcare professionals decision support.',
          citation: 'Wisedsri, P., Anutariya, C., Sujarae, A., Vachalathiti, R., & Bovonsunthonchai, S. (2024). Data analytics and visualization in bimanual rehabilitation monitoring systems: A user-centered design approach to healthcare professionals decision support. Proceedings of the 2024 International Conference on Electrical Engineering and Informatics (ICELTICs).',
          doi: 'https://doi.org/10.1109/ICELTICs62730.2024.10776145',
        },
        {
          date: '2023 (TENCON)',
          title: 'Data Analytics and Visualisation System for Fall Detection for Elderly and Disabled People.',
          description: 'Published in TENCON 2023 - 2023 IEEE Region 10 Conference.',
          citation: 'P. Wisedsri and C. Anutariya, "Data Analytics and Visualisation System for Fall Detection for Elderly and Disabled People," TENCON 2023 - 2023 IEEE Region 10 Conference (TENCON), Chiang Mai, Thailand, 2023, pp. 1315-1320.',
          doi: 'https://doi.org/10.1109/TENCON58879.2023.10322370',
        },
      ]

      for (const pub of publications) {
        await publicationService.create(pub)
      }
      setStatus('✅ Publications migrated')

      // 4. Migrate Blog posts
      setStatus('Migrating Blog posts...')
      const blogs = [
        {
          date: 'Nov 10, 2025',
          title: 'Embedding Runnable Code Snippets in a Portfolio.',
          description: 'A look at how to use simple JavaScript to create interactive, live examples on a static page.',
          content: `
            <p class="mb-6">One of the best ways to showcase technical skill is to demonstrate it live. Instead of just showing code, why not make it runnable? This portfolio uses simple, isolated JavaScript functions to power interactive components right inside a "blog post."</p>
            <p class="mb-8">This approach is lightweight, doesn't require a complex backend, and provides immediate value to the user. Below is the live currency converter example that was featured in a previous version of this site.</p>
            
            <h3 class="text-3xl font-semibold mb-6 pt-4 border-t border-gray-100 dark:border-slate-800">Live Code Snippet: Currency Converter</h3>
            <div data-converter-placeholder></div>
            
            <h3 class="text-2xl font-semibold mt-10 mb-4">Conclusion</h3>
            <p class="text-secondary-text dark:text-zinc-300">This method proves that a "static" portfolio can still be a dynamic and engaging experience.</p>
          `,
        },
      ]

      for (const blog of blogs) {
        await blogService.create(blog)
      }
      setStatus('✅ Blog posts migrated')

      setStatus('🎉 All data migration completed successfully!')
    } catch (error) {
      console.error('Migration failed:', error)
      setStatus(`❌ Migration failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-primary-bg dark:bg-dark-bg p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-primary-text dark:text-dark-text">Data Migration</h1>
        
        <div className="bg-gray-50 dark:bg-slate-800 p-6 rounded-lg mb-6">
          <p className="text-secondary-text dark:text-zinc-300 mb-4">
            This will migrate all the original hardcoded data to your Firebase database.
          </p>
          <p className="text-sm text-secondary-text dark:text-zinc-400 mb-2">
            <strong>Note:</strong> This will add data to Firebase. If data already exists, it may create duplicates.
          </p>
          <div className="mt-4 p-3 rounded bg-blue-50 dark:bg-blue-900/20">
            <p className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">Connection Status:</p>
            {isConnected === null && (
              <p className="text-sm text-blue-600 dark:text-blue-300">Checking connection...</p>
            )}
            {isConnected === true && (
              <p className="text-sm text-green-600 dark:text-green-300">✅ Firebase is connected</p>
            )}
            {isConnected === false && status && (
              <div className="text-sm text-red-600 dark:text-red-300 whitespace-pre-line">
                {status}
              </div>
            )}
            {isConnected === false && !status && (
              <p className="text-sm text-red-600 dark:text-red-300">
                ❌ Firebase connection failed. Please check:
                <ul className="list-disc list-inside mt-2 ml-2">
                  <li>Your .env.local file has all Firebase config values</li>
                  <li>You've restarted the dev server after creating .env.local</li>
                  <li>Your Realtime Database rules allow writes (use dev rules)</li>
                  <li>Realtime Database is enabled in Firebase Console</li>
                  <li>Your internet connection is working</li>
                </ul>
              </p>
            )}
          </div>
        </div>

        <button
          onClick={migrateData}
          disabled={loading || !isConnected}
          className="px-6 py-3 bg-tech-accent text-white rounded-lg hover:opacity-90 disabled:opacity-50 font-medium"
        >
          {loading ? 'Migrating...' : 'Start Migration'}
        </button>

        {status && (
          <div className="mt-6 p-4 bg-gray-50 dark:bg-slate-800 rounded-lg">
            <p className="text-primary-text dark:text-dark-text whitespace-pre-line">{status}</p>
          </div>
        )}
      </div>
    </div>
  )
}

