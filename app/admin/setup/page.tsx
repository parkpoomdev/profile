'use client'

import { useState } from 'react'
import { auth } from '@/lib/firebase/config'
import { createUserWithEmailAndPassword } from 'firebase/auth'

export default function SetupPage() {
  const [email, setEmail] = useState('parkpoom.wisedsri@gmail.com')
  const [password, setPassword] = useState('Viseszri1991Best')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage(null)
    setLoading(true)

    try {
      if (!auth) {
        throw new Error('Firebase Auth is not initialized. Please check your Firebase configuration.')
      }

      await createUserWithEmailAndPassword(auth, email, password)
      setMessage({
        type: 'success',
        text: `User created successfully! Email: ${email}`
      })
    } catch (error: any) {
      let errorMessage = 'Failed to create user'
      
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'อีเมลนี้ถูกใช้งานแล้ว คุณสามารถใช้เข้าสู่ระบบได้ที่หน้า Admin Panel'
        // Show success message style for this case
        setTimeout(() => {
          window.location.href = '/admin'
        }, 2000)
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address'
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'Password is too weak. Please use a stronger password.'
      } else if (error.code === 'auth/configuration-not-found') {
        errorMessage = 'Firebase Authentication ยังไม่ได้เปิดใช้งาน กรุณาเปิดใช้งาน Email/Password ใน Firebase Console → Authentication → Sign-in method'
      } else if (error.message) {
        errorMessage = error.message
      }
      
      setMessage({
        type: 'error',
        text: errorMessage
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-primary-bg dark:bg-dark-bg flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-8 border border-gray-200 dark:border-slate-700">
          <h1 className="text-3xl font-bold mb-2 text-primary-text dark:text-dark-text">
            Setup Admin Account
          </h1>
          <p className="text-secondary-text dark:text-zinc-400 mb-6">
            สร้างบัญชีผู้ดูแลระบบสำหรับ Admin Panel
          </p>

          {message && (
            <div className={`mb-4 p-4 rounded-lg ${
              message.type === 'success' 
                ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' 
                : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
            }`}>
              {message.text}
            </div>
          )}

          {!auth && (
            <div className="mb-4 p-4 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 rounded-lg">
              <p className="font-semibold mb-2">⚠️ Firebase Auth ไม่ได้ถูกตั้งค่า</p>
              <p className="text-sm mb-2">กรุณาทำตามขั้นตอนต่อไปนี้:</p>
              <ol className="text-sm list-decimal list-inside space-y-2 mb-3">
                <li>เปิด <a href="https://console.firebase.google.com/" target="_blank" rel="noopener noreferrer" className="underline font-semibold">Firebase Console</a></li>
                <li>เลือกโปรเจคของคุณ (parkpoom-git-blog)</li>
                <li>ไปที่ <strong>Authentication</strong> ในเมนูด้านซ้าย</li>
                <li>คลิก <strong>"Get started"</strong> ถ้าเห็น (ถ้าเคยเปิดแล้วข้ามขั้นตอนนี้)</li>
                <li>เปิดแท็บ <strong>"Sign-in method"</strong></li>
                <li>คลิกที่ <strong>"Email/Password"</strong></li>
                <li>เปิดใช้งาน <strong>"Enable"</strong> และคลิก <strong>"Save"</strong></li>
                <li>ตรวจสอบว่าไฟล์ <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">.env.local</code> มีค่าคอนฟิก Firebase ครบถ้วน</li>
                <li>รีสตาร์ท dev server (หยุดด้วย Ctrl+C แล้วรัน <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">npm run dev</code> อีกครั้ง)</li>
              </ol>
              <p className="text-xs mt-3 pt-3 border-t border-yellow-300 dark:border-yellow-700">
                <strong>หมายเหตุ:</strong> หลังจากเปิดใช้งาน Email/Password ใน Firebase Console แล้ว ต้องรีสตาร์ท dev server เพื่อให้การเปลี่ยนแปลงมีผล
              </p>
            </div>
          )}

          <form onSubmit={handleCreateUser} className="space-y-4">
            <div>
              <label 
                htmlFor="email" 
                className="block text-sm font-medium mb-2 text-primary-text dark:text-dark-text"
              >
                อีเมล
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading || !auth}
                className="w-full p-3 border border-gray-300 dark:border-slate-600 rounded-lg bg-primary-bg dark:bg-slate-700 text-primary-text dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-tech-accent disabled:opacity-50"
              />
            </div>

            <div>
              <label 
                htmlFor="password" 
                className="block text-sm font-medium mb-2 text-primary-text dark:text-dark-text"
              >
                รหัสผ่าน
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading || !auth}
                className="w-full p-3 border border-gray-300 dark:border-slate-600 rounded-lg bg-primary-bg dark:bg-slate-700 text-primary-text dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-tech-accent disabled:opacity-50"
              />
            </div>

            <button
              type="submit"
              disabled={loading || !auth}
              className="w-full px-6 py-3 bg-tech-accent text-white rounded-lg hover:opacity-90 disabled:opacity-50 font-medium transition"
            >
              {loading ? 'กำลังสร้างบัญชี...' : 'สร้างบัญชีผู้ดูแลระบบ'}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-slate-700">
            <p className="text-sm text-secondary-text dark:text-zinc-400 text-center">
              หลังจากสร้างบัญชีแล้ว คุณสามารถ{' '}
              <a href="/admin" className="text-tech-accent hover:underline">
                เข้าสู่ระบบที่หน้า Admin Panel
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

