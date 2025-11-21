'use client'

import { useState, useEffect } from 'react'
import { blogService } from '@/lib/firebase/services'
import type { BlogPost } from '@/lib/firebase/services'

interface BlogsSectionProps {
  onBlogClick: (id: string, slug?: string) => void
}

export default function BlogsSection({ onBlogClick }: BlogsSectionProps) {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadBlogs = async () => {
      try {
        const items = await blogService.getAll()
        setBlogPosts(items)
      } catch (error) {
        console.error('Failed to load blog posts:', error)
      } finally {
        setLoading(false)
      }
    }
    loadBlogs()
  }, [])

  return (
    <section className="content-section fade-in active">
      <h2 className="text-5xl font-extrabold mb-12 tracking-tighter">Code & Thoughts.</h2>
      {loading ? (
        <p className="text-secondary-text dark:text-zinc-400">Loading...</p>
      ) : blogPosts.length === 0 ? (
        <p className="text-secondary-text dark:text-zinc-400">No blog posts available.</p>
      ) : (
        <div className="space-y-8">
          {blogPosts.map((post) => (
            <button
              key={post.id}
              onClick={() => post.id && onBlogClick(post.id, post.slug)}
              className="new-post-link text-left w-full block p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800 transition duration-300 -mx-4"
            >
              <p className="text-sm uppercase tracking-wider text-secondary-text dark:text-zinc-500 mb-1">{post.date}</p>
              <h3 className="text-xl font-semibold">{post.title}</h3>
              <p className="text-secondary-text dark:text-zinc-300">{post.description}</p>
            </button>
          ))}
        </div>
      )}
    </section>
  )
}

