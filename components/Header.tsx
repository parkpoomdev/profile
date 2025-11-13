'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

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

  useEffect(() => {
    setMounted(true)
  }, [])

  const navItems = [
    { id: 'about', label: 'About me' },
    { id: 'work', label: 'Work' },
    { id: 'blogs', label: 'Publications' },
    { id: 'new-blogs', label: 'Blogs' },
  ]

  const isDark = theme === 'dark'

  return (
    <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-12 border-b border-gray-200 dark:border-slate-800">
      <a href="#" className="text-3xl font-bold tracking-tight mb-4 sm:mb-0 hover:text-tech-accent dark:hover:text-tech-accent transition duration-300">
        Parkpoom Wisedsri
      </a>

      <nav className="flex items-center space-x-6 text-base font-medium">
        <div className="flex space-x-6">
          {navItems.map((item) => {
            const isActive = activeSection === item.id && !isNavLocked
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
      </nav>
    </header>
  )
}

