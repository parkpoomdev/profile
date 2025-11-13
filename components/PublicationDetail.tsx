'use client'

interface PublicationData {
  title: string
  date: string
  content: string
}

const publicationData: Record<string, PublicationData> = {
  iceltics2024: {
    title: 'Data analytics and visualization in bimanual rehabilitation monitoring systems: A user-centered design approach to healthcare professionals decision support.',
    date: '2024 - ICELTICs',
    content: `
      <p class="mb-6"><strong>Full Citation:</strong> Wisedsri, P., Anutariya, C., Sujarae, A., Vachalathiti, R., & Bovonsunthonchai, S. (2024). Data analytics and visualization in bimanual rehabilitation monitoring systems: A user-centered design approach to healthcare professionals decision support. <em>Proceedings of the 2024 International Conference on Electrical Engineering and Informatics (ICELTICs).</em></p>
      
      <a href="https://doi.org/10.1109/ICELTICs62730.2024.10776145" target="_blank" rel="noopener noreferrer"
         class="inline-block text-lg font-semibold text-tech-accent hover:underline">
         View Publication (DOI) &rarr;
      </a>
    `,
  },
  tencon2023: {
    title: 'Data Analytics and Visualisation System for Fall Detection for Elderly and Disabled People.',
    date: '2023 - TENCON',
    content: `
      <p class="mb-6"><strong>Full Citation:</strong> P. Wisedsri and C. Anutariya, "Data Analytics and Visualisation System for Fall Detection for Elderly and Disabled People," <em>TENCON 2023 - 2023 IEEE Region 10 Conference (TENCON)</em>, Chiang Mai, Thailand, 2023, pp. 1315-1320.</p>
      
      <a href="https://doi.org/10.1109/TENCON58879.2023.10322370" target="_blank" rel="noopener noreferrer"
         class="inline-block text-lg font-semibold text-tech-accent hover:underline">
         View Publication (DOI) &rarr;
      </a>
    `,
  },
}

interface PublicationDetailProps {
  publicationId: string
  onBack: () => void
}

export default function PublicationDetail({ publicationId, onBack }: PublicationDetailProps) {
  const publication = publicationData[publicationId]

  if (!publication) {
    return (
      <section className="content-section fade-in active">
        <p className="text-xl text-red-500">Publication not found.</p>
      </section>
    )
  }

  return (
    <section className="content-section fade-in active">
      <button
        onClick={onBack}
        className="text-tech-accent mb-8 flex items-center hover:underline transition duration-200"
      >
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
        </svg>
        Back to all Publications
      </button>

      <div className="max-w-3xl mx-auto">
        <p className="text-sm uppercase tracking-wider text-secondary-text dark:text-zinc-500 mb-2">{publication.date}</p>
        <h1 className="text-5xl font-extrabold mb-10 tracking-tighter">{publication.title}</h1>
        <div
          className="text-lg space-y-4 text-secondary-text dark:text-zinc-300"
          dangerouslySetInnerHTML={{ __html: publication.content }}
        />
      </div>
    </section>
  )
}

