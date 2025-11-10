# Cache Control Setup

## Problem

When deploying updates to the portfolio site, users' browsers were caching the old HTML file, causing them to see outdated content even after new deployments. This was especially problematic because:

- Users had to manually clear their browser cache or use incognito mode to see updates
- The old version persisted until cache expiration
- This created a poor user experience where deployed changes weren't visible immediately

## Solution Overview

We've implemented a comprehensive cache control strategy that:

1. **Prevents HTML caching** - Forces browsers to check for the latest HTML on each visit
2. **Preserves asset caching** - Images, videos, and other assets are still cached efficiently
3. **Uses content-based hashing** - Changed JavaScript and CSS files get new filenames automatically
4. **Adds build timestamps** - Ensures HTML content changes on each build

## How It Works

### HTML File Caching

The HTML file (`index.html`) is configured to **never be cached aggressively**. This is achieved through:

1. **Cache-Control Meta Tags** - Added to the HTML `<head>` section:
   ```html
   <meta http-equiv="Cache-Control" content="no-cache, must-revalidate" />
   <meta http-equiv="Pragma" content="no-cache" />
   <meta http-equiv="Expires" content="0" />
   ```

2. **Build Timestamp** - Each build generates a unique timestamp that:
   - Is added as a meta tag: `<meta name="build-timestamp" content="[timestamp]" />`
   - Is added as a body attribute: `<body data-build="[timestamp]">`
   - Ensures the HTML file content is different on each build

### Asset Caching Strategy

Different asset types are handled differently:

#### JavaScript & CSS Files
- **Content-based hashing**: Vite automatically generates unique filenames based on file content
  - Example: `index-3N7hiEMf.js`, `index-5flEmdhC.css`
- **How it works**:
  - If content changes → new hash → new filename → browser downloads new file
  - If content unchanged → same hash → same filename → browser uses cached version
- **Result**: Users only download changed files, unchanged files are served from cache

#### Images & Videos
- **Cached by browser**: Based on GitHub Pages HTTP headers
- **How it works**:
  - Same URL = browser uses cached version
  - Different URL = browser downloads new file
- **Result**: Unchanged media files are served from cache, only changed files are downloaded

## Implementation Details

### Vite Plugins

The solution is implemented through three custom Vite plugins in `vite.config.js`:

#### 1. Cache Control Plugin (`cacheControlPlugin`)

**Purpose**: Adds cache-control meta tags and build timestamp to HTML

**How it works**:
- Runs during HTML transformation (`transformIndexHtml` hook)
- Generates a fresh timestamp for each build using `Date.now()`
- Injects cache-control meta tags before the closing `</head>` tag
- Adds timestamp as a data attribute on the `<body>` tag

**Key features**:
- Safety checks ensure HTML structure exists before modification
- Timestamp changes on every build, ensuring HTML content is always unique
- Only affects HTML file, not assets

#### 2. Copy 404 Plugin (`copy404Plugin`)

**Purpose**: Copies `index.html` to `404.html` for GitHub Pages SPA routing

