/**
 * Environment Variables Configuration
 * 
 * Locally: Set in .env file (Vite automatically loads .env files)
 * On GitHub: Set in GitHub repository/environment variables (passed via workflow)
 */

// Media assets base URL - must be set in environment variables
export const MEDIA_BASE_URL = import.meta.env.VITE_MEDIA_BASE_URL || "/";

// CV/Resume URL - optional, button will be hidden if not set
export function getCvUrl() {
  return import.meta.env.VITE_CV_URL || "";
}

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

