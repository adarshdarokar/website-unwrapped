import { motion } from 'framer-motion';

const stats = [
  { value: '50K+', label: 'Sites Analyzed' },
  { value: '12K+', label: 'Active Users' },
  { value: '99.9%', label: 'Uptime' },
];

export function TrustSection() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.6, duration: 0.5 }}
      className="mt-16 pt-8 border-t border-border/50"
    >
      <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 + index * 0.1 }}
            className="text-center"
          >
            <p className="text-2xl md:text-3xl font-display font-semibold text-foreground">
              {stat.value}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {stat.label}
            </p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
