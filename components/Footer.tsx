'use client'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="mt-8 sm:mt-12 md:mt-16 pt-6 sm:pt-8 md:pt-10 border-t border-gray-200 dark:border-slate-800 text-center text-xs sm:text-sm text-secondary-text dark:text-zinc-500">
      <p>&copy; {currentYear} Parkpoom Wisedsri. Crafted with Simplicity.</p>
    </footer>
  )
}

