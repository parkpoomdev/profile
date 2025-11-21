'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { blogService } from '@/lib/firebase/services'
import type { BlogPost } from '@/lib/firebase/services'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { createFullPath } from '@/lib/pathUtils'

export default function BlogsPage() {
  const router = useRouter()
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedTag, setSelectedTag] = useState<string | null>(null)

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

  // Get all unique tags from all blog posts
  const allTags = Array.from(
    new Set(
      blogPosts
        .flatMap(post => post.tags || [])
        .filter(tag => tag && tag.trim().length > 0)
    )
  ).sort()

  // Filter blogs by selected tag
  const filteredBlogs = selectedTag
    ? blogPosts.filter(post => post.tags && post.tags.includes(selectedTag))
    : blogPosts

  const handleBlogClick = (slug?: string, id?: string) => {
    if (slug) {
      const blogPath = createFullPath(`/blog?slug=${slug}`)
      window.location.href = blogPath
    } else if (id) {
      const blogPath = createFullPath(`/?blogId=${id}`)
      window.location.href = blogPath
    }
  }

  const handleNavigate = (section: string) => {
    // Navigate to home page with section parameter
    const homePath = createFullPath(`/?section=${section}`)
    window.location.href = homePath
  }

  return (
    <div className="max-w-6xl w-full mx-auto">
      <Header
        activeSection="blogs"
        onNavigate={handleNavigate}
        isNavLocked={false}
      />

      <main className="py-16">
        <div className="flex gap-8">
          {/* Main Content */}
          <div className="flex-1">
            <h2 className="text-5xl font-extrabold mb-12 tracking-tighter text-primary-text dark:text-dark-text">
              Code & Thoughts.
            </h2>
            
            {loading ? (
              <p className="text-secondary-text dark:text-zinc-400">Loading...</p>
            ) : filteredBlogs.length === 0 ? (
              <p className="text-secondary-text dark:text-zinc-400">
                {selectedTag ? `No blog posts found with tag "${selectedTag}".` : 'No blog posts available.'}
              </p>
            ) : (
              <div className="space-y-8">
                {filteredBlogs.map((post) => (
                  <button
                    key={post.id}
                    onClick={() => handleBlogClick(post.slug, post.id)}
                    className="new-post-link text-left w-full block p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800 transition duration-300 -mx-4"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <p className="text-sm uppercase tracking-wider text-secondary-text dark:text-zinc-500 mb-1">
                          {post.date}
                        </p>
                        <h3 className="text-xl font-semibold text-primary-text dark:text-dark-text mb-2">
                          {post.title}
                        </h3>
                        <p className="text-secondary-text dark:text-zinc-300 mb-2">
                          {post.description}
                        </p>
                        {post.tags && post.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-2">
                            {post.tags.map((tag, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 text-xs bg-gray-200 dark:bg-slate-700 text-secondary-text dark:text-zinc-300 rounded"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setSelectedTag(tag)
                                }}
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Tag Filter Panel */}
          {allTags.length > 0 && (
            <div className="w-64 flex-shrink-0">
              <div className="sticky top-24">
                <h3 className="text-lg font-semibold mb-4 text-primary-text dark:text-dark-text">
                  Tags
                </h3>
                <div className="space-y-2">
                  <button
                    onClick={() => setSelectedTag(null)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition ${
                      selectedTag === null
                        ? 'bg-tech-accent text-white'
                        : 'bg-gray-100 dark:bg-slate-800 text-secondary-text dark:text-zinc-300 hover:bg-gray-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    All Posts
                  </button>
                  {allTags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => setSelectedTag(tag)}
                      className={`w-full text-left px-3 py-2 rounded-lg transition ${
                        selectedTag === tag
                          ? 'bg-tech-accent text-white'
                          : 'bg-gray-100 dark:bg-slate-800 text-secondary-text dark:text-zinc-300 hover:bg-gray-200 dark:hover:bg-slate-700'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}

