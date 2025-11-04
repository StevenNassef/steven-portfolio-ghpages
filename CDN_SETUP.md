# CDN Setup Guide

This guide shows you how to move your images and videos to a free CDN.

## Option 1: GitHub Raw (Recommended - Easiest)

### Steps:
1. **Create a new GitHub repository** for your assets:
   - Go to GitHub and create a new repo (e.g., `portfolio-assets`)
   - Make it public (required for raw GitHub URLs)

2. **Upload your media files**:
   - Create the same folder structure: `projects/coin_forge/`, `projects/jumpy_shooter/`, etc.
   - Upload all your images and videos

3. **Update `src/config.js`**:
   ```javascript
   export const MEDIA_BASE_URL = "https://raw.githubusercontent.com/YOUR_USERNAME/portfolio-assets/main/";
   ```
   Replace `YOUR_USERNAME` with your GitHub username and `portfolio-assets` with your repo name.

### Example:
If your username is `stevenhenry` and repo is `portfolio-assets`:
```javascript
export const MEDIA_BASE_URL = "https://raw.githubusercontent.com/stevenhenry/portfolio-assets/main/";
```

---

## Option 2: jsDelivr (Recommended - Fastest CDN)

### Steps:
1. **Same as GitHub Raw** - host your assets on GitHub

2. **Update `src/config.js`**:
   ```javascript
   export const MEDIA_BASE_URL = "https://cdn.jsdelivr.net/gh/YOUR_USERNAME/portfolio-assets@main/";
   ```

### Example:
```javascript
export const MEDIA_BASE_URL = "https://cdn.jsdelivr.net/gh/stevenhenry/portfolio-assets@main/";
```

**Benefits**: jsDelivr is a fast global CDN with caching, so your assets load faster worldwide.

---

## Option 3: GitHub Pages (Current Repo)

If you want to keep assets in your current repo but reference them differently:

1. **Keep files in `public/projects/`** (current setup)

2. **Update `src/config.js`**:
   ```javascript
   // If your GitHub Pages URL is: https://stevenhenry.github.io/steven-portfolio-ghpages/
   export const MEDIA_BASE_URL = "https://stevenhenry.github.io/steven-portfolio-ghpages/";
   ```

---

## Option 4: Cloudflare R2 (Advanced)

### Steps:
1. Sign up for Cloudflare (free account)
2. Create an R2 bucket
3. Upload your files
4. Get your public URL

**Limits**: 10GB storage, 1M reads/month (free tier)

---

## Testing Your Setup

After updating `MEDIA_BASE_URL`:

1. **Build your project**: `npm run build`
2. **Preview locally**: `npm run preview`
3. **Check browser console** for any 404 errors on media files
4. **Verify images/videos load** correctly

---

## Troubleshooting

### Images not loading?
- Check that the URL in `MEDIA_BASE_URL` ends with `/`
- Verify your GitHub repo is **public** (required for raw.githubusercontent.com)
- Check browser console for exact error messages
- Ensure folder structure matches exactly (case-sensitive)

### Videos not loading?
- Same as above, plus:
- Check file sizes (GitHub has a 100MB file limit)
- Verify video format is supported (MP4 recommended)

---

## Current Local Setup

Right now, your config uses local files:
```javascript
export const MEDIA_BASE_URL = "/";
```

This works for local development. Change it when you're ready to deploy!

