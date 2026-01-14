import { motion } from 'framer-motion';
import { Code, Box, FileCode, Server, Cpu } from 'lucide-react';

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
  const technologies: { name: string; category: string; detected: boolean }[] = [
    { name: 'HTTPS/SSL', category: 'Security', detected: meta.isHttps },
    { name: 'Responsive Design', category: 'Mobile', detected: meta.hasViewport },
    { name: 'Resource Hints', category: 'Performance', detected: meta.hasPreload || meta.hasPreconnect },
    { name: 'Responsive Images', category: 'Images', detected: meta.hasResponsiveImages },
    { name: 'Google Fonts', category: 'Typography', detected: fonts.googleFonts.length > 0 },
    ...icons.libraries.map(lib => ({ name: lib, category: 'Icons', detected: true })),
  ].filter(tech => tech.detected);

  if (technologies.length === 0) {
    return null;
  }

  const categoryIcons: Record<string, typeof Code> = {
    Security: Server,
    Mobile: Box,
    Performance: Cpu,
    Images: FileCode,
    Typography: Code,
    Icons: Box,
  };

  const categoryColors: Record<string, string> = {
    Security: 'from-green-500 to-emerald-500',
    Mobile: 'from-blue-500 to-cyan-500',
    Performance: 'from-orange-500 to-amber-500',
    Images: 'from-purple-500 to-pink-500',
    Typography: 'from-indigo-500 to-violet-500',
    Icons: 'from-rose-500 to-red-500',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card-elevated p-4 sm:p-6"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg">
          <Code className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
        </div>
        <div>
          <h3 className="text-base sm:text-lg font-semibold">Tech Stack</h3>
          <p className="text-xs sm:text-sm text-muted-foreground">{technologies.length} detected</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {technologies.map((tech, index) => {
          const Icon = categoryIcons[tech.category] || Code;
          const colorClass = categoryColors[tech.category] || 'from-gray-500 to-gray-600';
          
          return (
            <motion.div
              key={tech.name}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.04, type: 'spring' }}
              whileHover={{ scale: 1.03 }}
              className="flex items-center gap-2 px-2.5 py-1.5 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className={`w-5 h-5 rounded bg-gradient-to-br ${colorClass} flex items-center justify-center`}>
                <Icon className="w-2.5 h-2.5 text-white" />
              </div>
              <div>
                <p className="text-xs font-medium leading-tight">{tech.name}</p>
                <p className="text-[9px] text-muted-foreground leading-tight">{tech.category}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
