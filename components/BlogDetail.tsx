'use client'

import { useState } from 'react'

interface BlogData {
  title: string
  date: string
  content: string
}

const blogData: Record<string, BlogData> = {
  runnable_scripts: {
    title: 'Embedding Runnable Code Snippets in a Portfolio.',
    date: 'Nov 10, 2025',
    content: `
      <p class="mb-6">One of the best ways to showcase technical skill is to demonstrate it live. Instead of just showing code, why not make it runnable? This portfolio uses simple, isolated JavaScript functions to power interactive components right inside a "blog post."</p>
      <p class="mb-8">This approach is lightweight, doesn't require a complex backend, and provides immediate value to the user. Below is the live currency converter example that was featured in a previous version of this site.</p>
      
      <h3 class="text-3xl font-semibold mb-6 pt-4 border-t border-gray-100 dark:border-slate-800">Live Code Snippet: Currency Converter</h3>
      <div data-converter-placeholder></div>
      
      <h3 class="text-2xl font-semibold mt-10 mb-4">Conclusion</h3>
      <p class="text-secondary-text dark:text-zinc-300">This method proves that a "static" portfolio can still be a dynamic and engaging experience.</p>
    `,
  },
}

interface BlogDetailProps {
  blogId: string
  onBack: () => void
}

function CurrencyConverter() {
  const [usd, setUsd] = useState(100)
  const rate = 0.92
  const eur = (usd * rate).toFixed(2)

  return (
    <div className="space-y-4">
      <h4 className="text-xl font-bold text-tech-accent mb-4">USD to EUR Converter</h4>
      <input
        type="number"
        value={usd}
        onChange={(e) => setUsd(parseFloat(e.target.value) || 0)}
        placeholder="Enter USD amount"
        className="w-full p-3 rounded-md border border-gray-300 dark:border-slate-600 dark:bg-slate-900 text-primary-text dark:text-dark-text focus:ring-tech-accent focus:border-tech-accent transition"
      />
      <div className="flex justify-between items-center text-secondary-text dark:text-zinc-400">
        <span className="text-lg">Result:</span>
        <span className="text-2xl font-extrabold text-primary-text dark:text-dark-text">€{eur}</span>
      </div>
      <p className="text-xs text-secondary-text dark:text-zinc-500">Exchange Rate (USD to EUR): 0.92</p>
    </div>
  )
}

export default function BlogDetail({ blogId, onBack }: BlogDetailProps) {
  const blog = blogData[blogId]

  if (!blog) {
    return (
      <section className="content-section fade-in active">
        <p className="text-xl text-red-500">Post not found.</p>
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
        Back to all Blogs
      </button>

      <div className="max-w-3xl mx-auto">
        <p className="text-sm uppercase tracking-wider text-secondary-text dark:text-zinc-500 mb-2">{blog.date}</p>
        <h1 className="text-5xl font-extrabold mb-10 tracking-tighter">{blog.title}</h1>
        <div className="text-lg space-y-4 text-secondary-text dark:text-zinc-300">
          {blogId === 'runnable_scripts' ? (
            <>
              <div dangerouslySetInnerHTML={{ __html: blog.content.split('<div data-converter-placeholder></div>')[0] }} />
              <div className="p-6 rounded-xl shadow-lg bg-gray-50 dark:bg-slate-800/70 border border-gray-200 dark:border-slate-700">
                <CurrencyConverter />
              </div>
              <div dangerouslySetInnerHTML={{ __html: blog.content.split('<div data-converter-placeholder></div>')[1] }} />
            </>
          ) : (
            <div dangerouslySetInnerHTML={{ __html: blog.content }} />
          )}
        </div>
      </div>
    </section>
  )
}

