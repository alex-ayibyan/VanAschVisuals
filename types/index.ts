export interface ProjectPart {
  id: string;
  title: string;
  folder?: string;
}

export interface Project {
  id: string;
  title: string;
  year?: string;
  location?: string;
  description?: string;
  coverUrl?: string;
  parts: ProjectPart[];
  order?: number;
}

export interface Photo {
  id: string;
  url: string;
  partId: string;
  order: number;
  name?: string;
}

export interface LightboxImage {
  src: string;
  title: string;
  description: string;
}
