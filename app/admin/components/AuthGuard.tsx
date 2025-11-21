'use client'

import { useState, useEffect } from 'react'
import { auth } from '@/lib/firebase/config'
import { 
  signInWithEmailAndPassword, 
  onAuthStateChanged, 
  User,
  signOut 
} from 'firebase/auth'
import AdminHeader from './AdminHeader'

interface AuthGuardProps {
  children: React.ReactNode
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [showLoginForm, setShowLoginForm] = useState(false)

  useEffect(() => {
    // Wait a bit for Firebase to initialize
    const checkAuth = () => {
      if (!auth) {
        console.error('Firebase Auth is not initialized. Please check your Firebase configuration.')
        setLoading(false)
        return
      }

      const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        setUser(currentUser)
        setLoading(false)
      }, (error) => {
        console.error('Auth state change error:', error)
        setLoading(false)
      })

      return () => unsubscribe()
    }

    // Small delay to ensure Firebase is initialized
    const timer = setTimeout(() => {
      checkAuth()
    }, 100)

    return () => clearTimeout(timer)
  }, [])

  const handleLogin = async (email: string, password: string) => {
    if (!auth) {
      const error = new Error('Firebase Auth is not initialized. Please enable Email/Password authentication in Firebase Console.')
      ;(error as any).code = 'auth/configuration-not-found'
      throw error
    }
    
    try {
      await signInWithEmailAndPassword(auth, email, password)
    } catch (error: any) {
      // Re-throw with better error message
      if (error.code === 'auth/configuration-not-found') {
        const newError = new Error('Firebase Authentication is not enabled. Please enable Email/Password in Firebase Console → Authentication → Sign-in method.')
        ;(newError as any).code = error.code
        throw newError
      }
      throw error
    }
  }

  const handleLogout = async () => {
    if (!auth) return
    await signOut(auth)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-primary-bg dark:bg-dark-bg flex items-center justify-center">
        <div className="text-secondary-text dark:text-zinc-400">กำลังโหลด...</div>
      </div>
    )
  }

  if (!auth) {
    return (
      <div className="min-h-screen bg-primary-bg dark:bg-dark-bg flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-8 border border-gray-200 dark:border-slate-700">
            <h1 className="text-2xl font-bold mb-4 text-primary-text dark:text-dark-text">
              Firebase Auth ไม่ได้ถูกตั้งค่า
            </h1>
            <div className="space-y-4 text-secondary-text dark:text-zinc-400">
              <p className="font-semibold text-primary-text dark:text-dark-text">⚠️ Firebase Auth ไม่ได้ถูกตั้งค่า</p>
              <p className="text-sm mb-2">กรุณาทำตามขั้นตอนต่อไปนี้:</p>
              <ol className="text-sm list-decimal list-inside space-y-2 mb-4">
                <li>เปิด <a href="https://console.firebase.google.com/" target="_blank" rel="noopener noreferrer" className="underline font-semibold text-tech-accent">Firebase Console</a></li>
                <li>เลือกโปรเจคของคุณ (parkpoom-git-blog)</li>
                <li>ไปที่ <strong>Authentication</strong> ในเมนูด้านซ้าย</li>
                <li>คลิก <strong>"Get started"</strong> ถ้าเห็น</li>
                <li>เปิดแท็บ <strong>"Sign-in method"</strong></li>
                <li>เปิดใช้งาน <strong>"Email/Password"</strong> และคลิก <strong>"Save"</strong></li>
                <li>ตรวจสอบว่าไฟล์ <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">.env.local</code> มีค่าคอนฟิก Firebase ครบถ้วน</li>
                <li>รีสตาร์ท dev server</li>
              </ol>
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-slate-700 space-y-2">
                <a 
                  href="/admin/setup" 
                  className="block text-center px-6 py-3 bg-tech-accent text-white rounded-lg hover:opacity-90 font-medium"
                >
                  ไปที่หน้า Setup
                </a>
                <a 
                  href="/admin/debug" 
                  className="block text-center px-6 py-2 text-sm text-secondary-text dark:text-zinc-400 hover:text-primary-text dark:hover:text-dark-text"
                >
                  ตรวจสอบการตั้งค่า Firebase
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // If no user, show login form in header
  // If user exists, show admin panel with header
  return (
    <>
      <AdminHeader
        user={user}
        onLogin={handleLogin}
        onLogout={handleLogout}
        showLoginForm={showLoginForm}
        onToggleLoginForm={() => setShowLoginForm(!showLoginForm)}
      />
      {user ? (
        children
      ) : (
        <div className="min-h-screen bg-primary-bg dark:bg-dark-bg flex items-center justify-center p-8">
          <div className="max-w-2xl w-full text-center">
            <h2 className="text-2xl font-bold mb-4 text-primary-text dark:text-dark-text">
              กรุณาเข้าสู่ระบบ
            </h2>
            <p className="text-secondary-text dark:text-zinc-400 mb-6">
              คลิกปุ่ม "Login" ที่มุมขวาบนเพื่อเข้าสู่ระบบ Admin Panel
            </p>
          </div>
        </div>
      )}
    </>
  )
}

