import React, { useEffect, useMemo, useState } from 'react'
import { Mail, Github, Linkedin, Download, Gamepad2, Wrench, Cpu, Rocket, Clock, Users, Code2 } from 'lucide-react'
import { projects, experiences, companyConfig, contactLinks } from './projectsData.js'
import MediaCarousel from "./components/MediaCarousel.jsx";
import { getMediaUrl, getCvUrl } from './config.js';
import { updateMetaTags, resetMetaTags } from './utils/metaTags.js';
import { injectStructuredData, generatePersonSchema, generatePortfolioSchema, generateProjectSchema, generateBreadcrumbSchema } from './utils/structuredData.js';

const Badge = ({children, className = ''}) => <span className={`badge ${className}`}>{children}</span>
const Card = ({children, className = '', ...props}) => <div className={`card ${className}`} {...props}>{children}</div>
const CardHeader = ({children}) => <div className='card-header'>{children}</div>
const CardTitle = ({children, className = ''}) => <div className={`card-title ${className}`}>{children}</div>
const CardContent = ({children}) => <div className='card-content'>{children}</div>

// Engine icon mapping with actual logos
const EngineIcon = ({ engine, size = 'md' }) => {
  const engineConfig = {
    Unity: { 
      label: 'Unity',
      iconUrl: 'https://cdn.simpleicons.org/unity/888888',
    },
    Unreal: { 
      label: 'Unreal Engine',
      iconUrl: 'https://cdn.simpleicons.org/unrealengine/888888',
    },
    Godot: { 
      label: 'Godot',
      iconUrl: 'https://cdn.simpleicons.org/godotengine/888888',
    },
  };

  const config = engineConfig[engine];
  if (!config) return null;

  const iconSize = size === 'sm' ? 'h-3.5 w-3.5' : size === 'lg' ? 'h-5 w-5' : 'h-4 w-4';
  
  return (
    <div className="flex items-center gap-1.5">
      <img 
        src={config.iconUrl} 
        alt={config.label}
        className={`${iconSize} object-contain`}
        loading="lazy"
      />
      <span>{config.label}</span>
    </div>
  );
};

// Helper function to decode HTML entities
const decodeHtmlEntities = (str) => {
  const textarea = document.createElement('textarea');
  textarea.innerHTML = str;
  return textarea.value;
};

// Helper function to clean and decode logo URL
const cleanLogoUrl = (url) => {
  if (!url) return null;
  try {
    let cleaned = decodeHtmlEntities(url);
    cleaned = decodeURIComponent(cleaned);
    cleaned = cleaned.replace(/&amp;/g, '&');
    return cleaned;
  } catch {
    return url.replace(/&amp;/g, '&');
  }
};

// Helper function to extract LinkedIn company logo URL
const extractLinkedInLogo = async (linkedinUrl) => {
  if (!linkedinUrl) return null;
  
  try {
    const proxies = [
      `https://api.allorigins.win/raw?url=${encodeURIComponent(linkedinUrl)}`,
      `https://corsproxy.io/?${encodeURIComponent(linkedinUrl)}`,
      `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(linkedinUrl)}`,
    ];
    
    let html = null;
    for (const proxyUrl of proxies) {
      try {
        const response = await fetch(proxyUrl);
        if (response.ok) {
          html = await response.text();
          break;
        }
      } catch {
        continue;
      }
    }
    
    if (!html) return null;
    
    const logoPatterns = [
      /<meta\s+property="og:image"\s+content="([^"]+)"/i,
      /<meta\s+name="og:image"\s+content="([^"]+)"/i,
      /<img[^>]*class="[^"]*org-top-card-primary-content__logo[^"]*"[^>]*src="([^"]+)"/i,
      /<img[^>]*data-delayed-url="([^"]*media\.licdn\.com[^"]+)"/i,
      /https:\/\/media\.licdn\.com\/dms\/image\/[^"'\s<>]+/i,
    ];
    
    for (const pattern of logoPatterns) {
      const match = html.match(pattern);
      if (match) {
        const logoUrl = match[1] || match[0];
        if (logoUrl?.includes('media.licdn.com')) {
          return cleanLogoUrl(logoUrl);
        }
      }
    }
  } catch (error) {
    console.error('Error extracting LinkedIn logo:', error);
  }
  
  return null;
};

