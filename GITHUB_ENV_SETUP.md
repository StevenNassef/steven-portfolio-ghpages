# GitHub Environment Variables Setup

This guide shows you how to use GitHub environment variables for your `MEDIA_BASE_URL` configuration.

## Option 1: Repository Variables (Recommended)

Use this for non-sensitive configuration values. Variables are visible to all collaborators but not encrypted.

### Steps:

1. **Go to your GitHub repository**
   - Navigate to: `https://github.com/StevenNassef/steven-portfolio-ghpages`

2. **Open Settings**
   - Click on **Settings** tab in your repository

3. **Go to Variables**
   - In the left sidebar, click **Secrets and variables** → **Actions**
   - Click on the **Variables** tab

4. **Add New Repository Variable**
   - Click **New repository variable**
   - Name: `VITE_MEDIA_BASE_URL`
   - Value: Your CDN URL (e.g., `https://cdn.jsdelivr.net/gh/StevenNassef/steven-portfolio-ghpages@main/public/`)
   - Click **Add variable**

### Available Options:

```bash
# jsDelivr CDN (Fastest - Recommended)
https://cdn.jsdelivr.net/gh/StevenNassef/steven-portfolio-ghpages@main/public/

# GitHub Raw
https://raw.githubusercontent.com/StevenNassef/steven-portfolio-ghpages/main/public/

# GitHub Pages (if deployed)
https://stevennassef.github.io/steven-portfolio-ghpages/
```

---

## Option 2: Environment Variables (github-pages environment)

Use this for environment-specific configurations. The workflow is already configured to use the `github-pages` environment.

### Steps:

1. **Go to your GitHub repository Settings**
   - Navigate to **Settings** → **Environments**

2. **Configure github-pages Environment**
   - Click on **github-pages** environment (or create it if it doesn't exist)
   - Click **Configure environment**

3. **Add Environment Variable**
   - Scroll to **Environment variables** section
   - Click **Add variable**
   - Name: `VITE_MEDIA_BASE_URL`
   - Value: Your CDN URL (e.g., `https://cdn.jsdelivr.net/gh/StevenNassef/steven-portfolio-ghpages@main/public/`)
   - Click **Save**

4. **Workflow will use it automatically**
   - The workflow is already configured to use the `github-pages` environment
   - Environment variables are accessible via `vars.VITE_MEDIA_BASE_URL`

---

## Priority Order

The workflow checks in this order:

1. **Repository Variable** (`vars.VITE_MEDIA_BASE_URL`) - highest priority
2. **Default CDN URL** (fallback) - `https://cdn.jsdelivr.net/gh/StevenNassef/steven-portfolio-ghpages@main/public/`

---

## How It Works

The GitHub Actions workflow (`.github/workflows/deploy.yml`) is configured to:

1. **Check for repository variable**: `vars.VITE_MEDIA_BASE_URL`
2. **Fallback to default**: jsDelivr CDN URL

**Note**: The workflow uses the `github-pages` environment, so environment variables set in that environment will also be accessible.

---

## Testing

After setting up the environment variable:

1. **Trigger a workflow run**:
   - Push a commit to `main` branch, or
   - Go to **Actions** tab → **Run workflow** manually

2. **Check the build logs**:
   - Go to **Actions** tab
   - Click on the latest workflow run
   - Check the build step logs
   - Verify `VITE_MEDIA_BASE_URL` is being used

3. **Verify on GitHub Pages**:
   - After deployment, check your GitHub Pages site
   - Open browser DevTools → Network tab
   - Verify images are loading from the correct URL

---

## Troubleshooting

### Variable not working?

1. **Check variable name**: Must be exactly `VITE_MEDIA_BASE_URL`
2. **Check workflow file**: Ensure it's reading the variable correctly
3. **Check build logs**: Look for the variable in the build step
4. **Redeploy**: Push a new commit to trigger a new build

### Want to change the URL?

1. **Update the secret/variable** in GitHub Settings
2. **Push a new commit** to trigger a rebuild
3. **Or manually trigger** workflow from Actions tab

---

## Quick Setup (Recommended)

For the fastest setup, use **Repository Variable**:

1. Go to: `Settings` → `Secrets and variables` → `Actions`
2. Click: `Variables` tab
3. Click: `New repository variable`
4. Name: `VITE_MEDIA_BASE_URL`
5. Value: `https://cdn.jsdelivr.net/gh/StevenNassef/steven-portfolio-ghpages@main/public/`
6. Click: `Add variable`
7. Done! Next build will use it automatically.

