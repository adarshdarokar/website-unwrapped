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
      <form onSubmit={handleSubmit} className="relative group">
        {/* Ambient focus glow */}
        <div
          aria-hidden
          className={`pointer-events-none absolute -inset-3 rounded-2xl blur-2xl transition-opacity duration-500 ${
            isFocused ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ background: 'radial-gradient(60% 80% at 50% 50%, hsl(var(--primary)/0.28), transparent 70%)' }}
        />
        <div
          className={`relative flex items-center gap-1.5 sm:gap-2 p-1 sm:p-1.5 bg-card/90 backdrop-blur-xl rounded-2xl transition-all duration-300 ${
            isFocused
              ? 'ring-1 ring-primary/50 shadow-[0_0_0_4px_hsl(var(--primary)/0.10),0_20px_50px_-20px_hsl(var(--primary)/0.45)]'
              : 'ring-1 ring-border/60 shadow-[0_8px_24px_-12px_hsl(240_20%_20%/0.18)] hover:ring-border'
          }`}
        >
          <div className="pl-2 sm:pl-3">
            <Search className={`w-4 h-4 transition-colors ${isFocused ? 'text-primary' : 'text-muted-foreground/60'}`} />
          </div>
          <Input
            ref={inputRef}
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Enter website URL..."
            className="flex-1 border-0 bg-transparent shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 text-sm sm:text-base placeholder:text-muted-foreground/50 h-9 sm:h-11 px-1 sm:px-2"
            disabled={isLoading}
            style={{ boxShadow: 'none' }}
          />
          <Button
            type="submit"
            disabled={isLoading || !url.trim()}
            className="h-8 sm:h-10 px-3 sm:px-5 rounded-xl bg-gradient-to-br from-primary to-primary/80 hover:from-primary hover:to-primary text-primary-foreground font-medium transition-all disabled:opacity-40 text-xs sm:text-sm shadow-[0_8px_22px_-8px_hsl(var(--primary)/0.55)] hover:shadow-[0_12px_28px_-6px_hsl(var(--primary)/0.6)] hover:-translate-y-[1px]"
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
