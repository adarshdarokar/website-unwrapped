import { motion } from 'framer-motion';
import { Shapes, Package, Code, Layers } from 'lucide-react';

interface IconDisplayProps {
  icons: {
    svgCount: number;
    svgs: string[];
    libraries: string[];
  };
}

const libraryInfo: Record<string, { color: string; description: string }> = {
  'Font Awesome': { color: 'from-blue-500 to-blue-600', description: 'Popular icon library with 7000+ icons' },
  'Material Icons': { color: 'from-green-500 to-green-600', description: 'Google\'s Material Design icons' },
  'Feather Icons': { color: 'from-purple-500 to-purple-600', description: 'Beautiful open source icons' },
  'Heroicons': { color: 'from-indigo-500 to-indigo-600', description: 'Icons by the makers of Tailwind CSS' },
  'Lucide': { color: 'from-orange-500 to-orange-600', description: 'Beautiful & consistent icons' },
};

export function IconDisplay({ icons }: IconDisplayProps) {
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
          <Shapes className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
        </motion.div>
        <p className="text-muted-foreground text-lg">No icons detected</p>
        <p className="text-muted-foreground/60 text-sm mt-2">
          Icons might be loaded as images or fonts
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card-elevated p-6"
    >
      <div className="flex items-center gap-3 mb-6">
        <motion.div 
          className="p-2.5 bg-gradient-to-br from-primary/20 to-accent/20 rounded-xl"
          whileHover={{ scale: 1.05, rotate: 15 }}
        >
          <Shapes className="w-5 h-5 text-primary" />
        </motion.div>
        <div>
          <h3 className="text-lg font-semibold">Icons & Graphics</h3>
          <p className="text-sm text-muted-foreground">
            {icons.svgCount} SVGs • {icons.libraries.length} libraries
          </p>
        </div>
      </div>

      {/* Icon Libraries */}
      {icons.libraries.length > 0 && (
        <div className="mb-6">
          <p className="text-sm font-medium mb-3 flex items-center gap-2">
            <Package className="w-4 h-4" />
            Icon Libraries Detected
          </p>
          <div className="grid gap-3">
            {icons.libraries.map((library, index) => {
              const info = libraryInfo[library] || { color: 'from-gray-500 to-gray-600', description: 'Icon library' };
              return (
                <motion.div
                  key={library}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02, x: 4 }}
                  className="p-4 rounded-xl bg-gradient-to-r from-muted/50 to-transparent border border-border/50"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${info.color} flex items-center justify-center`}>
                      <Layers className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium">{library}</p>
                      <p className="text-xs text-muted-foreground">{info.description}</p>
                    </div>
                  </div>
                </motion.div>
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
          <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
            {icons.svgs.slice(0, 12).map((svg, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05, type: 'spring' }}
                whileHover={{ scale: 1.1, y: -2 }}
                className="aspect-square p-3 bg-muted/50 rounded-xl flex items-center justify-center hover:bg-muted transition-colors cursor-pointer group"
                title="Click to view SVG code"
              >
                <div 
                  className="w-full h-full flex items-center justify-center [&>svg]:w-full [&>svg]:h-full [&>svg]:max-w-[32px] [&>svg]:max-h-[32px] text-foreground"
                  dangerouslySetInnerHTML={{ 
                    __html: svg
                      .replace(/width="[^"]*"/g, '')
                      .replace(/height="[^"]*"/g, '')
                      .replace(/fill="[^"]*"/g, 'fill="currentColor"')
                  }}
                />
              </motion.div>
            ))}
          </div>
          {icons.svgCount > 12 && (
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-center text-sm text-muted-foreground mt-4"
            >
              +{icons.svgCount - 12} more SVGs
            </motion.p>
          )}
        </div>
      )}
    </motion.div>
  );
}
