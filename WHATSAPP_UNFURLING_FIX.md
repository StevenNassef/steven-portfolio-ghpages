# WhatsApp URL Unfurling Fix

## The Problem

WhatsApp's crawler **does not execute JavaScript**, so it can only see the base HTML from `index.html`. This means:

- ✅ **Home page** (`https://stevennassef.com/`) works fine - meta tags are in the HTML
- ❌ **Project pages** (`https://stevennassef.com/#/project/mergedom`) don't work - meta tags are added dynamically via JavaScript

## Why This Happens

1. **Hash-based routing**: URLs like `/#/project/mergedom` are client-side routes
2. **No JavaScript execution**: WhatsApp's crawler doesn't run JavaScript
3. **Only sees base HTML**: It only sees the `<head>` from `index.html`

## Solutions

### Option 1: Use a Prerendering Service (Recommended)

Use a service that pre-renders your pages so crawlers see the full HTML:

#### **Prerender.io** (Free tier available)
1. Sign up at https://prerender.io/
2. Add their middleware to your site
3. Configure it to prerender hash routes

#### **Netlify Prerendering** (If using Netlify)
- Automatically handles prerendering for SPAs

#### **Cloudflare Workers** (Advanced)
- Create a worker that prerenders pages on-demand

### Option 2: Server-Side Rendering (SSR)

Convert your React app to use SSR:
- **Next.js**: Full React framework with SSR
- **Remix**: Modern React framework
- **React Server Components**: Latest React feature

### Option 3: Static HTML Files (Quick Fix)

Create static HTML files for each project page:

1. Create `public/project-mergedom.html` with meta tags
2. Create `public/project-kortifo.html` with meta tags
3. Use a redirect or rewrite rule to serve these files

**Pros**: Works immediately  
**Cons**: Requires maintaining duplicate HTML files

### Option 4: Use Query Parameters Instead of Hash (Partial Fix)

Change routing from `/#/project/mergedom` to `/project/mergedom`:

1. Update `vite.config.js` to use history mode
2. Configure server to serve `index.html` for all routes
3. Update routing in `App.jsx`

**Note**: This still requires server-side configuration to serve `index.html` for all routes.

## Current Status

✅ **Fixed Issues:**
- Added `og:image:url` and `og:image:secure_url` for WhatsApp compatibility
- Ensured all image URLs are absolute (HTTPS)
- Added `og:locale` meta tag
- Added `og:image:type` for better compatibility

❌ **Still Broken:**
- Project pages won't show correct previews in WhatsApp because crawler doesn't execute JavaScript
- Hash-based routing (`/#/project/...`) is not crawlable

## Testing WhatsApp

### Test Home Page (Should Work)
1. Share `https://stevennassef.com/` in WhatsApp
2. Should show: Title, description, and profile image

### Test Project Page (Won't Work Yet)
1. Share `https://stevennassef.com/#/project/mergedom` in WhatsApp
2. Will show: Base meta tags from `index.html` (not project-specific)

## Recommended Solution

For a **quick fix** that works immediately:

1. **Use Prerender.io** (easiest):
   - Free tier: 250 pages/month
   - Add their service to your site
   - Configure it to prerender hash routes

2. **Or switch to history-based routing**:
   - Change from `/#/project/...` to `/project/...`
   - Configure GitHub Pages to serve `index.html` for all routes
   - This requires a `404.html` workaround for GitHub Pages

## GitHub Pages 404.html Workaround

If you switch to history-based routing, create `public/404.html`:

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>Steven Henry — Portfolio</title>
    <script type="text/javascript">
      // Single Page Apps for GitHub Pages
      // https://github.com/rafgraph/spa-github-pages
      var pathSegmentsToKeep = 1;
      var l = window.location;
      l.replace(
        l.protocol + '//' + l.hostname + (l.port ? ':' + l.port : '') +
        l.pathname.split('/').slice(0, 1 + pathSegmentsToKeep).join('/') + '/?/' +
        l.pathname.slice(1).split('/').slice(pathSegmentsToKeep).join('/').replace(/&/g, '~and~') +
        (l.search ? '&' + l.search.slice(1).replace(/&/g, '~and~') : '') +
        l.hash
      );
    </script>
  </head>
  <body>
  </body>
</html>
```

And update `vite.config.js`:

```javascript
export default defineConfig({
  plugins: [react()],
  base: '/',
  build: {
    outDir: 'dist',
  },
})
```

## Immediate Action Items

1. ✅ **Done**: Fixed image URLs to be absolute
2. ✅ **Done**: Added WhatsApp-specific meta tags
3. ⚠️ **Next**: Choose a solution (Prerender.io recommended)
4. ⚠️ **Next**: Implement the chosen solution

## Resources

- [Prerender.io](https://prerender.io/)
- [WhatsApp Link Preview](https://faq.whatsapp.com/general/chats/how-to-use-link-previews)
- [Open Graph Protocol](https://ogp.me/)
- [GitHub Pages SPA Guide](https://github.com/rafgraph/spa-github-pages)

