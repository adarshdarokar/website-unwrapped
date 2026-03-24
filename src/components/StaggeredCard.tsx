import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface StaggeredCardProps {
  children: ReactNode;
  index: number;
  className?: string;
}

export function StaggeredCard({ children, index, className = '' }: StaggeredCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.4,
        delay: 0.08 * index,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
