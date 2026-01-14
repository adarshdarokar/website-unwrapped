import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Enhanced user agents for different site types
const userAgents = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Safari/605.1.15',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0'
];

async function fetchWithRetry(url: string, retries = 3): Promise<Response> {
  let lastError: Error | null = null;
  
  for (let i = 0; i < retries; i++) {
    try {
      const userAgent = userAgents[i % userAgents.length];
      const response = await fetch(url, {
        headers: {
          'User-Agent': userAgent,
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.9',
          'Accept-Encoding': 'gzip, deflate, br',
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache',
          'Sec-Fetch-Dest': 'document',
          'Sec-Fetch-Mode': 'navigate',
          'Sec-Fetch-Site': 'none',
          'Sec-Fetch-User': '?1',
          'Upgrade-Insecure-Requests': '1',
        },
        redirect: 'follow',
      });
      
      if (response.ok || response.status === 304) {
        return response;
      }
      
      // If blocked, try next user agent
      if (response.status === 403 || response.status === 429) {
        lastError = new Error(`HTTP ${response.status}`);
        continue;
      }
      
      return response;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      // Wait before retry
      await new Promise(resolve => setTimeout(resolve, 500 * (i + 1)));
    }
  }
  
  throw lastError || new Error('Failed to fetch after retries');
}

function extractMetaTags(html: string): Record<string, string> {
  const meta: Record<string, string> = {};
  const metaRegex = /<meta[^>]+(?:name|property)=["']([^"']+)["'][^>]+content=["']([^"']*)["'][^>]*>|<meta[^>]+content=["']([^"']*)["'][^>]+(?:name|property)=["']([^"']+)["'][^>]*>/gi;
  
  let match;
  while ((match = metaRegex.exec(html)) !== null) {
    const name = match[1] || match[4];
    const content = match[2] || match[3];
    if (name && content) {
      meta[name.toLowerCase()] = content;
    }
  }
  
  // Extract title
  const titleMatch = html.match(/<title[^>]*>([^<]*)<\/title>/i);
  if (titleMatch) {
    meta['title'] = titleMatch[1].trim();
  }
  
  return meta;
}

function extractTechStack(html: string): string[] {
  const tech: string[] = [];
  
  // Frameworks
  if (html.includes('__next') || html.includes('_next/')) tech.push('Next.js');
  if (html.includes('__nuxt') || html.includes('_nuxt/')) tech.push('Nuxt.js');
  if (html.includes('ng-version') || html.includes('ng-app')) tech.push('Angular');
  if (html.includes('data-v-') || html.includes('vue')) tech.push('Vue.js');
  if (html.includes('data-reactroot') || html.includes('__REACT')) tech.push('React');
  if (html.includes('svelte')) tech.push('Svelte');
  if (html.includes('gatsby')) tech.push('Gatsby');
  if (html.includes('astro')) tech.push('Astro');
  
  // CSS Frameworks
  if (html.includes('bootstrap') || html.includes('btn-primary')) tech.push('Bootstrap');
  if (html.includes('tailwind') || html.match(/class="[^"]*(?:flex|grid|p-\d|m-\d|text-\w+-\d)/)) tech.push('Tailwind CSS');
  if (html.includes('chakra')) tech.push('Chakra UI');
  if (html.includes('mui') || html.includes('MuiButton')) tech.push('Material UI');
  if (html.includes('ant-')) tech.push('Ant Design');
  
  // Animation libraries
  if (html.includes('gsap') || html.includes('GreenSock')) tech.push('GSAP');
  if (html.includes('framer-motion') || html.includes('data-framer')) tech.push('Framer Motion');
  if (html.includes('anime') || html.includes('animejs')) tech.push('Anime.js');
  if (html.includes('lottie')) tech.push('Lottie');
  if (html.includes('three') || html.includes('THREE.')) tech.push('Three.js');
  if (html.includes('webgl') || html.includes('WebGL')) tech.push('WebGL');
  
  // CMS
  if (html.includes('wp-content') || html.includes('wordpress')) tech.push('WordPress');
  if (html.includes('shopify')) tech.push('Shopify');
  if (html.includes('wix.com')) tech.push('Wix');
  if (html.includes('squarespace')) tech.push('Squarespace');
  if (html.includes('webflow')) tech.push('Webflow');
  
  // Analytics & Tools
  if (html.includes('gtag') || html.includes('google-analytics') || html.includes('googletagmanager')) tech.push('Google Analytics');
  if (html.includes('hotjar')) tech.push('Hotjar');
  if (html.includes('segment')) tech.push('Segment');
  if (html.includes('mixpanel')) tech.push('Mixpanel');
  
  // Video
  if (html.includes('youtube') || html.includes('yt-')) tech.push('YouTube Embed');
  if (html.includes('vimeo')) tech.push('Vimeo');
  if (html.includes('video.js') || html.includes('video-js')) tech.push('Video.js');
  
  return [...new Set(tech)];
}

