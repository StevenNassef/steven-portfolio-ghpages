/**
 * Utility functions for generating structured data (JSON-LD) for SEO
 * Supports Person, Portfolio, Article, and BreadcrumbList schemas
 */

const SITE_URL = 'https://www.stevennassef.com';

/**
 * Generates Person structured data for the home page
 */
export function generatePersonSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Steven Nassef Henry",
    "alternateName": "Steven Henry",
    "url": SITE_URL,
    "jobTitle": "Senior Unity Engineer",
    "description": "Senior Unity Engineer specializing in systems architecture and design, applying SOLID principles and design patterns to build scalable, maintainable game systems. Expert in high-performance mobile and PC game development, live-ops infrastructure, and seamless SDK integrations.",
    "image": `${SITE_URL}/profile/profile.jpg`,
    "sameAs": [
      "https://github.com/StevenNassef",
      "https://www.linkedin.com/in/steven-nassef-henry-192366227/",
      "https://www.linkedin.com/in/steven-nassef/"
    ],
    "email": "contact@stevennassef.com",
    "knowsAbout": [
      "Unity",
      "C#",
      "Game Development",
      "Mobile Game Development",
      "PC Game Development",
      "Systems Architecture",
      "SOLID Principles",
      "Design Patterns",
      "Unity Game Services",
      "Netcode for GameObjects",
      "Addressables",
      "Live-Ops",
      "Gameplay Architecture",
      "Performance Optimization",
      "Firebase",
      "PlayFab",
      "Analytics",
      "Feature Flags",
      "Remote Config",
      "A/B Testing",
      "SDK Integration",
      "AppsFlyer",
      "Singular",
      "Kinoa"
    ],
    "hasOccupation": {
      "@type": "Occupation",
      "name": "Senior Unity Engineer",
      "occupationLocation": {
        "@type": "Country",
        "name": "Egypt"
      },
      "skills": [
        "Unity Game Development",
        "C# Programming",
        "Systems Architecture",
        "SOLID Principles",
        "Design Patterns",
        "Mobile Game Optimization",
        "PC Game Development",
        "Live-Ops Systems",
        "Gameplay Systems Architecture",
        "Unity Game Services",
        "Netcode for GameObjects",
        "Addressables",
        "Firebase Integration",
        "PlayFab Integration",
        "Analytics & Attribution",
        "Feature Flags",
        "Remote Config",
        "A/B Testing",
        "SDK Integration",
        "AppsFlyer",
        "Singular",
        "Kinoa",
        "CI/CD"
      ]
    }
  };
}

/**
 * Generates Portfolio/CreativeWork collection structured data
 */
export function generatePortfolioSchema(projects) {
  const creativeWorks = projects.map(project => {
    const work = {
      "@type": "VideoGame",
      "name": project.title,
      "description": project.description || `${project.title} - ${project.jobTitle || 'Project'}`,
      "url": `${SITE_URL}/#/project/${encodeURIComponent(project.key)}`,
      "image": project.main || `${SITE_URL}/profile/profile.jpg`,
      "applicationCategory": "GameApplication",
    };

    // Add operating system info
    if (project.links?.appStore) {
      work.operatingSystem = project.links?.playStore ? "iOS, Android" : "iOS";
    } else if (project.links?.playStore) {
      work.operatingSystem = "Android";
    }

    // Add offers if available on stores
    if (project.links?.appStore || project.links?.playStore) {
      work.offers = {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      };
    }

    // Add rating if available
    if (project.metrics?.rating) {
      work.aggregateRating = {
        "@type": "AggregateRating",
        "ratingValue": project.metrics.rating,
        "bestRating": "5",
        "worstRating": "1"
      };
    }

    return work;
  });

  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Steven Henry — Portfolio",
    "description": "Portfolio of game development projects by Steven Nassef Henry, Senior Unity Engineer",
    "url": SITE_URL,
    "mainEntity": {
      "@type": "ItemList",
      "itemListElement": creativeWorks.map((work, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "item": work
      }))
    }
  };
}

/**
 * Generates Article/CreativeWork structured data for project pages
 */
export function generateProjectSchema(project) {
  const projectUrl = `${SITE_URL}/#/project/${encodeURIComponent(project.key)}`;
  const projectImage = project.main || `${SITE_URL}/profile/profile.jpg`;
  
  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": project.title,
    "name": project.title,
    "description": project.description || `${project.title} - ${project.jobTitle || 'Project'}`,
    "image": projectImage,
    "url": projectUrl,
    "author": {
      "@type": "Person",
      "name": "Steven Nassef Henry",
      "url": SITE_URL
    },
    "publisher": {
      "@type": "Person",
      "name": "Steven Nassef Henry",
      "image": `${SITE_URL}/profile/profile.jpg`
    },
    "datePublished": project.timeline ? project.timeline.split('-')[0].trim() : "2020",
    "dateModified": project.timeline || "2020",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": projectUrl
    }
  };

  // Add about property if description exists
  if (project.description) {
    schema.about = {
      "@type": "Thing",
      "name": project.title,
      "description": project.description
    };
  }

  // Add keywords from stack
  if (project.stack && project.stack.length > 0) {
    schema.keywords = project.stack.join(", ");
  }

  return schema;
}

/**
 * Generates BreadcrumbList structured data
 */
export function generateBreadcrumbSchema(project = null) {
  const breadcrumbs = [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": SITE_URL
    }
  ];

  if (project) {
    breadcrumbs.push({
      "@type": "ListItem",
      "position": 2,
      "name": "Projects",
      "item": `${SITE_URL}/#projects`
    });
    breadcrumbs.push({
      "@type": "ListItem",
      "position": 3,
      "name": project.title,
      "item": `${SITE_URL}/#/project/${encodeURIComponent(project.key)}`
    });
  }

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbs
  };
}

/**
 * Injects structured data into the document head
 * @param {object|array} schemas - Single schema object or array of schema objects
 */
export function injectStructuredData(schemas) {
  // Remove existing structured data scripts
  const existingScripts = document.querySelectorAll('script[type="application/ld+json"]');
  existingScripts.forEach(script => script.remove());

  // Ensure schemas is an array
  const schemaArray = Array.isArray(schemas) ? schemas : [schemas];

  // Inject each schema
  schemaArray.forEach(schema => {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(schema, null, 2);
    document.head.appendChild(script);
  });
}

