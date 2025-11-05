# GitHub Environment Variables Setup

This guide shows you how to use GitHub environment variables for your `MEDIA_BASE_URL` configuration.

## Option 1: Repository Secrets (Recommended for Private Values)

Use this if you want to keep the URL private or change it easily from GitHub UI.

### Steps:

1. **Go to your GitHub repository**
   - Navigate to: `https://github.com/StevenNassef/steven-portfolio-ghpages`

2. **Open Settings**
   - Click on **Settings** tab in your repository

3. **Go to Secrets**
   - In the left sidebar, click **Secrets and variables** → **Actions**

4. **Add New Repository Secret**
   - Click **New repository secret**
   - Name: `VITE_MEDIA_BASE_URL`
   - Value: Your CDN URL (e.g., `https://cdn.jsdelivr.net/gh/StevenNassef/steven-portfolio-ghpages@main/public/`)
   - Click **Add secret**

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

## Option 2: GitHub Environment Variables

Use this for environment-specific configurations (e.g., staging vs production).

### Steps:

1. **Go to your GitHub repository Settings**
   - Navigate to **Settings** → **Environments**

2. **Create New Environment**
   - Click **New environment**
   - Name: `github-pages` (or `production`)
   - Click **Configure environment**

3. **Add Environment Variable**
   - Scroll to **Environment variables**
   - Click **Add variable**
   - Name: `VITE_MEDIA_BASE_URL`
   - Value: Your CDN URL
   - Click **Save**

4. **Update workflow to use environment**
   - The workflow is already configured to use the `github-pages` environment
   - It will automatically use the environment variable

---

## Option 3: Repository Variables (Public, Less Secure)

Use this for non-sensitive values that you want to share publicly.

### Steps:

1. **Go to Repository Settings**
   - Navigate to **Settings** → **Secrets and variables** → **Actions**

2. **Go to Variables Tab**
   - Click on **Variables** tab

3. **Add New Variable**
   - Click **New repository variable**
   - Name: `VITE_MEDIA_BASE_URL`
   - Value: Your CDN URL
   - Click **Add variable**

---

## How It Works

The GitHub Actions workflow (`.github/workflows/deploy.yml`) is configured to:

1. **Check for secret first**: `secrets.VITE_MEDIA_BASE_URL`
2. **Check environment variable**: `env.VITE_MEDIA_BASE_URL`
3. **Fallback to default**: jsDelivr CDN URL

### Priority Order:

1. **Repository Secret** (highest priority)
2. **Environment Variable** (from `github-pages` environment)
3. **Repository Variable**
4. **Default CDN** (fallback)

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

For the fastest setup, use **Repository Secret**:

1. Go to: `Settings` → `Secrets and variables` → `Actions`
2. Click: `New repository secret`
3. Name: `VITE_MEDIA_BASE_URL`
4. Value: `https://cdn.jsdelivr.net/gh/StevenNassef/steven-portfolio-ghpages@main/public/`
5. Click: `Add secret`
6. Done! Next build will use it automatically.

