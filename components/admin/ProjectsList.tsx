'use client';

import { useState, useEffect } from 'react';
import {
  collection,
  onSnapshot,
  deleteDoc,
  doc,
  setDoc,
  updateDoc,
  query,
  orderBy,
  writeBatch,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Project } from '@/types';
import ProjectModal from './ProjectModal';

interface ProjectsListProps {
  onManagePhotos: (project: Project) => void;
  onEdit: (project: Project) => void;
}

export default function ProjectsList({ onManagePhotos, onEdit }: ProjectsListProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editProject, setEditProject] = useState<Project | null>(null);

  useEffect(() => {
    const q = query(collection(db, 'projects'), orderBy('order'));
    const unsub = onSnapshot(q, (snap) => {
      const data = snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Project, 'id'>) }));
      setProjects(data);
      setLoading(false);
    });
    return unsub;
  }, []);

  const handleDelete = async (project: Project) => {
    if (!confirm(`Project "${project.title}" verwijderen? Dit kan niet ongedaan worden.`)) return;
    await deleteDoc(doc(db, 'projects', project.id));
  };

  const handleSave = async (data: Partial<Project>) => {
    if (!data.id) return;
    const { id, ...rest } = data;
    if (editProject) {
      // Edit existing
      await updateDoc(doc(db, 'projects', editProject.id), rest);
      onEdit({ ...editProject, ...rest } as Project);
    } else {
      // Create new
      const order = projects.length;
      await setDoc(doc(db, 'projects', id), { ...rest, order });
    }
    setShowModal(false);
    setEditProject(null);
  };

  const moveProject = async (index: number, dir: 1 | -1) => {
    const swapIndex = index + dir;
    if (swapIndex < 0 || swapIndex >= projects.length) return;
    const batch = writeBatch(db);
    batch.update(doc(db, 'projects', projects[index].id), { order: swapIndex });
    batch.update(doc(db, 'projects', projects[swapIndex].id), { order: index });
    await batch.commit();
  };

  const openEdit = (project: Project) => {
    setEditProject(project);
    setShowModal(true);
  };

  const openNew = () => {
    setEditProject(null);
    setShowModal(true);
  };

  return (
    <>
      <main className="admin-main">
        <h1 className="page-title">Projecten</h1>
        <p className="page-subtitle">Portfolio beheer</p>

        <div className="toolbar">
          <div className="toolbar-left">
            {loading ? 'Laden…' : `${projects.length} project${projects.length !== 1 ? 'en' : ''}`}
          </div>
          <button className="btn-add" onClick={openNew}>
            <span>+</span> Nieuw project
          </button>
        </div>

        <div className="projects-list">
          {loading ? (
            <div className="loading-state">
              <div className="loading-spinner" />
              <p>Projecten laden…</p>
            </div>
          ) : projects.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">📁</div>
              <div className="empty-state-title">Geen projecten</div>
              <div className="empty-state-desc">Maak je eerste project aan via de knop hierboven.</div>
            </div>
          ) : (
            projects.map((project, i) => (
              <div key={project.id} className="project-row">
                {project.coverUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img className="project-thumb" src={project.coverUrl} alt={project.title} />
                ) : (
                  <div className="project-thumb-placeholder">✦</div>
                )}
                <div className="project-info">
                  <div className="project-info-title">{project.title}</div>
                  <div className="project-info-meta">
                    {[project.year, project.location].filter(Boolean).join(' — ')}
                  </div>
                  <div className="project-info-parts">
                    {project.parts?.length ?? 0} onderdeel{(project.parts?.length ?? 0) !== 1 ? 'en' : ''}
                  </div>
                </div>
                <div className="project-actions">
                  <button className="row-btn move" onClick={() => moveProject(i, -1)} title="Omhoog">↑</button>
                  <button className="row-btn move" onClick={() => moveProject(i, 1)} title="Omlaag">↓</button>
                  <button className="row-btn photos" onClick={() => onManagePhotos(project)} title="Foto&apos;s beheren">📷</button>
                  <button className="row-btn edit" onClick={() => openEdit(project)} title="Bewerken">✎</button>
                  <button className="row-btn del" onClick={() => handleDelete(project)} title="Verwijderen">🗑</button>
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      {showModal && (
        <ProjectModal
          project={editProject}
          onSave={handleSave}
          onClose={() => { setShowModal(false); setEditProject(null); }}
        />
      )}
    </>
  );
}