function extractAllImages(html: string, baseUrl: string): { src: string; alt: string; type: string }[] {
  const images: { src: string; alt: string; type: string }[] = [];
  const seen = new Set<string>();
  
  // Standard img tags
  const imgRegex = /<img[^>]+src=["']([^"']+)["'][^>]*(?:alt=["']([^"']*?)["'])?[^>]*>/gi;
  let match;
  while ((match = imgRegex.exec(html)) !== null) {
    const src = normalizeUrl(match[1], baseUrl);
    if (src && !seen.has(src) && !src.includes('data:image')) {
      seen.add(src);
      images.push({ src, alt: match[2] || '', type: 'img' });
    }
  }
  
  // srcset images
  const srcsetRegex = /srcset=["']([^"']+)["']/gi;
  while ((match = srcsetRegex.exec(html)) !== null) {
    const srcset = match[1].split(',');
    for (const entry of srcset) {
      const parts = entry.trim().split(/\s+/);
      if (parts[0]) {
        const src = normalizeUrl(parts[0], baseUrl);
        if (src && !seen.has(src) && !src.includes('data:image')) {
          seen.add(src);
          images.push({ src, alt: '', type: 'srcset' });
        }
      }
    }
  }
  
  // Background images in style attributes
  const bgStyleRegex = /style=["'][^"']*background(?:-image)?:\s*url\(['"]?([^'")\s]+)['"]?\)[^"']*["']/gi;
  while ((match = bgStyleRegex.exec(html)) !== null) {
    const src = normalizeUrl(match[1], baseUrl);
    if (src && !seen.has(src) && !src.includes('data:image')) {
      seen.add(src);
      images.push({ src, alt: 'Background', type: 'background' });
    }
  }
  
  // CSS background images in style blocks
  const cssUrlRegex = /url\(['"]?([^'")\s]+\.(?:jpg|jpeg|png|gif|webp|svg|avif))['"]?\)/gi;
  while ((match = cssUrlRegex.exec(html)) !== null) {
    const src = normalizeUrl(match[1], baseUrl);
    if (src && !seen.has(src) && !src.includes('data:image')) {
      seen.add(src);
      images.push({ src, alt: 'CSS Background', type: 'css' });
    }
  }
  
  // Picture source tags
  const pictureRegex = /<source[^>]+srcset=["']([^"']+)["'][^>]*>/gi;
  while ((match = pictureRegex.exec(html)) !== null) {
    const srcset = match[1].split(',');
    for (const entry of srcset) {
      const parts = entry.trim().split(/\s+/);
      if (parts[0]) {
        const src = normalizeUrl(parts[0], baseUrl);
        if (src && !seen.has(src) && !src.includes('data:image')) {
          seen.add(src);
          images.push({ src, alt: '', type: 'picture' });
        }
      }
    }
  }
  
  // Open Graph and meta images
  const ogImageRegex = /<meta[^>]+(?:property|name)=["']og:image["'][^>]+content=["']([^"']+)["'][^>]*>|<meta[^>]+content=["']([^"']+)["'][^>]+(?:property|name)=["']og:image["'][^>]*>/gi;
  while ((match = ogImageRegex.exec(html)) !== null) {
    const src = normalizeUrl(match[1] || match[2], baseUrl);
    if (src && !seen.has(src)) {
      seen.add(src);
      images.push({ src, alt: 'OG Image', type: 'meta' });
    }
  }
  
  // Lazy loaded images (data-src, data-lazy-src, etc.)
  const lazyRegex = /data-(?:src|lazy-src|original|bg|background)=["']([^"']+)["']/gi;
  while ((match = lazyRegex.exec(html)) !== null) {
    const src = normalizeUrl(match[1], baseUrl);
    if (src && !seen.has(src) && !src.includes('data:image')) {
      seen.add(src);
      images.push({ src, alt: 'Lazy Load', type: 'lazy' });
    }
  }
  
  return images;
}

function normalizeUrl(src: string, baseUrl: string): string {
  if (!src) return '';
  
  try {
    if (src.startsWith('//')) return 'https:' + src;
    if (src.startsWith('/')) return baseUrl + src;
    if (src.startsWith('http')) return src;
    return baseUrl + '/' + src;
  } catch {
    return '';
  }
}

function extractFonts(html: string): { detected: string[]; googleFonts: string[]; adobeFonts: string[] } {
  const detected: string[] = [];
  const googleFonts: string[] = [];
  const adobeFonts: string[] = [];
  
  // Font-family from CSS
  const fontFamilyRegex = /font-family:\s*([^;}"']+)/gi;
  let match;
  while ((match = fontFamilyRegex.exec(html)) !== null) {
    const fontNames = match[1].split(',').map(f => f.trim().replace(/["']/g, ''));
    for (const font of fontNames) {
      if (font && !detected.includes(font) && !['inherit', 'initial', 'unset', 'auto', 'sans-serif', 'serif', 'monospace', 'cursive', 'fantasy', 'system-ui', '-apple-system', 'BlinkMacSystemFont'].includes(font.toLowerCase())) {
        detected.push(font);
      }
    }
  }
  
  // CSS @font-face
  const fontFaceRegex = /@font-face[^}]*font-family:\s*["']?([^"';,}]+)["']?/gi;
  while ((match = fontFaceRegex.exec(html)) !== null) {
    const font = match[1].trim();
    if (font && !detected.includes(font)) {
      detected.push(font);
    }
  }
  
  // Google Fonts
  const googleFontRegex = /fonts\.googleapis\.com\/css2?\?[^"'>\s]*/gi;
  while ((match = googleFontRegex.exec(html)) !== null) {
    googleFonts.push('https://' + match[0].replace(/^\/\//, ''));
  }
  
  // Adobe Fonts
  const adobeRegex = /use\.typekit\.net\/([^"'>\s]+)/gi;
  while ((match = adobeRegex.exec(html)) !== null) {
    adobeFonts.push('https://use.typekit.net/' + match[1]);
  }
  
  return {
    detected: detected.slice(0, 20),
    googleFonts: googleFonts.slice(0, 10),
    adobeFonts: adobeFonts.slice(0, 5)
  };
}

function extractColors(html: string): { hex: string[]; rgb: string[]; hsl: string[]; gradients: string[] } {
  const hex: string[] = [];
  const rgb: string[] = [];
  const hsl: string[] = [];
  const gradients: string[] = [];
  
  // Hex colors
  const hexRegex = /#([0-9a-fA-F]{3,8})\b/g;
  let match;
  while ((match = hexRegex.exec(html)) !== null) {
    const color = match[0].toLowerCase();
    if (!hex.includes(color) && color !== '#fff' && color !== '#ffffff' && color !== '#000' && color !== '#000000') {
      hex.push(color);
    }
  }
  
  // RGB/RGBA colors
  const rgbRegex = /rgba?\([^)]+\)/gi;
  while ((match = rgbRegex.exec(html)) !== null) {
    const color = match[0].toLowerCase();
    if (!rgb.includes(color)) {
      rgb.push(color);
    }
  }
  
  // HSL/HSLA colors
  const hslRegex = /hsla?\([^)]+\)/gi;
  while ((match = hslRegex.exec(html)) !== null) {
    const color = match[0].toLowerCase();
    if (!hsl.includes(color)) {
      hsl.push(color);
    }
  }
  
  // CSS Gradients
  const gradientRegex = /(?:linear|radial|conic)-gradient\([^;}"']+\)/gi;
  while ((match = gradientRegex.exec(html)) !== null) {
    const gradient = match[0];
    if (!gradients.includes(gradient)) {
      gradients.push(gradient);
    }
  }
  
  return {
    hex: hex.slice(0, 30),
    rgb: rgb.slice(0, 20),
    hsl: hsl.slice(0, 20),
    gradients: gradients.slice(0, 10)
  };
}

function extractIcons(html: string): { svgCount: number; svgs: string[]; libraries: string[]; iconFonts: string[] } {
  const svgRegex = /<svg[^>]*>[\s\S]*?<\/svg>/gi;
  const svgs: string[] = [];
  let match;
  
  while ((match = svgRegex.exec(html)) !== null) {
    if (svgs.length < 30) {
      svgs.push(match[0]);
    }
  }
  
  const libraries: string[] = [];
  const iconFonts: string[] = [];
  
  // Icon libraries detection
  if (html.includes('font-awesome') || html.includes('fontawesome') || html.includes('fa-')) libraries.push('Font Awesome');
  if (html.includes('material-icons') || html.includes('material-symbols')) libraries.push('Material Icons');
  if (html.includes('feather-') || html.includes('feather.')) libraries.push('Feather Icons');
  if (html.includes('heroicons') || html.includes('hero-')) libraries.push('Heroicons');
  if (html.includes('lucide')) libraries.push('Lucide');
  if (html.includes('phosphor')) libraries.push('Phosphor Icons');
  if (html.includes('tabler')) libraries.push('Tabler Icons');
  if (html.includes('ionicons') || html.includes('ion-')) libraries.push('Ionicons');
  if (html.includes('bootstrap-icons') || html.includes('bi-')) libraries.push('Bootstrap Icons');
  if (html.includes('remixicon') || html.includes('ri-')) libraries.push('Remix Icons');
  
  // Icon fonts
  if (html.includes('icomoon')) iconFonts.push('IcoMoon');
  if (html.includes('glyphicons')) iconFonts.push('Glyphicons');
  if (html.includes('flaticon')) iconFonts.push('Flaticon');
  
  return {
    svgCount: svgs.length,
    svgs: svgs.slice(0, 15),
    libraries: [...new Set(libraries)],
    iconFonts
  };
}

function extractAnimations(html: string): { 
  cssAnimations: string[]; 
  transitions: string[]; 
  keyframes: string[]; 
  hasScrollAnimations: boolean;
  hasParallax: boolean;
  hasVideoBackground: boolean;
} {
  const cssAnimations: string[] = [];
  const transitions: string[] = [];
  const keyframes: string[] = [];
  
  // Animation properties
  const animationRegex = /animation(?:-name)?:\s*([^;}"'\n]+)/gi;
  let match;
  while ((match = animationRegex.exec(html)) !== null) {
    const anim = match[1].trim();
    if (anim && !cssAnimations.includes(anim) && anim !== 'none') {
      cssAnimations.push(anim);
    }
  }
  
  // Transition properties
  const transitionRegex = /transition(?:-property)?:\s*([^;}"'\n]+)/gi;
  while ((match = transitionRegex.exec(html)) !== null) {
    const trans = match[1].trim();
    if (trans && !transitions.includes(trans) && trans !== 'none') {
      transitions.push(trans);
    }
  }
  
  // Keyframes
  const keyframesRegex = /@keyframes\s+([a-zA-Z0-9_-]+)/gi;
  while ((match = keyframesRegex.exec(html)) !== null) {
    const name = match[1];
    if (!keyframes.includes(name)) {
      keyframes.push(name);
    }
  }
  
  // Check for scroll animations
  const hasScrollAnimations = 
    html.includes('data-aos') || 
    html.includes('wow.js') || 
    html.includes('scroll-trigger') || 
    html.includes('ScrollTrigger') ||
    html.includes('data-scroll') ||
    html.includes('locomotive') ||
    html.includes('intersection-observer') ||
    html.includes('IntersectionObserver');
  
  // Check for parallax
  const hasParallax = 
    html.includes('parallax') || 
    html.includes('data-rellax') || 
    html.includes('jarallax') ||
    html.includes('simpleParallax');
  
  // Check for video backgrounds
  const hasVideoBackground = 
    html.includes('video-background') || 
    html.includes('background-video') ||
    (html.includes('<video') && html.includes('autoplay'));
  
  return {
    cssAnimations: cssAnimations.slice(0, 15),
    transitions: transitions.slice(0, 15),
    keyframes: keyframes.slice(0, 20),
    hasScrollAnimations,
    hasParallax,
    hasVideoBackground
  };
}

function calculateScore(data: {
  images: { src: string; alt: string; type: string }[];
  fonts: { detected: string[]; googleFonts: string[]; adobeFonts: string[] };
  colors: { hex: string[]; rgb: string[]; hsl: string[]; gradients: string[] };
  icons: { svgCount: number; svgs: string[]; libraries: string[]; iconFonts: string[] };
  animations: { cssAnimations: string[]; transitions: string[]; keyframes: string[]; hasScrollAnimations: boolean; hasParallax: boolean; hasVideoBackground: boolean };
  techStack: string[];
  meta: Record<string, string>;
  html: string;
  url: string;
}): { score: number; breakdown: Record<string, number> } {
  const breakdown: Record<string, number> = {};
  let score = 0;
  
  // Images (max 15 points)
  const imgCount = data.images.length;
  if (imgCount > 0 && imgCount < 30) breakdown.images = 10;
  else if (imgCount >= 30 && imgCount < 60) breakdown.images = 5;
  else if (imgCount >= 60) breakdown.images = 2;
  else breakdown.images = 0;
  
  // Alt tags (max 5 points)
  const imagesWithAlt = data.images.filter(i => i.alt && i.alt.length > 0).length;
  if (imgCount > 0) {
    breakdown.accessibility = Math.round((imagesWithAlt / imgCount) * 5);
  } else {
    breakdown.accessibility = 3;
  }
  
  // Typography (max 15 points)
  const fontCount = data.fonts.detected.length;
  if (fontCount > 0 && fontCount <= 4) breakdown.typography = 15;
  else if (fontCount > 4 && fontCount <= 7) breakdown.typography = 10;
  else if (fontCount > 7) breakdown.typography = 5;
  else breakdown.typography = 0;
  
  // Web fonts bonus
  if (data.fonts.googleFonts.length > 0 || data.fonts.adobeFonts.length > 0) {
    breakdown.typography += 3;
  }
  
  // Color palette (max 15 points)
  const colorCount = data.colors.hex.length + data.colors.rgb.length + data.colors.hsl.length;
  if (colorCount >= 5 && colorCount <= 15) breakdown.colors = 15;
  else if (colorCount > 15 && colorCount <= 30) breakdown.colors = 10;
  else breakdown.colors = 5;
  
  // Gradients bonus
  if (data.colors.gradients.length > 0) breakdown.colors += 3;
  
  // Icons (max 10 points)
  if (data.icons.svgCount > 0 || data.icons.libraries.length > 0) {
    breakdown.icons = 10;
  } else {
    breakdown.icons = 0;
  }
  
  // Animations (max 15 points)
  const hasAnimations = data.animations.cssAnimations.length > 0 || 
                       data.animations.keyframes.length > 0 || 
                       data.animations.transitions.length > 0;
  if (hasAnimations) breakdown.animations = 10;
  else breakdown.animations = 0;
  
  if (data.animations.hasScrollAnimations) breakdown.animations += 3;
  if (data.animations.hasParallax) breakdown.animations += 2;
  
  // Tech Stack (max 10 points)
  if (data.techStack.length >= 3) breakdown.techStack = 10;
  else if (data.techStack.length >= 1) breakdown.techStack = 5;
  else breakdown.techStack = 0;
  
  // SEO & Meta (max 10 points)
  breakdown.seo = 0;
  if (data.meta['title']) breakdown.seo += 2;
  if (data.meta['description']) breakdown.seo += 2;
  if (data.meta['og:title'] || data.meta['og:image']) breakdown.seo += 2;
  if (data.html.includes('viewport')) breakdown.seo += 2;
  if (data.url.startsWith('https')) breakdown.seo += 2;
  
  // Performance hints (max 5 points)
  breakdown.performance = 0;
  if (data.html.includes('rel="preload"')) breakdown.performance += 1;
  if (data.html.includes('rel="preconnect"')) breakdown.performance += 1;
  if (data.html.includes('loading="lazy"')) breakdown.performance += 1;
  if (data.html.includes('srcset')) breakdown.performance += 1;
  if (data.html.includes('async') || data.html.includes('defer')) breakdown.performance += 1;
  
  // Calculate total
  for (const key in breakdown) {
    score += breakdown[key];
  }
  
  return { score: Math.min(100, score), breakdown };
}

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

    console.log(`Analyzing website: ${url}`);
    
    // Fetch with retry and different user agents
    const response = await fetchWithRetry(url);
    const html = await response.text();
    const baseUrl = new URL(url).origin;
    
    console.log(`Fetched ${html.length} bytes from ${url}`);

    // Extract all data
    const images = extractAllImages(html, baseUrl);
    const fonts = extractFonts(html);
    const colors = extractColors(html);
    const icons = extractIcons(html);
    const animations = extractAnimations(html);
    const techStack = extractTechStack(html);
    const meta = extractMetaTags(html);
    
    // Calculate score
    const { score, breakdown } = calculateScore({
      images,
      fonts,
      colors,
      icons,
      animations,
      techStack,
      meta,
      html,
      url
    });

    const result = {
      url,
      score,
      scoreBreakdown: breakdown,
      images: images.slice(0, 50),
      fonts,
      colors: [...colors.hex, ...colors.rgb.slice(0, 10), ...colors.hsl.slice(0, 10)],
      colorDetails: colors,
      icons,
      animations,
      techStack,
      meta: {
        title: meta['title'] || '',
        description: meta['description'] || '',
        ogImage: meta['og:image'] || '',
        hasViewport: html.includes('viewport'),
        hasPreload: html.includes('rel="preload"'),
        hasPreconnect: html.includes('rel="preconnect"'),
        isHttps: url.startsWith('https'),
        imageCount: images.length,
        hasResponsiveImages: html.includes('srcset'),
        hasLazyLoading: html.includes('loading="lazy"'),
        hasServiceWorker: html.includes('serviceWorker') || html.includes('service-worker'),
      }
    };

    console.log(`Analysis complete. Score: ${score}, Images: ${images.length}, Fonts: ${fonts.detected.length}`);

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
