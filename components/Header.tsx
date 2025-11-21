'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState, useRef } from 'react'
import { auth } from '@/lib/firebase/config'
import { onAuthStateChanged, User, signOut } from 'firebase/auth'
import Link from 'next/link'
import { createFullPath } from '@/lib/pathUtils'

const lightIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="5"></circle>
    <line x1="12" y1="1" x2="12" y2="3"></line>
    <line x1="12" y1="21" x2="12" y2="23"></line>
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
    <line x1="1" y1="12" x2="3" y2="12"></line>
    <line x1="21" y1="12" x2="23" y2="12"></line>
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
  </svg>
)

const darkIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
  </svg>
)

interface HeaderProps {
  activeSection: string
  onNavigate: (section: string) => void
  isNavLocked: boolean
}

export default function Header({ activeSection, onNavigate, isNavLocked }: HeaderProps) {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!auth) return

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
    })

    return () => unsubscribe()
  }, [])

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

  const handleLogout = async () => {
    if (!auth) return
    setDropdownOpen(false)
    await signOut(auth)
  }

  const navItems: Array<{ id: string; label: string; href?: string }> = [
    { id: 'about', label: 'About me' },
    { id: 'work', label: 'Work' },
    { id: 'publications', label: 'Publications' },
    { id: 'blogs', label: 'Blogs', href: '/blogs' },
  ]

  const isDark = theme === 'dark'

  const handleHomeClick = (e: React.MouseEvent) => {
    e.preventDefault()
    const homePath = createFullPath('/')
    window.location.href = homePath
  }

  return (
    <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-12 border-b border-gray-200 dark:border-slate-800">
      <a 
        href="/" 
        onClick={handleHomeClick}
        className="text-3xl font-bold tracking-tight mb-4 sm:mb-0 hover:text-tech-accent dark:hover:text-tech-accent transition duration-300"
      >
        Parkpoom Wisedsri
      </a>

      <nav className="flex items-center space-x-6 text-base font-medium">
        <div className="flex space-x-6">
          {navItems.map((item) => {
            const isActive = activeSection === item.id && !isNavLocked
            // If item has href, use Link, otherwise use button
            // Note: Next.js Link automatically handles basePath, so we don't need createFullPath
            if ('href' in item && item.href) {
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  className={`nav-link transition duration-200 ${
                    isActive
                      ? 'active-nav-link text-tech-accent'
                      : 'text-secondary-text dark:text-zinc-300 hover:text-tech-accent dark:hover:text-tech-accent'
                  }`}
                >
                  {item.label}
                </Link>
              )
            }
            return (
              <button
                key={item.id}
                onClick={() => !isNavLocked && onNavigate(item.id)}
                className={`nav-link transition duration-200 ${
                  isActive
                    ? 'active-nav-link text-tech-accent'
                    : 'text-secondary-text dark:text-zinc-300 hover:text-tech-accent dark:hover:text-tech-accent'
                } ${isNavLocked ? 'disabled' : ''}`}
                disabled={isNavLocked}
              >
                {item.label}
              </button>
            )
          })}
        </div>

        <button
          onClick={() => setTheme(isDark ? 'light' : 'dark')}
          aria-label="Toggle dark mode"
          className="minimal-btn ml-4"
        >
          {mounted ? (isDark ? darkIcon : lightIcon) : <div className="w-5 h-5" />}
        </button>

        {/* User Icon with Dropdown */}
        {user && (
          <div className="relative ml-4" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="minimal-btn"
              aria-label="User menu"
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
            </button>

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-gray-200 dark:border-slate-700 py-2 z-50">
                <div className="px-4 py-2 border-b border-gray-200 dark:border-slate-700">
                  <p className="text-xs text-secondary-text dark:text-zinc-400">เข้าสู่ระบบเป็น</p>
                  <p className="text-sm font-medium text-primary-text dark:text-dark-text mt-1 truncate">
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
        )}
      </nav>
    </header>
  )
}

