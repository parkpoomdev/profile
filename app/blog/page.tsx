'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { blogService } from '@/lib/firebase/services'
import type { BlogPost } from '@/lib/firebase/services'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { createFullPath } from '@/lib/pathUtils'

function BlogPostContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [slug, setSlug] = useState<string>('')
  const [blog, setBlog] = useState<BlogPost | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeSection, setActiveSection] = useState<string>('blog-detail')

  useEffect(() => {
    // Get slug from URL - check both pathname and search params
    if (typeof window !== 'undefined') {
      const pathParts = window.location.pathname.split('/')
      const slugFromPath = pathParts[pathParts.length - 1]
      const slugFromParam = searchParams?.get('slug')
      const slugToUse = slugFromPath !== 'blog' ? slugFromPath : (slugFromParam || '')
      setSlug(slugToUse)
    }
  }, [searchParams])

  useEffect(() => {
    const loadBlog = async () => {
      if (!slug) {
        setLoading(false)
        return
      }

      try {
        const data = await blogService.getBySlug(slug)
        if (data) {
          setBlog(data)
          // Set page title dynamically
          document.title = `${data.title} | Parkpoom Wisedsri`
        } else {
          // Try to find by ID (backward compatibility)
          const byId = await blogService.get(slug)
          if (byId) {
            setBlog(byId)
            // Set page title dynamically
            document.title = `${byId.title} | Parkpoom Wisedsri`
          }
        }
      } catch (error) {
        console.error('Failed to load blog post:', error)
      } finally {
        setLoading(false)
      }
    }

    if (slug) {
      loadBlog()
    }
  }, [slug])

  // Reset title when component unmounts
  useEffect(() => {
    return () => {
      document.title = 'Profile | Parkpoom Wisedsri (ภาคภูมิ วิเศษศรี)'
    }
  }, [])

  const handleBack = () => {
    const homePath = createFullPath('/')
    router.push(homePath)
  }

  if (loading) {
    return (
      <div className="max-w-4xl w-full mx-auto">
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-secondary-text dark:text-zinc-400">Loading...</p>
        </div>
      </div>
    )
  }

  if (!blog) {
    return (
      <div className="max-w-4xl w-full mx-auto">
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <p className="text-xl text-red-500 mb-4">Post not found.</p>
            <button
              onClick={handleBack}
              className="px-6 py-2 bg-tech-accent text-white rounded-lg hover:opacity-90"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Check if content contains converter placeholder
  const hasConverter = blog.content.includes('data-converter-placeholder')

  return (
    <div className="max-w-4xl w-full mx-auto">
      <Header
        activeSection={activeSection}
        onNavigate={() => {}}
        isNavLocked={true}
      />

      <main className="py-16">
        <section className="content-section fade-in active">
          <button
            onClick={handleBack}
            className="mb-6 text-secondary-text dark:text-zinc-400 hover:text-tech-accent dark:hover:text-tech-accent transition"
          >
            ← Back to Blogs
          </button>

          <p className="text-sm uppercase tracking-wider text-secondary-text dark:text-zinc-500 mb-2">
            {blog.date}
          </p>
          <h1 className="text-5xl font-extrabold mb-10 tracking-tighter text-primary-text dark:text-dark-text">
            {blog.title}
          </h1>
          <div
            className="text-lg space-y-4 text-secondary-text dark:text-zinc-300 prose prose-lg dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />

          {hasConverter && (
            <div id="currency-converter-container" className="mt-8"></div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  )
}

export default function BlogPostPage() {
  return (
    <Suspense fallback={
      <div className="max-w-4xl w-full mx-auto">
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-secondary-text dark:text-zinc-400">Loading...</p>
        </div>
      </div>
    }>
      <BlogPostContent />
    </Suspense>
  )
}

