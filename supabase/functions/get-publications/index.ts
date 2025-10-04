import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const url = new URL(req.url);
    const year = url.searchParams.get('year');
    const organism = url.searchParams.get('organism');
    const experiment = url.searchParams.get('experiment');
    const mission = url.searchParams.get('mission');
    const search = url.searchParams.get('q');

    let query = supabase.from('publications').select('*');

    // Apply filters
    if (year) {
      query = query.eq('year', parseInt(year));
    }
    if (organism) {
      query = query.eq('organism_type', organism);
    }
    if (experiment) {
      query = query.eq('experiment_type', experiment);
    }
    if (mission) {
      query = query.eq('mission', mission);
    }
    if (search) {
      query = query.textSearch('search_vector', search, {
        type: 'websearch',
        config: 'english'
      });
    }

    query = query.order('year', { ascending: false });

    const { data, error } = await query;

    if (error) {
      console.error('Database error:', error);
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify(data), {
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