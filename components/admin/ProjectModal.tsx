'use client';

import { useState, useEffect, FormEvent } from 'react';
import { Project, ProjectPart } from '@/types';

interface ProjectModalProps {
  project: Project | null;
  onSave: (data: Partial<Project>) => Promise<void>;
  onClose: () => void;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export default function ProjectModal({ project, onSave, onClose }: ProjectModalProps) {
  const isNew = project === null;

  const [title, setTitle] = useState(project?.title ?? '');
  const [year, setYear] = useState(project?.year ?? '');
  const [location, setLocation] = useState(project?.location ?? '');
  const [description, setDescription] = useState(project?.description ?? '');
  const [projectId, setProjectId] = useState(project?.id ?? '');
  const [parts, setParts] = useState<ProjectPart[]>(
    project?.parts ?? [{ id: 'part1', title: 'Deel 1' }]
  );
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isNew && title) {
      setProjectId(slugify(title));
    }
  }, [isNew, title]);

  const addPart = () => {
    const num = parts.length + 1;
    setParts([...parts, { id: `part${num}`, title: `Deel ${num}` }]);
  };

  const removePart = (index: number) => {
    setParts(parts.filter((_, i) => i !== index));
  };

  const updatePartTitle = (index: number, value: string) => {
    setParts(parts.map((p, i) => (i === index ? { ...p, title: value } : p)));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await onSave({ id: projectId, title, year, location, description, parts });
    setSaving(false);
  };

  return (
    <div className="modal-overlay open" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">{isNew ? 'Nieuw project' : 'Project bewerken'}</div>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-grid">
              <div className="form-group-admin span2">
                <label className="form-label">Titel</label>
                <input
                  type="text"
                  className="form-input"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
              <div className="form-group-admin">
                <label className="form-label">Jaar</label>
                <input
                  type="text"
                  className="form-input"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  placeholder="2025"
                />
              </div>
              <div className="form-group-admin">
                <label className="form-label">Locatie</label>
                <input
                  type="text"
                  className="form-input"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Antwerpen"
                />
              </div>
              <div className="form-group-admin span2">
                <label className="form-label">Omschrijving</label>
                <textarea
                  className="form-textarea"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              {isNew && (
                <div className="form-group-admin span2">
                  <label className="form-label">Project ID</label>
                  <input
                    type="text"
                    className="form-input"
                    value={projectId}
                    onChange={(e) => setProjectId(e.target.value)}
                    required
                  />
                  <div className="form-hint">Wordt automatisch gegenereerd vanuit de titel. Kan eenmalig aangepast worden.</div>
                </div>
              )}
            </div>

            <div className="parts-section">
              <div className="parts-header">
                <div className="parts-label">Onderdelen</div>
                <button type="button" className="btn-add-part" onClick={addPart}>+ Deel toevoegen</button>
              </div>
              <div className="parts-list">
                {parts.map((part, i) => (
                  <div key={i} className="part-item">
                    <div className="part-number-badge">{i + 1}</div>
                    <input
                      type="text"
                      className="form-input"
                      value={part.title}
                      onChange={(e) => updatePartTitle(i, e.target.value)}
                      placeholder={`Deel ${i + 1}`}
                    />
                    <button
                      type="button"
                      className="part-remove-btn"
                      onClick={() => removePart(i)}
                      disabled={parts.length <= 1}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn-cancel" onClick={onClose}>Annuleren</button>
            <button type="submit" className="btn-save" disabled={saving}>
              {saving ? 'Opslaan…' : 'Opslaan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
