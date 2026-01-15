import { motion } from 'framer-motion';
import { Shield, Smartphone, Zap, Image, Type, Shapes } from 'lucide-react';

interface TechStackProps {
  meta: {
    hasViewport: boolean;
    hasPreload: boolean;
    hasPreconnect: boolean;
    isHttps: boolean;
    imageCount: number;
    hasResponsiveImages: boolean;
  };
  fonts: {
    googleFonts: string[];
  };
  icons: {
    libraries: string[];
  };
}

export function TechStack({ meta, fonts, icons }: TechStackProps) {
  const technologies: { name: string; category: string; icon: typeof Shield }[] = [];

  if (meta.isHttps) technologies.push({ name: 'HTTPS', category: 'Security', icon: Shield });
  if (meta.hasViewport) technologies.push({ name: 'Mobile Ready', category: 'Responsive', icon: Smartphone });
  if (meta.hasPreload || meta.hasPreconnect) technologies.push({ name: 'Optimized', category: 'Performance', icon: Zap });
  if (meta.hasResponsiveImages) technologies.push({ name: 'Responsive', category: 'Images', icon: Image });
  if (fonts.googleFonts.length > 0) technologies.push({ name: 'Google Fonts', category: 'Typography', icon: Type });
  icons.libraries.forEach(lib => technologies.push({ name: lib, category: 'Icons', icon: Shapes }));

  if (technologies.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="bg-card border border-border rounded-xl p-5"
    >
      <h3 className="text-sm font-medium text-muted-foreground mb-3">Detected</h3>

      <div className="space-y-2">
        {technologies.slice(0, 6).map((tech, index) => (
          <motion.div
            key={`${tech.name}-${index}`}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 + index * 0.03 }}
            className="flex items-center gap-2.5"
          >
            <div className="p-1.5 bg-muted rounded-md">
              <tech.icon className="w-3 h-3 text-muted-foreground" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium truncate">{tech.name}</p>
              <p className="text-[10px] text-muted-foreground">{tech.category}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
