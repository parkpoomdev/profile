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
import { createFullPath } from '@/lib/pathUtils'

type Section = 'about' | 'work' | 'publications' | 'blogs' | 'blog-detail' | 'new-blog-detail'

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
    // Check for blogId or section in URL query parameter
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      const blogIdParam = params.get('blogId')
      const sectionParam = params.get('section')
      
      if (blogIdParam) {
        setBlogId(blogIdParam)
        setActiveSection('new-blog-detail')
        setIsNavLocked(true)
        window.scrollTo(0, 0)
      } else if (sectionParam && ['about', 'work', 'publications', 'blogs'].includes(sectionParam)) {
        setActiveSection(sectionParam as Section)
        setIsNavLocked(false)
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
    // If slug exists, navigate to SEO-friendly URL with basePath
    if (slug) {
      const blogPath = createFullPath(`/blog?slug=${slug}`)
      window.location.href = blogPath
      return
    }
    // Fallback to old method for backward compatibility
    setBlogId(id)
    setActiveSection('new-blog-detail')
    setIsNavLocked(true)
    window.scrollTo(0, 0)
  }

  const handleBackToPublications = () => {
    setActiveSection('publications')
    setIsNavLocked(false)
    window.scrollTo(0, 0)
  }

  const handleBackToBlogs = () => {
    setActiveSection('blogs')
    setIsNavLocked(false)
    window.scrollTo(0, 0)
  }

  return (
    <div className="max-w-4xl w-full mx-auto px-0 sm:px-2">
      <Header
        activeSection={activeSection}
        onNavigate={handleNavigate}
        isNavLocked={isNavLocked}
      />

      <main className="py-8 sm:py-12 md:py-16">
        {activeSection === 'about' && <AboutSection />}
        {activeSection === 'work' && <WorkSection />}
        {activeSection === 'publications' && <PublicationsSection onPublicationClick={handlePublicationClick} />}
        {activeSection === 'blog-detail' && (
          <PublicationDetail publicationId={publicationId} onBack={handleBackToPublications} />
        )}
        {activeSection === 'blogs' && <BlogsSection onBlogClick={handleBlogClick} />}
        {activeSection === 'new-blog-detail' && (
          <BlogDetail blogId={blogId} onBack={handleBackToBlogs} />
        )}
      </main>

      <Footer />
    </div>
  )
}

