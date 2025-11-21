'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { User } from 'firebase/auth'

interface AdminHeaderProps {
  user: User | null
  onLogin: (email: string, password: string) => Promise<void>
  onLogout: () => Promise<void>
  showLoginForm: boolean
  onToggleLoginForm: () => void
}

export default function AdminHeader({ user, onLogin, onLogout, showLoginForm, onToggleLoginForm }: AdminHeaderProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false)
      }
    }

    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [dropdownOpen])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      await onLogin(email, password)
      setEmail('')
      setPassword('')
      onToggleLoginForm()
    } catch (err: any) {
      let errorMessage = 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ'
      
      if (err.code === 'auth/user-not-found') {
        errorMessage = 'ไม่พบผู้ใช้ในระบบ'
      } else if (err.code === 'auth/wrong-password') {
        errorMessage = 'รหัสผ่านไม่ถูกต้อง'
      } else if (err.code === 'auth/invalid-email') {
        errorMessage = 'รูปแบบอีเมลไม่ถูกต้อง'
      } else if (err.code === 'auth/invalid-credential') {
        errorMessage = 'อีเมลหรือรหัสผ่านไม่ถูกต้อง'
      } else if (err.code === 'auth/configuration-not-found') {
        errorMessage = 'Firebase Authentication ยังไม่ได้เปิดใช้งาน'
      } else if (err.message) {
        errorMessage = err.message
      }
      
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    setDropdownOpen(false)
    await onLogout()
  }

  return (
    <header className="sticky top-0 z-50 bg-primary-bg dark:bg-dark-bg border-b border-gray-200 dark:border-slate-700 mb-8">
      <div className="max-w-6xl mx-auto px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Left side - Title */}
          <h1 className="text-4xl font-bold text-primary-text dark:text-dark-text">Admin Panel</h1>

          {/* Right side - Actions */}
          <div className="flex items-center gap-4">
            {/* Home Button */}
            <Link
              href="/"
              className="px-4 py-2 text-sm font-medium text-secondary-text dark:text-zinc-400 hover:text-primary-text dark:hover:text-dark-text transition"
            >
              Home
            </Link>

            {/* User Menu or Login */}
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-primary-text dark:text-dark-text"
                  >
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                  <span className="text-sm text-secondary-text dark:text-zinc-400 hidden sm:inline">
                    {user.email}
                  </span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={`text-secondary-text dark:text-zinc-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`}
                  >
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </button>

                {/* Dropdown Menu */}
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-gray-200 dark:border-slate-700 py-2">
                    <div className="px-4 py-2 border-b border-gray-200 dark:border-slate-700">
                      <p className="text-xs text-secondary-text dark:text-zinc-400">เข้าสู่ระบบเป็น</p>
                      <p className="text-sm font-medium text-primary-text dark:text-dark-text mt-1">
                        {user.email}
                      </p>
                    </div>
                    <Link
                      href="/admin"
                      className="block px-4 py-2 text-sm text-primary-text dark:text-dark-text hover:bg-gray-100 dark:hover:bg-slate-700 transition"
                      onClick={() => setDropdownOpen(false)}
                    >
                      Admin Panel
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-slate-700 transition"
                    >
                      ออกจากระบบ
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="relative">
                <button
                  onClick={onToggleLoginForm}
                  className="px-4 py-2 bg-tech-accent text-white rounded-lg hover:opacity-90 text-sm font-medium transition"
                >
                  Login
                </button>

                {/* Login Form Dropdown */}
                {showLoginForm && (
                  <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-gray-200 dark:border-slate-700 p-4">
                    <h3 className="text-lg font-semibold mb-3 text-primary-text dark:text-dark-text">
                      เข้าสู่ระบบ
                    </h3>

                    {error && (
                      <div className="mb-3 p-3 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 rounded-lg text-sm">
                        {error}
                      </div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-3">
                      <div>
                        <label className="block text-xs font-medium mb-1 text-primary-text dark:text-dark-text">
                          อีเมล
                        </label>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          disabled={loading}
                          placeholder="your-email@example.com"
                          className="w-full p-2 text-sm border border-gray-300 dark:border-slate-600 rounded-lg bg-primary-bg dark:bg-slate-700 text-primary-text dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-tech-accent disabled:opacity-50"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium mb-1 text-primary-text dark:text-dark-text">
                          รหัสผ่าน
                        </label>
                        <input
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          disabled={loading}
                          placeholder="••••••••"
                          className="w-full p-2 text-sm border border-gray-300 dark:border-slate-600 rounded-lg bg-primary-bg dark:bg-slate-700 text-primary-text dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-tech-accent disabled:opacity-50"
                        />
                      </div>

                      <div className="flex gap-2">
                        <button
                          type="submit"
                          disabled={loading}
                          className="flex-1 px-4 py-2 bg-tech-accent text-white rounded-lg hover:opacity-90 disabled:opacity-50 text-sm font-medium transition"
                        >
                          {loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
                        </button>
                        <button
                          type="button"
                          onClick={onToggleLoginForm}
                          className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:opacity-90 text-sm font-medium transition"
                        >
                          ยกเลิก
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

