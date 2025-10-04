export interface ResearchPaper {
  id: string;
  title: string;
  authors: string[];
  year: number;
  mission: string;
  experimentType: string;
  organismType: 'Plant' | 'Animal' | 'Microbe';
  abstract: string;
  citations: number;
  impact: number;
  keywords: string[];
  pubmedLink?: string;
}

export interface FilterState {
  organismType: string[];
  experimentType: string[];
  yearRange: [number, number];
  mission: string[];
  searchQuery: string;
}

export interface ChartData {
  name: string;
  value: number;
  color?: string;
}

export interface NetworkNode {
  id: string;
  label: string;
  type: 'paper' | 'organism' | 'mission' | 'experiment';
  size: number;
  color: string;
}

export interface NetworkEdge {
  source: string;
  target: string;
  weight: number;
}