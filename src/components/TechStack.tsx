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
      className="glass-card-elevated p-4 sm:p-5"
    >
      <div className="flex items-center gap-2.5 mb-3">
        <div className="p-1.5 bg-gradient-to-br from-primary/15 to-accent/15 rounded-lg">
          <Code className="w-4 h-4 text-primary" />
        </div>
        <div>
          <h3 className="text-sm font-semibold">Tech Stack</h3>
          <p className="text-[10px] text-muted-foreground">{technologies.length} detected</p>
        </div>
      </div>

      <div className="space-y-1.5">
        {technologies.map((tech, index) => {
          const Icon = categoryIcons[tech.category] || Code;
          const colorClass = categoryColors[tech.category] || 'from-gray-500 to-gray-600';
          
          return (
            <motion.div
              key={tech.name}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.04 }}
              className="flex items-center gap-2 px-2 py-1.5 bg-muted/20 rounded-lg hover:bg-muted/30 transition-colors"
            >
              <div className={`w-5 h-5 rounded bg-gradient-to-br ${colorClass} flex items-center justify-center flex-shrink-0`}>
                <Icon className="w-2.5 h-2.5 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-medium leading-tight truncate">{tech.name}</p>
                <p className="text-[9px] text-muted-foreground leading-tight">{tech.category}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
