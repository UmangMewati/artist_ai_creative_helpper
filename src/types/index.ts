export interface StyleProfile {
  id: string;
  name: string;
  lineWeight: 'thin' | 'medium' | 'thick';
  colorTone: 'warm' | 'cool' | 'neutral';
  shadingStyle: 'soft' | 'hard' | 'mixed';
  proportions: 'realistic' | 'stylized' | 'cartoon';
  createdAt: Date;
  sampleImages: string[];
}

export interface Project {
  id: string;
  name: string;
  styleProfile?: StyleProfile;
  versions: ProjectVersion[];
  currentVersionId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProjectVersion {
  id: string;
  projectId: string;
  imageUrl: string;
  title: string;
  description?: string;
  enhancements: Enhancement[];
  createdAt: Date;
}

export interface Enhancement {
  type: 'line-cleanup' | 'anatomy-fix' | 'symmetry' | 'perspective' | 'color-palette';
  applied: boolean;
  settings: Record<string, any>;
}

export interface ColorPalette {
  id: string;
  name: string;
  colors: string[];
  mood: 'warm' | 'cool' | 'dramatic' | 'sunset' | 'night' | 'natural';
  createdAt: Date;
}

export interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  suggestions?: string[];
  images?: string[];
  timestamp: Date;
}

export interface CompositionGuide {
  type: 'rule-of-thirds' | 'golden-ratio' | 'dynamic-arc' | 'depth-guide';
  enabled: boolean;
  opacity: number;
}