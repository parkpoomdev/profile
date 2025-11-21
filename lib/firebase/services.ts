import { db, ref, set, get, push, remove, update } from './config'

const getDb = () => {
  if (!db) {
    throw new Error('Firebase Realtime Database is not initialized. Make sure you are running this code in the browser.')
  }
  return db
}

// Types
export interface AboutData {
  id?: string
  introduction: string
  specialization: string
  technicalSkills: string
}

export interface WorkItem {
  id?: string
  year: string
  title: string
  description: string
  link?: string
}

export interface Publication {
  id?: string
  date: string
  title: string
  description: string
  citation?: string
  doi?: string
}

export interface BlogPost {
  id?: string
  date: string
  title: string
  description: string
  content: string
  slug?: string
  tags?: string[]
}

// Utility function to generate URL-friendly slug from title
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces, underscores, and multiple hyphens with single hyphen
    .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
}

// Ensure unique slug by appending number if needed
export async function generateUniqueSlug(title: string, excludeId?: string): Promise<string> {
  const baseSlug = generateSlug(title)
  const allBlogs = await blogService.getAll()
  let slug = baseSlug
  let counter = 1

  while (allBlogs.some(blog => blog.slug === slug && blog.id !== excludeId)) {
    slug = `${baseSlug}-${counter}`
    counter++
  }

  return slug
}

// About CRUD
export const aboutService = {
  get: async (): Promise<AboutData | null> => {
    const dbRef = ref(getDb(), 'about/profile')
    const snapshot = await get(dbRef)
    if (snapshot.exists()) {
      return { id: 'profile', ...snapshot.val() } as AboutData
    }
    return null
  },
  
  create: async (data: AboutData): Promise<void> => {
    const dbRef = ref(getDb(), 'about/profile')
    await set(dbRef, data)
  },
  
  update: async (data: Partial<AboutData>): Promise<void> => {
    const dbRef = ref(getDb(), 'about/profile')
    await update(dbRef, data)
  },
}

// Work CRUD
export const workService = {
  getAll: async (): Promise<WorkItem[]> => {
    const dbRef = ref(getDb(), 'work')
    const snapshot = await get(dbRef)
    if (snapshot.exists()) {
      const data = snapshot.val()
      return Object.keys(data).map(id => ({
        id,
        ...data[id]
      })).sort((a, b) => parseInt(b.year) - parseInt(a.year)) as WorkItem[]
    }
    return []
  },
  
  get: async (id: string): Promise<WorkItem | null> => {
    const dbRef = ref(getDb(), `work/${id}`)
    const snapshot = await get(dbRef)
    if (snapshot.exists()) {
      return { id, ...snapshot.val() } as WorkItem
    }
    return null
  },
  
  create: async (data: Omit<WorkItem, 'id'>): Promise<string> => {
    const dbRef = ref(getDb(), 'work')
    const newRef = push(dbRef)
    await set(newRef, data)
    return newRef.key || ''
  },
  
  update: async (id: string, data: Partial<WorkItem>): Promise<void> => {
    const dbRef = ref(getDb(), `work/${id}`)
    await update(dbRef, data)
  },
  
  delete: async (id: string): Promise<void> => {
    const dbRef = ref(getDb(), `work/${id}`)
    await remove(dbRef)
  },
}

// Publications CRUD
export const publicationService = {
  getAll: async (): Promise<Publication[]> => {
    const dbRef = ref(getDb(), 'publications')
    const snapshot = await get(dbRef)
    if (snapshot.exists()) {
      const data = snapshot.val()
      return Object.keys(data).map(id => ({
        id,
        ...data[id]
      })).sort((a, b) => b.date.localeCompare(a.date)) as Publication[]
    }
    return []
  },
  
  get: async (id: string): Promise<Publication | null> => {
    const dbRef = ref(getDb(), `publications/${id}`)
    const snapshot = await get(dbRef)
    if (snapshot.exists()) {
      return { id, ...snapshot.val() } as Publication
    }
    return null
  },
  
  create: async (data: Omit<Publication, 'id'>): Promise<string> => {
    const dbRef = ref(getDb(), 'publications')
    const newRef = push(dbRef)
    await set(newRef, data)
    return newRef.key || ''
  },
  
  update: async (id: string, data: Partial<Publication>): Promise<void> => {
    const dbRef = ref(getDb(), `publications/${id}`)
    await update(dbRef, data)
  },
  
  delete: async (id: string): Promise<void> => {
    const dbRef = ref(getDb(), `publications/${id}`)
    await remove(dbRef)
  },
}

// Blogs CRUD
export const blogService = {
  getAll: async (): Promise<BlogPost[]> => {
    const dbRef = ref(getDb(), 'blogs')
    const snapshot = await get(dbRef)
    if (snapshot.exists()) {
      const data = snapshot.val()
      return Object.keys(data).map(id => ({
        id,
        ...data[id]
      })).sort((a, b) => b.date.localeCompare(a.date)) as BlogPost[]
    }
    return []
  },
  
  get: async (id: string): Promise<BlogPost | null> => {
    const dbRef = ref(getDb(), `blogs/${id}`)
    const snapshot = await get(dbRef)
    if (snapshot.exists()) {
      return { id, ...snapshot.val() } as BlogPost
    }
    return null
  },

  getBySlug: async (slug: string): Promise<BlogPost | null> => {
    const allBlogs = await blogService.getAll()
    return allBlogs.find(blog => blog.slug === slug) || null
  },
  
  create: async (data: Omit<BlogPost, 'id'>): Promise<string> => {
    const dbRef = ref(getDb(), 'blogs')
    const newRef = push(dbRef)
    await set(newRef, data)
    return newRef.key || ''
  },
  
  update: async (id: string, data: Partial<BlogPost>): Promise<void> => {
    const dbRef = ref(getDb(), `blogs/${id}`)
    await update(dbRef, data)
  },
  
  delete: async (id: string): Promise<void> => {
    const dbRef = ref(getDb(), `blogs/${id}`)
    await remove(dbRef)
  },
}

