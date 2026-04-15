'use client';

import { useState, useEffect } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth, firebaseConfig } from '@/lib/firebase';
import { Project } from '@/types';
import LoginScreen from '@/components/admin/LoginScreen';
import ProjectsList from '@/components/admin/ProjectsList';
import PhotosManager from '@/components/admin/PhotosManager';

type AdminView = 'projects' | 'photos';

const IS_CONFIGURED = !firebaseConfig.apiKey.includes('JOUW');

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [view, setView] = useState<AdminView>('projects');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setAuthenticated(!!user);
    });
    return unsub;
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    setAuthenticated(false);
  };

  const handleManagePhotos = (project: Project) => {
    setSelectedProject(project);
    setView('photos');
  };

  const handleBack = () => {
    setSelectedProject(null);
    setView('projects');
  };

  // Loading state
  if (authenticated === null) {
    return (
      <div className="loading-state" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div className="loading-spinner" />
        <p>Laden…</p>
      </div>
    );
  }

  if (!authenticated) {
    return (
      <>
        {!IS_CONFIGURED && (
          <div className="setup-banner">
            <span className="setup-banner-icon">⚠️</span>
            <div>
              <strong>Firebase nog niet ingesteld.</strong>{' '}
              Vul je Firebase-configuratie in <code>lib/firebase.ts</code>.
            </div>
          </div>
        )}
        <LoginScreen onLogin={() => setAuthenticated(true)} />
      </>
    );
  }

  return (
    <div>
      {!IS_CONFIGURED && (
        <div className="setup-banner">
          <span className="setup-banner-icon">⚠️</span>
          <div>
            <strong>Firebase nog niet ingesteld.</strong>{' '}
            Vul je Firebase-configuratie in <code>lib/firebase.ts</code>.
          </div>
        </div>
      )}

      <header className="admin-header">
        <div className="admin-header-left">
          <span className="admin-logo">Portfolio</span>
          <span className="admin-badge">Beheer</span>
        </div>
        <div className="admin-header-actions">
          <div className="status-bar">
            <div className="status-dot" />
            <span>Firebase</span>
          </div>
          <a className="header-btn" href="/" target="_blank" rel="noopener noreferrer">
            Bekijk site ↗
          </a>
          <button className="header-btn" onClick={handleLogout}>
            Uitloggen
          </button>
        </div>
      </header>

      {view === 'projects' && (
        <ProjectsList
          onManagePhotos={handleManagePhotos}
          onEdit={() => {}}
        />
      )}

      {view === 'photos' && selectedProject && (
        <div className="admin-main">
          <PhotosManager project={selectedProject} onBack={handleBack} />
        </div>
      )}
    </div>
  );
}