// Company icon mapping with actual logos
const CompanyIcon = ({ company, size = 'md' }) => {
  const [linkedinLogos, setLinkedinLogos] = React.useState({});
  
  const config = companyConfig[company];
  if (!config) return null;
  
  // Resolve local icon URL using getMediaUrl
  const localIcon = config.localIcon ? getMediaUrl(config.localIcon) : null;
  
  // Fetch LinkedIn logo if URL is provided and not already fetched
  React.useEffect(() => {
    if (config.linkedinUrl && !linkedinLogos[company]) {
      extractLinkedInLogo(config.linkedinUrl).then(logoUrl => {
        if (logoUrl) {
          setLinkedinLogos(prev => ({ ...prev, [company]: logoUrl }));
        }
      });
    }
  }, [company, config.linkedinUrl, linkedinLogos]);
  
  const linkedinLogoUrl = linkedinLogos[company] || null;
  
  const iconSize = size === 'sm' ? 'h-6 w-6' : size === 'lg' ? 'h-10 w-10' : 'h-8 w-8';
  
  // Priority: linkedinLogoUrl > localIcon > iconUrl > clearbitLogo
  const iconSrc = linkedinLogoUrl || localIcon || config.iconUrl || config.clearbitLogo;
  
  return (
    <div className="flex items-center gap-2">
      <div className={`${iconSize} rounded-lg overflow-hidden bg-white dark:bg-gray-800 border border-border flex items-center justify-center flex-shrink-0`}>
        <img 
          src={iconSrc} 
          alt={config.label}
          className={`${iconSize} object-cover`}
          loading="lazy"
        onError={(e) => {
          const currentSrc = e.target.src;
          const tried = (e.target.getAttribute('data-tried') || '').split(',').filter(Boolean);
          
          const urlMatches = (url1, url2) => {
            if (!url1 || !url2) return false;
            try {
              return url1 === url2 || 
                     decodeURIComponent(url1) === decodeURIComponent(url2) ||
                     url1.includes(url2) || url2.includes(url1);
            } catch {
              return url1 === url2;
            }
          };
          
          // Define fallback sources in priority order
          const fallbacks = [
            { key: 'linkedin', url: linkedinLogoUrl },
            { key: 'local', url: localIcon },
            { key: 'icon', url: config.iconUrl },
            { key: 'clearbit', url: config.clearbitLogo },
          ].filter(f => f.url);
          
          // Find which source failed
          const failedIndex = fallbacks.findIndex(f => urlMatches(currentSrc, f.url));
          
          if (failedIndex >= 0) {
            // Try next available fallback
            const nextFallback = fallbacks.find((f, idx) => idx > failedIndex && !tried.includes(f.key));
            
            if (nextFallback) {
              e.target.src = nextFallback.url;
              e.target.setAttribute('data-tried', [...tried, nextFallback.key].join(','));
            } else if (tried.length >= fallbacks.length) {
              // All options exhausted
              e.target.style.display = 'none';
            }
          }
        }}
        />
      </div>
    </div>
  );
};

