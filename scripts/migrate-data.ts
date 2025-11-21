/**
 * Migration script to add existing hardcoded data to Firebase
 * Run this once to populate your Firebase database with the original content
 * 
 * Usage: 
 * 1. Make sure your .env.local file is configured
 * 2. Run: npx ts-node scripts/migrate-data.ts
 * 
 * Or use this in the browser console at /admin page
 */

import { aboutService, workService, publicationService, blogService } from '../lib/firebase/services'

async function migrateData() {
  console.log('Starting data migration...')

  try {
    // 1. Migrate About data
    console.log('Migrating About data...')
    await aboutService.update({
      introduction: 'I am a doctoral student focused on developing digital systems that are purposeful, efficient, and visually coherent. My work bridges computational creativity with intuitive interface design, emphasizing clarity, usability, and data-driven insight.',
      specialization: 'Data Analytics and Visualisation in Information Technology',
      technicalSkills: 'My technical expertise encompasses web application development utilising Python, Node.js, and JavaScript, database management with SQL, and mobile application development with Java for Android platforms.',
    })
    console.log('✅ About data migrated')

    // 2. Migrate Work items
    console.log('Migrating Work items...')
    const workItems = [
      {
        year: '2023',
        title: 'Telehealth Monitoring System',
        description: 'A system utilizing AI and Data Science to deliver healthcare services to elderly and disabled patients remotely, enhancing accuracy in physical health monitoring.',
        link: '#',
      },
      {
        year: '2020',
        title: 'Mobile Workout Planner',
        description: 'A mobile application (dissertation project) for workout planning based on current weather and air quality conditions.',
        link: '#',
      },
      {
        year: '2014',
        title: 'Animated UI with WebGL',
        description: 'Cooperative education project at NECTEC focused on developing a 2D animated user interface using WebGL technology.',
        link: '#',
      },
    ]

    for (const item of workItems) {
      await workService.create(item)
    }
    console.log('✅ Work items migrated')

    // 3. Migrate Publications
    console.log('Migrating Publications...')
    const publications = [
      {
        date: '2024 (ICELTICs)',
        title: 'Data analytics and visualization in bimanual rehabilitation monitoring systems: A user-centered design approach to healthcare professionals decision support.',
        description: 'A user-centered design approach to healthcare professionals decision support.',
        citation: 'Wisedsri, P., Anutariya, C., Sujarae, A., Vachalathiti, R., & Bovonsunthonchai, S. (2024). Data analytics and visualization in bimanual rehabilitation monitoring systems: A user-centered design approach to healthcare professionals decision support. Proceedings of the 2024 International Conference on Electrical Engineering and Informatics (ICELTICs).',
        doi: 'https://doi.org/10.1109/ICELTICs62730.2024.10776145',
      },
      {
        date: '2023 (TENCON)',
        title: 'Data Analytics and Visualisation System for Fall Detection for Elderly and Disabled People.',
        description: 'Published in TENCON 2023 - 2023 IEEE Region 10 Conference.',
        citation: 'P. Wisedsri and C. Anutariya, "Data Analytics and Visualisation System for Fall Detection for Elderly and Disabled People," TENCON 2023 - 2023 IEEE Region 10 Conference (TENCON), Chiang Mai, Thailand, 2023, pp. 1315-1320.',
        doi: 'https://doi.org/10.1109/TENCON58879.2023.10322370',
      },
    ]

    for (const pub of publications) {
      await publicationService.create(pub)
    }
    console.log('✅ Publications migrated')

    // 4. Migrate Blog posts
    console.log('Migrating Blog posts...')
    const blogs = [
      {
        date: 'Nov 10, 2025',
        title: 'Embedding Runnable Code Snippets in a Portfolio.',
        description: 'A look at how to use simple JavaScript to create interactive, live examples on a static page.',
        content: `
          <p class="mb-6">One of the best ways to showcase technical skill is to demonstrate it live. Instead of just showing code, why not make it runnable? This portfolio uses simple, isolated JavaScript functions to power interactive components right inside a "blog post."</p>
          <p class="mb-8">This approach is lightweight, doesn't require a complex backend, and provides immediate value to the user. Below is the live currency converter example that was featured in a previous version of this site.</p>
          
          <h3 class="text-3xl font-semibold mb-6 pt-4 border-t border-gray-100 dark:border-slate-800">Live Code Snippet: Currency Converter</h3>
          <div data-converter-placeholder></div>
          
          <h3 class="text-2xl font-semibold mt-10 mb-4">Conclusion</h3>
          <p class="text-secondary-text dark:text-zinc-300">This method proves that a "static" portfolio can still be a dynamic and engaging experience.</p>
        `,
      },
    ]

    for (const blog of blogs) {
      await blogService.create(blog)
    }
    console.log('✅ Blog posts migrated')

    console.log('🎉 All data migration completed successfully!')
  } catch (error) {
    console.error('❌ Migration failed:', error)
    throw error
  }
}

// Run migration if this file is executed directly
if (typeof window === 'undefined') {
  // Node.js environment
  migrateData()
    .then(() => {
      console.log('Migration script completed')
      process.exit(0)
    })
    .catch((error) => {
      console.error('Migration script failed:', error)
      process.exit(1)
    })
}

export { migrateData }

