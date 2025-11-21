'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { aboutService, workService, publicationService, blogService, generateUniqueSlug } from '@/lib/firebase/services'
import type { AboutData, WorkItem, Publication, BlogPost } from '@/lib/firebase/services'
import AuthGuard from './components/AuthGuard'
import WysiwygEditor from './components/WysiwygEditor'

type Tab = 'about' | 'work' | 'publications' | 'blogs'

function AdminPanelContent() {
  const searchParams = useSearchParams()
  const [activeTab, setActiveTab] = useState<Tab>('about')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  // About state
  const [aboutData, setAboutData] = useState<AboutData>({
    introduction: '',
    specialization: '',
    technicalSkills: '',
  })

  // Work state
  const [workItems, setWorkItems] = useState<WorkItem[]>([])
  const [editingWork, setEditingWork] = useState<WorkItem | null>(null)

  // Publications state
  const [publications, setPublications] = useState<Publication[]>([])
  const [editingPublication, setEditingPublication] = useState<Publication | null>(null)

  // Blogs state
  const [blogs, setBlogs] = useState<BlogPost[]>([])
  const [editingBlog, setEditingBlog] = useState<BlogPost | null>(null)

  // Handle URL query parameters
  useEffect(() => {
    const tab = searchParams?.get('tab') as Tab | null
    const editId = searchParams?.get('edit')
    
    if (tab && ['about', 'work', 'publications', 'blogs'].includes(tab)) {
      setActiveTab(tab)
    }
    
    if (editId && tab === 'blogs') {
      // Load blogs and find the one to edit
      blogService.getAll().then(items => {
        const blogToEdit = items.find(b => b.id === editId)
        if (blogToEdit) {
          setEditingBlog(blogToEdit)
        }
      }).catch(error => {
        console.error('Failed to load blogs for editing:', error)
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams])

  useEffect(() => {
    loadData()
  }, [activeTab])

  const loadData = async () => {
    setLoading(true)
    try {
      if (activeTab === 'about') {
        const data = await aboutService.get()
        if (data) {
          setAboutData(data)
        }
      } else if (activeTab === 'work') {
        const items = await workService.getAll()
        setWorkItems(items)
      } else if (activeTab === 'publications') {
        const items = await publicationService.getAll()
        setPublications(items)
      } else if (activeTab === 'blogs') {
        const items = await blogService.getAll()
        setBlogs(items)
      }
    } catch (error) {
      showMessage('error', 'Failed to load data')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text })
    setTimeout(() => setMessage(null), 3000)
  }

  // About handlers
  const handleAboutSave = async () => {
    setLoading(true)
    try {
      const existing = await aboutService.get()
      if (existing) {
        await aboutService.update(aboutData)
      } else {
        await aboutService.create(aboutData)
      }
      showMessage('success', 'About section saved successfully')
    } catch (error) {
      showMessage('error', 'Failed to save about section')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  // Work handlers
  const handleWorkSave = async (data: Omit<WorkItem, 'id'>) => {
    setLoading(true)
    try {
      if (editingWork?.id) {
        await workService.update(editingWork.id, data)
      } else {
        await workService.create(data)
      }
      setEditingWork(null)
      await loadData()
      showMessage('success', 'Work item saved successfully')
    } catch (error) {
      showMessage('error', 'Failed to save work item')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleWorkDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this work item?')) return
    setLoading(true)
    try {
      await workService.delete(id)
      await loadData()
      showMessage('success', 'Work item deleted successfully')
    } catch (error) {
      showMessage('error', 'Failed to delete work item')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  // Publication handlers
  const handlePublicationSave = async (data: Omit<Publication, 'id'>) => {
    setLoading(true)
    try {
      if (editingPublication?.id) {
        await publicationService.update(editingPublication.id, data)
      } else {
        await publicationService.create(data)
      }
      setEditingPublication(null)
      await loadData()
      showMessage('success', 'Publication saved successfully')
    } catch (error) {
      showMessage('error', 'Failed to save publication')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handlePublicationDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this publication?')) return
    setLoading(true)
    try {
      await publicationService.delete(id)
      await loadData()
      showMessage('success', 'Publication deleted successfully')
    } catch (error) {
      showMessage('error', 'Failed to delete publication')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  // Blog handlers
  const handleBlogSave = async (data: Omit<BlogPost, 'id'>) => {
    setLoading(true)
    try {
      // Generate slug from title if not provided
      const slug = data.slug || await generateUniqueSlug(data.title, editingBlog?.id)
      const dataWithSlug = { ...data, slug }

      if (editingBlog?.id) {
        await blogService.update(editingBlog.id, dataWithSlug)
      } else {
        await blogService.create(dataWithSlug)
      }
      setEditingBlog(null)
      await loadData()
      showMessage('success', 'Blog post saved successfully')
    } catch (error) {
      showMessage('error', 'Failed to save blog post')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleBlogDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this blog post?')) return
    setLoading(true)
    try {
      await blogService.delete(id)
      await loadData()
      showMessage('success', 'Blog post deleted successfully')
    } catch (error) {
      showMessage('error', 'Failed to delete blog post')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-primary-bg dark:bg-dark-bg">
      <div className="max-w-6xl mx-auto px-8 py-8">

        {message && (
          <div className={`mb-4 p-4 rounded-lg ${
            message.type === 'success' 
              ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' 
              : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
          }`}>
            {message.text}
          </div>
        )}

        <div className="flex space-x-4 mb-8 border-b border-gray-200 dark:border-slate-700">
          {(['about', 'work', 'publications', 'blogs'] as Tab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 font-medium transition ${
                activeTab === tab
                  ? 'border-b-2 border-tech-accent text-tech-accent'
                  : 'text-secondary-text dark:text-zinc-400 hover:text-primary-text dark:hover:text-dark-text'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {loading && <div className="mb-4 text-secondary-text dark:text-zinc-400">Loading...</div>}

        {activeTab === 'about' && (
          <AboutEditor data={aboutData} onChange={setAboutData} onSave={handleAboutSave} loading={loading} />
        )}

        {activeTab === 'work' && (
          <WorkEditor
            items={workItems}
            editing={editingWork}
            onEdit={setEditingWork}
            onSave={handleWorkSave}
            onDelete={handleWorkDelete}
            loading={loading}
          />
        )}

        {activeTab === 'publications' && (
          <PublicationEditor
            items={publications}
            editing={editingPublication}
            onEdit={setEditingPublication}
            onSave={handlePublicationSave}
            onDelete={handlePublicationDelete}
            loading={loading}
          />
        )}

        {activeTab === 'blogs' && (
          <BlogEditor
            items={blogs}
            editing={editingBlog}
            onEdit={setEditingBlog}
            onSave={handleBlogSave}
            onDelete={handleBlogDelete}
            loading={loading}
          />
        )}
      </div>
    </div>
  )
}

// About Editor Component
function AboutEditor({ data, onChange, onSave, loading }: {
  data: AboutData
  onChange: (data: AboutData) => void
  onSave: () => void
  loading: boolean
}) {
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-2 text-primary-text dark:text-dark-text">
          Introduction
        </label>
        <textarea
          value={data.introduction}
          onChange={(e) => onChange({ ...data, introduction: e.target.value })}
          rows={4}
          className="w-full p-3 border border-gray-300 dark:border-slate-600 rounded-lg bg-primary-bg dark:bg-slate-800 text-primary-text dark:text-dark-text"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-2 text-primary-text dark:text-dark-text">
          Specialization
        </label>
        <input
          type="text"
          value={data.specialization}
          onChange={(e) => onChange({ ...data, specialization: e.target.value })}
          className="w-full p-3 border border-gray-300 dark:border-slate-600 rounded-lg bg-primary-bg dark:bg-slate-800 text-primary-text dark:text-dark-text"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-2 text-primary-text dark:text-dark-text">
          Technical Skills
        </label>
        <textarea
          value={data.technicalSkills}
          onChange={(e) => onChange({ ...data, technicalSkills: e.target.value })}
          rows={3}
          className="w-full p-3 border border-gray-300 dark:border-slate-600 rounded-lg bg-primary-bg dark:bg-slate-800 text-primary-text dark:text-dark-text"
        />
      </div>
      <button
        onClick={onSave}
        disabled={loading}
        className="px-6 py-2 bg-tech-accent text-white rounded-lg hover:opacity-90 disabled:opacity-50"
      >
        Save About Section
      </button>
    </div>
  )
}

// Work Editor Component
function WorkEditor({ items, editing, onEdit, onSave, onDelete, loading }: {
  items: WorkItem[]
  editing: WorkItem | null
  onEdit: (item: WorkItem | null) => void
  onSave: (data: Omit<WorkItem, 'id'>) => void
  onDelete: (id: string) => void
  loading: boolean
}) {
  const [formData, setFormData] = useState({ year: '', title: '', description: '', link: '' })

  useEffect(() => {
    if (editing) {
      setFormData({
        year: editing.year,
        title: editing.title,
        description: editing.description,
        link: editing.link || '',
      })
    } else {
      setFormData({ year: '', title: '', description: '', link: '' })
    }
  }, [editing])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
    setFormData({ year: '', title: '', description: '', link: '' })
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4 p-4 border border-gray-200 dark:border-slate-700 rounded-lg">
        <h3 className="text-xl font-semibold text-primary-text dark:text-dark-text">
          {editing ? 'Edit Work Item' : 'Add New Work Item'}
        </h3>
        <input
          type="text"
          placeholder="Year"
          value={formData.year}
          onChange={(e) => setFormData({ ...formData, year: e.target.value })}
          required
          className="w-full p-3 border border-gray-300 dark:border-slate-600 rounded-lg bg-primary-bg dark:bg-slate-800 text-primary-text dark:text-dark-text"
        />
        <input
          type="text"
          placeholder="Title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
          className="w-full p-3 border border-gray-300 dark:border-slate-600 rounded-lg bg-primary-bg dark:bg-slate-800 text-primary-text dark:text-dark-text"
        />
        <textarea
          placeholder="Description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          required
          rows={3}
          className="w-full p-3 border border-gray-300 dark:border-slate-600 rounded-lg bg-primary-bg dark:bg-slate-800 text-primary-text dark:text-dark-text"
        />
        <input
          type="url"
          placeholder="Link (optional)"
          value={formData.link}
          onChange={(e) => setFormData({ ...formData, link: e.target.value })}
          className="w-full p-3 border border-gray-300 dark:border-slate-600 rounded-lg bg-primary-bg dark:bg-slate-800 text-primary-text dark:text-dark-text"
        />
        <div className="flex space-x-2">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-tech-accent text-white rounded-lg hover:opacity-90 disabled:opacity-50"
          >
            {editing ? 'Update' : 'Add'} Work Item
          </button>
          {editing && (
            <button
              type="button"
              onClick={() => onEdit(null)}
              className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:opacity-90"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-primary-text dark:text-dark-text">Work Items</h3>
        {items.map((item) => (
          <div key={item.id} className="p-4 border border-gray-200 dark:border-slate-700 rounded-lg">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-semibold text-primary-text dark:text-dark-text">{item.title}</h4>
                <p className="text-sm text-secondary-text dark:text-zinc-400">{item.year}</p>
                <p className="mt-2 text-secondary-text dark:text-zinc-300">{item.description}</p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => onEdit(item)}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:opacity-90"
                >
                  Edit
                </button>
                <button
                  onClick={() => item.id && onDelete(item.id)}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:opacity-90"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Publication Editor Component
function PublicationEditor({ items, editing, onEdit, onSave, onDelete, loading }: {
  items: Publication[]
  editing: Publication | null
  onEdit: (item: Publication | null) => void
  onSave: (data: Omit<Publication, 'id'>) => void
  onDelete: (id: string) => void
  loading: boolean
}) {
  const [formData, setFormData] = useState({ date: '', title: '', description: '', citation: '', doi: '' })

  useEffect(() => {
    if (editing) {
      setFormData({
        date: editing.date,
        title: editing.title,
        description: editing.description,
        citation: editing.citation || '',
        doi: editing.doi || '',
      })
    } else {
      setFormData({ date: '', title: '', description: '', citation: '', doi: '' })
    }
  }, [editing])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
    setFormData({ date: '', title: '', description: '', citation: '', doi: '' })
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4 p-4 border border-gray-200 dark:border-slate-700 rounded-lg">
        <h3 className="text-xl font-semibold text-primary-text dark:text-dark-text">
          {editing ? 'Edit Publication' : 'Add New Publication'}
        </h3>
        <input
          type="text"
          placeholder="Date (e.g., 2024 - ICELTICs)"
          value={formData.date}
          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          required
          className="w-full p-3 border border-gray-300 dark:border-slate-600 rounded-lg bg-primary-bg dark:bg-slate-800 text-primary-text dark:text-dark-text"
        />
        <input
          type="text"
          placeholder="Title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
          className="w-full p-3 border border-gray-300 dark:border-slate-600 rounded-lg bg-primary-bg dark:bg-slate-800 text-primary-text dark:text-dark-text"
        />
        <textarea
          placeholder="Description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          required
          rows={3}
          className="w-full p-3 border border-gray-300 dark:border-slate-600 rounded-lg bg-primary-bg dark:bg-slate-800 text-primary-text dark:text-dark-text"
        />
        <textarea
          placeholder="Full Citation (optional)"
          value={formData.citation}
          onChange={(e) => setFormData({ ...formData, citation: e.target.value })}
          rows={2}
          className="w-full p-3 border border-gray-300 dark:border-slate-600 rounded-lg bg-primary-bg dark:bg-slate-800 text-primary-text dark:text-dark-text"
        />
        <input
          type="url"
          placeholder="DOI Link (optional)"
          value={formData.doi}
          onChange={(e) => setFormData({ ...formData, doi: e.target.value })}
          className="w-full p-3 border border-gray-300 dark:border-slate-600 rounded-lg bg-primary-bg dark:bg-slate-800 text-primary-text dark:text-dark-text"
        />
        <div className="flex space-x-2">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-tech-accent text-white rounded-lg hover:opacity-90 disabled:opacity-50"
          >
            {editing ? 'Update' : 'Add'} Publication
          </button>
          {editing && (
            <button
              type="button"
              onClick={() => onEdit(null)}
              className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:opacity-90"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-primary-text dark:text-dark-text">Publications</h3>
        {items.map((item) => (
          <div key={item.id} className="p-4 border border-gray-200 dark:border-slate-700 rounded-lg">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-semibold text-primary-text dark:text-dark-text">{item.title}</h4>
                <p className="text-sm text-secondary-text dark:text-zinc-400">{item.date}</p>
                <p className="mt-2 text-secondary-text dark:text-zinc-300">{item.description}</p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => onEdit(item)}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:opacity-90"
                >
                  Edit
                </button>
                <button
                  onClick={() => item.id && onDelete(item.id)}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:opacity-90"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Blog Editor Component
function BlogEditor({ items, editing, onEdit, onSave, onDelete, loading }: {
  items: BlogPost[]
  editing: BlogPost | null
  onEdit: (item: BlogPost | null) => void
  onSave: (data: Omit<BlogPost, 'id'>) => void
  onDelete: (id: string) => void
  loading: boolean
}) {
  const [formData, setFormData] = useState({ date: '', title: '', description: '', content: '', slug: '', tags: '' })
  const [slugPreview, setSlugPreview] = useState('')

  // Get current date and time as default
  const getCurrentDateTime = () => {
    const now = new Date()
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const month = months[now.getMonth()]
    const day = now.getDate()
    const year = now.getFullYear()
    const hours = now.getHours().toString().padStart(2, '0')
    const minutes = now.getMinutes().toString().padStart(2, '0')
    return `${month} ${day}, ${year} ${hours}:${minutes}`
  }

  useEffect(() => {
    if (editing) {
      setFormData({
        date: editing.date,
        title: editing.title,
        description: editing.description,
        content: editing.content,
        slug: editing.slug || '',
        tags: editing.tags ? editing.tags.join(', ') : '',
      })
      setSlugPreview(editing.slug || '')
    } else {
      setFormData({ 
        date: getCurrentDateTime(), 
        title: '', 
        description: '', 
        content: '', 
        slug: '', 
        tags: '' 
      })
      setSlugPreview('')
    }
  }, [editing])

  useEffect(() => {
    // Auto-generate slug preview when title changes
    if (formData.title && !editing) {
      const { generateSlug } = require('@/lib/firebase/services')
      setSlugPreview(generateSlug(formData.title))
    }
  }, [formData.title, editing])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Convert tags string to array
    const tagsArray = formData.tags
      ? formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
      : []
    
    const dataToSave = {
      ...formData,
      tags: tagsArray,
    }
    delete (dataToSave as any).tags // Remove the string version
    
    onSave({
      date: dataToSave.date,
      title: dataToSave.title,
      description: dataToSave.description,
      content: dataToSave.content,
      slug: dataToSave.slug,
      tags: tagsArray,
    })
    setFormData({ date: getCurrentDateTime(), title: '', description: '', content: '', slug: '', tags: '' })
    setSlugPreview('')
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4 p-4 border border-gray-200 dark:border-slate-700 rounded-lg">
        <h3 className="text-xl font-semibold text-primary-text dark:text-dark-text">
          {editing ? 'Edit Blog Post' : 'Add New Blog Post'}
        </h3>
        <input
          type="text"
          placeholder="Date (e.g., Nov 10, 2025 14:30)"
          value={formData.date}
          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          required
          className="w-full p-3 border border-gray-300 dark:border-slate-600 rounded-lg bg-primary-bg dark:bg-slate-800 text-primary-text dark:text-dark-text"
        />
        <input
          type="text"
          placeholder="Tags (comma-separated, e.g., React, Next.js, TypeScript)"
          value={formData.tags}
          onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
          className="w-full p-3 border border-gray-300 dark:border-slate-600 rounded-lg bg-primary-bg dark:bg-slate-800 text-primary-text dark:text-dark-text"
        />
        <input
          type="text"
          placeholder="Title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
          className="w-full p-3 border border-gray-300 dark:border-slate-600 rounded-lg bg-primary-bg dark:bg-slate-800 text-primary-text dark:text-dark-text"
        />
        <textarea
          placeholder="Description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          required
          rows={2}
          className="w-full p-3 border border-gray-300 dark:border-slate-600 rounded-lg bg-primary-bg dark:bg-slate-800 text-primary-text dark:text-dark-text"
        />
        <div>
          <label className="block text-sm font-medium mb-2 text-primary-text dark:text-dark-text">
            Content
          </label>
          <WysiwygEditor
            value={formData.content}
            onChange={(content) => setFormData({ ...formData, content })}
            placeholder="Write your blog content here..."
            disabled={loading}
          />
        </div>
        <div className="flex space-x-2">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-tech-accent text-white rounded-lg hover:opacity-90 disabled:opacity-50"
          >
            {editing ? 'Update' : 'Add'} Blog Post
          </button>
          {editing && (
            <button
              type="button"
              onClick={() => onEdit(null)}
              className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:opacity-90"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-primary-text dark:text-dark-text">Blog Posts</h3>
        {items.map((item) => (
          <div key={item.id} className="p-4 border border-gray-200 dark:border-slate-700 rounded-lg">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-semibold text-primary-text dark:text-dark-text">{item.title}</h4>
                <p className="text-sm text-secondary-text dark:text-zinc-400">{item.date}</p>
                <p className="mt-2 text-secondary-text dark:text-zinc-300">{item.description}</p>
              </div>
              <div className="flex space-x-2">
                <a
                  href={item.slug ? `/blog?slug=${item.slug}` : `/?blogId=${item.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-green-500 text-white rounded hover:opacity-90 flex items-center gap-2"
                  title="View Post"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                  View
                </a>
                <button
                  onClick={() => onEdit(item)}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:opacity-90"
                >
                  Edit
                </button>
                <button
                  onClick={() => item.id && onDelete(item.id)}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:opacity-90"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}



function AdminPanel() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-primary-bg dark:bg-dark-bg flex items-center justify-center">
        <p className="text-secondary-text dark:text-zinc-400">Loading...</p>
      </div>
    }>
      <AdminPanelContent />
    </Suspense>
  )
}

export default function AdminPage() {
  return (
    <AuthGuard>
      <AdminPanel />
    </AuthGuard>
  )
}

