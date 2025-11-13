'use client'

interface BlogPost {
  id: string
  date: string
  title: string
  description: string
}

const blogPosts: BlogPost[] = [
  {
    id: 'runnable_scripts',
    date: 'Nov 10, 2025',
    title: 'Embedding Runnable Code Snippets in a Portfolio.',
    description: 'A look at how to use simple JavaScript to create interactive, live examples on a static page.',
  },
]

interface BlogsSectionProps {
  onBlogClick: (id: string) => void
}

export default function BlogsSection({ onBlogClick }: BlogsSectionProps) {
  return (
    <section className="content-section fade-in active">
      <h2 className="text-5xl font-extrabold mb-12 tracking-tighter">Code & Thoughts.</h2>
      <div className="space-y-8">
        {blogPosts.map((post) => (
          <button
            key={post.id}
            onClick={() => onBlogClick(post.id)}
            className="new-post-link text-left w-full block p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800 transition duration-300 -mx-4"
          >
            <p className="text-sm uppercase tracking-wider text-secondary-text dark:text-zinc-500 mb-1">{post.date}</p>
            <h3 className="text-xl font-semibold">{post.title}</h3>
            <p className="text-secondary-text dark:text-zinc-300">{post.description}</p>
          </button>
        ))}
      </div>
    </section>
  )
}

