// Media assets base URL
// Change this to point to your CDN, cloud storage, or other hosting service

// === FREE OPTIONS (Using Same Repo) ===

// Option 1: GitHub Raw from same repo (FREE)
// Your assets are in public/projects/ folder
// Uncomment and use this for GitHub Raw:
// export const MEDIA_BASE_URL = "https://raw.githubusercontent.com/StevenNassef/steven-portfolio-ghpages/main/public/";

// Option 2: jsDelivr CDN from same repo (Fastest - FREE, Recommended)
// Your assets are in public/projects/ folder
// Uncomment and use this for jsDelivr (fastest global CDN):
// export const MEDIA_BASE_URL = "https://cdn.jsdelivr.net/gh/StevenNassef/steven-portfolio-ghpages@main/public/";

// Option 3: GitHub Pages from same repo (FREE)
// If deployed to GitHub Pages, use your GitHub Pages URL:
// export const MEDIA_BASE_URL = "https://stevennassef.github.io/steven-portfolio-ghpages/public/";

// Option 4: Local files (current setup - for development)
export const MEDIA_BASE_URL = "/";

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

