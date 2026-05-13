import { motion } from 'framer-motion';
import { Search, Twitter, Facebook } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Props {
  url: string;
  meta: any;
}

export function SEOPreview({ url, meta }: Props) {
  const title = meta?.title || meta?.['og:title'] || 'Untitled page';
  const description =
    meta?.description ||
    meta?.['og:description'] ||
    meta?.['twitter:description'] ||
    'No description available for this page.';
  const ogImage = meta?.['og:image'] || meta?.['twitter:image'];
  const host = (() => {
    try { return new URL(url).hostname; } catch { return url; }
  })();
  const displayUrl = (() => {
    try {
      const u = new URL(url);
      return `${u.hostname}${u.pathname === '/' ? '' : u.pathname}`;
    } catch { return url; }
  })();

  return (
    <div className="space-y-4">
      {/* Google */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <span className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <Search className="w-4 h-4 text-blue-500" />
            </span>
            Google Search Result
          </CardTitle>
        </CardHeader>
        <CardContent>
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card border border-border/40 rounded-lg p-4 max-w-2xl"
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="w-5 h-5 rounded-full bg-muted flex items-center justify-center text-[10px]">🌐</span>
              <span className="text-xs text-muted-foreground">{host}</span>
            </div>
            <p className="text-[#1a0dab] dark:text-blue-400 text-lg leading-snug truncate">{title}</p>
            <p className="text-[#4d5156] dark:text-muted-foreground text-sm mt-1 line-clamp-2">{description}</p>
          </motion.div>
        </CardContent>
      </Card>

      {/* Twitter / X */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <span className="w-8 h-8 rounded-lg bg-foreground/5 flex items-center justify-center">
              <Twitter className="w-4 h-4" />
            </span>
            Twitter / X Card
          </CardTitle>
        </CardHeader>
        <CardContent>
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl overflow-hidden border border-border/50 max-w-md bg-card"
          >
            {ogImage ? (
              <div className="aspect-[1.91/1] bg-muted overflow-hidden">
                <img src={ogImage} alt="" className="w-full h-full object-cover" loading="lazy" />
              </div>
            ) : (
              <div className="aspect-[1.91/1] bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                <span className="text-xs text-muted-foreground">No og:image</span>
              </div>
            )}
            <div className="px-3 py-2 border-t border-border/40">
              <p className="text-[10px] text-muted-foreground uppercase">{host}</p>
              <p className="text-sm font-medium truncate">{title}</p>
              <p className="text-xs text-muted-foreground line-clamp-2">{description}</p>
            </div>
          </motion.div>
        </CardContent>
      </Card>

      {/* OpenGraph (Facebook / LinkedIn) */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <span className="w-8 h-8 rounded-lg bg-blue-600/10 flex items-center justify-center">
              <Facebook className="w-4 h-4 text-blue-600" />
            </span>
            OpenGraph (Facebook / LinkedIn)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-lg overflow-hidden border border-border/50 max-w-md bg-card"
          >
            {ogImage ? (
              <div className="aspect-[1.91/1] bg-muted overflow-hidden">
                <img src={ogImage} alt="" className="w-full h-full object-cover" loading="lazy" />
              </div>
            ) : (
              <div className="aspect-[1.91/1] bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                <span className="text-xs text-muted-foreground">No og:image</span>
              </div>
            )}
            <div className="px-3 py-2 bg-muted/40">
              <p className="text-[10px] text-muted-foreground uppercase truncate">{displayUrl}</p>
              <p className="text-sm font-semibold truncate">{title}</p>
              <p className="text-xs text-muted-foreground line-clamp-2">{description}</p>
            </div>
          </motion.div>
        </CardContent>
      </Card>
    </div>
  );
}
