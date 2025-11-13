'use client'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="mt-16 pt-10 border-t border-gray-200 dark:border-slate-800 text-center text-sm text-secondary-text dark:text-zinc-500">
      <p>&copy; {currentYear} Parkpoom Wisedsri. Crafted with Simplicity.</p>
    </footer>
  )
}

