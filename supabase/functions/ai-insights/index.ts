const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SYSTEM = `You are a witty senior product designer + design critic. Reply ONLY by calling the provided function.
- "summary": 2-3 sentence professional design overview.
- "roast": playful but kind 2-3 sentence roast of the website's design choices. Funny, never offensive.
- "hero": object analyzing hero/CTA: headline (string verdict), hierarchy (string), cta_visibility (string), conversion_score (0-100 number), tips (array of 2-4 short strings).
- "trends": array of detected design trends from this list ONLY: "Glassmorphism","Brutalism","Neumorphism","Bento Grid","Minimalism","Dark Mode","Maximalism","Aurora Gradients","3D / Spline","Retro / Y2K","Editorial","Skeuomorphism". Include only what genuinely fits.
- "vibe": one short label like "Premium SaaS", "Playful indie", "Corporate", "Editorial brand".`;

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  try {
    const { url, analysis } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) throw new Error('LOVABLE_API_KEY not configured');
    if (!analysis) throw new Error('analysis payload required');

    // Compact context to keep prompt small
    const ctx = {
      url,
      score: analysis.score,
      colors: (analysis.colors?.hex || analysis.colors || []).slice(0, 12),
      gradients: (analysis.colors?.gradients || []).slice(0, 4),
      fonts: analysis.fonts?.detected?.slice(0, 8) || [],
      googleFonts: analysis.fonts?.googleFonts?.length || 0,
      iconLibs: analysis.icons?.libraries || [],
      animations: {
        keyframes: analysis.animations?.keyframes?.length || 0,
        scroll: !!analysis.animations?.hasScrollAnimations,
        parallax: !!analysis.animations?.hasParallax,
      },
      tech: analysis.techStack || [],
      meta: {
        title: analysis.meta?.title,
        description: analysis.meta?.description,
        hasViewport: analysis.meta?.hasViewport,
        isHttps: analysis.meta?.isHttps,
      },
      imageCount: analysis.images?.length || analysis.meta?.imageCount || 0,
    };

    const tools = [{
      type: 'function',
      function: {
        name: 'emit_insights',
        description: 'Return structured AI design insights',
        parameters: {
          type: 'object',
          properties: {
            summary: { type: 'string' },
            roast: { type: 'string' },
            vibe: { type: 'string' },
            trends: { type: 'array', items: { type: 'string' } },
            hero: {
              type: 'object',
              properties: {
                headline: { type: 'string' },
                hierarchy: { type: 'string' },
                cta_visibility: { type: 'string' },
                conversion_score: { type: 'number' },
                tips: { type: 'array', items: { type: 'string' } },
              },
              required: ['headline', 'hierarchy', 'cta_visibility', 'conversion_score', 'tips'],
            },
          },
          required: ['summary', 'roast', 'vibe', 'trends', 'hero'],
        },
      },
    }];

    const resp = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-3-flash-preview',
        messages: [
          { role: 'system', content: SYSTEM },
          { role: 'user', content: `Analyze this website:\n${JSON.stringify(ctx)}` },
        ],
        tools,
        tool_choice: { type: 'function', function: { name: 'emit_insights' } },
      }),
    });

    if (resp.status === 429) {
      return new Response(JSON.stringify({ error: 'Rate limit exceeded, try again shortly.' }), {
        status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    if (resp.status === 402) {
      return new Response(JSON.stringify({ error: 'AI credits exhausted. Add credits in Settings → Workspace → Usage.' }), {
        status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    if (!resp.ok) {
      const t = await resp.text();
      console.error('AI gateway error', resp.status, t);
      return new Response(JSON.stringify({ error: 'AI gateway error' }), {
        status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const data = await resp.json();
    const call = data.choices?.[0]?.message?.tool_calls?.[0];
    const args = call ? JSON.parse(call.function.arguments) : null;
    if (!args) throw new Error('No insights returned');

    return new Response(JSON.stringify(args), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (e) {
    console.error('ai-insights error', e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : 'Unknown error' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
