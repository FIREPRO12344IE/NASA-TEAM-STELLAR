import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Helper function to extract metadata from title
function extractMetadata(title: string) {
  const metadata: {
    year?: number;
    organism?: string;
    experiment?: string;
    mission?: string;
  } = {};

  // Extract year (4-digit number)
  const yearMatch = title.match(/\b(19|20)\d{2}\b/);
  if (yearMatch) {
    metadata.year = parseInt(yearMatch[0]);
  }

  // Extract organism type
  const titleLower = title.toLowerCase();
  if (titleLower.includes('plant') || titleLower.includes('arabidopsis') || titleLower.includes('rice') || titleLower.includes('wheat')) {
    metadata.organism = 'Plant';
  } else if (titleLower.includes('mouse') || titleLower.includes('mice') || titleLower.includes('rat') || titleLower.includes('human')) {
    metadata.organism = 'Animal';
  } else if (titleLower.includes('bacteria') || titleLower.includes('microbe') || titleLower.includes('yeast') || titleLower.includes('fungi')) {
    metadata.organism = 'Microbe';
  }

  // Extract mission
  if (titleLower.includes('iss') || titleLower.includes('international space station')) {
    metadata.mission = 'ISS';
  } else if (titleLower.includes('mars')) {
    metadata.mission = 'Mars';
  } else if (titleLower.includes('moon') || titleLower.includes('lunar')) {
    metadata.mission = 'Moon';
  }

  // Extract experiment type
  if (titleLower.includes('radiation')) {
    metadata.experiment = 'Radiation';
  } else if (titleLower.includes('microgravity') || titleLower.includes('gravity')) {
    metadata.experiment = 'Microgravity';
  } else if (titleLower.includes('plant growth')) {
    metadata.experiment = 'Plant Growth';
  } else if (titleLower.includes('cell culture')) {
    metadata.experiment = 'Cell Culture';
  }

  return metadata;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { csvData } = await req.json();

    if (!csvData || !Array.isArray(csvData)) {
      return new Response(JSON.stringify({ error: 'Invalid CSV data' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const publications = csvData.map((row: any) => {
      const metadata = extractMetadata(row.Title || '');
      
      return {
        title: row.Title || row.title || '',
        pubmed_link: row['PubMed Central Link'] || row.link || '',
        year: metadata.year || null,
        organism_type: metadata.organism || null,
        experiment_type: metadata.experiment || null,
        mission: metadata.mission || null,
        abstract: row.abstract || null,
        keywords: row.keywords ? row.keywords.split(',').map((k: string) => k.trim()) : [],
        authors: row.authors ? row.authors.split(',').map((a: string) => a.trim()) : [],
      };
    });

    const { data, error } = await supabase
      .from('publications')
      .insert(publications)
      .select();

    if (error) {
      console.error('Insert error:', error);
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ 
      success: true, 
      count: data.length,
      message: `Successfully imported ${data.length} publications`
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});