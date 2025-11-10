# Steven Nassef Henry — Portfolio Website

A modern, responsive portfolio website showcasing game development projects, professional experience, and technical expertise. Built with React, Vite, and Tailwind CSS, deployed on GitHub Pages.

## 🚀 Features

- **Responsive Design** - Optimized for desktop, tablet, and mobile devices
- **Project Showcase** - Interactive project gallery with media carousels
- **SEO Optimized** - Meta tags, structured data (JSON-LD), and sitemap generation
- **Performance** - Optimized assets, lazy loading, and efficient caching strategies
- **Dark Mode** - Built-in dark mode support with system preference detection
- **Dynamic Routing** - Client-side routing with GitHub Pages compatibility
- **Media Management** - Support for images and videos with low-quality fallbacks
- **Analytics Integration** - Firebase Analytics integration ready
- **Social Sharing** - Open Graph and Twitter Card meta tags for rich previews

## 🛠️ Tech Stack

- **Framework**: React 18.3
- **Build Tool**: Vite 5.4
- **Styling**: Tailwind CSS 3.4
- **Icons**: Lucide React
- **Hosting**: GitHub Pages
- **Analytics**: Firebase
- **Deployment**: GitHub Actions

## 📋 Prerequisites

- Node.js 18+ and npm
- Git

## 🏃 Quick Start

### Installation

```bash
# Clone the repository
git clone https://github.com/StevenNassef/steven-portfolio-ghpages.git

# Navigate to the project directory
cd steven-portfolio-ghpages

# Install dependencies
npm install
```

### Development

```bash
# Start development server
npm run dev
```

The development server will start at `http://localhost:5173` (or the next available port).

### Building

```bash
# Build for production
npm run build
```

The production build will be generated in the `dist/` directory.

### Preview Production Build

```bash
# Preview the production build locally
npm run preview
```

## 🚢 Deployment

This project is configured for automatic deployment to GitHub Pages via GitHub Actions. The workflow:

1. Builds the project on push to `main` branch
2. Deploys the `dist/` directory to GitHub Pages
3. Generates sitemap and copies necessary files (robots.txt, CNAME, etc.)

### Manual Deployment

If you need to deploy manually:

1. Build the project: `npm run build`
2. Commit and push the `dist/` directory to the `gh-pages` branch, or
3. Use GitHub Pages settings to point to the `dist/` directory

## 📁 Project Structure

```
steven-portfolio-ghpages/
├── public/                 # Static assets (images, videos, etc.)
│   ├── projects/          # Project media assets
│   ├── profile/           # Profile images
│   ├── robots.txt         # SEO robots file
│   └── sitemap.xml        # SEO sitemap
├── src/
│   ├── components/        # React components
│   │   └── MediaCarousel.jsx
│   ├── utils/             # Utility functions
│   │   ├── metaTags.js    # Meta tag management
│   │   └── structuredData.js  # JSON-LD schema
│   ├── App.jsx            # Main application component
│   ├── config.js          # Configuration and environment variables
│   ├── projectsData.js    # Project data and content
│   ├── firebase.js        # Firebase configuration
│   ├── index.css          # Global styles
│   └── main.jsx           # Application entry point
├── scripts/               # Build scripts
│   └── generate-sitemap.js
├── dist/                  # Production build output
└── vite.config.js         # Vite configuration
```

## 📜 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run generate-pdf` - Generate portfolio PDF
- `npm run generate-bimi` - Generate BIMI SVG (optimized)
- `npm run generate-bimi-basic` - Generate BIMI SVG (basic)
- `npm run generate-low-quality-videos` - Generate low-quality video versions
- `npm run generate-sitemap` - Generate sitemap.xml

## ⚙️ Configuration

### Environment Variables

The project uses environment variables for configuration. Create a `.env` file in the root directory:

```env
# Media assets base URL (required)
VITE_MEDIA_BASE_URL=https://your-cdn.com

# High-quality video base URL (optional, defaults to MEDIA_BASE_URL)
VITE_HIGH_QUALITY_VIDEO_BASE_URL=https://your-video-cdn.com

# CV/Resume URL (optional)
VITE_CV_URL=https://your-cv-url.com/resume.pdf

# Firebase configuration (JSON string)
VITE_FIREBASE_CONFIG={"apiKey":"...","authDomain":"...","projectId":"..."}
```

See [ENV_SETUP.md](./ENV_SETUP.md) for detailed configuration instructions.

### Media Assets

Media assets follow a naming convention:
- **Main image**: `{project_key}_main.jpeg`
- **Gallery images**: `{project_key}_1.jpeg`, `{project_key}_2.jpeg`, etc.
- **Video**: `{project_key}.mp4`
- **Low-quality video**: `{project_key}_low.mp4`

Place all media assets in `public/projects/{project_key}/`.

## 📚 Documentation

- **[Environment Setup](./ENV_SETUP.md)** - Configuration for environment variables
- **[CDN Setup](./CDN_SETUP.md)** - Guide for setting up CDN for media assets
- **[Domain Setup](./DOMAIN_SETUP.md)** - Custom domain configuration
- **[Cache Control Setup](./CACHE_CONTROL_SETUP.md)** - Browser caching configuration
- **[Git LFS Setup](./GIT_LFS_SETUP.md)** - Large file storage setup
- **[Image Optimization Guide](./IMAGE_OPTIMIZATION_GUIDE.md)** - Image optimization best practices
- **[BIMI Setup](./BIMI_SETUP.md)** - Brand Indicators for Message Identification setup

## 🎨 Customization

### Adding a New Project

1. Add project data to `src/projectsData.js`
2. Add media assets to `public/projects/{project_key}/`
3. Follow the media naming convention (see Configuration section)

### Styling

The project uses Tailwind CSS. Customize styles in:
- `src/index.css` - Global styles and Tailwind directives
- `tailwind.config.js` - Tailwind configuration
- Component-level classes in React components

### SEO

- Meta tags are managed in `src/utils/metaTags.js`
- Structured data (JSON-LD) is handled in `src/utils/structuredData.js`
- Sitemap generation is automated via `scripts/generate-sitemap.js`

## 🔧 Troubleshooting

### Build Issues

- Ensure Node.js version is 18 or higher
- Clear `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Check that all environment variables are set correctly

### Deployment Issues

- Verify GitHub Actions workflow is enabled
- Check that `dist/` directory is being generated correctly
- Ensure GitHub Pages is configured to use the correct branch/directory

### Media Loading Issues

- Verify `VITE_MEDIA_BASE_URL` is set correctly
- Check that media files exist in the correct paths
- Ensure CDN (if used) is accessible and CORS is configured

## 📝 License

This project is private and proprietary.

## 👤 Author

**Steven Nassef Henry**

- Portfolio: [stevennassef.com](https://stevennassef.com)
- LinkedIn: [steven-nassef](https://www.linkedin.com/in/steven-nassef/)
- GitHub: [@StevenNassef](https://github.com/StevenNassef)
- Email: contact@stevennassef.com

## 🙏 Acknowledgments

- Built with [React](https://react.dev/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Icons from [Lucide](https://lucide.dev/)
- Deployed on [GitHub Pages](https://pages.github.com/)

---

**Note**: This portfolio showcases projects with 20M+ downloads and demonstrates expertise in Unity game development, systems architecture, and live-ops infrastructure.
