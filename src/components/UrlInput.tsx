import { useState, RefObject } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface UrlInputProps {
  onAnalyze: (url: string) => void;
  isLoading: boolean;
  inputRef?: RefObject<HTMLInputElement>;
}

export function UrlInput({ onAnalyze, isLoading, inputRef }: UrlInputProps) {
  const [url, setUrl] = useState('');
  const [isFocused, setIsFocused] = useState(false);

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
      transition={{ duration: 0.5, delay: 0.3 }}
      className="w-full max-w-xl mx-auto"
    >
      <form onSubmit={handleSubmit} className="relative">
        <div 
          className={`flex items-center gap-2 p-1.5 bg-card border rounded-xl transition-all duration-200 ${
            isFocused 
              ? 'border-primary shadow-[0_0_0_3px_hsl(var(--primary)/0.1)]' 
              : 'border-border hover:border-border/80'
          }`}
        >
          <Input
            ref={inputRef}
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Enter website URL..."
            className="flex-1 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-base placeholder:text-muted-foreground/50 h-11"
            disabled={isLoading}
          />
          <Button 
            type="submit" 
            disabled={isLoading || !url.trim()}
            className="h-10 px-5 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground font-medium transition-all disabled:opacity-40"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <span className="mr-2">Analyze</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </Button>
        </div>
      </form>
      
      {/* Subtle hint */}
      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-center text-xs text-muted-foreground/70 mt-3"
      >
        e.g. stripe.com, linear.app, vercel.com
      </motion.p>
    </motion.div>
  );
}
