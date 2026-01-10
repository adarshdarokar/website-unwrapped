import { motion } from 'framer-motion';
import { Shapes, Package } from 'lucide-react';

interface IconDisplayProps {
  icons: {
    svgCount: number;
    svgs: string[];
    libraries: string[];
  };
}

export function IconDisplay({ icons }: IconDisplayProps) {
  if (icons.svgCount === 0 && icons.libraries.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-8 text-center"
      >
        <Shapes className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
        <p className="text-muted-foreground">No icons detected</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-6"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-primary/10 rounded-xl">
          <Shapes className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="text-lg font-semibold">Icons</h3>
          <p className="text-sm text-muted-foreground">
            {icons.svgCount} SVGs found
          </p>
        </div>
      </div>

      {icons.libraries.length > 0 && (
        <div className="mb-6">
          <p className="text-sm font-medium mb-3 flex items-center gap-2">
            <Package className="w-4 h-4" />
            Icon Libraries Detected
          </p>
          <div className="flex flex-wrap gap-2">
            {icons.libraries.map((library, index) => (
              <motion.span
                key={library}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="px-3 py-1.5 bg-accent text-accent-foreground rounded-lg text-sm font-medium"
              >
                {library}
              </motion.span>
            ))}
          </div>
        </div>
      )}

      {icons.svgs.length > 0 && (
        <div>
          <p className="text-sm font-medium mb-3">Inline SVGs Preview</p>
          <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
            {icons.svgs.slice(0, 12).map((svg, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className="aspect-square p-3 bg-muted/50 rounded-xl flex items-center justify-center"
                dangerouslySetInnerHTML={{ 
                  __html: svg.replace(/width="[^"]*"/g, 'width="100%"').replace(/height="[^"]*"/g, 'height="100%"') 
                }}
              />
            ))}
          </div>
        </div>
      )}

      {icons.svgCount > 12 && (
        <p className="text-center text-sm text-muted-foreground mt-4">
          +{icons.svgCount - 12} more SVGs
        </p>
      )}
    </motion.div>
  );
}
