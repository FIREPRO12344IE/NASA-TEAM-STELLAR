import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { Sidebar } from '@/components/Sidebar';
import { Dashboard } from '@/components/Dashboard';
import { Footer } from '@/components/Footer';
import { WelcomeAnimation } from '@/components/WelcomeAnimation';
import { FilterState } from '@/types/dashboard';
import { sampleResearchPapers } from '@/data/sampleData';
import { useAISearch } from '@/hooks/useAISearch';
import { usePublications } from '@/hooks/usePublications';

export function DashboardPage() {
  const [showWelcome, setShowWelcome] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    organismType: [],
    experimentType: [],
    yearRange: [2010, 2025],
    mission: [],
    searchQuery: ''
  });
  const [aiFilteredPaperIds, setAiFilteredPaperIds] = useState<string[] | null>(null);
  const { performAISearch, isSearching, searchResult } = useAISearch();
  const { publications, loading } = usePublications(filters, aiFilteredPaperIds);
  
  // Use real publications if available, otherwise fall back to sample data
  const displayPapers = publications.length > 0 ? publications : sampleResearchPapers;

  const handleSearchChange = (query: string) => {
    setFilters(prev => ({ ...prev, searchQuery: query }));
  };

  // Trigger AI search when search query changes
  useEffect(() => {
    const searchTimeout = setTimeout(async () => {
      if (filters.searchQuery.trim().length > 2) {
        const result = await performAISearch(filters.searchQuery, displayPapers);
        if (result?.paperIds) {
          setAiFilteredPaperIds(result.paperIds);
        }
      } else {
        setAiFilteredPaperIds(null);
      }
    }, 500); // Debounce for 500ms

    return () => clearTimeout(searchTimeout);
  }, [filters.searchQuery, displayPapers.length]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  if (showWelcome) {
    return <WelcomeAnimation onAnimationComplete={() => setShowWelcome(false)} />;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header 
        onSearchChange={handleSearchChange}
        searchQuery={filters.searchQuery}
        onMenuToggle={toggleSidebar}
        isAISearching={isSearching}
      />
      
      <div className="flex flex-1 relative">
        <Sidebar 
          filters={filters}
          onFiltersChange={setFilters}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
        
        <main className="flex-1 overflow-auto">
          <Dashboard 
            papers={displayPapers}
            filters={filters}
            aiFilteredPaperIds={aiFilteredPaperIds}
            searchResult={searchResult}
            isSearching={isSearching}
          />
        </main>
      </div>
      
      <Footer />
    </div>
  );
}