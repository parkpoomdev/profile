'use client'

import { useState, useEffect } from 'react'
import { publicationService } from '@/lib/firebase/services'
import type { Publication } from '@/lib/firebase/services'

interface PublicationsSectionProps {
  onPublicationClick: (id: string) => void
}

// Helper function to truncate text
const truncateText = (text: string, maxLength: number = 150): string => {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength).trim() + '...'
}

export default function PublicationsSection({ onPublicationClick }: PublicationsSectionProps) {
  const [publications, setPublications] = useState<Publication[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadPublications = async () => {
      try {
        const items = await publicationService.getAll()
        setPublications(items)
      } catch (error) {
        console.error('Failed to load publications:', error)
      } finally {
        setLoading(false)
      }
    }
    loadPublications()
  }, [])

  return (
    <section className="content-section fade-in active">
      <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-8 sm:mb-10 md:mb-12 tracking-tighter">Publications.</h2>
      {loading ? (
        <p className="text-secondary-text dark:text-zinc-400">Loading...</p>
      ) : publications.length === 0 ? (
        <p className="text-secondary-text dark:text-zinc-400">No publications available.</p>
      ) : (
        <div className="space-y-6 sm:space-y-8">
          {publications.map((pub) => {
            const truncatedDescription = truncateText(pub.description || '', 150)
            const isTruncated = (pub.description || '').length > 150

            return (
              <div
                key={pub.id}
                className="p-3 sm:p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800 transition duration-300 -mx-2 sm:-mx-4"
              >
                <p className="text-xs sm:text-sm uppercase tracking-wider text-secondary-text dark:text-zinc-500 mb-1">{pub.date}</p>
                <h3 className="text-lg sm:text-xl font-semibold text-primary-text dark:text-dark-text mb-2">{pub.title}</h3>
                <p className="text-sm sm:text-base text-secondary-text dark:text-zinc-300 mb-3">
                  {truncatedDescription}
                </p>
                {isTruncated && (
                  <button
                    onClick={() => pub.id && onPublicationClick(pub.id)}
                    className="text-sm sm:text-base font-medium text-tech-accent hover:underline transition duration-200"
                  >
                    Read more →
                  </button>
                )}
              </div>
            )
          })}
        </div>
      )}
    </section>
  )
}

