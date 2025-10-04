import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query, papers } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    console.log('AI Search Query:', query);
    console.log('Papers count:', papers?.length || 0);

    const systemPrompt = `You are an AI assistant specialized in NASA space biology research, helping researchers explore how humans, plants, and biological systems respond to space environments.

Your task is to analyze research papers and provide intelligent, insightful search results:

1. Understand the user's intent (organisms, missions, experiments, authors, topics, or general concepts)
2. Identify the most relevant papers based on scientific relevance and impact
3. Provide a clear, engaging summary that explains what was found and why it matters
4. If no exact matches exist, find related research and explain the connection
5. Suggest useful filters to help users explore further

Return ONLY a JSON object with this structure:
{
  "paperIds": ["id1", "id2", "id3"],
  "summary": "A clear 2-3 sentence summary of what was found and key insights from the research",
  "explanation": "Brief explanation of why these papers match the query",
  "suggestedFilters": {
    "organismType": ["Plant", "Animal"],
    "experimentType": ["Plant Growth Study"],
    "mission": ["ISS Expedition 68"]
  },
  "noResults": false
}

If no relevant papers are found, set "noResults": true, "paperIds": [], and provide a helpful "summary" like:
"No direct results found for your query, but here's what we found related to [topic]..." and suggest broader search terms or related topics.`;

    const userPrompt = `Search Query: "${query}"

Available Papers:
${papers.map((p: any) => `
ID: ${p.id}
Title: ${p.title}
Authors: ${p.authors.join(', ')}
Year: ${p.year}
Mission: ${p.mission}
Experiment Type: ${p.experimentType}
Organism Type: ${p.organismType}
Abstract: ${p.abstract}
Keywords: ${p.keywords.join(', ')}
Citations: ${p.citations}
Impact: ${p.impact}
`).join('\n---\n')}

Find the most relevant papers for this query and explain why.`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI Gateway error:', response.status, errorText);
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;
    
    console.log('AI Response:', aiResponse);

    // Parse the JSON response from AI
    const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
    const result = jsonMatch ? JSON.parse(jsonMatch[0]) : {
      paperIds: [],
      summary: "Unable to process your search. Please try again with different terms.",
      explanation: "Error processing AI response.",
      suggestedFilters: {},
      noResults: true
    };

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in ai-search function:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error',
        paperIds: [],
        explanation: 'An error occurred while processing your search.'
      }), 
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
