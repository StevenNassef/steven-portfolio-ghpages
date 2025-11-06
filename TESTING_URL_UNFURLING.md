# Testing URL Unfurling

This guide explains how to test Open Graph and Twitter Card meta tags for URL unfurling.

## Quick Test Methods

### 1. **Local Testing (View Source)**

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Open your browser and navigate to `http://localhost:5173`

3. **View Page Source**:
   - Right-click → "View Page Source" (or `Cmd+Option+U` on Mac, `Ctrl+U` on Windows)
   - Look for the meta tags in the `<head>` section
   - You should see:
     - `<meta property="og:title" content="...">`
     - `<meta property="og:description" content="...">`
     - `<meta property="og:image" content="...">`
     - `<meta name="twitter:card" content="...">`

4. **Test Dynamic Updates**:
   - Navigate to a project page (e.g., `http://localhost:5173/#/project/mergedom`)
   - Open browser DevTools (`F12` or `Cmd+Option+I`)
   - Go to the **Elements** tab
   - Check the `<head>` section - meta tags should be updated dynamically

### 2. **Browser DevTools Console**

1. Open DevTools (`F12` or `Cmd+Option+I`)
2. Go to the **Console** tab
3. Run these commands to check meta tags:

   ```javascript
   // Check Open Graph tags
   document.querySelector('meta[property="og:title"]')?.content
   document.querySelector('meta[property="og:description"]')?.content
   document.querySelector('meta[property="og:image"]')?.content
   document.querySelector('meta[property="og:url"]')?.content

   // Check Twitter Card tags
   document.querySelector('meta[name="twitter:card"]')?.content
   document.querySelector('meta[name="twitter:title"]')?.content
   document.querySelector('meta[name="twitter:description"]')?.content
   document.querySelector('meta[name="twitter:image"]')?.content
   ```

### 3. **Online Testing Tools (After Deployment)**

These tools require your site to be publicly accessible (deployed):

#### **Open Graph Debugger (Facebook)**
- URL: https://developers.facebook.com/tools/debug/
- Enter your site URL: `https://stevennassef.com`
- Click "Debug" to see how Facebook will render your link
- Click "Scrape Again" to refresh cached data

#### **Twitter Card Validator**
- URL: https://cards-dev.twitter.com/validator
- Enter your site URL: `https://stevennassef.com`
- See how Twitter will display your link
- **Note**: Requires Twitter account login

#### **LinkedIn Post Inspector**
- URL: https://www.linkedin.com/post-inspector/
- Enter your site URL: `https://stevennassef.com`
- See how LinkedIn will display your link
- **Note**: Requires LinkedIn account login

#### **OpenGraph.xyz (Universal)**
- URL: https://www.opengraph.xyz/
- Enter your site URL: `https://stevennassef.com`
- Shows preview for multiple platforms (Facebook, Twitter, LinkedIn, Slack, etc.)

#### **Meta Tags.io**
- URL: https://metatags.io/
- Enter your site URL: `https://stevennassef.com`
- Comprehensive meta tag checker and preview

### 4. **Test Production Build Locally**

1. Build your site:
   ```bash
   npm run build
   ```

2. Preview the production build:
   ```bash
   npm run preview
   ```

3. Navigate to `http://localhost:4173` (or the port shown)
4. Test using the same methods as above

### 5. **Test After Deployment**

Once your site is deployed to `https://stevennassef.com`:

1. **Test Home Page**:
   - Use any of the online tools above with: `https://stevennassef.com`

2. **Test Project Pages**:
   - Use online tools with project URLs like:
     - `https://stevennassef.com/#/project/mergedom`
     - `https://stevennassef.com/#/project/kortifo`
   
   **Important Note**: Some crawlers may not execute JavaScript, so they might only see the base meta tags. For hash-based routes, you may need to:
   - Use a service like Prerender.io
   - Or implement server-side rendering (SSR)
   - Or use a static site generator that pre-renders pages

3. **Real-World Test**:
   - Share a link on Twitter, Facebook, or LinkedIn
   - See if the preview card appears correctly
   - Check if the image, title, and description are correct

## What to Check

### ✅ Home Page Meta Tags Should Include:
- `og:title`: "Steven Henry — Portfolio"
- `og:description`: "Senior Unity Engineer — gameplay systems, live‑ops, and high‑performance mobile experiences."
- `og:image`: Profile image URL
- `og:url`: `https://stevennassef.com/`
- `twitter:card`: "summary_large_image"

### ✅ Project Page Meta Tags Should Include:
- `og:title`: Project title with job title
- `og:description`: Project description
- `og:image`: Project main image or first gallery image
- `og:url`: Project-specific URL
- `og:type`: "article"

## Troubleshooting

### Issue: Meta tags not updating on project pages
- **Solution**: Check browser console for errors
- Verify the route is being detected correctly
- Check that project data is loading

### Issue: Images not showing in previews
- **Solution**: 
  - Ensure image URLs are absolute (start with `https://`)
  - Verify images are publicly accessible
  - Check image dimensions (recommended: 1200x630px for Open Graph)

### Issue: Crawlers not seeing updated meta tags
- **Solution**: 
  - This is expected for SPAs with hash routing
  - Consider using a prerendering service
  - Or implement server-side rendering

### Issue: Cached previews
- **Solution**: 
  - Use Facebook Debugger's "Scrape Again" feature
  - Twitter and LinkedIn may cache for 7 days
  - Clear cache using their respective tools

## Quick Test Checklist

- [ ] View page source shows meta tags in `<head>`
- [ ] DevTools shows meta tags updating on navigation
- [ ] Console commands return correct meta tag values
- [ ] Production build preview works correctly
- [ ] Deployed site shows correct previews in online tools
- [ ] Shared links display correctly on social platforms

