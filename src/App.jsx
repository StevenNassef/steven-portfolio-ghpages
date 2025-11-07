import React, { useEffect, useMemo, useState } from 'react'
import { Github, Linkedin, Mail, Download, Gamepad2, Wrench, Cpu, Rocket, Clock, Users, Smartphone, ExternalLink } from 'lucide-react'
import { projects, experiences, companyConfig } from './projectsData.js'
import MediaCarousel from "./components/MediaCarousel.jsx";
import { getMediaUrl, getCvUrl } from './config.js';
import { updateMetaTags, resetMetaTags } from './utils/metaTags.js';

const Badge = ({children}) => <span className='badge'>{children}</span>
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

const Section = ({id, title, subtitle, children}) => (
  <section id={id} className='section'>
    <div className='mb-6'>
      <h2 className='text-2xl sm:text-3xl font-bold tracking-tight'>{title}</h2>
      {subtitle && <p className='mt-2 text-muted max-w-3xl'>{subtitle}</p>}
    </div>
    {children}
  </section>
)

function parseRoute() {
  const hash = window.location.hash || '';
  const m = hash.match(/^#\/project\/([^\/]+)$/);
  if (m) return { name: 'project', key: decodeURIComponent(m[1]) };
  return { name: 'home' };
}

function Home({ onOpenProject }) {
  const year = new Date().getFullYear()
  return (
    <div>
      <header className='container py-16 flex flex-col gap-6'>
        <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-6'>
          <div>
            <div className='flex items-center gap-4 mb-3'>
              <img 
                src={getMediaUrl("/profile/profile.jpg")} 
                alt="Steven Nassef Henry" 
                className='w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-2 border-border'
              />
              <h1 className='text-4xl sm:text-5xl font-extrabold tracking-tight'>Steven Nassef Henry</h1>
            </div>
            <p className='mt-3 text-lg sm:text-xl text-muted max-w-2xl'>
              Senior Unity Engineer — gameplay systems, live‑ops, and high‑performance mobile experiences.
            </p>
            <div className='mt-4 flex flex-wrap items-center gap-2'>
              {['Unity','C#','DOTS','Netcode for Entities','Firebase','Adjust','AppsFlyer','PlayFab','Jenkins CI'].map((t,i)=>(<Badge key={i}>{t}</Badge>))}
            </div>
          </div>
          <div className='flex flex-wrap gap-3'>
            <a className='btn btn-primary' href='mailto:stevennassef97@gmail.com'><Mail className='h-4 w-4'/> Contact</a>
            <a className='btn btn-outline' href='https://github.com/StevenNassef' target='_blank' rel='noreferrer'><Github className='h-4 w-4'/> GitHub</a>
            <a className='btn btn-outline' href='https://www.linkedin.com/in/steven-nassef-henry-192366227/' target='_blank' rel='noreferrer'><Linkedin className='h-4 w-4'/> LinkedIn</a>
            {getCvUrl() && (
              <a className='btn btn-outline' href={getCvUrl()} target='_blank' rel='noreferrer' download><Download className='h-4 w-4'/> Resume</a>
            )}
          </div>
        </div>
      </header>

      <Section id='experience' title='Experience Snapshot' subtitle='Focused on shipping robust features, optimizing performance, and integrating growth/analytics SDKs at scale.'>
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
                <CardTitle>{p.title}</CardTitle>
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
                />
                <div className='flex flex-wrap items-center gap-4 mt-4 border-t border-border text-sm'></div>
                {p.metrics && (p.metrics.downloads || p.metrics.rating || p.metrics.dau) && (
                  <div className='flex flex-wrap items-center gap-4 pt-4 text-sm'>
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
                <ul className='list-disc pl-5 space-y-1 text-sm pt-4'>
                  {p.bullets.map((b,i)=>(<li key={i}>{b}</li>))}
                </ul>
                <div className='flex flex-wrap gap-2 pt-4'>
                  {p.stack.map((s,i)=>(<Badge key={i}>{s}</Badge>))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </Section>

      <Section id='skills' title='Core Skills'>
        <div className='grid md:grid-cols-2 gap-4'>
          <Card>
            <CardHeader><CardTitle>Engineering</CardTitle></CardHeader>
            <CardContent className='flex flex-wrap gap-2 text-sm'>
              {['Gameplay Architecture','ECS/DOTS','Netcode for Entities','UI/UX Implementation','Addressables','Profiling & Optimization','Editor Tooling','Unit Testing / TDD'].map((s,i)=>(<Badge key={i}>{s}</Badge>))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Production</CardTitle></CardHeader>
            <CardContent className='flex flex-wrap gap-2 text-sm'>
              {['Feature Flags','Live‑Ops','Analytics & Attribution','SDK Integrations','Crash/ANR Triage','CI/CD (Jenkins)','Remote Config','A/B Testing'].map((s,i)=>(<Badge key={i}>{s}</Badge>))}
            </CardContent>
          </Card>
        </div>
      </Section>

      <Section id='contact' title="Let's work together" subtitle='Open to Senior/Lead Unity roles — remote or on‑site.'>
        <div className='flex flex-wrap gap-3'>
          <a className='btn btn-primary' href='mailto:stevennassef97@gmail.com'><Mail className='h-4 w-4'/> Email me</a>
          <a className='btn btn-outline' href='https://www.linkedin.com/in/steven-nassef-henry-192366227/' target='_blank' rel='noreferrer'><Linkedin className='h-4 w-4'/> Connect on LinkedIn</a>
          <a className='btn btn-outline' href='https://github.com/StevenNassef' target='_blank' rel='noreferrer'><Github className='h-4 w-4'/> View GitHub</a>
          {getCvUrl() && (
            <a className='btn btn-outline' href={getCvUrl()} target='_blank' rel='noreferrer' download><Download className='h-4 w-4'/> Download Resume (PDF)</a>
          )}
        </div>
      </Section>

      <footer className='py-10 text-center text-xs text-muted'>© {year} Steven Nassef Henry — Built with React & Tailwind</footer>
    </div>
  )
}

function ProjectDetail({ projectKey, onBack }) {
  const p = useMemo(() => projects.find(x => x.key === projectKey), [projectKey]);
  if (!p) {
    return (
      <div className='container py-10'>
        <button className='btn btn-outline mb-6 hover:ring-2 hover:ring-indigo-400/50 transition-shadow' onClick={onBack}>← Back to projects</button>
        <h2 className='text-2xl font-bold'>Project not found</h2>
        <p className='text-muted mt-2'>We couldn't find a project with key "{projectKey}".</p>
      </div>
    );
  }
  return (
    <div className='container py-10'>
      <button className='btn btn-outline mb-6 hover:ring-2 hover:ring-indigo-400/50 transition-shadow' onClick={onBack}>← Back to projects</button>
      <div className='max-w-5xl mx-auto'>
        <div className='mb-8'>
          <h1 className='text-4xl sm:text-5xl font-extrabold tracking-tight'>{p.title}</h1>
          <div className='flex flex-wrap items-center gap-4 mt-2'>
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
            <p className='mt-4 text-muted max-w-3xl'>{p.description}</p>
          )}
        </div>

        <div className='mt-8 mb-8'>
          <MediaCarousel 
            title={p.title} 
            main={p.main} 
            gallery={p.gallery} 
            aspect={p.aspectRatio || "16 / 9"}
            itemsPerView={p.itemsPerView || 1}
          />
        </div>

        <div className='grid md:grid-cols-2 gap-6 mb-6'>
          <Card>
            <CardHeader>
              <CardTitle>Key Features</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className='list-disc pl-5 space-y-2 text-sm'>
                {p.bullets.map((b,i)=>(<li key={i}>{b}</li>))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Technologies & Tools</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='flex flex-wrap gap-2'>
                {p.stack.map((s,i)=>(<Badge key={i}>{s}</Badge>))}
              </div>
            </CardContent>
          </Card>
        </div>

        {p.challenges && p.challenges.length > 0 && (
          <Card className='mb-6'>
            <CardHeader>
              <CardTitle>Technical Challenges & Solutions</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className='list-disc pl-5 space-y-2 text-sm'>
                {p.challenges.map((c,i)=>(<li key={i}>{c}</li>))}
              </ul>
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
      </div>
    </div>
  );
}

export default function App(){
  const [route, setRoute] = useState(parseRoute());

  useEffect(() => {
    const onHash = () => setRoute(parseRoute());
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  // Update meta tags based on current route
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
        
        updateMetaTags({
          title: `${project.title} — ${project.jobTitle || 'Project'} | Steven Henry`,
          description: projectDescription,
          image: projectImage,
          url: projectUrl,
          type: 'article',
        });
      }
    } else {
      resetMetaTags();
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