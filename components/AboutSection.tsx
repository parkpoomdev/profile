'use client'

interface TimelineItem {
  id: string
  period: string
  title: string
  organization: string
  description?: string
}

const timelineData: TimelineItem[] = [
  {
    id: 'ra-ait',
    period: 'May 2023 - Present',
    title: 'Research Assistant (ICT / AI / Data Science)',
    organization: 'Asian Institute of Technology | Thailand',
    description: 'Working on Telehealth Monitoring and Assistive Systems for Elderly and Disabled People.',
  },
  {
    id: 'ta-chula',
    period: 'February 2023',
    title: 'Teacher Assistant (BAScii)',
    organization: 'Chulalongkorn University | Thailand',
  },
  {
    id: 'pa-brunel',
    period: 'Aug 2022 - Oct 2022',
    title: 'Project Assistant (Web Developer OT Replacement)',
    organization: 'Brunel University London | United Kingdom',
  },
  {
    id: 'gta-brunel',
    period: 'Sep 2022 - Nov 2022',
    title: 'Graduate Teaching Assistant (GTA)',
    organization: 'Brunel University London | United Kingdom',
  },
  {
    id: 'reslife-brunel',
    period: 'Sep 2022 - Nov 2022',
    title: 'ResLife Ambassador',
    organization: 'Brunel University London | United Kingdom',
  },
  {
    id: 'lab-suranaree',
    period: 'Aug 2014 - Present',
    title: 'Laboratory Instructor (Study Leave)',
    organization: 'Suranaree University of Technology | Thailand',
  },
]

export default function AboutSection() {
  return (
    <section className="content-section fade-in active">
      <h2 className="text-5xl font-extrabold mb-10 tracking-tighter">Hello, I&apos;m Parkpoom Wisedsri.</h2>
      <div className="text-lg space-y-6 max-w-2xl text-secondary-text dark:text-zinc-300">
        <p>
          I am a doctoral student focused on developing digital systems that are purposeful, efficient, and visually coherent. My work bridges computational creativity with intuitive interface design, emphasizing clarity, usability, and data-driven insight.
        </p>
        <p>
          Currently based in Pathum Thani, Thailand, I aim to specialise in <span className="text-tech-accent font-semibold">Data Analytics and Visualisation in Information Technology</span>.
        </p>
        <p>
          My technical expertise encompasses web application development utilising Python, Node.js, and JavaScript, database management with SQL, and mobile application development with Java for Android platforms.
        </p>
      </div>

      <div className="mt-12">
        <h3 className="text-3xl font-bold mb-10 tracking-tight">Professional Timeline</h3>
        
        <ol className="relative border-s border-gray-300 dark:border-gray-700">
          {timelineData.map((item, index) => (
            <li
              key={item.id}
              className={`ms-6 cursor-pointer p-2 -m-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition duration-200 ${
                index < timelineData.length - 1 ? 'mb-10' : ''
              }`}
            >
              <div className="absolute w-4 h-4 bg-tech-accent rounded-full mt-1.5 -start-2.5 border-4 border-primary-bg dark:border-dark-bg"></div>
              <p className="mb-1 text-sm font-normal leading-none text-tech-accent">{item.period}</p>
              <h4 className="text-xl font-semibold text-primary-text dark:text-dark-text mt-1">{item.title}</h4>
              <p className="text-base font-normal text-secondary-text dark:text-zinc-400">{item.organization}</p>
              {item.description && (
                <p className="text-sm mt-2 font-normal text-secondary-text dark:text-zinc-400">{item.description}</p>
              )}
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

