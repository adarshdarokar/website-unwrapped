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

function extractAllVideos(html: string, baseUrl: string): { src: string; poster: string; type: string; title: string }[] {
  const videos: { src: string; poster: string; type: string; title: string }[] = [];
  const seen = new Set<string>();
  let match;

  // <video src="..."> and <video poster="...">
  const videoTagRegex = /<video\b([^>]*)>([\s\S]*?)<\/video>/gi;
  while ((match = videoTagRegex.exec(html)) !== null) {
    const attrs = match[1];
    const inner = match[2];
    const posterMatch = attrs.match(/poster=["']([^"']+)["']/i);
    const poster = posterMatch ? normalizeUrl(posterMatch[1], baseUrl) : '';
    const titleMatch = attrs.match(/(?:title|aria-label)=["']([^"']+)["']/i);
    const title = titleMatch ? titleMatch[1] : '';

    const srcMatch = attrs.match(/\ssrc=["']([^"']+)["']/i);
    if (srcMatch) {
      const src = normalizeUrl(srcMatch[1], baseUrl);
      if (src && !seen.has(src)) {
        seen.add(src);
        videos.push({ src, poster, type: 'video', title });
      }
    }

    // <source> children
    const sourceRegex = /<source[^>]+src=["']([^"']+)["'][^>]*>/gi;
    let sm;
    while ((sm = sourceRegex.exec(inner)) !== null) {
      const src = normalizeUrl(sm[1], baseUrl);
      if (src && !seen.has(src)) {
        seen.add(src);
        videos.push({ src, poster, type: 'source', title });
      }
    }
  }

  // Direct video file URLs anywhere in HTML
  const fileRegex = /https?:\/\/[^\s"'<>()]+\.(?:mp4|webm|ogv|ogg|mov|m3u8)(?:\?[^\s"'<>()]*)?/gi;
  while ((match = fileRegex.exec(html)) !== null) {
    const src = match[0];
    if (!seen.has(src)) {
      seen.add(src);
      videos.push({ src, poster: '', type: 'file', title: '' });
    }
  }

  // YouTube iframes / links
  const ytRegex = /(?:https?:)?\/\/(?:www\.)?(?:youtube\.com\/embed\/|youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{6,})/gi;
  while ((match = ytRegex.exec(html)) !== null) {
    const id = match[1];
    const embed = `https://www.youtube.com/embed/${id}`;
    if (!seen.has(embed)) {
      seen.add(embed);
      videos.push({
        src: embed,
        poster: `https://img.youtube.com/vi/${id}/hqdefault.jpg`,
        type: 'youtube',
        title: 'YouTube video',
      });
    }
  }

  // Vimeo iframes / links
  const vimeoRegex = /(?:https?:)?\/\/(?:www\.)?(?:player\.)?vimeo\.com\/(?:video\/)?(\d{5,})/gi;
  while ((match = vimeoRegex.exec(html)) !== null) {
    const id = match[1];
    const embed = `https://player.vimeo.com/video/${id}`;
    if (!seen.has(embed)) {
      seen.add(embed);
      videos.push({ src: embed, poster: '', type: 'vimeo', title: 'Vimeo video' });
    }
  }

  return videos;
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
    svgs.push(match[0]);
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
    svgs,
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
}): { score: number; breakdown: Record<string, number>; reasons: string[] } {
  const breakdown: Record<string, number> = {};
  const reasons: string[] = [];
  let score = 0;

  const imgCount = data.images.length;
  const imagesWithAlt = data.images.filter(i => i.alt && i.alt.length > 0).length;
  const altRatio = imgCount > 0 ? imagesWithAlt / imgCount : 1;

  // === VISUAL DESIGN (40 points max) ===

  // Typography quality (max 12)
  const fontCount = data.fonts.detected.length;
  const hasWebFonts = data.fonts.googleFonts.length > 0 || data.fonts.adobeFonts.length > 0;
  if (fontCount >= 1 && fontCount <= 3) {
    breakdown.typography = hasWebFonts ? 12 : 9;
    reasons.push(`Clean typography with ${fontCount} font${fontCount > 1 ? 's' : ''}${hasWebFonts ? ' using web fonts' : ''} (+${breakdown.typography})`);
  } else if (fontCount >= 4 && fontCount <= 6) {
    breakdown.typography = hasWebFonts ? 8 : 6;
    reasons.push(`${fontCount} fonts detected — consider consolidating to 2-3 for consistency (+${breakdown.typography})`);
  } else if (fontCount > 6) {
    breakdown.typography = 3;
    reasons.push(`Too many fonts (${fontCount}) — hurts visual consistency and load time (+3)`);
  } else {
    breakdown.typography = 2;
    reasons.push('No custom fonts detected — using browser defaults (+2)');
  }

  // Color palette coherence (max 12)
  const totalColors = data.colors.hex.length + data.colors.rgb.length + data.colors.hsl.length;
  const hasGradients = data.colors.gradients.length > 0;
  if (totalColors >= 4 && totalColors <= 12) {
    breakdown.colors = hasGradients ? 12 : 10;
    reasons.push(`Well-curated palette of ${totalColors} colors${hasGradients ? ' with gradients' : ''} (+${breakdown.colors})`);
  } else if (totalColors >= 13 && totalColors <= 20) {
    breakdown.colors = 7;
    reasons.push(`${totalColors} colors — slightly broad palette, could benefit from consolidation (+7)`);
  } else if (totalColors > 20) {
    breakdown.colors = 4;
    reasons.push(`${totalColors} colors is excessive — indicates inconsistent color usage (+4)`);
  } else if (totalColors >= 1) {
    breakdown.colors = 5;
    reasons.push(`Minimal color palette (${totalColors} colors) — could be intentional or underdeveloped (+5)`);
  } else {
    breakdown.colors = 1;
    reasons.push('No meaningful color palette detected (+1)');
  }

  // Icons & visual assets (max 8)
  const hasIconLib = data.icons.libraries.length > 0;
  const hasSvgs = data.icons.svgCount > 0;
  if (hasIconLib && hasSvgs) {
    breakdown.icons = 8;
    reasons.push(`Using ${data.icons.libraries.join(', ')} with ${data.icons.svgCount} SVGs (+8)`);
  } else if (hasSvgs && data.icons.svgCount >= 3) {
    breakdown.icons = 6;
    reasons.push(`${data.icons.svgCount} inline SVG icons — good for performance (+6)`);
  } else if (hasSvgs || hasIconLib) {
    breakdown.icons = 4;
    reasons.push(`Basic icon usage detected (+4)`);
  } else {
    breakdown.icons = 0;
    reasons.push('No SVG icons or icon libraries found (+0)');
  }

  // Motion & interaction design (max 8)
  const animCount = data.animations.cssAnimations.length + data.animations.keyframes.length;
  const transCount = data.animations.transitions.length;
  const hasAdvancedMotion = data.animations.hasScrollAnimations || data.animations.hasParallax;
  if (animCount > 0 && transCount > 0 && hasAdvancedMotion) {
    breakdown.animations = 8;
    reasons.push(`Rich motion design: ${animCount} animations, ${transCount} transitions, scroll effects (+8)`);
  } else if (animCount > 0 || transCount > 2) {
    breakdown.animations = 5;
    reasons.push(`${animCount} animations and ${transCount} transitions — decent interactivity (+5)`);
  } else if (transCount > 0) {
    breakdown.animations = 3;
    reasons.push(`Basic transitions only (${transCount}) — limited motion design (+3)`);
  } else {
    breakdown.animations = 0;
    reasons.push('No animations or transitions detected — static experience (+0)');
  }

  // === SEO & DISCOVERABILITY (20 points max) ===

  breakdown.seo = 0;
  const seoReasons: string[] = [];
  if (data.meta['title'] && data.meta['title'].length >= 10 && data.meta['title'].length <= 70) {
    breakdown.seo += 4;
    seoReasons.push('good title tag');
  } else if (data.meta['title']) {
    breakdown.seo += 2;
    seoReasons.push('title exists but suboptimal length');
  }
  if (data.meta['description'] && data.meta['description'].length >= 50) {
    breakdown.seo += 4;
    seoReasons.push('good meta description');
  } else if (data.meta['description']) {
    breakdown.seo += 2;
    seoReasons.push('short meta description');
  }
  if (data.meta['og:title'] && data.meta['og:image']) {
    breakdown.seo += 4;
    seoReasons.push('Open Graph tags');
  } else if (data.meta['og:title'] || data.meta['og:image']) {
    breakdown.seo += 2;
    seoReasons.push('partial Open Graph');
  }
  if (data.html.includes('viewport')) {
    breakdown.seo += 4;
    seoReasons.push('mobile viewport');
  }
  if (data.url.startsWith('https')) {
    breakdown.seo += 4;
    seoReasons.push('HTTPS');
  }
  reasons.push(`SEO: ${seoReasons.length > 0 ? seoReasons.join(', ') : 'no SEO signals found'} (+${breakdown.seo})`);

  // === PERFORMANCE BEST PRACTICES (15 points max) ===

  breakdown.performance = 0;
  const perfReasons: string[] = [];
  if (data.html.includes('rel="preload"') || data.html.includes("rel='preload'")) {
    breakdown.performance += 3; perfReasons.push('preload');
  }
  if (data.html.includes('rel="preconnect"') || data.html.includes("rel='preconnect'")) {
    breakdown.performance += 3; perfReasons.push('preconnect');
  }
  if (data.html.includes('loading="lazy"') || data.html.includes("loading='lazy'")) {
    breakdown.performance += 3; perfReasons.push('lazy loading');
  }
  if (data.html.includes('srcset')) {
    breakdown.performance += 3; perfReasons.push('responsive images');
  }
  if (data.html.includes(' async') || data.html.includes(' defer')) {
    breakdown.performance += 3; perfReasons.push('async/defer scripts');
  }
  reasons.push(`Performance: ${perfReasons.length > 0 ? perfReasons.join(', ') : 'no optimization hints'} (+${breakdown.performance})`);

  // === ACCESSIBILITY (15 points max) ===

  breakdown.accessibility = 0;
  if (altRatio >= 0.8) {
    breakdown.accessibility += 6;
    reasons.push(`${Math.round(altRatio * 100)}% images have alt text — excellent accessibility (+6)`);
  } else if (altRatio >= 0.5) {
    breakdown.accessibility += 3;
    reasons.push(`Only ${Math.round(altRatio * 100)}% images have alt text — needs improvement (+3)`);
  } else if (imgCount > 0) {
    breakdown.accessibility += 1;
    reasons.push(`Poor alt text coverage (${Math.round(altRatio * 100)}%) — major accessibility gap (+1)`);
  } else {
    breakdown.accessibility += 4;
    reasons.push('No images to evaluate for alt text (+4)');
  }

  // Semantic HTML signals
  const hasLandmarks = data.html.includes('<nav') || data.html.includes('<main') || data.html.includes('<header') || data.html.includes('<footer');
  const hasAriaLabels = data.html.includes('aria-label') || data.html.includes('aria-labelledby') || data.html.includes('role=');
  if (hasLandmarks && hasAriaLabels) {
    breakdown.accessibility += 6;
    reasons.push('Good semantic HTML with ARIA landmarks (+6)');
  } else if (hasLandmarks) {
    breakdown.accessibility += 4;
    reasons.push('Has semantic landmarks but limited ARIA labels (+4)');
  } else if (hasAriaLabels) {
    breakdown.accessibility += 3;
    reasons.push('Has ARIA labels but missing semantic landmarks (+3)');
  } else {
    breakdown.accessibility += 0;
    reasons.push('No semantic HTML landmarks or ARIA attributes detected (+0)');
  }

  // Heading structure
  const hasH1 = data.html.includes('<h1');
  const hasHeadingHierarchy = hasH1 && (data.html.includes('<h2') || data.html.includes('<h3'));
  if (hasHeadingHierarchy) {
    breakdown.accessibility += 3;
  } else if (hasH1) {
    breakdown.accessibility += 2;
  }

  // === IMAGE QUALITY (10 points max) ===

  breakdown.images = 0;
  if (imgCount >= 3 && imgCount <= 40) {
    breakdown.images = 7;
    reasons.push(`Appropriate image count (${imgCount}) — well-balanced (+7)`);
  } else if (imgCount > 40 && imgCount <= 80) {
    breakdown.images = 4;
    reasons.push(`High image count (${imgCount}) — may impact load performance (+4)`);
  } else if (imgCount > 80) {
    breakdown.images = 2;
    reasons.push(`Excessive images (${imgCount}) — significant performance concern (+2)`);
  } else if (imgCount > 0) {
    breakdown.images = 5;
    reasons.push(`Few images (${imgCount}) — could be text-heavy or minimal design (+5)`);
  } else {
    breakdown.images = 2;
    reasons.push('No images found — site may be text-only or heavily JS-rendered (+2)');
  }
  // Variety bonus
  const hasMultipleTypes = new Set(data.images.map(i => i.type)).size >= 2;
  if (hasMultipleTypes) {
    breakdown.images += 3;
  }

  // Calculate total
  for (const key in breakdown) {
    score += breakdown[key];
  }

  // Generate improvement suggestions
  const suggestions: string[] = [];
  
  if ((breakdown.typography || 0) < 9) {
    suggestions.push('Use 2-3 well-paired web fonts (e.g., from Google Fonts) for a more polished, professional look. Avoid using too many or too few fonts.');
  }
  if ((breakdown.colors || 0) < 8) {
    suggestions.push('Define a cohesive color palette with 5-8 colors including primary, secondary, accent, and neutral tones. Use CSS variables for consistency.');
  }
  if ((breakdown.icons || 0) < 5) {
    suggestions.push('Add SVG icons using a library like Lucide, Heroicons, or Font Awesome to improve visual communication and UI clarity.');
  }
  if ((breakdown.animations || 0) < 5) {
    suggestions.push('Add subtle CSS transitions on interactive elements (buttons, links, cards) and consider scroll-based animations for a modern feel.');
  }
  if ((breakdown.seo || 0) < 14) {
    if (!data.meta['title'] || data.meta['title'].length < 10) suggestions.push('Add a descriptive title tag (50-60 characters) that includes your primary keyword for better search visibility.');
    if (!data.meta['description'] || data.meta['description'].length < 50) suggestions.push('Write a compelling meta description (120-160 characters) to improve click-through rates from search results.');
    if (!data.meta['og:title'] || !data.meta['og:image']) suggestions.push('Add Open Graph tags (og:title, og:description, og:image) so your site looks great when shared on social media.');
  }
  if ((breakdown.performance || 0) < 9) {
    const missing: string[] = [];
    if (!data.html.includes('rel="preload"')) missing.push('preload critical resources');
    if (!data.html.includes('rel="preconnect"')) missing.push('preconnect to third-party domains');
    if (!data.html.includes('loading="lazy"')) missing.push('lazy-load images below the fold');
    if (!data.html.includes('srcset')) missing.push('use srcset for responsive images');
    if (missing.length > 0) suggestions.push(`Improve load performance: ${missing.join(', ')}.`);
  }
  if ((breakdown.accessibility || 0) < 10) {
    if (altRatio < 0.8) suggestions.push(`Add descriptive alt text to all images — currently only ${Math.round(altRatio * 100)}% have alt attributes. This is critical for screen readers.`);
    if (!data.html.includes('aria-label')) suggestions.push('Add ARIA labels to interactive elements (buttons, forms, navigation) for better assistive technology support.');
    if (!data.html.includes('<nav') && !data.html.includes('<main')) suggestions.push('Use semantic HTML landmarks (<nav>, <main>, <header>, <footer>) for better page structure and accessibility.');
  }
  if ((breakdown.images || 0) < 7) {
    suggestions.push('Optimize your image strategy — aim for 5-30 well-optimized images with proper alt text, multiple formats (WebP/AVIF), and responsive sizes.');
  }

  return { score: Math.min(100, score), breakdown, reasons, suggestions };
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
    const videos = extractAllVideos(html, baseUrl);
    const fonts = extractFonts(html);
    const colors = extractColors(html);
    const icons = extractIcons(html);
    const animations = extractAnimations(html);
    const techStack = extractTechStack(html);
    const meta = extractMetaTags(html);
    
    // Calculate score
    const { score, breakdown, reasons, suggestions } = calculateScore({
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
      scoreReasons: reasons,
      suggestions,
      images,
      videos,
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
    const rawMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error analyzing website:', rawMessage);

    // Provide user-friendly error messages for common issues
    let friendlyMessage = 'Failed to analyze the website.';
    const lower = rawMessage.toLowerCase();

    if (lower.includes('dns error') || lower.includes('name or service not known') || lower.includes('getaddrinfo')) {
      friendlyMessage = 'Could not find this website. Please check the URL for typos (e.g., "thesouledstore.com" instead of "thesouldstore.com").';
    } else if (lower.includes('connection refused') || lower.includes('connect error')) {
      friendlyMessage = 'The website refused the connection. It may be down or blocking automated requests.';
    } else if (lower.includes('timeout') || lower.includes('timed out')) {
      friendlyMessage = 'The website took too long to respond. Please try again later.';
    } else if (lower.includes('certificate') || lower.includes('ssl')) {
      friendlyMessage = 'The website has an invalid or expired SSL certificate.';
    } else if (lower.includes('status: 403') || lower.includes('forbidden')) {
      friendlyMessage = 'The website blocked access. Try a different site.';
    } else if (lower.includes('status: 404') || lower.includes('not found')) {
      friendlyMessage = 'The page was not found. Please verify the URL.';
    }

    return new Response(
      JSON.stringify({ error: friendlyMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
