'use client'

import { useState, useEffect } from 'react'
import Header from '@/components/Header'
import AboutSection from '@/components/AboutSection'
import WorkSection from '@/components/WorkSection'
import PublicationsSection from '@/components/PublicationsSection'
import PublicationDetail from '@/components/PublicationDetail'
import BlogsSection from '@/components/BlogsSection'
import BlogDetail from '@/components/BlogDetail'
import Footer from '@/components/Footer'

type Section = 'about' | 'work' | 'blogs' | 'new-blogs' | 'blog-detail' | 'new-blog-detail'

export default function Home() {
  const [activeSection, setActiveSection] = useState<Section>('about')
  const [publicationId, setPublicationId] = useState<string>('')
  const [blogId, setBlogId] = useState<string>('')
  const [isNavLocked, setIsNavLocked] = useState(false)

  useEffect(() => {
    // Add fade-in animation on mount
    const timer = setTimeout(() => {
      const sections = document.querySelectorAll('.content-section')
      sections.forEach((section) => {
        if (section.classList.contains('active')) {
          section.classList.add('active')
        }
      })
    }, 50)

    return () => clearTimeout(timer)
  }, [activeSection])

  useEffect(() => {
    // Check for blogId in URL query parameter
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      const blogIdParam = params.get('blogId')
      if (blogIdParam) {
        setBlogId(blogIdParam)
        setActiveSection('new-blog-detail')
        setIsNavLocked(true)
        window.scrollTo(0, 0)
      }
    }
  }, [])

  const handleNavigate = (section: string) => {
    setActiveSection(section as Section)
    setIsNavLocked(false)
    window.scrollTo(0, 0)
  }

  const handlePublicationClick = (id: string) => {
    setPublicationId(id)
    setActiveSection('blog-detail')
    setIsNavLocked(true)
    window.scrollTo(0, 0)
  }

  const handleBlogClick = (id: string, slug?: string) => {
    // If slug exists, navigate to SEO-friendly URL
    if (slug) {
      window.location.href = `/blog/${slug}`
      return
    }
    // Fallback to old method for backward compatibility
    setBlogId(id)
    setActiveSection('new-blog-detail')
    setIsNavLocked(true)
    window.scrollTo(0, 0)
  }

  const handleBackToPublications = () => {
    setActiveSection('blogs')
    setIsNavLocked(false)
    window.scrollTo(0, 0)
  }

  const handleBackToBlogs = () => {
    setActiveSection('new-blogs')
    setIsNavLocked(false)
    window.scrollTo(0, 0)
  }

  return (
    <div className="max-w-4xl w-full mx-auto">
      <Header
        activeSection={activeSection}
        onNavigate={handleNavigate}
        isNavLocked={isNavLocked}
      />

      <main className="py-16">
        {activeSection === 'about' && <AboutSection />}
        {activeSection === 'work' && <WorkSection />}
        {activeSection === 'blogs' && <PublicationsSection onPublicationClick={handlePublicationClick} />}
        {activeSection === 'blog-detail' && (
          <PublicationDetail publicationId={publicationId} onBack={handleBackToPublications} />
        )}
        {activeSection === 'new-blogs' && <BlogsSection onBlogClick={handleBlogClick} />}
        {activeSection === 'new-blog-detail' && (
          <BlogDetail blogId={blogId} onBack={handleBackToBlogs} />
        )}
      </main>

      <Footer />
    </div>
  )
}

