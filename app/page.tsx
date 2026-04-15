'use client';

import { useState, useEffect } from 'react';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Project } from '@/types';
import HeroSection from '@/components/portfolio/HeroSection';
import AboutSection from '@/components/portfolio/AboutSection';
import ProjectsOverview from '@/components/portfolio/ProjectsOverview';
import ProjectDetail from '@/components/portfolio/ProjectDetail';
import ContactSection from '@/components/portfolio/ContactSection';

type View = 'home' | 'about' | 'overview' | 'project' | 'contact';

const FALLBACK_PROJECTS: Project[] = [
  {
    id: 'project1',
    title: 'N° by Inside Insight',
    year: '2025',
    location: 'Antwerpen',
    description:
      'Een minimalistisch stijlvol design van creative ontwerper/designer Bart Vermeulen van architenctenbureau N° by Inside Insight...',
    coverUrl: '/images/project1/cover.jpg',
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

  const navigate = (newView: View) => {
    setView(newView);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openProject = (id: string) => {
    setCurrentProjectId(id);
    navigate('project');
  };

  const currentProject = projects.find((p) => p.id === currentProjectId) ?? null;

  const showBack = view !== 'home';

  return (
    <>
      {showBack && (
        <button
          className="back-btn active"
          onClick={() => {
            if (view === 'project') navigate('overview');
            else navigate('home');
          }}
        >
          {view === 'project' ? '← Alle Projecten' : '← Terug'}
        </button>
      )}

      {view === 'home' && (
        <HeroSection
          onAbout={() => navigate('about')}
          onWork={() => navigate('overview')}
          onContact={() => navigate('contact')}
        />
      )}

      {view === 'about' && <AboutSection />}

      {view === 'overview' && (
        <ProjectsOverview projects={projects} onProjectClick={openProject} />
      )}

      {view === 'project' && currentProject && (
        <ProjectDetail project={currentProject} />
      )}

      {view === 'contact' && <ContactSection />}
    </>
  );
}
