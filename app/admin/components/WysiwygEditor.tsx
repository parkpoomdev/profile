'use client'

import { useRef } from 'react'
import dynamic from 'next/dynamic'
import 'react-quill/dist/quill.snow.css'

// Dynamically import ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill'), { 
  ssr: false,
  loading: () => <div className="h-[300px] border border-gray-300 dark:border-slate-600 rounded-lg bg-primary-bg dark:bg-slate-800 flex items-center justify-center text-secondary-text dark:text-zinc-400">Loading editor...</div>
})

interface WysiwygEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  disabled?: boolean
}

export default function WysiwygEditor({ value, onChange, placeholder, disabled }: WysiwygEditorProps) {
  const quillRef = useRef<any>(null)

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      [{ 'font': [] }],
      [{ 'size': [] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }, { 'indent': '-1'}, { 'indent': '+1' }],
      [{ 'script': 'sub'}, { 'script': 'super' }],
      [{ 'direction': 'rtl' }],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'align': [] }],
      ['link', 'image', 'video'],
      ['clean']
    ],
  }

  const formats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'script',
    'direction',
    'color', 'background',
    'align',
    'link', 'image', 'video'
  ]

  return (
    <div className="wysiwyg-editor">
      <ReactQuill
        ref={quillRef}
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
        readOnly={disabled}
        className="bg-primary-bg dark:bg-slate-800"
        style={{
          backgroundColor: 'transparent',
        }}
      />
      <style jsx global>{`
        .wysiwyg-editor {
          border: 1px solid rgb(209, 213, 219);
          border-radius: 0.5rem;
          overflow: hidden;
        }

        .dark .wysiwyg-editor {
          border-color: rgb(71, 85, 105);
        }

        .wysiwyg-editor .ql-container {
          font-family: inherit;
          font-size: 1rem;
          min-height: 300px;
          border: none;
          border-top: 1px solid rgb(209, 213, 219);
        }
        
        .dark .wysiwyg-editor .ql-container {
          border-top-color: rgb(71, 85, 105);
          background-color: rgb(30, 41, 59);
          color: rgb(241, 245, 249);
        }

        .wysiwyg-editor .ql-toolbar {
          border: none;
          border-bottom: 1px solid rgb(209, 213, 219);
          background-color: rgb(249, 250, 251);
          padding: 12px;
        }

        .dark .wysiwyg-editor .ql-toolbar {
          border-bottom-color: rgb(71, 85, 105);
          background-color: rgb(30, 41, 59);
        }

        .wysiwyg-editor .ql-toolbar .ql-stroke {
          stroke: rgb(75, 85, 99);
        }

        .dark .wysiwyg-editor .ql-toolbar .ql-stroke {
          stroke: rgb(203, 213, 225);
        }

        .wysiwyg-editor .ql-toolbar .ql-fill {
          fill: rgb(75, 85, 99);
        }

        .dark .wysiwyg-editor .ql-toolbar .ql-fill {
          fill: rgb(203, 213, 225);
        }

        .wysiwyg-editor .ql-toolbar button:hover,
        .wysiwyg-editor .ql-toolbar button:focus,
        .wysiwyg-editor .ql-toolbar button.ql-active {
          color: rgb(59, 130, 246);
        }

        .dark .wysiwyg-editor .ql-toolbar button:hover,
        .dark .wysiwyg-editor .ql-toolbar button:focus,
        .dark .wysiwyg-editor .ql-toolbar button.ql-active {
          color: rgb(96, 165, 250);
        }

        .wysiwyg-editor .ql-toolbar .ql-picker-label {
          color: rgb(75, 85, 99);
        }

        .dark .wysiwyg-editor .ql-toolbar .ql-picker-label {
          color: rgb(203, 213, 225);
        }

        .wysiwyg-editor .ql-editor {
          min-height: 300px;
          color: inherit;
        }

        .wysiwyg-editor .ql-editor.ql-blank::before {
          color: rgb(156, 163, 175);
          font-style: normal;
        }

        .dark .wysiwyg-editor .ql-editor.ql-blank::before {
          color: rgb(100, 116, 139);
        }

        .wysiwyg-editor .ql-editor p,
        .wysiwyg-editor .ql-editor ol,
        .wysiwyg-editor .ql-editor ul,
        .wysiwyg-editor .ql-editor pre,
        .wysiwyg-editor .ql-editor blockquote,
        .wysiwyg-editor .ql-editor h1,
        .wysiwyg-editor .ql-editor h2,
        .wysiwyg-editor .ql-editor h3,
        .wysiwyg-editor .ql-editor h4,
        .wysiwyg-editor .ql-editor h5,
        .wysiwyg-editor .ql-editor h6 {
          color: inherit;
        }
      `}</style>
    </div>
  )
}

