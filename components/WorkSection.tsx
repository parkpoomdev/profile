'use client'

interface Project {
  year: string
  title: string
  description: string
}

const projects: Project[] = [
  {
    year: '2023',
    title: 'Telehealth Monitoring System',
    description: 'A system utilizing AI and Data Science to deliver healthcare services to elderly and disabled patients remotely, enhancing accuracy in physical health monitoring.',
  },
  {
    year: '2020',
    title: 'Mobile Workout Planner',
    description: 'A mobile application (dissertation project) for workout planning based on current weather and air quality conditions.',
  },
  {
    year: '2014',
    title: 'Animated UI with WebGL',
    description: 'Cooperative education project at NECTEC focused on developing a 2D animated user interface using WebGL technology.',
  },
]

export default function WorkSection() {
  return (
    <section className="content-section fade-in active">
      <h2 className="text-5xl font-extrabold mb-12 tracking-tighter">Selected Projects.</h2>
      <div className="space-y-16">
        {projects.map((project, index) => (
          <article key={index} className="flex flex-col sm:flex-row gap-8">
            <div className="w-full sm:w-1/3">
              <p className="text-sm uppercase tracking-wider text-secondary-text dark:text-zinc-500">{project.year}</p>
              <h3 className="text-2xl font-semibold mt-1">{project.title}</h3>
            </div>
            <div className="w-full sm:w-2/3 text-lg space-y-4 text-secondary-text dark:text-zinc-300">
              <p>{project.description}</p>
              <a href="#" className="block text-sm font-medium underline text-tech-accent hover:no-underline">
                View Project Details &rarr;
              </a>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

