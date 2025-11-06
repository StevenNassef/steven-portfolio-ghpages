# Environment Variables Setup

Environment variables are loaded from:
- **Local development**: `.env` file (or `.env.local` for overrides)
- **GitHub deployment**: GitHub repository/environment variables (set in GitHub Settings)

## Available Environment Variables

### `VITE_MEDIA_BASE_URL`
Base URL for media assets (images, videos, etc.)

**Required**: Yes (defaults to `/` if not set)

**Examples**:
- Local development: `/`
- CDN: `https://cdn.jsdelivr.net/gh/StevenNassef/steven-portfolio-ghpages@main/public/`
- GitHub Pages: `https://stevennassef.github.io/steven-portfolio-ghpages/`

### `VITE_CV_URL`
URL to your CV/Resume PDF file.

**Required**: No (download button will be hidden if not set)

**Examples**:
- Direct link: `https://flowcv.com/resume/u95uup2l43`
- PDF file: `https://example.com/resume.pdf`

## Local Development Setup

Create a `.env.local` file in the project root (this file is ignored by git):

```bash
VITE_MEDIA_BASE_URL=/
VITE_CV_URL=https://flowcv.com/resume/u95uup2l43
```

**Note**: `.env.local` takes precedence over `.env` files. Use it for local overrides.

## GitHub Deployment Setup

Set environment variables in GitHub:

1. Go to your repository: `Settings` → `Secrets and variables` → `Actions`
2. Click on the `Variables` tab
3. Click `New repository variable`
4. Add the following variables:
   - `VITE_MEDIA_BASE_URL`: Your media base URL (e.g., CDN or GitHub Pages URL)
   - `VITE_CV_URL`: Your CV/Resume URL (optional)

**Alternative**: You can also set them in the `github-pages` environment:
1. Go to `Settings` → `Environments`
2. Click on `github-pages` environment
3. Add environment variables in the `Environment variables` section

## How It Works

- **Local**: Vite automatically loads `.env` files when you run `npm run dev` or `npm run build`
- **GitHub**: The GitHub Actions workflow passes environment variables from GitHub to the build process
- **No auto-detection**: All values must be explicitly set via environment variables

## Testing

1. **Local development**: 
   - Create `.env.local` with your values
   - Run `npm run dev`
   - Verify the values are being used

2. **Production build**:
   - Set variables in GitHub
   - Push to `main` branch (triggers deployment)
   - Check the deployed site

## Notes

- Environment variables must start with `VITE_` to be accessible in the browser
- `.env.local` is ignored by git (safe for local overrides)
- If `VITE_CV_URL` is not set, the download CV button will be hidden
- If `VITE_MEDIA_BASE_URL` is not set, it defaults to `/` (local files)
