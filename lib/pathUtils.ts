/**
 * Get the base path for the application
 * Detects base path from current window location
 * In production (GitHub Pages), this is '/profile'
 * In development, this is empty string
 */
export function getBasePath(): string {
  if (typeof window === 'undefined') {
    return ''
  }
  
  // Detect base path from current location
  const pathname = window.location.pathname
  if (pathname.startsWith('/profile')) {
    return '/profile'
  }
  return ''
}

/**
 * Create a full path with basePath included
 * @param path - The path to append (should start with /)
 * @returns Full path with basePath
 */
export function createFullPath(path: string): string {
  const basePath = getBasePath()
  // If path is just '/', return basePath + '/' or just '/'
  if (path === '/') {
    return basePath || '/'
  }
  // Ensure path starts with /
  const cleanPath = path.startsWith('/') ? path : `/${path}`
  return `${basePath}${cleanPath}`
}

