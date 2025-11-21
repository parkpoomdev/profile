'use client'

import { useState, useEffect } from 'react'
import { publicationService } from '@/lib/firebase/services'
import type { Publication } from '@/lib/firebase/services'

interface PublicationsSectionProps {
  onPublicationClick: (id: string) => void
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
      <h2 className="text-5xl font-extrabold mb-12 tracking-tighter">Publications.</h2>
      {loading ? (
        <p className="text-secondary-text dark:text-zinc-400">Loading...</p>
      ) : publications.length === 0 ? (
        <p className="text-secondary-text dark:text-zinc-400">No publications available.</p>
      ) : (
        <div className="space-y-8">
          {publications.map((pub) => (
            <button
              key={pub.id}
              onClick={() => pub.id && onPublicationClick(pub.id)}
              className="post-link text-left w-full block p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800 transition duration-300 -mx-4"
            >
              <p className="text-sm uppercase tracking-wider text-secondary-text dark:text-zinc-500 mb-1">{pub.date}</p>
              <h3 className="text-xl font-semibold">{pub.title}</h3>
              <p className="text-secondary-text dark:text-zinc-300">{pub.description}</p>
            </button>
          ))}
        </div>
      )}
    </section>
  )
}

