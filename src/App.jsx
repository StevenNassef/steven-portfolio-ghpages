import React, { useEffect, useMemo, useState } from 'react'
import { Github, Linkedin, Mail, Download, Gamepad2, Wrench, Cpu, Rocket, Clock, Users, Smartphone, ExternalLink } from 'lucide-react'
import { projects } from './projectsData.js'
import MediaCarousel from "./components/MediaCarousel.jsx";
import { getMediaUrl, getCvUrl } from './config.js';

const Badge = ({children}) => <span className='badge'>{children}</span>
const Card = ({children, className = '', ...props}) => <div className={`card ${className}`} {...props}>{children}</div>
const CardHeader = ({children}) => <div className='card-header'>{children}</div>
const CardTitle = ({children}) => <div className='card-title'>{children}</div>
const CardContent = ({children}) => <div className='card-content'>{children}</div>

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
                src={getMediaUrl("/profile/profile.png")} 
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
        <div className='grid md:grid-cols-3 gap-4'>
          <Card>
            <CardHeader>
              <CardTitle><Wrench className='h-5 w-5'/> Carry1st — Senior Unity Engineer</CardTitle>
              <div className='text-sm text-muted'>2025</div>
            </CardHeader>
            <CardContent>
              <p className='text-sm'><b>Mergedom: Home Design</b> — core gameplay systems, feature flags, IAP & live‑ops content tooling (e.g., Throwback Treasure, Chocolate Box), performance profiling, SDK integrations.</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle><Cpu className='h-5 w-5'/> Umami Games — Lead Game Programmer</CardTitle>
              <div className='text-sm text-muted'>2023–2024</div>
            </CardHeader>
            <CardContent>
              <p className='text-sm'>Architected core systems, rapid prototyping, led feature development and code reviews across multiple mobile titles.</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle><Rocket className='h-5 w-5'/> Yajulu & Solo Projects</CardTitle>
              <div className='text-sm text-muted'>2019–2023</div>
            </CardHeader>
            <CardContent>
              <p className='text-sm'><b>Zarzura</b> (word‑trivia), <b>Rocket Factory</b>, <b>Coin Forge</b>, <b>Rent Lord</b> — full lifecycle: design, implementation, launch, and updates.</p>
            </CardContent>
          </Card>
        </div>
      </Section>

      <Section id='projects' title='Selected Projects'>
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
                <div className='flex flex-wrap items-center gap-3 mt-2 text-sm text-muted'>
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
                  <div className='flex flex-wrap items-center gap-2 mt-3'>
                    <PlatformIcon platform="appStore" url={p.links.appStore} size="sm" />
                    <PlatformIcon platform="playStore" url={p.links.playStore} size="sm" />
                    <PlatformIcon platform="steam" url={p.links.steam} size="sm" />
                    <PlatformIcon platform="itch" url={p.links.itch} size="sm" />
                    <PlatformIcon platform="github" url={p.links.github} size="sm" />
                  </div>
                )}
              </CardHeader>
              <CardContent>
                <MediaCarousel
                  title={p.title}
                  main={p.main}
                  gallery={p.gallery}
                  aspect={p.aspectRatio}  // iPhone 13 Pro Max landscape
                  itemsPerView={p.itemsPerView}
                />

                <ul className='list-disc pl-5 space-y-1 text-sm mt-4'>
                  {p.bullets.map((b,i)=>(<li key={i}>{b}</li>))}
                </ul>
                <div className='flex flex-wrap gap-2 pt-3'>
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

            {p.metrics && (p.metrics.downloads || p.metrics.rating) && (
              <Card>
                <CardHeader>
                  <CardTitle>Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='space-y-2 text-sm'>
                    {p.metrics.downloads && (
                      <div>
                        <span className='font-medium'>Downloads: </span>
                        <span className='text-muted'>{p.metrics.downloads}</span>
                      </div>
                    )}
                    {p.metrics.rating && (
                      <div>
                        <span className='font-medium'>Rating: </span>
                        <span className='text-muted'>{p.metrics.rating} ⭐</span>
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