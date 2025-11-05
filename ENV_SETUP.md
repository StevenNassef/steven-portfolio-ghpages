# Environment Variables Setup

The `MEDIA_BASE_URL` is now automatically configured based on your environment.

## How It Works

The system uses a **3-tier priority system**:

1. **Environment Variable** (highest priority)
   - Uses `VITE_MEDIA_BASE_URL` if set in `.env` files

2. **Auto-Detection** (automatic)
   - Detects if running on `localhost` → uses local files (`/`)
   - Detects if running on `github.io` → uses GitHub Pages URL
   - Otherwise → uses jsDelivr CDN

3. **Fallback** (default)
   - Development mode → local files (`/`)
   - Production mode → jsDelivr CDN

## Environment Files

### `.env.development`
Used when running `npm run dev` (local development)
```bash
VITE_MEDIA_BASE_URL=/
```

### `.env.production`
Used when running `npm run build` (production build)
```bash
VITE_MEDIA_BASE_URL=https://cdn.jsdelivr.net/gh/StevenNassef/steven-portfolio-ghpages@main/public/
```

### `.env.local` (optional)
Create this file for local overrides (not committed to git)
```bash
VITE_MEDIA_BASE_URL=/
```

## Automatic Detection

The system automatically detects:

- **Local Development**: `localhost` or `127.0.0.1` → uses `/`
- **GitHub Pages**: `*.github.io` → uses GitHub Pages URL
- **Production**: Otherwise → uses jsDelivr CDN

## Override Manually

To override the automatic detection, create `.env.local`:

```bash
# Force local files
VITE_MEDIA_BASE_URL=/

# Or force CDN
VITE_MEDIA_BASE_URL=https://cdn.jsdelivr.net/gh/StevenNassef/steven-portfolio-ghpages@main/public/
```

## Testing

1. **Local development**: `npm run dev` → uses local files
2. **Production build**: `npm run build` → uses CDN
3. **Preview**: `npm run preview` → uses CDN (production mode)

## Notes

- `.env.local` is ignored by git (add your local overrides here)
- `.env.development` and `.env.production` are committed (safe defaults)
- Environment variables must start with `VITE_` to be accessible in the browser

