'use client';

import { useState, useEffect } from 'react';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Project } from '@/types';
import SiteHeader from '@/components/portfolio/SiteHeader';
import HeroSection from '@/components/portfolio/HeroSection';
import Marquee from '@/components/portfolio/Marquee';
import ProjectsOverview from '@/components/portfolio/ProjectsOverview';
import AboutSection from '@/components/portfolio/AboutSection';
import ContactSection from '@/components/portfolio/ContactSection';
import ProjectDetail from '@/components/portfolio/ProjectDetail';
import SiteFooter from '@/components/portfolio/SiteFooter';

type View = 'home' | 'project';

const FALLBACK_PROJECTS: Project[] = [
  {
    id: 'project1',
    title: 'N° by Inside Insight',
    year: '2025',
    location: 'Antwerpen',
    description:
      'Een minimalistisch stijlvol design van creative ontwerper/designer Bart Vermeulen van architenctenbureau N° by Inside Insight...',
    coverUrl: '/images/project1/part2/foto1.jpg',
    parts: [
      { id: 'part1', title: 'Eerste Deel', folder: 'images/project1/part1' },
      { id: 'part2', title: 'Tweede Deel', folder: 'images/project1/part2' },
      { id: 'part3', title: 'Derde Deel', folder: 'images/project1/part3' },
    ],
  },
  {
    id: 'project2',
    title: 'Coming soon',
    year: '',
    location: '',
    description: '',
    coverUrl: '/images/project2/cover.jpg',
    parts: [{ id: 'part1', title: 'Deel 1', folder: 'images/project2/part1' }],
  },
  {
    id: 'project3',
    title: 'Coming soon',
    year: '',
    location: '',
    description: '',
    coverUrl: '/images/project3/cover.jpg',
    parts: [{ id: 'part1', title: 'Deel 1', folder: 'images/project3/part1' }],
  },
];

export default function HomePage() {
  const [view, setView] = useState<View>('home');
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentProjectId, setCurrentProjectId] = useState<string | null>(null);

  useEffect(() => {
    async function loadProjects() {
      try {
        const q = query(collection(db, 'projects'), orderBy('order'));
        const snap = await getDocs(q);
        if (!snap.empty) {
          const loaded: Project[] = snap.docs.map((doc) => ({
            id: doc.id,
            ...(doc.data() as Omit<Project, 'id'>),
          }));
          setProjects(loaded);
        } else {
          setProjects(FALLBACK_PROJECTS);
        }
      } catch {
        setProjects(FALLBACK_PROJECTS);
      }
    }
    loadProjects();
  }, []);

  // Scroll-reveal: observe .reveal elements whenever the rendered view changes
  useEffect(() => {
    const els = document.querySelectorAll('.reveal:not(.in)');
    if (els.length === 0) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [view, projects]);

  const switchView = (newView: View) => {
    const apply = () => {
      setView(newView);
      window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
    };
    const doc = document as Document & {
      startViewTransition?: (cb: () => void) => void;
    };
    if (doc.startViewTransition && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      doc.startViewTransition(apply);
    } else {
      apply();
    }
  };

  const scrollToSection = (id: string) => {
    if (view !== 'home') {
      setView('home');
      // Wait for the home view to render before scrolling to the target section
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
        });
      });
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const goHome = () => {
    if (view !== 'home') switchView('home');
    else window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openProject = (id: string) => {
    setCurrentProjectId(id);
    switchView('project');
  };

  const closeProject = () => {
    setView('home');
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        document.getElementById('projects')?.scrollIntoView();
      });
    });
  };

  const currentProject = projects.find((p) => p.id === currentProjectId) ?? null;

  return (
    <>
      <SiteHeader
        onHome={goHome}
        onNav={scrollToSection}
        onBack={closeProject}
        showBack={view === 'project'}
      />

      {view === 'home' && (
        <main>
          <HeroSection onScrollToProjects={() => scrollToSection('projects')} />
          <Marquee />
          <ProjectsOverview projects={projects} onProjectClick={openProject} />
          <AboutSection />
          <ContactSection />
          <SiteFooter />
        </main>
      )}

      {view === 'project' && currentProject && (
        <main>
          <ProjectDetail project={currentProject} />
          <SiteFooter />
        </main>
      )}
    </>
  );
}