**How it works**:
- Runs after build completes (`writeBundle` hook)
- Copies `dist/index.html` to `dist/404.html`
- Ensures 404.html includes cache-control tags (since it's copied after cache-control plugin runs)

**Why it's needed**:
- GitHub Pages serves `404.html` for unmatched routes
- For SPAs, we want all routes to serve the React app
- This enables client-side routing to work correctly

#### 3. SEO Plugin (`seoPlugin`)

**Purpose**: Handles SEO files and GitHub Pages configuration

**How it works**:
- **Before build** (`buildStart` hook):
  - Generates sitemap.xml
- **After build** (`writeBundle` hook):
  - Copies sitemap.xml to dist directory
  - Copies robots.txt to dist directory
  - Creates `.nojekyll` file

**Why `.nojekyll` is important**:
- Tells GitHub Pages to skip Jekyll processing
- Ensures all files (including dot-files and underscore files) are served correctly
- Required for proper static file serving and caching

### Plugin Execution Order

Plugins run in this order:
1. `react()` - React plugin
2. `cacheControlPlugin()` - Adds cache-control to HTML
3. `copy404Plugin()` - Copies HTML to 404.html (includes cache-control)
4. `seoPlugin()` - Handles SEO files and .nojekyll

This order ensures cache-control tags are added before 404.html is created.

## File Structure

After building, the `dist` directory contains:

```
dist/
├── index.html          # Main HTML with cache-control tags
├── 404.html           # Copy of index.html for SPA routing
├── .nojekyll          # Tells GitHub Pages to skip Jekyll
├── robots.txt         # SEO robots file
├── sitemap.xml        # SEO sitemap
└── assets/
    ├── index-[hash].js    # JavaScript (content-hashed)
    └── index-[hash].css   # CSS (content-hashed)
```

## What Users Experience

### Scenario 1: Text/Layout Update (No Asset Changes)

1. **HTML**: Browser checks server, sees new timestamp, downloads new HTML (~4KB)
2. **JS/CSS**: If unchanged, browser uses cached versions (same hash = same filename)
3. **Images/Videos**: Browser uses cached versions (same URLs)
4. **Result**: Fast update, minimal data transfer

### Scenario 2: Asset Update (New Image/Video)

1. **HTML**: Browser downloads new HTML
2. **JS/CSS**: If unchanged, browser uses cached versions
3. **Images/Videos**: Only changed files are downloaded (different URLs)
4. **Result**: Only changed assets are downloaded

### Scenario 3: Code Update (JS/CSS Changes)

1. **HTML**: Browser downloads new HTML
2. **JS/CSS**: New files with new hashes are downloaded (e.g., `index-ABC123.js` → `index-XYZ789.js`)
3. **Images/Videos**: Browser uses cached versions
4. **Result**: Only changed code files are downloaded

## Verification

### Check Cache-Control Tags

After building, verify cache-control tags are present:

```bash
grep -A 5 "Cache Control" dist/index.html
```

Expected output:
```html
<!-- Cache Control - HTML only (does NOT affect images/videos/assets) -->
<meta http-equiv="Cache-Control" content="no-cache, must-revalidate" />
<meta http-equiv="Pragma" content="no-cache" />
<meta http-equiv="Expires" content="0" />
<meta name="build-timestamp" content="[timestamp]" />
```

### Check Build Timestamp

Verify timestamp changes on each build:

```bash
# First build
npm run build
grep 'build-timestamp' dist/index.html

# Wait a moment, then rebuild
npm run build
grep 'build-timestamp' dist/index.html
```

The timestamp should be different on each build.

### Check Required Files

Verify all required files exist:

```bash
test -f dist/.nojekyll && echo "✓ .nojekyll exists" || echo "✗ Missing .nojekyll"
test -f dist/404.html && echo "✓ 404.html exists" || echo "✗ Missing 404.html"
test -f dist/index.html && echo "✓ index.html exists" || echo "✗ Missing index.html"
```

### Test in Browser

1. **Deploy** your site
2. **Visit** the site in a regular browser window
3. **Make a change** and redeploy
4. **Visit again** - you should see the new version immediately (no hard refresh needed)
5. **Check Network tab** - HTML should show "no-cache" in response headers

## Troubleshooting

### Users Still See Old Version

**Possible causes**:
1. **CDN caching**: If using a CDN, it may cache HTML. Check CDN settings.
2. **Service worker**: If you have a service worker, it may cache HTML. Update service worker cache strategy.
3. **Browser extension**: Some browser extensions cache content. Test in incognito mode.

**Solutions**:
- Clear CDN cache if applicable
- Update service worker to not cache HTML
- Verify cache-control meta tags are present in deployed HTML

### Assets Not Caching

**Possible causes**:
1. **GitHub Pages headers**: GitHub Pages should serve assets with proper cache headers automatically
2. **CDN configuration**: If using a CDN, check CDN cache settings

**Solutions**:
- Verify assets are served with proper cache headers (check Network tab)
- If using a CDN, configure CDN to cache assets appropriately

### Build Timestamp Not Changing

**Possible causes**:
1. **Build cache**: Vite may be using cached build
2. **Plugin not running**: Cache control plugin may not be executing

**Solutions**:
- Clear build cache: `rm -rf dist node_modules/.vite`
- Verify plugin is in `vite.config.js` plugins array
- Check build output for any errors

## Technical Details

### Cache-Control Meta Tags

While `http-equiv` meta tags are not as powerful as HTTP headers, they are the best solution for GitHub Pages because:

1. **GitHub Pages limitations**: GitHub Pages doesn't allow custom HTTP headers
2. **Browser support**: Modern browsers respect `http-equiv` cache-control directives
3. **Combined with timestamp**: The build timestamp ensures HTML content changes, forcing revalidation

### Why "no-cache" Instead of "no-store"

We use `no-cache, must-revalidate` instead of `no-store` because:

- **`no-cache`**: Allows caching but requires revalidation with server
- **`no-store`**: Prevents caching entirely (more aggressive)
- **Combined with timestamp**: `no-cache` is sufficient since HTML content changes on each build
- **Better performance**: Allows browser to cache if timestamp matches, reducing server requests

### Build Timestamp Strategy

The timestamp is generated using `Date.now()` in the `transformIndexHtml` hook:

- **Generated per build**: Fresh timestamp for each build
- **Unique content**: Ensures HTML file content is always different
- **Browser detection**: Browsers recognize file content change and revalidate
- **Multiple locations**: Added to both meta tag and body attribute for redundancy

## Maintenance

### No Regular Maintenance Required

Once set up, this solution requires no ongoing maintenance:

- ✅ Cache-control tags are added automatically on each build
- ✅ Build timestamp is generated automatically
- ✅ Asset hashing is handled by Vite automatically
- ✅ .nojekyll file is created automatically

### When to Update

Update the configuration if:

1. **Changing build tool**: If migrating away from Vite, adapt the plugins
2. **Adding service worker**: Update service worker to not cache HTML
3. **Using CDN**: Configure CDN to respect cache-control directives
4. **Changing hosting**: Adapt cache-control strategy for new hosting platform

## Related Files

- `vite.config.js` - Contains all plugin implementations
- `dist/index.html` - Built HTML with cache-control tags
- `dist/404.html` - Copy of index.html for SPA routing
- `dist/.nojekyll` - GitHub Pages configuration file

## References

- [Vite Plugin API](https://vitejs.dev/guide/api-plugin.html)
- [MDN: HTTP Caching](https://developer.mozilla.org/en-US/docs/Web/HTTP/Caching)
- [GitHub Pages: Custom 404 Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-custom-404-page-for-your-github-pages-site)
- [GitHub Pages: Jekyll](https://docs.github.com/en/pages/setting-up-a-github-pages-site-with-jekyll)

## Summary

This cache control solution ensures:

✅ **Users always see the latest version** of your site  
✅ **Assets are cached efficiently** (no unnecessary downloads)  
✅ **Only changed files are downloaded** (optimal performance)  
✅ **Works seamlessly with GitHub Pages** (no custom headers needed)  
✅ **Zero maintenance required** (automatic on each build)  

The solution strikes the perfect balance between ensuring users see updates immediately while maintaining optimal caching performance for assets.

