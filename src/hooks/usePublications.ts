import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ResearchPaper, FilterState } from '@/types/dashboard';
import { useToast } from '@/hooks/use-toast';

export function usePublications(filters: FilterState, aiFilteredPaperIds: string[] | null) {
  const [publications, setPublications] = useState<ResearchPaper[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchPublications();
  }, [filters.organismType, filters.experimentType, filters.yearRange, filters.mission]);

  const fetchPublications = async () => {
    try {
      setLoading(true);

      // Build query params
      const params = new URLSearchParams();
      
      if (filters.organismType.length > 0) {
        params.append('organism', filters.organismType[0]);
      }
      if (filters.experimentType.length > 0) {
        params.append('experiment', filters.experimentType[0]);
      }
      if (filters.mission.length > 0) {
        params.append('mission', filters.mission[0]);
      }

      const { data, error } = await supabase.functions.invoke('get-publications', {
        body: { filters }
      });

      if (error) throw error;

      // Transform data to match ResearchPaper interface
      const transformedData: ResearchPaper[] = (data || []).map((pub: any) => ({
        id: pub.id,
        title: pub.title,
        authors: pub.authors || [],
        year: pub.year || 2020,
        mission: pub.mission || 'Unknown',
        experimentType: pub.experiment_type || 'Unknown',
        organismType: (pub.organism_type as 'Plant' | 'Animal' | 'Microbe') || 'Microbe',
        abstract: pub.abstract || '',
        citations: pub.citations || 0,
        impact: pub.citations || 0,
        keywords: pub.keywords || [],
        pubmedLink: pub.pubmed_link,
      }));

      // Apply year range filter
      const filtered = transformedData.filter(pub => 
        pub.year >= filters.yearRange[0] && pub.year <= filters.yearRange[1]
      );

      setPublications(filtered);
    } catch (error) {
      console.error('Error fetching publications:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch publications. Using sample data.",
      });
      setPublications([]);
    } finally {
      setLoading(false);
    }
  };

  return { publications, loading, refetch: fetchPublications };
}
