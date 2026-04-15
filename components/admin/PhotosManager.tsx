'use client';

import { useState, useEffect, useRef, DragEvent, ChangeEvent } from 'react';
import {
  collection,
  onSnapshot,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
  query,
  orderBy,
  writeBatch,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Project, Photo } from '@/types';

// ── Cloudinary config ──────────────────────────────────────────
const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!;
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!;
// ──────────────────────────────────────────────────────────────

interface PhotosManagerProps {
  project: Project;
  onBack: () => void;
}

interface UploadItem {
  uid: string;
  name: string;
  progress: number;
  status: 'uploading' | 'done' | 'error';
}

function uploadToCloudinary(
  file: File,
  onProgress: (pct: number) => void,
): Promise<string> {
  return new Promise((resolve, reject) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', UPLOAD_PRESET);

    const xhr = new XMLHttpRequest();
    xhr.open('POST', `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`);

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) onProgress(Math.round((e.loaded / e.total) * 100));
    };
    xhr.onload = () => {
      if (xhr.status === 200) {
        resolve(JSON.parse(xhr.responseText).secure_url as string);
      } else {
        reject(new Error(`Upload mislukt (${xhr.status})`));
      }
    };
    xhr.onerror = () => reject(new Error('Netwerkfout tijdens upload'));
    xhr.send(formData);
  });
}

