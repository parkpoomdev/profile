'use client'

import { useState, useEffect } from 'react'
import { workService } from '@/lib/firebase/services'
import type { WorkItem } from '@/lib/firebase/services'

export default function WorkSection() {
  const [projects, setProjects] = useState<WorkItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const items = await workService.getAll()
        setProjects(items)
      } catch (error) {
        console.error('Failed to load work items:', error)
      } finally {
        setLoading(false)
      }
    }
    loadProjects()
  }, [])

  return (
    <section className="content-section fade-in active">
      <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-8 sm:mb-10 md:mb-12 tracking-tighter">Selected Projects.</h2>
      {loading ? (
        <p className="text-secondary-text dark:text-zinc-400">Loading...</p>
      ) : projects.length === 0 ? (
        <p className="text-secondary-text dark:text-zinc-400">No projects available.</p>
      ) : (
        <div className="space-y-10 sm:space-y-12 md:space-y-16">
          {projects.map((project) => (
            <article key={project.id} className="flex flex-col sm:flex-row gap-4 sm:gap-6 md:gap-8">
              <div className="w-full sm:w-1/3">
                <p className="text-sm uppercase tracking-wider text-secondary-text dark:text-zinc-500">{project.year}</p>
                <h3 className="text-xl sm:text-2xl font-semibold mt-1">{project.title}</h3>
              </div>
              <div className="w-full sm:w-2/3 text-base sm:text-lg space-y-3 sm:space-y-4 text-secondary-text dark:text-zinc-300">
                <p>{project.description}</p>
                {project.link && (
                  <a href={project.link} target="_blank" rel="noopener noreferrer" className="block text-sm font-medium underline text-tech-accent hover:no-underline">
                    View Project Details &rarr;
                  </a>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}