// Platform icon mapping with actual logos
const PlatformIcon = ({ platform, url, size = 'md' }) => {
  const platformConfig = {
    appStore: { 
      label: 'App Store',
      tooltip: 'View on App Store',
      iconUrl: 'https://cdn.simpleicons.org/appstore/007AFF',
      bgColor: 'hover:bg-blue-50 dark:hover:bg-blue-950/20'
    },
    playStore: { 
      label: 'Google Play',
      tooltip: 'View on Google Play',
      iconUrl: 'https://cdn.simpleicons.org/googleplay/0F9D58',
      bgColor: 'hover:bg-green-50 dark:hover:bg-green-950/20'
    },
    steam: { 
      label: 'Steam',
      tooltip: 'View on Steam',
      iconUrl: 'https://cdn.simpleicons.org/steam/0099FF',
      bgColor: 'hover:bg-blue-50 dark:hover:bg-blue-950/20'
    },
    itch: { 
      label: 'itch.io',
      tooltip: 'View on itch.io',
      iconUrl: 'https://cdn.simpleicons.org/itchdotio/FA5C5C',
      bgColor: 'hover:bg-red-50 dark:hover:bg-red-950/20'
    },
    github: { 
      label: 'GitHub',
      tooltip: 'View on GitHub',
      iconUrl: 'https://cdn.simpleicons.org/github/FFFFFF',
      bgColor: 'hover:bg-gray-50 dark:hover:bg-gray-900/20'
    },
  };

  const config = platformConfig[platform];
  if (!config || !url) return null;

  const iconSize = size === 'sm' ? 'h-4 w-4' : size === 'lg' ? 'h-6 w-6' : 'h-5 w-5';
  const containerSize = size === 'sm' ? 'p-1.5' : size === 'lg' ? 'p-3' : 'p-2.5';
  
  return (
    <div className="relative group">
      <a
        href={url}
        target='_blank'
        rel='noreferrer'
        className={`inline-flex items-center justify-center ${containerSize} rounded-lg border border-border ${config.bgColor} transition-all hover:scale-110`}
        aria-label={`${config.label} - Opens in new tab`}
      >
        <img 
          src={config.iconUrl} 
          alt={config.label}
          className={`${iconSize} object-contain`}
          loading="lazy"
        />
      </a>
      {/* Tooltip */}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1.5 text-xs font-medium text-white bg-gray-900 dark:bg-gray-800 rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
        {config.tooltip}
        <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-900 dark:border-t-gray-800"></div>
      </div>
    </div>
  );
};

const Section = ({id, title, subtitle, children, className = ''}) => {
  // Extract padding-top from className if provided, otherwise use default
  const hasCustomPadding = className.includes('pt-') || className.includes('!pt-');
  const defaultPadding = hasCustomPadding ? '' : 'py-12';
  
  return (
    <section id={id} className={`container ${defaultPadding} ${className}`}>
      <div className='mb-6'>
        <h2 className='text-2xl sm:text-3xl font-bold tracking-tight'>{title}</h2>
        {subtitle && <p className='mt-2 text-muted max-w-3xl'>{subtitle}</p>}
      </div>
      {children}
    </section>
  );
}

