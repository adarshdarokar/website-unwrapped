import { motion } from 'framer-motion';
import { Shield, Zap, Globe, Users } from 'lucide-react';

const stats = [
  { value: '50K+', label: 'Sites Analyzed', icon: Globe },
  { value: '12K+', label: 'Active Users', icon: Users },
  { value: '<3s', label: 'Avg. Speed', icon: Zap },
  { value: '99.9%', label: 'Uptime', icon: Shield },
];

export function TrustSection() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.6, duration: 0.5 }}
      className="mt-12 sm:mt-16 pt-6 sm:pt-8 border-t border-border/50"
    >
      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-5 sm:mb-6 text-center">
        Trusted by designers & developers
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-lg mx-auto">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 + index * 0.1 }}
            className="text-center p-3 sm:p-4 bg-card/50 border border-border/30 rounded-xl"
          >
            <stat.icon className="w-4 h-4 mx-auto text-primary/60 mb-2" />
            <p className="text-lg sm:text-xl font-display font-bold text-foreground">
              {stat.value}
            </p>
            <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5">
              {stat.label}
            </p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