export default function PhotosManager({ project, onBack }: PhotosManagerProps) {
  const [activePartId, setActivePartId] = useState(project.parts[0]?.id ?? '');
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [uploads, setUploads] = useState<UploadItem[]>([]);
  const [coverUrl, setCoverUrl] = useState(project.coverUrl ?? '');
  const [dragOver, setDragOver] = useState(false);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dragTargetIndex, setDragTargetIndex] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const q = query(
      collection(db, `projects/${project.id}/photos`),
      orderBy('order'),
    );
    const unsub = onSnapshot(q, (snap) => {
      const data = snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Photo, 'id'>) }));
      setPhotos(data.filter((p) => p.partId === activePartId).sort((a, b) => a.order - b.order));
    });
    return unsub;
  }, [project.id, activePartId]);

  const updateUpload = (uid: string, patch: Partial<UploadItem>) => {
    setUploads((prev) => prev.map((u) => (u.uid === uid ? { ...u, ...patch } : u)));
  };

  const uploadFiles = async (files: File[]) => {
    const imageFiles = files.filter((f) => f.type.startsWith('image/'));
    if (!imageFiles.length) return;

    const startOrder = photos.length;

    const newItems: UploadItem[] = imageFiles.map((f) => ({
      uid: `${Date.now()}-${f.name}`,
      name: f.name,
      progress: 0,
      status: 'uploading',
    }));
    setUploads((prev) => [...prev, ...newItems]);

    await Promise.all(
      imageFiles.map(async (file, idx) => {
        const uid = newItems[idx].uid;
        try {
          const url = await uploadToCloudinary(file, (pct) =>
            updateUpload(uid, { progress: pct }),
          );
          await addDoc(collection(db, `projects/${project.id}/photos`), {
            url,
            partId: activePartId,
            order: startOrder + idx,
            name: file.name,
          });
          updateUpload(uid, { status: 'done', progress: 100 });
        } catch (err) {
          console.error('Upload fout:', err);
          updateUpload(uid, { status: 'error' });
        }
      }),
    );
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    uploadFiles(Array.from(e.dataTransfer.files));
  };

  const handleFileInput = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      uploadFiles(Array.from(e.target.files));
      e.target.value = '';
    }
  };

  const deletePhoto = async (photo: Photo) => {
    if (!confirm('Foto verwijderen?')) return;
    await deleteDoc(doc(db, `projects/${project.id}/photos`, photo.id));
  };

  const handlePhotoDragStart = (index: number) => setDragIndex(index);

  const handlePhotoDrop = async (targetIndex: number) => {
    if (dragIndex === null || dragIndex === targetIndex) {
      setDragIndex(null);
      setDragTargetIndex(null);
      return;
    }
    const reordered = [...photos];
    const [moved] = reordered.splice(dragIndex, 1);
    reordered.splice(targetIndex, 0, moved);

    const batch = writeBatch(db);
    reordered.forEach((p, i) => {
      batch.update(doc(db, `projects/${project.id}/photos`, p.id), { order: i });
    });
    await batch.commit();

    setDragIndex(null);
    setDragTargetIndex(null);
  };

  const uploadCover = async (file: File) => {
    try {
      const url = await uploadToCloudinary(file, () => {});
      await updateDoc(doc(db, 'projects', project.id), { coverUrl: url });
      setCoverUrl(url);
    } catch (err) {
      console.error('Cover upload fout:', err);
    }
  };

  return (
    <div>
      <div className="photos-nav">
        <button className="back-link" onClick={onBack}>← Alle projecten</button>
        <h1 className="photos-project-title">{project.title}</h1>
      </div>

      {/* Cover section */}
      <div className="cover-section">
        <div className="cover-section-title">
          Cover afbeelding <span>Wordt getoond op de projectenkaart</span>
        </div>
        <div className="cover-upload-row">
          {coverUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img className="cover-thumb" src={coverUrl} alt="Cover" />
          ) : (
            <div className="cover-thumb-placeholder">📷</div>
          )}
          <div className="cover-upload-info">
            Aanbevolen: 800×1000px of groter, JPG of PNG.
          </div>
          <button className="btn-cover-upload" onClick={() => coverInputRef.current?.click()}>
            Cover uploaden
          </button>
          <input
            type="file"
            ref={coverInputRef}
            accept="image/*"
            style={{ display: 'none' }}
            onChange={(e) => e.target.files?.[0] && uploadCover(e.target.files[0])}
          />
        </div>
      </div>

      {/* Part tabs */}
      {project.parts.length > 1 && (
        <div className="part-tabs">
          {project.parts.map((part) => (
            <button
              key={part.id}
              className={`part-tab${part.id === activePartId ? ' active' : ''}`}
              onClick={() => setActivePartId(part.id)}
            >
              {part.title}
            </button>
          ))}
        </div>
      )}

      {/* Upload zone */}
      <div
        className={`upload-zone${dragOver ? ' drag-over' : ''}`}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <div className="upload-zone-icon">📸</div>
        <div className="upload-zone-text">
          Sleep foto&apos;s hierheen of <span>klik om te uploaden</span>
        </div>
        <div className="upload-zone-hint">JPG, PNG — meerdere bestanden tegelijk mogelijk</div>
        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          multiple
          style={{ display: 'none' }}
          onChange={handleFileInput}
        />
      </div>

      {/* Upload queue */}
      {uploads.length > 0 && (
        <div className="upload-queue">
          {uploads.map((u) => (
            <div key={u.uid} className="upload-item">
              <span className="upload-item-name">{u.name}</span>
              <div className="upload-item-progress">
                <div className="upload-item-bar" style={{ width: `${u.progress}%` }} />
              </div>
              <span className={`upload-item-status${u.status === 'done' ? ' done' : u.status === 'error' ? ' error' : ''}`}>
                {u.status === 'done' ? '✓' : u.status === 'error' ? '✗' : `${u.progress}%`}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Photo grid */}
      <div className="photo-grid">
        {photos.length === 0 ? (
          <div className="photo-empty-state">
            <div className="photo-empty-icon">📷</div>
            <div className="photo-empty-text">Nog geen foto&apos;s</div>
          </div>
        ) : (
          photos.map((photo, i) => (
            <div
              key={photo.id}
              className={`photo-item${dragIndex === i ? ' dragging' : ''}${dragTargetIndex === i ? ' drag-target' : ''}`}
              draggable
              onDragStart={() => handlePhotoDragStart(i)}
              onDragOver={(e) => { e.preventDefault(); setDragTargetIndex(i); }}
              onDrop={() => handlePhotoDrop(i)}
              onDragEnd={() => { setDragIndex(null); setDragTargetIndex(null); }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={photo.url} alt={photo.name ?? `Foto ${i + 1}`} loading="lazy" />
              <div className="photo-drag-hint">⠿</div>
              <div className="photo-item-overlay">
                <span className="photo-item-num">{i + 1}</span>
                <button
                  className="photo-delete-btn"
                  onClick={(e) => { e.stopPropagation(); deletePhoto(photo); }}
                >
                  ×
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
