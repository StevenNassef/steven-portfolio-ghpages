import React from 'react'
import { Github, Linkedin, Mail, Download, Gamepad2, Wrench, Cpu, Rocket } from 'lucide-react'
import { projects } from './projectsData.js'
import MediaCarousel from "./components/MediaCarousel.jsx";

const Badge = ({children}) => <span className='badge'>{children}</span>
const Card = ({children}) => <div className='card'>{children}</div>
const CardHeader = ({children}) => <div className='card-header'>{children}</div>
const CardTitle = ({children}) => <div className='card-title'>{children}</div>
const CardContent = ({children}) => <div className='card-content'>{children}</div>

const Section = ({id, title, subtitle, children}) => (
  <section id={id} className='section'>
    <div className='mb-6'>
      <h2 className='text-2xl sm:text-3xl font-bold tracking-tight'>{title}</h2>
      {subtitle && <p className='mt-2 text-muted max-w-3xl'>{subtitle}</p>}
    </div>
    {children}
  </section>
)

export default function App(){
  const year = new Date().getFullYear()
  return (
    <div>
      <header className='container py-16 flex flex-col gap-6'>
        <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-6'>
          <div>
            <h1 className='text-4xl sm:text-5xl font-extrabold tracking-tight'>Steven Nassef Henry</h1>
            <p className='mt-3 text-lg sm:text-xl text-muted max-w-2xl'>
              Senior Unity Engineer — gameplay systems, live‑ops, and high‑performance mobile experiences.
            </p>
            <div className='mt-4 flex flex-wrap items-center gap-2'>
              {['Unity','C#','DOTS','Netcode for Entities','Firebase','Adjust','AppsFlyer','PlayFab','Jenkins CI'].map((t,i)=>(<Badge key={i}>{t}</Badge>))}
            </div>
          </div>
          <div className='flex gap-2'>
            <a className='btn btn-outline' href='mailto:stevennassef97@gmail.com'><Mail className='h-4 w-4'/> Contact</a>
            <a className='btn btn-outline' href='https://github.com/StevenNassef' target='_blank' rel='noreferrer'><Github className='h-4 w-4'/> GitHub</a>
            <a className='btn btn-primary' href='https://www.linkedin.com/in/steven-nassef-henry-192366227/' target='_blank' rel='noreferrer'><Linkedin className='h-4 w-4'/> LinkedIn</a>
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

      <Section id='case-study' title='Case Study — Mergedom: Home Design' subtitle='Selected contributions from a large‑scale, ad/IAP‑driven mobile title.'>
        <div className='grid md:grid-cols-2 gap-6'>
          {projects.filter(p => p.key === 'mergdom').map(p => (
            <Card key={p.key}>
              <CardHeader>
                <CardTitle>{p.title}</CardTitle>
                <div className='text-sm text-muted'>Senior Unity Engineer</div>
              </CardHeader>
              <CardContent>
                <div className='media ratio-16x9 mb-4'>
                  <img src={p.image} alt={p.title + ' screenshot'} loading='lazy' />
                </div>
                <div className='media ratio-16x9 mb-4'>
                  <img src={p.video} alt={p.title + ' demo video'} loading='lazy' />
                </div>
                <ul className='list-disc pl-5 space-y-1 text-sm'>
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

      <Section id='projects' title='Selected Projects'>
        <div className='grid md:grid-cols-2 gap-6'>
          {projects.filter(p => p.key !== 'mergdom').map(p => (
            <Card key={p.key}>
              <CardHeader>
                <CardTitle>{p.title}</CardTitle>
                <div className='text-sm text-muted'>{p.role}</div>
              </CardHeader>
                <CardContent>
                    <MediaCarousel
                        title={p.title}
                        main={p.main}
                        gallery={p.gallery}
                        aspect="16 / 9"   // iPhone 13 Pro Max landscape
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

      <Section id='contact' title='Let’s work together' subtitle='Open to Senior/Lead Unity roles — remote or on‑site.'>
        <div className='flex flex-wrap gap-3'>
          <a className='btn btn-primary' href='mailto:stevennassef97@gmail.com'><Mail className='h-4 w-4'/> Email me</a>
          <a className='btn btn-outline' href='https://www.linkedin.com/in/steven-nassef-henry-192366227/' target='_blank' rel='noreferrer'><Linkedin className='h-4 w-4'/> Connect on LinkedIn</a>
          <a className='btn btn-outline' href='https://github.com/StevenNassef' target='_blank' rel='noreferrer'><Github className='h-4 w-4'/> View GitHub</a>
          <a className='btn btn-outline' href='#' onClick={(e)=> e.preventDefault()}><Download className='h-4 w-4'/> Download Resume (PDF)</a>
        </div>
      </Section>

      <footer className='py-10 text-center text-xs text-muted'>© {year} Steven Nassef Henry — Built with React & Tailwind</footer>
    </div>
  )
}