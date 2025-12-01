'use client'

import { useState, useEffect } from 'react'
import { publicationService } from '@/lib/firebase/services'
import type { Publication } from '@/lib/firebase/services'

interface PublicationDetailProps {
  publicationId: string
  onBack: () => void
}

export default function PublicationDetail({ publicationId, onBack }: PublicationDetailProps) {
  const [publication, setPublication] = useState<Publication | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadPublication = async () => {
      try {
        const data = await publicationService.get(publicationId)
        setPublication(data)
      } catch (error) {
        console.error('Failed to load publication:', error)
      } finally {
        setLoading(false)
      }
    }
    if (publicationId) {
      loadPublication()
    }
  }, [publicationId])

  if (loading) {
    return (
      <section className="content-section fade-in active">
        <p className="text-secondary-text dark:text-zinc-400">Loading...</p>
      </section>
    )
  }

  if (!publication) {
    return (
      <section className="content-section fade-in active">
        <p className="text-xl text-red-500">Publication not found.</p>
      </section>
    )
  }

  // Build content from publication data
  const content = publication.citation 
    ? `<p class="mb-6"><strong>Full Citation:</strong> ${publication.citation}</p>`
    : ''
  const doiLink = publication.doi
    ? `<a href="${publication.doi}" target="_blank" rel="noopener noreferrer" class="inline-block text-lg font-semibold text-tech-accent hover:underline">View Publication (DOI) &rarr;</a>`
    : ''

  return (
    <section className="content-section fade-in active">
      <button
        onClick={onBack}
        className="text-sm sm:text-base text-tech-accent mb-6 sm:mb-8 flex items-center hover:underline transition duration-200"
      >
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
        </svg>
        Back to all Publications
      </button>

      <div className="max-w-3xl mx-auto">
        <p className="text-xs sm:text-sm uppercase tracking-wider text-secondary-text dark:text-zinc-500 mb-2">{publication.date}</p>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-6 sm:mb-8 md:mb-10 tracking-tighter">{publication.title}</h1>
        <div className="text-base sm:text-lg space-y-3 sm:space-y-4 text-secondary-text dark:text-zinc-300">
          {publication.description && <p>{publication.description}</p>}
          {(content || doiLink) && (
            <div className="prose prose-sm sm:prose-base md:prose-lg dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: content + doiLink }} />
          )}
        </div>
      </div>
    </section>
  )
}

