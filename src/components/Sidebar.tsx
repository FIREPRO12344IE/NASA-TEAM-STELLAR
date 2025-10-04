import { useState } from 'react';
import { ChevronDown, ChevronRight, Filter, X, Leaf, Bug, Microscope, Beaker, Rocket, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Card } from '@/components/ui/card';
import { FilterState } from '@/types/dashboard';
import { organismTypes, experimentTypes, missions } from '@/data/sampleData';

interface SidebarProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ filters, onFiltersChange, isOpen, onClose }: SidebarProps) {
  const [expandedSections, setExpandedSections] = useState({
    organism: true,
    experiment: true,
    year: true,
    mission: true
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const updateFilter = (key: keyof FilterState, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const clearFilters = () => {
    onFiltersChange({
      organismType: [],
      experimentType: [],
      yearRange: [2010, 2025],
      mission: [],
      searchQuery: ''
    });
  };

  const getOrganismIcon = (type: string) => {
    switch (type) {
      case 'Plant': return <Leaf className="h-4 w-4 text-nasa-green" />;
      case 'Animal': return <Bug className="h-4 w-4 text-nasa-blue" />;
      case 'Microbe': return <Microscope className="h-4 w-4 text-nasa-orange" />;
      default: return null;
    }
  };

  const FilterSection = ({ 
    title, 
    section,
    icon,
    children 
  }: { 
    title: string; 
    section: keyof typeof expandedSections;
    icon?: React.ReactNode;
    children: React.ReactNode;
  }) => (
    <div className="border-b border-border last:border-b-0">
      <button
        onClick={() => toggleSection(section)}
        className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
      >
        <div className="flex items-center gap-2">
          {icon}
          <span className="font-medium text-foreground">{title}</span>
        </div>
        {expandedSections[section] ? (
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        ) : (
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        )}
      </button>
      {expandedSections[section] && (
        <div className="px-4 pb-4 space-y-3">
          {children}
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <aside className={`
        fixed top-[73px] left-0 h-[calc(100vh-73px)] w-80 bg-card border-r border-border z-50
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        md:relative md:top-0 md:h-[calc(100vh-73px)] md:translate-x-0
        overflow-y-auto
      `}>
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-primary" />
              <h2 className="font-semibold text-foreground">Filters</h2>
            </div>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="text-xs btn-enhanced hover:bg-destructive/10 hover:text-destructive"
              >
                Clear All
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="md:hidden h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="divide-y divide-border">
          <FilterSection 
            title="Organism Type" 
            section="organism"
            icon={<Leaf className="h-4 w-4 text-nasa-green" />}
          >
            <div className="space-y-2">
              {organismTypes.map((type) => (
                <div key={type} className="filter-item">
                  <Checkbox
                    id={`organism-${type}`}
                    checked={filters.organismType.includes(type)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        updateFilter('organismType', [...filters.organismType, type]);
                      } else {
                        updateFilter('organismType', filters.organismType.filter(t => t !== type));
                      }
                    }}
                    className="transition-colors duration-200"
                  />
                  {getOrganismIcon(type)}
                  <label 
                    htmlFor={`organism-${type}`}
                    className="text-sm text-foreground cursor-pointer flex-1"
                  >
                    {type}
                  </label>
                </div>
              ))}
            </div>
          </FilterSection>

          <FilterSection 
            title="Experiment Type" 
            section="experiment"
            icon={<Beaker className="h-4 w-4 text-nasa-orange" />}
          >
            <div className="space-y-2">
              {experimentTypes.map((type) => (
                <div key={type} className="filter-item">
                  <Checkbox
                    id={`experiment-${type}`}
                    checked={filters.experimentType.includes(type)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        updateFilter('experimentType', [...filters.experimentType, type]);
                      } else {
                        updateFilter('experimentType', filters.experimentType.filter(t => t !== type));
                      }
                    }}
                    className="transition-colors duration-200"
                  />
                  <label 
                    htmlFor={`experiment-${type}`}
                    className="text-sm text-foreground cursor-pointer flex-1"
                  >
                    {type}
                  </label>
                </div>
              ))}
            </div>
          </FilterSection>

          <FilterSection 
            title="Year Range" 
            section="year"
            icon={<Calendar className="h-4 w-4 text-nasa-blue" />}
          >
            <div className="space-y-4">
              <div className="px-2">
                <Slider
                  value={filters.yearRange}
                  onValueChange={(value) => updateFilter('yearRange', value as [number, number])}
                  max={2025}
                  min={2010}
                  step={1}
                  className="w-full"
                />
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>{filters.yearRange[0]}</span>
                <span>{filters.yearRange[1]}</span>
              </div>
            </div>
          </FilterSection>

          <FilterSection 
            title="Mission" 
            section="mission"
            icon={<Rocket className="h-4 w-4 text-nasa-yellow" />}
          >
            <div className="space-y-2">
              {missions.map((mission) => (
                <div key={mission} className="filter-item">
                  <Checkbox
                    id={`mission-${mission}`}
                    checked={filters.mission.includes(mission)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        updateFilter('mission', [...filters.mission, mission]);
                      } else {
                        updateFilter('mission', filters.mission.filter(m => m !== mission));
                      }
                    }}
                    className="transition-colors duration-200"
                  />
                  <label 
                    htmlFor={`mission-${mission}`}
                    className="text-sm text-foreground cursor-pointer leading-tight flex-1"
                  >
                    {mission}
                  </label>
                </div>
              ))}
            </div>
          </FilterSection>
        </div>
      </aside>
    </>
  );
}