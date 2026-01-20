import { useState, RefObject } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Loader2, Search } from 'lucide-react';
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
      className="w-full max-w-xl mx-auto px-2 sm:px-0"
    >
      <form onSubmit={handleSubmit} className="relative">
        <div 
          className={`flex items-center gap-1.5 sm:gap-2 p-1 sm:p-1.5 bg-card border rounded-xl transition-all duration-200 ${
            isFocused 
              ? 'border-primary shadow-[0_0_0_3px_hsl(var(--primary)/0.1)]' 
              : 'border-border hover:border-border/80'
          }`}
        >
          <div className="pl-2 sm:pl-3">
            <Search className="w-4 h-4 text-muted-foreground/50" />
          </div>
          <Input
            ref={inputRef}
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Enter website URL..."
            className="flex-1 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-sm sm:text-base placeholder:text-muted-foreground/50 h-9 sm:h-11 px-1 sm:px-2"
            disabled={isLoading}
          />
          <Button 
            type="submit" 
            disabled={isLoading || !url.trim()}
            className="h-8 sm:h-10 px-3 sm:px-5 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground font-medium transition-all disabled:opacity-40 text-xs sm:text-sm"
          >
            {isLoading ? (
              <Loader2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-spin" />
            ) : (
              <>
                <span className="mr-1.5 sm:mr-2 hidden xs:inline">Analyze</span>
                <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
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
        className="text-center text-[10px] sm:text-xs text-muted-foreground/70 mt-2 sm:mt-3"
      >
        e.g. stripe.com, linear.app, vercel.com
      </motion.p>
    </motion.div>
  );
}
