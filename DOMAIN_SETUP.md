# Custom Domain Setup for stevennassef.com

This guide will help you configure your custom domain `stevennassef.com` to work with GitHub Pages.

## Step 1: GitHub Pages Configuration

The `CNAME` file has been created in the `public` folder. This file will be automatically included in your build and deployed to GitHub Pages.

## Step 2: Configure DNS on Hostinger

You need to configure DNS records in your Hostinger account to point to GitHub Pages.

### Option A: Using Apex Domain (stevennassef.com)

If you want to use the apex domain (without www), add these DNS records in Hostinger:

1. Log in to your Hostinger account
2. Go to **Domains** → Select `stevennassef.com` → **DNS / Name Servers**
3. Add the following **A records**:
   - **Type**: A
   - **Name**: @ (or leave blank)
   - **Value**: `185.199.108.153`
   - **TTL**: 3600 (or default)

   - **Type**: A
   - **Name**: @ (or leave blank)
   - **Value**: `185.199.109.153`
   - **TTL**: 3600 (or default)

   - **Type**: A
   - **Name**: @ (or leave blank)
   - **Value**: `185.199.110.153`
   - **TTL**: 3600 (or default)

   - **Type**: A
   - **Name**: @ (or leave blank)
   - **Value**: `185.199.111.153`
   - **TTL**: 3600 (or default)

### Option B: Using www Subdomain (www.stevennassef.com)

If you prefer to use www, add this DNS record:

1. **Type**: CNAME
2. **Name**: www
3. **Value**: `StevenNassef.github.io`
4. **TTL**: 3600 (or default)

### Option C: Both Apex and www

You can configure both by adding:
- The 4 A records for the apex domain (as shown in Option A)
- The CNAME record for www (as shown in Option B)

## Step 3: Configure Domain in GitHub

1. Go to your GitHub repository
2. Navigate to **Settings** → **Pages**
3. Under **Custom domain**, enter: `stevennassef.com`
4. Check **Enforce HTTPS** (recommended)
5. GitHub will verify the DNS configuration

## Step 4: Wait for DNS Propagation

DNS changes can take anywhere from a few minutes to 48 hours to propagate. Typically, it takes 1-2 hours.

You can check if DNS has propagated using:
- [whatsmydns.net](https://www.whatsmydns.net/#A/stevennassef.com)
- [dnschecker.org](https://dnschecker.org/#A/stevennassef.com)

## Step 5: Verify SSL Certificate

After DNS propagation, GitHub will automatically provision an SSL certificate for your domain. This usually takes a few minutes to a few hours.

## Troubleshooting

- **Domain not working**: Wait for DNS propagation (up to 48 hours)
- **SSL certificate issues**: Make sure DNS is properly configured and wait for GitHub to provision the certificate
- **404 errors**: Ensure the CNAME file is in the `public` folder and has been deployed
- **Mixed content warnings**: Make sure all resources use HTTPS

## Important Notes

- The CNAME file must contain only the domain name: `stevennassef.com` (no http:// or https://)
- Do NOT add a trailing slash
- After setting up the custom domain, GitHub Pages will automatically update the CNAME file in your repository
- If you need to change the domain later, update it in GitHub Pages settings and the CNAME file will be updated automatically

## Base Path Configuration

**Important**: Your current deployment workflow uses a base path based on the repository name (`/steven-portfolio-ghpages/`). When using a custom domain, GitHub Pages serves the site from the root (`/`), so you may need to update the `BASE_PATH` environment variable in your GitHub Actions workflow.

If you want the custom domain to work correctly, you should:
1. Go to your GitHub repository → **Settings** → **Environments** → **github-pages** → **Environment variables**
2. Add a variable: `BASE_PATH` with value `/`
3. Or update the workflow to conditionally set `BASE_PATH` to `/` when deploying

Alternatively, you can update the workflow file (`.github/workflows/deploy.yml`) to set `BASE_PATH: '/'` instead of `'/${{ github.event.repository.name }}/'` if you want to prioritize the custom domain over the GitHub Pages subpath.

