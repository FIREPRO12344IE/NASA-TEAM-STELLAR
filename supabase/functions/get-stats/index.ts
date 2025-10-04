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

    // Get publications by year
    const { data: yearData, error: yearError } = await supabase
      .from('publications')
      .select('year')
      .not('year', 'is', null);

    if (yearError) throw yearError;

    // Get publications by organism
    const { data: organismData, error: organismError } = await supabase
      .from('publications')
      .select('organism_type')
      .not('organism_type', 'is', null);

    if (organismError) throw organismError;

    // Get publications by experiment type
    const { data: experimentData, error: experimentError } = await supabase
      .from('publications')
      .select('experiment_type')
      .not('experiment_type', 'is', null);

    if (experimentError) throw experimentError;

    // Get publications by mission
    const { data: missionData, error: missionError } = await supabase
      .from('publications')
      .select('mission')
      .not('mission', 'is', null);

    if (missionError) throw missionError;

    // Count by year
    const yearCounts: Record<number, number> = {};
    yearData.forEach((item) => {
      yearCounts[item.year] = (yearCounts[item.year] || 0) + 1;
    });

    // Count by organism
    const organismCounts: Record<string, number> = {};
    organismData.forEach((item) => {
      organismCounts[item.organism_type] = (organismCounts[item.organism_type] || 0) + 1;
    });

    // Count by experiment
    const experimentCounts: Record<string, number> = {};
    experimentData.forEach((item) => {
      experimentCounts[item.experiment_type] = (experimentCounts[item.experiment_type] || 0) + 1;
    });

    // Count by mission
    const missionCounts: Record<string, number> = {};
    missionData.forEach((item) => {
      missionCounts[item.mission] = (missionCounts[item.mission] || 0) + 1;
    });

    const stats = {
      byYear: Object.entries(yearCounts).map(([year, count]) => ({
        year: parseInt(year),
        count,
      })).sort((a, b) => a.year - b.year),
      byOrganism: Object.entries(organismCounts).map(([type, count]) => ({
        type,
        count,
      })),
      byExperiment: Object.entries(experimentCounts).map(([type, count]) => ({
        type,
        count,
      })),
      byMission: Object.entries(missionCounts).map(([mission, count]) => ({
        mission,
        count,
      })),
      total: yearData.length,
    };

    return new Response(JSON.stringify(stats), {
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