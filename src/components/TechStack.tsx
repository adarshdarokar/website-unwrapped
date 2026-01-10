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
      className="glass-card-elevated p-6"
    >
      <div className="flex items-center gap-3 mb-6">
        <motion.div 
          className="p-2.5 bg-gradient-to-br from-primary/20 to-accent/20 rounded-xl"
          whileHover={{ scale: 1.05, rotate: -5 }}
        >
          <Code className="w-5 h-5 text-primary" />
        </motion.div>
        <div>
          <h3 className="text-lg font-semibold">Tech Stack</h3>
          <p className="text-sm text-muted-foreground">{technologies.length} technologies detected</p>
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
              transition={{ delay: index * 0.05, type: 'spring' }}
              whileHover={{ scale: 1.05, y: -2 }}
              className="flex items-center gap-2 px-3 py-2 bg-muted/50 rounded-xl hover:bg-muted transition-colors"
            >
              <div className={`w-6 h-6 rounded-md bg-gradient-to-br ${colorClass} flex items-center justify-center`}>
                <Icon className="w-3 h-3 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium">{tech.name}</p>
                <p className="text-[10px] text-muted-foreground">{tech.category}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