function parseRoute() {
  const hash = window.location.hash || '';
  const m = hash.match(/^#\/project\/([^\/]+)$/);
  if (m) return { name: 'project', key: decodeURIComponent(m[1]) };
  return { name: 'home' };
}

function Home({ onOpenProject }) {
  const year = new Date().getFullYear()
  return (
    <main>
      <header className='container pt-16 sm:pt-20 lg:pt-24 pb-8 sm:pb-12 flex flex-col'>
        {/* Main Profile Section */}
        <div className='flex flex-col'>
          {/* Profile Image and Name/Title Row */}
          <div className='flex flex-col sm:flex-row items-start gap-5 sm:gap-6 mb-8'>
            {/* Profile Image */}
            <div className='flex-shrink-0'>
              <img 
                src={getMediaUrl("/profile/profile.jpg")} 
                alt="Steven Nassef Henry - Senior Unity Engineer and Game Developer" 
                className='w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 rounded-2xl object-cover border-2 border-border shadow-lg'
              />
            </div>
            
            {/* Name and Title - beside photo on larger screens */}
            <div className='flex-1 space-y-1.5 sm:pt-1'>
              <h1 className='text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight'>
                Steven Nassef Henry
              </h1>
              <p className='text-xl sm:text-2xl font-semibold text-foreground'>
                Senior Unity Engineer
              </p>
            </div>
          </div>
          
          {/* Description and Content - full width */}
          <div className='flex flex-col space-y-7 w-full'>
            {/* Description */}
            <p className='text-base sm:text-lg text-muted leading-relaxed max-w-none'>
              Specializing in systems architecture and design, applying SOLID principles and proven design patterns to build 
              scalable, maintainable game systems. Delivering high-performance mobile and PC game experiences with robust 
              live-ops infrastructure, seamless SDK integrations, and optimized gameplay architectures that support millions of players.
            </p>

            {/* Professional Highlights */}
            <div className='flex flex-wrap items-center gap-x-4 gap-y-2'>
              <div className='flex items-center gap-2 text-sm text-muted'>
                <Clock className='h-4 w-4 flex-shrink-0' />
                <span className='font-medium'>5+ Years Experience</span>
              </div>
              <span className='text-muted hidden sm:inline'>•</span>
              <div className='flex items-center gap-2 text-sm text-muted'>
                <Rocket className='h-4 w-4 flex-shrink-0' />
                <span className='font-medium'>20M+ Downloads</span>
              </div>
              <span className='text-muted hidden sm:inline'>•</span>
              <div className='flex items-center gap-2 text-sm text-muted'>
                <Gamepad2 className='h-4 w-4 flex-shrink-0' />
                <span className='font-medium'>Mobile & PC Games Specialist</span>
              </div>
            </div>

            {/* Core Technologies - Quick Recap */}
            <div className='space-y-3'>
              <h3 className='text-sm font-semibold text-muted uppercase tracking-wider'>Key Technologies</h3>
              <div className='flex flex-wrap items-center gap-2.5'>
                {['Unity', 'C#', 'Unity Game Services', 'Netcode for GameObjects', 'Firebase', 'PlayFab', 'Analytics', 'Live-Ops'].map((t,i)=>(<Badge key={i} className='text-xs px-3.5 py-1.5'>{t}</Badge>))}
              </div>
            </div>

            {/* Contact Actions */}
            <div className='flex flex-wrap items-center gap-3 pt-6 border-t border-border'>
              <a 
                className='btn btn-primary' 
                href={`mailto:${contactLinks.email}${contactLinks.ccEmail ? `?cc=${encodeURIComponent(contactLinks.ccEmail)}` : ''}`}
                aria-label='Send email to Steven Nassef Henry'
              >
                <Mail className='h-4 w-4'/> 
                <span>Contact Me</span>
              </a>
              <a 
                className='btn btn-outline' 
                href={contactLinks.github} 
                target='_blank' 
                rel='noreferrer'
                aria-label='View Steven Nassef Henry on GitHub'
              >
                <Github className='h-4 w-4'/> 
                <span>GitHub</span>
              </a>
              <a 
                className='btn btn-outline' 
                href={contactLinks.linkedin} 
                target='_blank' 
                rel='noreferrer'
                aria-label='Connect with Steven Nassef Henry on LinkedIn'
              >
                <Linkedin className='h-4 w-4'/> 
                <span>LinkedIn</span>
              </a>
              <a 
                className='btn btn-outline' 
                href={contactLinks.leetcode} 
                target='_blank' 
                rel='noreferrer'
                aria-label='View Steven Nassef Henry on LeetCode'
              >
                <Code2 className='h-4 w-4'/> 
                <span>LeetCode</span>
              </a>
              {getCvUrl() && (
                <a 
                  className='btn btn-outline' 
                  href={getCvUrl()} 
                  target='_blank' 
                  rel='noreferrer' 
                  download
                  aria-label='Download Steven Nassef Henry resume'
                >
                  <Download className='h-4 w-4'/> 
                  <span>Download Resume</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </header>

      <Section id='experience' title='Experience Snapshot' subtitle='Focused on shipping robust features, optimizing performance, and integrating growth/analytics SDKs at scale.' className='pt-8 sm:pt-10 pb-12'>
        <div className='grid md:grid-cols-2 lg:grid-cols-4 gap-4'>
          {experiences.map((exp, index) => (
            <Card key={index}>
              <CardHeader className='pb-4'>
                <CardTitle className='flex items-center gap-2.5 mb-2.5'>
                  <CompanyIcon company={exp.company} size='lr' />
                  <span>
                    {exp.displayTitle || exp.company}
                  </span>
                </CardTitle>
                <div className='flex flex-col gap-1 text-sm text-muted mt-1.5'>
                  {exp.role && exp.role.trim() && (
                    <div>{exp.role}</div>
                  )}
                  {exp.period && (
                    <div>{exp.period}</div>
                  )}
                </div>
              </CardHeader>
              <CardContent className='pt-0 pb-6'>
                <p className='text-sm leading-relaxed' dangerouslySetInnerHTML={{ __html: exp.description }} />
              </CardContent>
            </Card>
          ))}
        </div>
      </Section>

      <Section id='projects' title='Projects'>
        <div className='grid md:grid-cols-2 gap-6'>
          {projects.map(p => (
            <Card
              key={p.key}
              onClick={() => onOpenProject(p.key)}
              className='cursor-pointer hover:ring-2 hover:ring-indigo-400/50 transition-shadow'
            >
              <CardHeader>
                <div className='flex flex-wrap items-center gap-2 mb-2'>
                  <CardTitle>{p.title}</CardTitle>
                  {p.genre && (
                    <Badge className='text-xs'>{p.genre}</Badge>
                  )}
                </div>
                <div className='flex flex-wrap items-center gap-2 text-sm text-muted'>
                  {p.jobTitle && (
                    <div>{p.jobTitle}</div>
                  )}
                  {p.role && (
                    <div>• {p.role}</div>
                  )}
                </div>
                <div className='flex flex-wrap items-center justify-between gap-3 mt-2 text-sm text-muted'>
                  <div className='flex flex-wrap items-center gap-3'>
                    {p.engine && (
                      <EngineIcon engine={p.engine} size="sm" />
                    )}
                    {p.duration && (
                      <div className='flex items-center gap-1.5'>
                        <Clock className='h-3.5 w-3.5' />
                        <span>{p.duration}</span>
                      </div>
                    )}
                    {p.teamSize && (
                      <div className='flex items-center gap-1.5'>
                        <Users className='h-3.5 w-3.5' />
                        <span>{p.teamSize} {p.teamSize === 1 ? 'person' : 'people'}</span>
                      </div>
                    )}
                  </div>
                  {p.links && (p.links.appStore || p.links.playStore || p.links.steam || p.links.itch || p.links.github) && (
                    <div className='flex flex-wrap items-center gap-2' onClick={(e) => e.stopPropagation()}>
                      <PlatformIcon platform="appStore" url={p.links.appStore} size="sm" />
                      <PlatformIcon platform="playStore" url={p.links.playStore} size="sm" />
                      <PlatformIcon platform="steam" url={p.links.steam} size="sm" />
                      <PlatformIcon platform="itch" url={p.links.itch} size="sm" />
                      <PlatformIcon platform="github" url={p.links.github} size="sm" />
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <MediaCarousel
                  title={p.title}
                  main={p.main}
                  gallery={p.gallery}
                  aspect={p.aspectRatio}  // iPhone 13 Pro Max landscape
                  itemsPerView={p.itemsPerView}
                  showControls={false}
                  useLowQuality={true}
                />
                {p.description && (
                  <p className='mt-4 text-sm text-muted line-clamp-3'>{p.description}</p>
                )}
                {p.metrics && (p.metrics.downloads || p.metrics.rating || p.metrics.dau) && (
                  <div className='flex flex-wrap items-center gap-4 mt-4 pt-4 border-t border-border text-sm'>
                    {p.metrics.rating && (
                      <div className='relative group flex items-center gap-1.5'>
                        <span>⭐</span>
                        <span className='font-medium'>{p.metrics.rating}</span>
                        {/* Tooltip */}
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1.5 text-xs font-medium text-white bg-gray-900 dark:bg-gray-800 rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                          Store Rating
                          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-900 dark:border-t-gray-800"></div>
                        </div>
                      </div>
                    )}
                    {p.metrics.downloads && (
                      <div className='relative group flex items-center gap-1.5'>
                        <Download className='h-3.5 w-3.5' />
                        <span className='font-medium'>{p.metrics.downloads}</span>
                        {/* Tooltip */}
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1.5 text-xs font-medium text-white bg-gray-900 dark:bg-gray-800 rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                          Total Downloads
                          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-900 dark:border-t-gray-800"></div>
                        </div>
                      </div>
                    )}
                    {p.metrics.dau && (
                      <div className='relative group flex items-center gap-1.5'>
                        <Users className='h-3.5 w-3.5' />
                        <span className='font-medium'>{p.metrics.dau}</span>
                        <span className='text-muted'>DAU</span>
                        {/* Tooltip */}
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1.5 text-xs font-medium text-white bg-gray-900 dark:bg-gray-800 rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                          Daily Active Users
                          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-900 dark:border-t-gray-800"></div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
                <div className='mt-4'>
                  <h4 className='text-sm font-semibold mb-2'>Key Features:</h4>
                  <ul className='list-disc pl-5 space-y-1 text-sm text-muted'>
                    {p.bullets.slice(0, 4).map((b,i)=>(<li key={i} className='line-clamp-2'>{b}</li>))}
                    {p.bullets.length > 4 && (
                      <li className='text-xs text-muted italic'>+ {p.bullets.length - 4} more features</li>
                    )}
                  </ul>
                </div>
                <div className='flex flex-wrap gap-2 pt-4 mt-4 border-t border-border'>
                  {p.stack.slice(0, 6).map((s,i)=>(<Badge key={i} className='text-xs'>{s}</Badge>))}
                  {p.stack.length > 6 && (
                    <Badge className='text-xs text-muted'>+{p.stack.length - 6} more</Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </Section>

      <Section id='skills' title='Core Skills & Technologies' subtitle='Comprehensive expertise in game development, systems architecture, and production tools.'>
        <div className='grid md:grid-cols-2 gap-4'>
          <Card>
            <CardHeader><CardTitle>Engineering & Architecture</CardTitle></CardHeader>
            <CardContent className='flex flex-wrap gap-2 text-sm'>
              {['Systems Architecture','SOLID Principles','Design Patterns','Gameplay Architecture','UI/UX Implementation','Profiling & Optimization','Editor Tooling','Unit Testing / TDD'].map((s,i)=>(<Badge key={i}>{s}</Badge>))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Core Technologies</CardTitle></CardHeader>
            <CardContent className='flex flex-wrap gap-2 text-sm'>
              {['Unity','C#','Unity Game Services','Netcode for GameObjects','Addressables','Firebase','PlayFab','Jenkins CI'].map((s,i)=>(<Badge key={i}>{s}</Badge>))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Production & Live-Ops</CardTitle></CardHeader>
            <CardContent className='flex flex-wrap gap-2 text-sm'>
              {['Feature Flags','Live-Ops','Remote Config','A/B Testing','SDK Integrations','Crash/ANR Triage','CI/CD'].map((s,i)=>(<Badge key={i}>{s}</Badge>))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Analytics & Attribution</CardTitle></CardHeader>
            <CardContent className='flex flex-wrap gap-2 text-sm'>
              {['Firebase Analytics','AppsFlyer','Singular','Kinoa','Data Analysis','Performance Monitoring', 'Unity Game Services'].map((s,i)=>(<Badge key={i}>{s}</Badge>))}
            </CardContent>
          </Card>
        </div>
      </Section>

      <Section id='contact' title="Let's work together" subtitle='Open to Senior/Lead Unity roles — remote or on‑site.'>
        <div className='flex flex-wrap gap-3'>
          <a className='btn btn-primary' href={`mailto:${contactLinks.email}${contactLinks.ccEmail ? `?cc=${encodeURIComponent(contactLinks.ccEmail)}` : ''}`}><Mail className='h-4 w-4'/> Contact Me</a>
          <a className='btn btn-outline' href={contactLinks.linkedin} target='_blank' rel='noreferrer'><Linkedin className='h-4 w-4'/> LinkedIn</a>
          <a className='btn btn-outline' href={contactLinks.github} target='_blank' rel='noreferrer'><Github className='h-4 w-4'/> GitHub</a>
          <a className='btn btn-outline' href={contactLinks.leetcode} target='_blank' rel='noreferrer'><Code2 className='h-4 w-4'/> LeetCode</a>
          {getCvUrl() && (
            <a className='btn btn-outline' href={getCvUrl()} target='_blank' rel='noreferrer' download><Download className='h-4 w-4'/> Download Resume</a>
          )}
        </div>
      </Section>

      <footer className='py-10 text-center text-xs text-muted'>© {year} Steven Nassef Henry — Built with React & Tailwind</footer>
    </main>
  )
}

function ProjectDetail({ projectKey, onBack }) {
  const p = useMemo(() => projects.find(x => x.key === projectKey), [projectKey]);
  if (!p) {
  return (
    <main className='container py-10'>
      <button className='btn btn-outline mb-6 hover:ring-2 hover:ring-indigo-400/50 transition-shadow' onClick={onBack}>← Back to projects</button>
      <h1 className='text-2xl font-bold'>Project not found</h1>
      <p className='text-muted mt-2'>We couldn't find a project with key "{projectKey}".</p>
    </main>
  );
  }
  return (
    <main className='container py-10'>
      <nav aria-label="Breadcrumb">
        <button className='btn btn-outline mb-6 hover:ring-2 hover:ring-indigo-400/50 transition-shadow' onClick={onBack}>← Back to projects</button>
      </nav>
      <article className='max-w-5xl mx-auto'>
        <header className='mb-8'>
          <h1 className='text-4xl sm:text-5xl font-extrabold tracking-tight'>{p.title}</h1>
          <div className='flex flex-wrap items-center gap-4 mt-2'>
            {p.genre && (
              <Badge className='text-xs'>{p.genre}</Badge>
            )}
            {p.jobTitle && (
              <div className='text-lg text-muted'>{p.jobTitle}</div>
            )}
            {p.role && (
              <div className='text-sm text-muted'>• {p.role}</div>
            )}
            {p.timeline && (
              <div className='text-sm text-muted'>• {p.timeline}</div>
            )}
          </div>
          <div className='flex flex-wrap items-center gap-4 mt-2'>
            {p.duration && (
              <div className='flex items-center gap-1.5 text-sm text-muted'>
                <Clock className='h-4 w-4' />
                <span>{p.duration}</span>
              </div>
            )}
            {p.teamSize && (
              <div className='flex items-center gap-1.5 text-sm text-muted'>
                <Users className='h-4 w-4' />
                <span>{p.teamSize} {p.teamSize === 1 ? 'person' : 'people'}</span>
              </div>
            )}
            {p.engine && (
              <div className='flex items-center gap-1.5 text-sm text-muted'>
                <EngineIcon engine={p.engine} size="md" />
              </div>
            )}
          </div>
          {p.description && (
            <p className='mt-4 text-base leading-relaxed text-muted max-w-3xl'>{p.description}</p>
          )}
        </header>

        <div className='mt-8 mb-8'>
          <MediaCarousel 
            title={p.title} 
            main={p.main} 
            gallery={p.gallery} 
            aspect={p.aspectRatio || "16 / 9"}
            itemsPerView={p.itemsPerView || 1}
          />
        </div>

        {p.highlights && p.highlights.length > 0 && (
          <Card className='mb-6 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/20 dark:to-purple-950/20 border-indigo-200 dark:border-indigo-800'>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <Rocket className='h-5 w-5 text-indigo-600 dark:text-indigo-400' />
                Highlights & Achievements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className='list-disc pl-5 space-y-2 text-sm'>
                {p.highlights.map((h,i)=>(<li key={i} className='text-muted'>{h}</li>))}
              </ul>
            </CardContent>
          </Card>
        )}

        <div className='grid md:grid-cols-2 gap-6 mb-6'>
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <Gamepad2 className='h-5 w-5' />
                Key Features
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className='list-disc pl-5 space-y-2 text-sm'>
                {p.bullets.map((b,i)=>(<li key={i}>{b}</li>))}
              </ul>
            </CardContent>
          </Card>

          {p.challenges && p.challenges.length > 0 ? (
            <Card>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <Cpu className='h-5 w-5' />
                  Technical Challenges & Solutions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className='list-disc pl-5 space-y-3 text-sm'>
                  {p.challenges.map((c,i)=>(<li key={i} className='leading-relaxed'>{c}</li>))}
                </ul>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <Wrench className='h-5 w-5' />
                  Technologies & Tools
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className='flex flex-wrap gap-2'>
                  {p.stack.map((s,i)=>(<Badge key={i}>{s}</Badge>))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {p.gameplayMechanics && p.gameplayMechanics.length > 0 && (
          <Card className='mb-6'>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <Gamepad2 className='h-5 w-5' />
                Gameplay Mechanics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='grid sm:grid-cols-2 gap-3'>
                {p.gameplayMechanics.map((m,i)=>(
                  <div key={i} className='flex items-start gap-2 text-sm'>
                    <span className='text-indigo-600 dark:text-indigo-400 mt-1'>•</span>
                    <span>{m}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {p.challenges && p.challenges.length > 0 && (
          <Card className='mb-6'>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <Wrench className='h-5 w-5' />
                Technologies & Tools
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='flex flex-wrap gap-2'>
                {p.stack.map((s,i)=>(<Badge key={i}>{s}</Badge>))}
              </div>
            </CardContent>
          </Card>
        )}

        {(p.links || p.metrics) && (
          <div className='grid md:grid-cols-2 gap-6'>
            {p.links && (p.links.appStore || p.links.playStore || p.links.steam || p.links.itch || p.links.github) && (
              <Card>
                <CardHeader>
                  <CardTitle>Links</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='flex flex-wrap gap-2'>
                    <PlatformIcon platform="appStore" url={p.links.appStore} size="md" />
                    <PlatformIcon platform="playStore" url={p.links.playStore} size="md" />
                    <PlatformIcon platform="steam" url={p.links.steam} size="md" />
                    <PlatformIcon platform="itch" url={p.links.itch} size="md" />
                    <PlatformIcon platform="github" url={p.links.github} size="md" />
                  </div>
                </CardContent>
              </Card>
            )}

            {p.metrics && (p.metrics.downloads || p.metrics.rating || p.metrics.dau) && (
              <Card>
                <CardHeader>
                  <CardTitle>Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='space-y-2 text-sm'>
                    {p.metrics.rating && (
                      <div>
                        <span className='font-medium'>Rating: </span>
                        <span className='text-muted'>⭐ {p.metrics.rating}</span>
                      </div>
                    )}
                    {p.metrics.downloads && (
                      <div>
                        <span className='font-medium'>Downloads: </span>
                        <span className='text-muted'>{p.metrics.downloads}</span>
                      </div>
                    )}
                    {p.metrics.dau && (
                      <div className='relative group inline-flex items-center gap-1.5'>
                        <span className='font-medium'>DAU: </span>
                        <span className='text-muted'>{p.metrics.dau}</span>
                        <Users className='h-3.5 w-3.5 text-muted' />
                        {/* Tooltip */}
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1.5 text-xs font-medium text-white bg-gray-900 dark:bg-gray-800 rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                          Daily Active Users
                          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-900 dark:border-t-gray-800"></div>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </article>
    </main>
  );
}

export default function App(){
  const [route, setRoute] = useState(parseRoute());

  // Handle /resume path redirect
  useEffect(() => {
    const pathname = window.location.pathname;
    if (pathname === '/resume' || pathname === '/resume/') {
      const cvUrl = getCvUrl();
      if (cvUrl) {
        window.location.href = cvUrl;
      } else {
        // If no CV URL is configured, redirect to home
        window.location.href = '/';
      }
      return;
    }
  }, []);

  useEffect(() => {
    const onHash = () => setRoute(parseRoute());
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  // Update meta tags and structured data based on current route
  useEffect(() => {
    if (route.name === 'project') {
      const project = projects.find(p => p.key === route.key);
      if (project) {
        const projectUrl = `/#/project/${encodeURIComponent(route.key)}`;
        
        // Get project image - prefer main, then first gallery image, then poster from video, then default
        let projectImage = project.main;
        if (!projectImage && project.gallery && project.gallery.length > 0) {
          const firstItem = project.gallery[0];
          projectImage = firstItem.poster || firstItem.src;
        }
        if (!projectImage) {
          projectImage = '/profile/profile.jpg';
        }
        
        const projectDescription = project.description || `${project.title} - ${project.jobTitle || 'Project'}`;
        
        // Generate keywords from project stack and description
        const projectKeywords = [
          ...(project.stack || []),
          project.engine || '',
          'Unity',
          'Game Development',
          'Mobile Games',
          'PC Games'
        ].filter(Boolean).join(', ');
        
        updateMetaTags({
          title: `${project.title} — ${project.jobTitle || 'Project'} | Steven Henry`,
          description: projectDescription,
          image: projectImage,
          url: projectUrl,
          type: 'article',
          keywords: projectKeywords,
          publishedTime: project.timeline ? `${project.timeline.split('-')[0].trim()}-01-01` : undefined,
          author: 'Steven Nassef Henry',
        });

        // Inject structured data for project page
        injectStructuredData([
          generateProjectSchema(project),
          generateBreadcrumbSchema(project)
        ]);
      }
    } else {
      resetMetaTags();
      
      // Inject structured data for home page
      injectStructuredData([
        generatePersonSchema(),
        generatePortfolioSchema(projects),
        generateBreadcrumbSchema()
      ]);
    }
  }, [route]);

  const openProject = (key) => {
    window.location.hash = `/project/${encodeURIComponent(key)}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const goHome = () => {
    window.location.hash = '';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (route.name === 'project') {
    return <ProjectDetail projectKey={route.key} onBack={goHome} />
  }
  return <Home onOpenProject={openProject} />
}