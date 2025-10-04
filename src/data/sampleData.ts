import { ResearchPaper } from '@/types/dashboard';

export const sampleResearchPapers: ResearchPaper[] = [
  {
    id: '1',
    title: 'Microgravity Effects on Arabidopsis Growth Patterns',
    authors: ['Dr. Sarah Chen', 'Dr. Michael Rodriguez', 'Dr. Lisa Thompson'],
    year: 2023,
    mission: 'ISS Expedition 68',
    experimentType: 'Plant Growth Study',
    organismType: 'Plant',
    abstract: 'Investigation of how microgravity affects the cellular development and root growth patterns in Arabidopsis thaliana specimens during extended spaceflight conditions.',
    citations: 45,
    impact: 8.2,
    keywords: ['microgravity', 'plant biology', 'root development', 'ISS']
  },
  {
    id: '2',
    title: 'Tardigrade Survivability in Deep Space Radiation',
    authors: ['Dr. James Wilson', 'Dr. Elena Kowalski'],
    year: 2024,
    mission: 'Artemis Lunar Gateway',
    experimentType: 'Radiation Resistance',
    organismType: 'Animal',
    abstract: 'Comprehensive analysis of tardigrade molecular mechanisms enabling survival in extreme radiation environments encountered during lunar missions.',
    citations: 67,
    impact: 9.1,
    keywords: ['tardigrades', 'radiation', 'extremophiles', 'lunar research']
  },
  {
    id: '3',
    title: 'Bacterial Biofilm Formation in Simulated Mars Atmosphere',
    authors: ['Dr. Robert Kim', 'Dr. Anna Petrov', 'Dr. Carlos Mendez'],
    year: 2023,
    mission: 'Mars Analog Research',
    experimentType: 'Microbial Ecology',
    organismType: 'Microbe',
    abstract: 'Study of bacterial biofilm development under Mars-like atmospheric conditions and its implications for potential life detection missions.',
    citations: 32,
    impact: 7.5,
    keywords: ['biofilms', 'Mars simulation', 'astrobiology', 'bacteria']
  },
  {
    id: '4',
    title: 'Zebrafish Cardiovascular Adaptation to Zero Gravity',
    authors: ['Dr. Maria Garcia', 'Dr. Thomas Anderson'],
    year: 2022,
    mission: 'SpaceX Dragon CRS-25',
    experimentType: 'Physiological Study',
    organismType: 'Animal',
    abstract: 'Examination of cardiovascular system adaptations in zebrafish exposed to microgravity conditions over extended periods.',
    citations: 58,
    impact: 8.7,
    keywords: ['zebrafish', 'cardiovascular', 'microgravity', 'adaptation']
  },
  {
    id: '5',
    title: 'Moss Spore Germination Under Cosmic Radiation',
    authors: ['Dr. Jennifer Liu', 'Dr. David Nakamura'],
    year: 2024,
    mission: 'ISS Expedition 70',
    experimentType: 'Reproductive Biology',
    organismType: 'Plant',
    abstract: 'Investigation of moss reproductive cycles and spore viability when exposed to cosmic radiation during long-duration spaceflight.',
    citations: 23,
    impact: 6.8,
    keywords: ['moss', 'reproduction', 'cosmic radiation', 'spores']
  },
  {
    id: '6',
    title: 'Extremophile Metabolic Pathways in Vacuum Conditions',
    authors: ['Dr. Ahmed Hassan', 'Dr. Sophie Laurent'],
    year: 2023,
    mission: 'ESA Columbus Laboratory',
    experimentType: 'Biochemical Analysis',
    organismType: 'Microbe',
    abstract: 'Detailed analysis of metabolic pathway modifications in extremophile bacteria when subjected to vacuum conditions similar to outer space.',
    citations: 41,
    impact: 8.9,
    keywords: ['extremophiles', 'metabolism', 'vacuum', 'biochemistry']
  }
];

export const missions = [
  'ISS Expedition 68',
  'Artemis Lunar Gateway',
  'Mars Analog Research',
  'SpaceX Dragon CRS-25',
  'ISS Expedition 70',
  'ESA Columbus Laboratory'
];

export const experimentTypes = [
  'Plant Growth Study',
  'Radiation Resistance',
  'Microbial Ecology',
  'Physiological Study',
  'Reproductive Biology',
  'Biochemical Analysis'
];

export const organismTypes = ['Plant', 'Animal', 'Microbe'];