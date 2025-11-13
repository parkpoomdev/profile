# Minimal Portfolio | Parkpoom Wisedsri

A modern, minimal portfolio website built with Next.js, React, and Tailwind CSS. This portfolio showcases professional experience, projects, publications, and blog posts with a clean, tech-focused aesthetic.

## ✨ Features

- **Dark Mode Support** - Theme persistence with system preference detection
- **Responsive Design** - Optimized for all screen sizes
- **Smooth Navigation** - Section-based navigation with fade-in animations
- **Interactive Components** - Live code snippets and interactive demos
- **Professional Timeline** - Visual timeline of work experience
- **Publications Section** - Academic publications with detailed views
- **Blog Section** - Code & thoughts with interactive examples
- **Custom Styling** - Tailored color scheme with tech accent colors

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm

### Installation

1. Clone the repository or navigate to the project directory:
```bash
cd port
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the portfolio.

## 📦 Build for Production

Create an optimized production build:

```bash
npm run build
npm start
```

Or deploy to Vercel (recommended for Next.js):

```bash
npm install -g vercel
vercel
```

## 🛠️ Tech Stack

- **Next.js 14** - React framework with App Router
- **React 18** - UI library
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **next-themes** - Dark mode theme management

## 📁 Project Structure

```
port/
├── app/
│   ├── layout.tsx          # Root layout with theme provider
│   ├── page.tsx            # Main page with navigation logic
│   ├── globals.css         # Global styles and Tailwind directives
│   └── providers/
│       └── ThemeProvider.tsx  # Theme context provider
├── components/
│   ├── Header.tsx          # Navigation and theme toggle
│   ├── AboutSection.tsx    # About section with timeline
│   ├── WorkSection.tsx     # Projects showcase
│   ├── PublicationsSection.tsx  # Publications list
│   ├── PublicationDetail.tsx    # Publication detail view
│   ├── BlogsSection.tsx    # Blog posts list
│   ├── BlogDetail.tsx      # Blog detail with interactive components
│   └── Footer.tsx          # Footer component
├── public/                 # Static assets
├── package.json            # Dependencies and scripts
├── tailwind.config.js      # Tailwind configuration
├── tsconfig.json           # TypeScript configuration
└── next.config.js          # Next.js configuration
```

## 🎨 Customization

### Updating Personal Information

1. **About Section** - Edit `components/AboutSection.tsx`:
   - Update the introduction text
   - Modify timeline items in the `timelineData` array

2. **Projects** - Edit `components/WorkSection.tsx`:
   - Update the `projects` array with your projects

3. **Publications** - Edit `components/PublicationsSection.tsx` and `components/PublicationDetail.tsx`:
   - Add/remove publications in the `publications` array
   - Update publication details in `publicationData` object

4. **Blog Posts** - Edit `components/BlogsSection.tsx` and `components/BlogDetail.tsx`:
   - Add/remove blog posts in the `blogPosts` array
   - Update blog content in `blogData` object

5. **Header** - Edit `components/Header.tsx`:
   - Update name and navigation items

### Customizing Colors

Edit `tailwind.config.js` to customize the color scheme:
- `primary-text` - Main text color (light mode)
- `secondary-text` - Secondary text color
- `primary-bg` - Background color (light mode)
- `dark-text` - Main text color (dark mode)
- `dark-bg` - Background color (dark mode)
- `tech-accent` - Accent color (used for highlights and links)

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## 🌐 Deployment

This Next.js app can be deployed on:

- **Vercel** (recommended) - Zero-config deployment
- **Netlify** - Great for static exports
- **AWS Amplify** - Full-stack deployment
- **Any Node.js hosting** - Traditional server deployment

## 📄 License

This project is open source and available for personal use.

## 👤 Author

**Parkpoom Wisedsri**
- Doctoral Student
- Specialized in Data Analytics and Visualization for Telehealth Applications
- Based in Pathum Thani, Thailand

---

*Crafted with Simplicity*

