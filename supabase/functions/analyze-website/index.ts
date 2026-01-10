import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { url } = await req.json();

    if (!url) {
      return new Response(
        JSON.stringify({ error: 'URL is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Fetch the website HTML
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    const html = await response.text();
    const baseUrl = new URL(url).origin;

    // Extract images
    const imageRegex = /<img[^>]+src=["']([^"']+)["'][^>]*(?:alt=["']([^"']*?)["'])?[^>]*>/gi;
    const images: { src: string; alt: string }[] = [];
    let match;
    while ((match = imageRegex.exec(html)) !== null) {
      let src = match[1];
      if (src.startsWith('//')) src = 'https:' + src;
      else if (src.startsWith('/')) src = baseUrl + src;
      else if (!src.startsWith('http')) src = baseUrl + '/' + src;
      
      if (!src.includes('data:image')) {
        images.push({ src, alt: match[2] || '' });
      }
    }

    // Extract background images from CSS
    const bgImageRegex = /background(?:-image)?:\s*url\(['"]?([^'")\s]+)['"]?\)/gi;
    while ((match = bgImageRegex.exec(html)) !== null) {
      let src = match[1];
      if (src.startsWith('//')) src = 'https:' + src;
      else if (src.startsWith('/')) src = baseUrl + src;
      else if (!src.startsWith('http')) src = baseUrl + '/' + src;
      
      if (!src.includes('data:image')) {
        images.push({ src, alt: 'Background Image' });
      }
    }

    // Extract fonts
    const fontFamilyRegex = /font-family:\s*([^;}"']+)/gi;
    const googleFontRegex = /fonts\.googleapis\.com\/css[^"'>\s]*/gi;
    const fonts: string[] = [];
    
    while ((match = fontFamilyRegex.exec(html)) !== null) {
      const fontNames = match[1].split(',').map(f => f.trim().replace(/["']/g, ''));
      fontNames.forEach(font => {
        if (font && !fonts.includes(font) && !['inherit', 'initial', 'unset'].includes(font.toLowerCase())) {
          fonts.push(font);
        }
      });
    }

    const googleFonts: string[] = [];
    while ((match = googleFontRegex.exec(html)) !== null) {
      googleFonts.push('https://' + match[0]);
    }

    // Extract colors
    const colorRegex = /#([0-9a-fA-F]{3,8})\b|rgb\([^)]+\)|rgba\([^)]+\)|hsl\([^)]+\)|hsla\([^)]+\)/gi;
    const colors: string[] = [];
    while ((match = colorRegex.exec(html)) !== null) {
      const color = match[0];
      if (!colors.includes(color) && colors.length < 50) {
        colors.push(color);
      }
    }

    // Extract icons (SVG and icon fonts)
    const svgRegex = /<svg[^>]*>[\s\S]*?<\/svg>/gi;
    const svgs: string[] = [];
    while ((match = svgRegex.exec(html)) !== null) {
      if (svgs.length < 20) {
        svgs.push(match[0]);
      }
    }

    // Check for icon libraries
    const iconLibraries: string[] = [];
    if (html.includes('font-awesome') || html.includes('fontawesome')) iconLibraries.push('Font Awesome');
    if (html.includes('material-icons')) iconLibraries.push('Material Icons');
    if (html.includes('feather')) iconLibraries.push('Feather Icons');
    if (html.includes('heroicons')) iconLibraries.push('Heroicons');
    if (html.includes('lucide')) iconLibraries.push('Lucide');

    // Extract animations
    const animationRegex = /animation[^:]*:\s*([^;}"']+)/gi;
    const transitionRegex = /transition[^:]*:\s*([^;}"']+)/gi;
    const keyframesRegex = /@keyframes\s+([a-zA-Z0-9_-]+)/gi;
    
    const animations: string[] = [];
    while ((match = animationRegex.exec(html)) !== null) {
      const anim = match[1].trim();
      if (anim && !animations.includes(anim)) animations.push(anim);
    }
    
    const transitions: string[] = [];
    while ((match = transitionRegex.exec(html)) !== null) {
      const trans = match[1].trim();
      if (trans && !transitions.includes(trans)) transitions.push(trans);
    }

    const keyframes: string[] = [];
    while ((match = keyframesRegex.exec(html)) !== null) {
      keyframes.push(match[1]);
    }

    // Calculate quality score
    let score = 50; // Base score
    
    // Performance factors
    if (images.length > 0 && images.length < 20) score += 5;
    if (images.length > 50) score -= 10;
    
    // Design factors
    if (fonts.length > 0 && fonts.length < 5) score += 10;
    if (fonts.length > 10) score -= 5;
    
    if (colors.length > 3 && colors.length < 15) score += 10;
    
    // Modern practices
    if (html.includes('viewport')) score += 5;
    if (html.includes('rel="preload"') || html.includes('rel="preconnect"')) score += 5;
    if (svgs.length > 0) score += 5;
    if (animations.length > 0) score += 5;
    
    // Accessibility
    const altTagCount = (html.match(/alt=["'][^"']+["']/g) || []).length;
    if (images.length > 0 && altTagCount / images.length > 0.7) score += 10;
    
    // Security
    if (url.startsWith('https')) score += 5;

    score = Math.min(100, Math.max(0, score));

    const result = {
      url,
      score,
      images: images.slice(0, 30),
      fonts: {
        detected: fonts.slice(0, 15),
        googleFonts: googleFonts.slice(0, 5)
      },
      colors: colors.slice(0, 30),
      icons: {
        svgCount: svgs.length,
        svgs: svgs.slice(0, 10),
        libraries: iconLibraries
      },
      animations: {
        cssAnimations: animations.slice(0, 10),
        transitions: transitions.slice(0, 10),
        keyframes: keyframes.slice(0, 10)
      },
      meta: {
        hasViewport: html.includes('viewport'),
        hasPreload: html.includes('rel="preload"'),
        hasPreconnect: html.includes('rel="preconnect"'),
        isHttps: url.startsWith('https'),
        imageCount: images.length,
        hasResponsiveImages: html.includes('srcset')
      }
    };

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error analyzing website:', errorMessage);
    return new Response(
      JSON.stringify({ error: 'Failed to analyze website: ' + errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
