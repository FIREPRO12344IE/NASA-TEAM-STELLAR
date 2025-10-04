import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ResearchPaper } from '@/types/dashboard';
import { toast } from '@/hooks/use-toast';

interface AISearchResult {
  paperIds: string[];
  summary?: string;
  explanation: string;
  noResults?: boolean;
  suggestedFilters?: {
    organismType?: string[];
    experimentType?: string[];
    mission?: string[];
  };
}

export function useAISearch() {
  const [isSearching, setIsSearching] = useState(false);
  const [searchResult, setSearchResult] = useState<AISearchResult | null>(null);

  const performAISearch = async (query: string, papers: ResearchPaper[]) => {
    if (!query.trim() || papers.length === 0) {
      setSearchResult(null);
      return null;
    }

    setIsSearching(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-search', {
        body: { query, papers }
      });

      if (error) {
        console.error('AI Search error:', error);
        toast({
          title: "Search Error",
          description: "Failed to perform AI search. Using basic search instead.",
          variant: "destructive"
        });
        return null;
      }

      setSearchResult(data);
      return data;
    } catch (error) {
      console.error('AI Search error:', error);
      toast({
        title: "Search Error",
        description: "An unexpected error occurred.",
        variant: "destructive"
      });
      return null;
    } finally {
      setIsSearching(false);
    }
  };

  return {
    performAISearch,
    isSearching,
    searchResult,
    clearSearch: () => setSearchResult(null)
  };
}
