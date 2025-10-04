-- Create table for NASA research publications
CREATE TABLE IF NOT EXISTS public.publications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  pubmed_link TEXT,
  year INTEGER,
  organism_type TEXT,
  experiment_type TEXT,
  mission TEXT,
  abstract TEXT,
  keywords TEXT[],
  authors TEXT[],
  citations INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.publications ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access (anyone can view publications)
CREATE POLICY "Publications are viewable by everyone" 
ON public.publications 
FOR SELECT 
USING (true);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_publications_year ON public.publications(year);
CREATE INDEX IF NOT EXISTS idx_publications_organism ON public.publications(organism_type);
CREATE INDEX IF NOT EXISTS idx_publications_experiment ON public.publications(experiment_type);
CREATE INDEX IF NOT EXISTS idx_publications_mission ON public.publications(mission);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_publications_updated_at
BEFORE UPDATE ON public.publications
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add full-text search capability
ALTER TABLE public.publications ADD COLUMN IF NOT EXISTS search_vector tsvector;

CREATE INDEX IF NOT EXISTS idx_publications_search ON public.publications USING gin(search_vector);

-- Create function to update search vector
CREATE OR REPLACE FUNCTION public.update_publication_search_vector()
RETURNS TRIGGER AS $$
BEGIN
  NEW.search_vector := 
    setweight(to_tsvector('english', coalesce(NEW.title, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(NEW.abstract, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(array_to_string(NEW.keywords, ' '), '')), 'C');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic search vector updates
CREATE TRIGGER update_publications_search_vector
BEFORE INSERT OR UPDATE ON public.publications
FOR EACH ROW
EXECUTE FUNCTION public.update_publication_search_vector();