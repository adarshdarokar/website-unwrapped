import { useState } from 'react';
import { motion } from 'framer-motion';
import { Shapes, Package, Code, Layers, Download, Copy, Check, ExternalLink, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useLazyList } from '@/hooks/useLazyList';

interface IconDisplayProps {
  icons: {
    svgCount: number;
    svgs: string[];
    libraries: string[];
  };
}

const libraryInfo: Record<string, { color: string; description: string; url: string }> = {
  'Font Awesome': { color: 'from-blue-500 to-blue-600', description: 'Popular icon library', url: 'https://fontawesome.com' },
  'Material Icons': { color: 'from-green-500 to-green-600', description: 'Google Material icons', url: 'https://fonts.google.com/icons' },
  'Feather Icons': { color: 'from-purple-500 to-purple-600', description: 'Open source icons', url: 'https://feathericons.com' },
  'Heroicons': { color: 'from-indigo-500 to-indigo-600', description: 'By Tailwind CSS', url: 'https://heroicons.com' },
  'Lucide': { color: 'from-orange-500 to-orange-600', description: 'Beautiful icons', url: 'https://lucide.dev' },
};

export function IconDisplay({ icons }: IconDisplayProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const { visible: visibleSvgs, hasMore, sentinelRef, loadMore, total } = useLazyList(icons.svgs, 36, 36);


  const copySvgCode = (svg: string, index: number) => {
    navigator.clipboard.writeText(svg);
    setCopiedIndex(index);
    toast.success('SVG code copied to clipboard');
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const downloadSvg = (svg: string, index: number) => {
    const blob = new Blob([svg], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `icon-${index + 1}.svg`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(`Downloaded icon-${index + 1}.svg`);
  };

  const downloadAllSvgs = () => {
    icons.svgs.forEach((svg, index) => {
      setTimeout(() => {
        const blob = new Blob([svg], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `icon-${index + 1}.svg`;
        a.click();
        URL.revokeObjectURL(url);
      }, index * 100);
    });
    toast.success(`Downloading ${icons.svgs.length} SVG files`);
  };

  if (icons.svgCount === 0 && icons.libraries.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-8 text-center"
      >
        <motion.div
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
        >
          <Shapes className="w-12 h-12 mx-auto text-muted-foreground/40 mb-4" />
        </motion.div>
        <p className="text-muted-foreground">No icons detected</p>
        <p className="text-muted-foreground/60 text-sm mt-1">
          Icons might be loaded as images or fonts
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card-elevated p-4 sm:p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg">
            <Shapes className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-semibold">Icons & Graphics</h3>
            <p className="text-xs sm:text-sm text-muted-foreground">
              {icons.svgCount} SVGs • {icons.libraries.length} libraries
            </p>
          </div>
        </div>
        
        {icons.svgs.length > 0 && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={downloadAllSvgs}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 hover:bg-primary/20 text-primary text-xs font-medium rounded-lg transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Download All</span>
          </motion.button>
        )}
      </div>

      {/* Icon Libraries */}
      {icons.libraries.length > 0 && (
        <div className="mb-6">
          <p className="text-sm font-medium mb-3 flex items-center gap-2">
            <Package className="w-4 h-4" />
            Icon Libraries
          </p>
          <div className="grid gap-2">
            {icons.libraries.map((library, index) => {
              const info = libraryInfo[library] || { color: 'from-gray-500 to-gray-600', description: 'Icon library', url: '#' };
              return (
                <motion.a
                  key={library}
                  href={info.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ x: 4 }}
                  className="p-3 rounded-lg bg-muted/30 border border-border/50 hover:border-primary/30 transition-all group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${info.color} flex items-center justify-center`}>
                        <Layers className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{library}</p>
                        <p className="text-xs text-muted-foreground">{info.description}</p>
                      </div>
                    </div>
                    <ExternalLink className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </motion.a>
              );
            })}
          </div>
        </div>
      )}

      {/* SVG Preview */}
      {icons.svgs.length > 0 && (
        <div>
          <p className="text-sm font-medium mb-3 flex items-center gap-2">
            <Code className="w-4 h-4" />
            Inline SVGs ({icons.svgCount} total)
          </p>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
            {visibleSvgs.map((svg, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05, type: 'spring' }}
                className="relative aspect-square bg-muted/30 rounded-lg flex items-center justify-center group hover:bg-muted/50 transition-colors"
              >
                <div 
                  className="w-8 h-8 flex items-center justify-center [&>svg]:w-full [&>svg]:h-full [&>svg]:max-w-[24px] [&>svg]:max-h-[24px] text-foreground"
                  dangerouslySetInnerHTML={{ 
                    __html: svg
                      .replace(/width="[^"]*"/g, '')
                      .replace(/height="[^"]*"/g, '')
                      .replace(/fill="[^"]*"/g, 'fill="currentColor"')
                  }}
                />
                
                {/* Action buttons */}
                <div className="absolute inset-0 flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 bg-background/80 rounded-lg transition-opacity">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => copySvgCode(svg, index)}
                    className="p-1.5 bg-muted rounded-md hover:bg-muted/80"
                    title="Copy SVG code"
                  >
                    {copiedIndex === index ? (
                      <Check className="w-3 h-3 text-green-500" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => downloadSvg(svg, index)}
                    className="p-1.5 bg-muted rounded-md hover:bg-muted/80"
                    title="Download SVG"
                  >
                    <Download className="w-3 h-3" />
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}
