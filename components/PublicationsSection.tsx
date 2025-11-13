'use client'

interface Publication {
  id: string
  date: string
  title: string
  description: string
}

const publications: Publication[] = [
  {
    id: 'iceltics2024',
    date: '2024 (ICELTICs)',
    title: 'Data analytics and visualization in bimanual rehabilitation monitoring systems...',
    description: 'A user-centered design approach to healthcare professionals decision support.',
  },
  {
    id: 'tencon2023',
    date: '2023 (TENCON)',
    title: 'Data Analytics and Visualisation System for Fall Detection for Elderly and Disabled People.',
    description: 'Published in TENCON 2023 - 2023 IEEE Region 10 Conference.',
  },
]

interface PublicationsSectionProps {
  onPublicationClick: (id: string) => void
}

export default function PublicationsSection({ onPublicationClick }: PublicationsSectionProps) {
  return (
    <section className="content-section fade-in active">
      <h2 className="text-5xl font-extrabold mb-12 tracking-tighter">Publications.</h2>
      <div className="space-y-8">
        {publications.map((pub) => (
          <button
            key={pub.id}
            onClick={() => onPublicationClick(pub.id)}
            className="post-link text-left w-full block p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800 transition duration-300 -mx-4"
          >
            <p className="text-sm uppercase tracking-wider text-secondary-text dark:text-zinc-500 mb-1">{pub.date}</p>
            <h3 className="text-xl font-semibold">{pub.title}</h3>
            <p className="text-secondary-text dark:text-zinc-300">{pub.description}</p>
          </button>
        ))}
      </div>
    </section>
  )
}

