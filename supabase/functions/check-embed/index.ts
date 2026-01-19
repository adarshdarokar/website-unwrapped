// Supabase Edge Function: check-embed
// Determines whether a given URL is likely embeddable in an iframe.

import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

type EmbedCheckResponse = {
  url: string;
  embeddable: boolean;
  reason?: string;
  headers?: {
    xFrameOptions?: string | null;
    contentSecurityPolicy?: string | null;
  };
};

function parseFrameAncestors(csp: string | null): string | null {
  if (!csp) return null;
  const match = csp.match(/(?:^|;)\s*frame-ancestors\s+([^;]+)/i);
  return match?.[1]?.trim() ?? null;
}

function decideEmbeddable(headers: Headers): { embeddable: boolean; reason?: string } {
  const xfo = headers.get("x-frame-options");
  if (xfo) {
    const v = xfo.toLowerCase();
    if (v.includes("deny")) return { embeddable: false, reason: "X-Frame-Options: DENY" };
    if (v.includes("sameorigin")) return { embeddable: false, reason: "X-Frame-Options: SAMEORIGIN" };
  }

  const csp = headers.get("content-security-policy");
  const fa = parseFrameAncestors(csp);
  if (fa) {
    const v = fa.toLowerCase();
    // Conservative: if it's locked to self/none, we treat as non-embeddable from our domain.
    if (v.includes("'none'")) return { embeddable: false, reason: "CSP frame-ancestors 'none'" };
    if (v.includes("'self'")) return { embeddable: false, reason: "CSP frame-ancestors 'self'" };
  }

  return { embeddable: true };
}

async function fetchHeaders(url: string): Promise<Headers> {
  // Prefer HEAD; fallback to GET if blocked.
  try {
    const r = await fetch(url, { method: "HEAD", redirect: "follow" });
    return r.headers;
  } catch {
    const r = await fetch(url, { method: "GET", redirect: "follow" });
    return r.headers;
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { url } = await req.json();
    if (!url || typeof url !== "string") {
      return new Response(JSON.stringify({ error: "Missing url" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const headers = await fetchHeaders(url);
    const decision = decideEmbeddable(headers);

    const res: EmbedCheckResponse = {
      url,
      embeddable: decision.embeddable,
      reason: decision.reason,
      headers: {
        xFrameOptions: headers.get("x-frame-options"),
        contentSecurityPolicy: headers.get("content-security-policy"),
      },
    };

    return new Response(JSON.stringify(res), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : String(e) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
