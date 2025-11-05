// Media assets base URL
// Dynamically set based on environment and location

/**
 * Get the media base URL based on environment
 * Priority:
 * 1. Environment variable (VITE_MEDIA_BASE_URL)
 * 2. Auto-detect based on hostname (localhost = local, else = CDN)
 * 3. Fallback to local for development, CDN for production
 */
function getMediaBaseUrl() {
  // Check if environment variable is set (highest priority)
  if (import.meta.env.VITE_MEDIA_BASE_URL) {
    return import.meta.env.VITE_MEDIA_BASE_URL;
  }

  // Auto-detect based on hostname
  const hostname = typeof window !== 'undefined' ? window.location.hostname : '';
  const isLocalhost = hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '';

  // Check if running on GitHub Pages
  const isGitHubPages = hostname.includes('github.io') || hostname.includes('github.com');

  // Development mode or localhost: use local files
  if (import.meta.env.DEV || isLocalhost) {
    return "/";
  }

  // Production on GitHub Pages: use GitHub Pages URL
  if (isGitHubPages) {
    // Extract repo name from hostname or use default
    const repoName = hostname.includes('github.io') 
      ? hostname.split('.')[0] 
      : 'steven-portfolio-ghpages';
    return `https://${hostname}/`;
  }

  // Production build: use jsDelivr CDN (fastest)
  return "https://cdn.jsdelivr.net/gh/StevenNassef/steven-portfolio-ghpages@main/public/";
}

export const MEDIA_BASE_URL = getMediaBaseUrl();

// === PAID OPTIONS ===
// - Cloudflare R2: Free tier available (10GB storage, 1M reads/month)
// - AWS S3: Pay-as-you-go
// - Google Cloud Storage: Pay-as-you-go

// Helper function to build full media URLs
export function getMediaUrl(path) {
  if (!path) return "";
  // If path already starts with http:// or https://, return as-is
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }
  // Remove leading slash if present, then add base URL
  const cleanPath = path.startsWith("/") ? path.slice(1) : path;
  return MEDIA_BASE_URL.endsWith("/") 
    ? `${MEDIA_BASE_URL}${cleanPath}`
    : `${MEDIA_BASE_URL}/${cleanPath}`;
}

