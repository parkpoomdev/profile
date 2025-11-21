'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { onAuthStateChanged, User } from 'firebase/auth'
import { auth } from '@/lib/firebase/config'
import { blogService } from '@/lib/firebase/services'
import type { BlogPost } from '@/lib/firebase/services'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ConfirmModal from '@/components/ConfirmModal'
import { createFullPath } from '@/lib/pathUtils'

function BlogPostContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [slug, setSlug] = useState<string>('')
  const [blog, setBlog] = useState<BlogPost | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeSection, setActiveSection] = useState<string>('blog-detail')
  const [user, setUser] = useState<User | null>(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleting, setDeleting] = useState(false)

  // Check admin authentication
  useEffect(() => {
    if (!auth) return
    
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
    })

    return () => unsubscribe()
  }, [])

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
    const blogsPath = createFullPath('/blogs')
    router.push(blogsPath)
  }

  const handleEdit = () => {
    if (!blog?.id) return
    const editPath = createFullPath(`/admin?tab=blogs&edit=${blog.id}`)
    router.push(editPath)
  }

  const handleDeleteClick = () => {
    setShowDeleteModal(true)
  }

  const handleDeleteConfirm = async () => {
    if (!blog?.id) return
    
    setDeleting(true)
    try {
      await blogService.delete(blog.id)
      // Redirect to blogs page after deletion
      const blogsPath = createFullPath('/blogs')
      router.push(blogsPath)
    } catch (error) {
      console.error('Failed to delete blog post:', error)
      alert('Failed to delete blog post. Please try again.')
    } finally {
      setDeleting(false)
      setShowDeleteModal(false)
    }
  }

  const handleDeleteCancel = () => {
    setShowDeleteModal(false)
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
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={handleBack}
              className="text-secondary-text dark:text-zinc-400 hover:text-tech-accent dark:hover:text-tech-accent transition"
            >
              ← Back to Blogs
            </button>
            
            {user && blog?.id && (
              <div className="flex gap-2">
                <button
                  onClick={handleEdit}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:opacity-90 transition"
                >
                  Edit
                </button>
                <button
                  onClick={handleDeleteClick}
                  disabled={deleting}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:opacity-90 transition disabled:opacity-50"
                >
                  {deleting ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            )}
          </div>

          <p className="text-sm uppercase tracking-wider text-secondary-text dark:text-zinc-500 mb-2">
            {blog.date}
          </p>
          <h1 className="text-5xl font-extrabold mb-10 tracking-tighter text-primary-text dark:text-dark-text">
            {blog.title}
          </h1>
          
          {blog.tags && blog.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {blog.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 text-sm bg-gray-200 dark:bg-slate-700 text-secondary-text dark:text-zinc-300 rounded"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
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
      
      <ConfirmModal
        isOpen={showDeleteModal}
        title="Delete Blog Post"
        message={`Are you sure you want to delete "${blog?.title}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        danger={true}
      />
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

