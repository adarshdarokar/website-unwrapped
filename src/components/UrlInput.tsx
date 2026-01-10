import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Globe, Sparkles } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface UrlInputProps {
  onAnalyze: (url: string) => void;
  isLoading: boolean;
}

export function UrlInput({ onAnalyze, isLoading }: UrlInputProps) {
  const [url, setUrl] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      onAnalyze(url.trim());
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="w-full max-w-2xl mx-auto"
    >
      <form onSubmit={handleSubmit} className="relative">
        <div className="glass-card-elevated p-2 flex items-center gap-2">
          <div className="flex items-center gap-3 pl-4 text-muted-foreground">
            <Globe className="w-5 h-5" />
          </div>
          <Input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter any website URL to analyze..."
            className="flex-1 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-lg placeholder:text-muted-foreground/60"
            disabled={isLoading}
          />
          <Button 
            type="submit" 
            disabled={isLoading || !url.trim()}
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-2 rounded-xl transition-all duration-300 hover:shadow-lg"
          >
            {isLoading ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              >
                <Sparkles className="w-5 h-5" />
              </motion.div>
            ) : (
              <Search className="w-5 h-5" />
            )}
          </Button>
        </div>
      </form>
      
      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-center text-sm text-muted-foreground mt-4"
      >
        Paste any URL to discover its design elements, fonts, colors, and more
      </motion.p>
    </motion.div>
  );
}
