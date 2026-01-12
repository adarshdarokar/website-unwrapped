import { useState, RefObject } from 'react';
import { motion } from 'framer-motion';
import { Search, Globe, Sparkles, ArrowRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface UrlInputProps {
  onAnalyze: (url: string) => void;
  isLoading: boolean;
  inputRef?: RefObject<HTMLInputElement>;
}

const suggestions = [
  { name: 'Apple', url: 'apple.com' },
  { name: 'Stripe', url: 'stripe.com' },
  { name: 'Vercel', url: 'vercel.com' },
  { name: 'Linear', url: 'linear.app' },
];

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
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="w-full max-w-2xl mx-auto"
    >
      <form onSubmit={handleSubmit} className="relative">
        <motion.div 
          className={`glass-card-elevated p-2 flex items-center gap-2 transition-all duration-300 ${
            isFocused ? 'ring-2 ring-primary/50 shadow-glow' : ''
          }`}
          animate={{ scale: isFocused ? 1.01 : 1 }}
        >
          <motion.div 
            className="flex items-center gap-3 pl-4 text-muted-foreground"
            animate={{ rotate: isLoading ? 360 : 0 }}
            transition={{ duration: 2, repeat: isLoading ? Infinity : 0, ease: 'linear' }}
          >
            <Globe className="w-5 h-5" />
          </motion.div>
          <Input
            ref={inputRef}
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Enter any website URL to analyze..."
            className="flex-1 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-lg placeholder:text-muted-foreground/60"
            disabled={isLoading}
          />
          <Button 
            type="submit" 
            disabled={isLoading || !url.trim()}
            className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground px-6 py-2 rounded-xl transition-all duration-300 hover:shadow-lg disabled:opacity-50"
          >
            {isLoading ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              >
                <Sparkles className="w-5 h-5" />
              </motion.div>
            ) : (
              <div className="flex items-center gap-2">
                <Search className="w-5 h-5" />
                <span className="hidden sm:inline">Analyze</span>
              </div>
            )}
          </Button>
        </motion.div>
      </form>
      
      {/* Quick suggestions */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="flex flex-wrap items-center justify-center gap-2 mt-6"
      >
        <span className="text-xs text-muted-foreground">Try:</span>
        {suggestions.map((suggestion, index) => (
          <motion.button
            key={suggestion.url}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + index * 0.1 }}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setUrl(suggestion.url);
              onAnalyze(suggestion.url);
            }}
            disabled={isLoading}
            className="px-3 py-1.5 text-xs font-medium bg-muted/50 hover:bg-muted rounded-full text-muted-foreground hover:text-foreground transition-all duration-200 flex items-center gap-1 group disabled:opacity-50"
          >
            {suggestion.name}
            <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
          </motion.button>
        ))}
      </motion.div>
      
      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-center text-sm text-muted-foreground mt-4"
      >
        Paste any URL to discover its design elements, fonts, colors, and more
      </motion.p>
    </motion.div>
  );
}
