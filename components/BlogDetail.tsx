'use client'

import { useState, useEffect } from 'react'
import { blogService } from '@/lib/firebase/services'
import type { BlogPost } from '@/lib/firebase/services'

interface BlogDetailProps {
  blogId: string
  onBack: () => void
}

function CurrencyConverter() {
  const [usd, setUsd] = useState(100)
  const rate = 0.92
  const eur = (usd * rate).toFixed(2)

  return (
    <div className="space-y-4">
      <h4 className="text-xl font-bold text-tech-accent mb-4">USD to EUR Converter</h4>
      <input
        type="number"
        value={usd}
        onChange={(e) => setUsd(parseFloat(e.target.value) || 0)}
        placeholder="Enter USD amount"
        className="w-full p-3 rounded-md border border-gray-300 dark:border-slate-600 dark:bg-slate-900 text-primary-text dark:text-dark-text focus:ring-tech-accent focus:border-tech-accent transition"
      />
      <div className="flex justify-between items-center text-secondary-text dark:text-zinc-400">
        <span className="text-lg">Result:</span>
        <span className="text-2xl font-extrabold text-primary-text dark:text-dark-text">€{eur}</span>
      </div>
      <p className="text-xs text-secondary-text dark:text-zinc-500">Exchange Rate (USD to EUR): 0.92</p>
    </div>
  )
}

export default function BlogDetail({ blogId, onBack }: BlogDetailProps) {
  const [blog, setBlog] = useState<BlogPost | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadBlog = async () => {
      try {
        const data = await blogService.get(blogId)
        setBlog(data)
      } catch (error) {
        console.error('Failed to load blog post:', error)
      } finally {
        setLoading(false)
      }
    }
    if (blogId) {
      loadBlog()
    }
  }, [blogId])

  if (loading) {
    return (
      <section className="content-section fade-in active">
        <p className="text-secondary-text dark:text-zinc-400">Loading...</p>
      </section>
    )
  }

  if (!blog) {
    return (
      <section className="content-section fade-in active">
        <p className="text-xl text-red-500">Post not found.</p>
      </section>
    )
  }

  // Check if content contains converter placeholder
  const hasConverter = blog.content.includes('data-converter-placeholder')

  return (
    <section className="content-section fade-in active">
      <button
        onClick={onBack}
        className="text-tech-accent mb-8 flex items-center hover:underline transition duration-200"
      >
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
        </svg>
        Back to all Blogs
      </button>

      <div className="max-w-3xl mx-auto">
        <p className="text-sm uppercase tracking-wider text-secondary-text dark:text-zinc-500 mb-2">{blog.date}</p>
        <h1 className="text-5xl font-extrabold mb-10 tracking-tighter">{blog.title}</h1>
        <div className="text-lg space-y-4 text-secondary-text dark:text-zinc-300">
          {hasConverter ? (
            <>
              <div dangerouslySetInnerHTML={{ __html: blog.content.split('<div data-converter-placeholder></div>')[0] }} />
              <div className="p-6 rounded-xl shadow-lg bg-gray-50 dark:bg-slate-800/70 border border-gray-200 dark:border-slate-700">
                <CurrencyConverter />
              </div>
              <div dangerouslySetInnerHTML={{ __html: blog.content.split('<div data-converter-placeholder></div>')[1] }} />
            </>
          ) : (
            <div dangerouslySetInnerHTML={{ __html: blog.content }} />
          )}
        </div>
      </div>
    </section>
  )
}

