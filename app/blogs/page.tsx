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

  // Helper function to truncate text
  const truncateText = (text: string, maxLength: number = 150): string => {
    if (text.length <= maxLength) return text
    return text.slice(0, maxLength).trim() + '...'
  }

  return (
    <div className="max-w-6xl w-full mx-auto px-0 sm:px-2">
      <Header
        activeSection="blogs"
        onNavigate={handleNavigate}
        isNavLocked={false}
      />

      <main className="py-8 sm:py-12 md:py-16">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Main Content */}
          <div className="flex-1 order-2 lg:order-1">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-8 sm:mb-10 md:mb-12 tracking-tighter text-primary-text dark:text-dark-text">
              Code & Thoughts.
            </h2>
            
            {loading ? (
              <p className="text-secondary-text dark:text-zinc-400">Loading...</p>
            ) : filteredBlogs.length === 0 ? (
              <p className="text-secondary-text dark:text-zinc-400">
                {selectedTag ? `No blog posts found with tag "${selectedTag}".` : 'No blog posts available.'}
              </p>
            ) : (
              <div className="space-y-6 sm:space-y-8">
                {filteredBlogs.map((post) => {
                  const truncatedDescription = truncateText(post.description || '', 150)
                  const isTruncated = (post.description || '').length > 150

                  return (
                    <div
                      key={post.id}
                      className="p-3 sm:p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800 transition duration-300 -mx-2 sm:-mx-4"
                    >
                      <div className="flex items-start justify-between gap-3 sm:gap-4">
                        <div className="flex-1">
                          <p className="text-xs sm:text-sm uppercase tracking-wider text-secondary-text dark:text-zinc-500 mb-1">
                            {post.date}
                          </p>
                          <h3 className="text-lg sm:text-xl font-semibold text-primary-text dark:text-dark-text mb-2">
                            {post.title}
                          </h3>
                          <p className="text-sm sm:text-base text-secondary-text dark:text-zinc-300 mb-3">
                            {truncatedDescription}
                          </p>
                          <div className="flex items-center justify-between gap-4">
                            {post.tags && post.tags.length > 0 && (
                              <div className="flex flex-wrap gap-2">
                                {post.tags.map((tag, index) => (
                                  <span
                                    key={index}
                                    className="px-2 py-1 text-xs bg-gray-200 dark:bg-slate-700 text-secondary-text dark:text-zinc-300 rounded cursor-pointer hover:bg-gray-300 dark:hover:bg-slate-600 transition"
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
                            {isTruncated && (
                              <button
                                onClick={() => handleBlogClick(post.slug, post.id)}
                                className="text-sm sm:text-base font-medium text-tech-accent hover:underline transition duration-200 whitespace-nowrap ml-auto"
                              >
                                Read more →
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Tag Filter Panel */}
          {allTags.length > 0 && (
            <div className="w-full lg:w-64 flex-shrink-0 order-1 lg:order-2">
              <div className="lg:sticky lg:top-24">
                <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-primary-text dark:text-dark-text">
                  Tags
                </h3>
                <div className="flex flex-wrap lg:flex-col gap-2 lg:space-y-2">
                  <button
                    onClick={() => setSelectedTag(null)}
                    className={`text-left px-3 py-2 rounded-lg transition text-sm sm:text-base ${
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
                      className={`text-left px-3 py-2 rounded-lg transition text-sm sm:text-base ${
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

