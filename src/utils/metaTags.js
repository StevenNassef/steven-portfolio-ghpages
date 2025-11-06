/**
 * Utility functions for managing meta tags for URL unfurling
 * Supports Open Graph and Twitter Card meta tags
 */

const SITE_URL = 'https://www.stevennassef.com';
const SITE_NAME = 'Steven Henry — Portfolio';
const DEFAULT_DESCRIPTION = 'Senior Unity Engineer — gameplay systems, live‑ops, and high‑performance mobile experiences.';
const DEFAULT_IMAGE = `${SITE_URL}/profile/profile.jpg`;

/**
 * Updates or creates a meta tag in the document head
 * @param {string} property - The property/name attribute
 * @param {string} content - The content value
 * @param {string} type - 'property' for Open Graph, 'name' for Twitter/standard
 */
function setMetaTag(property, content, type = 'property') {
  if (!content) return;
  
  let meta = document.querySelector(`meta[${type}="${property}"]`);
  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute(type, property);
    document.head.appendChild(meta);
  }
  meta.setAttribute('content', content);
}

/**
 * Updates the page title
 * @param {string} title - The page title
 */
function setTitle(title) {
  document.title = title;
  setMetaTag('title', title, 'name');
}

/**
 * Updates meta tags for URL unfurling
 * @param {object} options - Meta tag options
 * @param {string} options.title - Page title
 * @param {string} options.description - Page description
 * @param {string} options.image - Image URL for social sharing
 * @param {string} options.url - Page URL (relative path will be converted to full URL)
 * @param {string} options.type - Open Graph type (default: 'website')
 */
export function updateMetaTags({ title, description, image, url, type = 'website' }) {
  const fullUrl = url ? (url.startsWith('http') ? url : `${SITE_URL}${url}`) : SITE_URL;
  // Ensure image is always an absolute URL
  let fullImage = image ? (image.startsWith('http') ? image : `${SITE_URL}${image}`) : DEFAULT_IMAGE;
  // Remove any leading slashes that might cause issues
  if (fullImage.startsWith('//')) {
    fullImage = `https:${fullImage}`;
  }
  
  // Update title
  if (title) {
    setTitle(title);
  }
  
  // Update description
  if (description) {
    setMetaTag('description', description, 'name');
    setMetaTag('og:description', description);
    setMetaTag('twitter:description', description);
  }
  
  // Update URL
  if (url) {
    setMetaTag('og:url', fullUrl);
    setMetaTag('twitter:url', fullUrl);
  }
  
  // Update image with all required properties for WhatsApp
  if (image || fullImage) {
    setMetaTag('og:image', fullImage);
    setMetaTag('og:image:url', fullImage); // WhatsApp sometimes needs this
    setMetaTag('og:image:secure_url', fullImage.replace('http://', 'https://')); // WhatsApp requires HTTPS
    setMetaTag('twitter:image', fullImage);
    // Add image dimensions if not already set
    if (!document.querySelector('meta[property="og:image:width"]')) {
      setMetaTag('og:image:width', '1200');
      setMetaTag('og:image:height', '630');
    }
  }
  
  // Update Open Graph type
  setMetaTag('og:type', type);
  
  // Update Open Graph title
  if (title) {
    setMetaTag('og:title', title);
    setMetaTag('twitter:title', title);
  }
  
  // Ensure site name is set
  setMetaTag('og:site_name', SITE_NAME);
  
  // WhatsApp-specific: Ensure locale is set
  setMetaTag('og:locale', 'en_US');
}

/**
 * Resets meta tags to default home page values
 */
export function resetMetaTags() {
  updateMetaTags({
    title: SITE_NAME,
    description: DEFAULT_DESCRIPTION,
    image: DEFAULT_IMAGE,
    url: '/',
  });
}

