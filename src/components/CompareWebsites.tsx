import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  GitCompare, 
  Globe, 
  ArrowRight, 
  Loader2, 
  Check, 
  X, 
  Palette, 
  Type, 
  Image, 
  Zap, 
  TrendingUp, 
  TrendingDown, 
  Minus,
  Trophy,
  Sparkles,
  BarChart3,
  Eye,
  ArrowUpRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { useWebsiteAnalyzer, AnalysisResult } from '@/hooks/useWebsiteAnalyzer';
import { toast } from 'sonner';
import { Progress } from '@/components/ui/progress';

interface CompareWebsitesProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CompareWebsites({ isOpen, onClose }: CompareWebsitesProps) {
  const [url1, setUrl1] = useState('');
  const [url2, setUrl2] = useState('');
  const [result1, setResult1] = useState<AnalysisResult | null>(null);
  const [result2, setResult2] = useState<AnalysisResult | null>(null);
  const [isComparing, setIsComparing] = useState(false);
  const [progress, setProgress] = useState(0);
  const { analyzeWebsiteStandalone } = useWebsiteAnalyzer();

  const handleCompare = async () => {
    if (!url1 || !url2) {
      toast.error('Please enter both URLs');
      return;
    }

    setIsComparing(true);
    setResult1(null);
    setResult2(null);
    setProgress(0);

    try {
      // Show progress animation
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 10, 90));
      }, 300);

      // Analyze both websites in parallel using the standalone method
      const [res1, res2] = await Promise.all([
        analyzeWebsiteStandalone(url1),
        analyzeWebsiteStandalone(url2),
      ]);

      clearInterval(progressInterval);
      setProgress(100);

      if (!res1 || !res2) {
        toast.error('Failed to analyze one or both websites');
        setIsComparing(false);
        return;
      }

      setResult1(res1);
      setResult2(res2);
      toast.success('Comparison complete!');
    } catch (error) {
      toast.error('Failed to compare websites');
    } finally {
      setIsComparing(false);
    }
  };

  const resetComparison = () => {
    setResult1(null);
    setResult2(null);
    setUrl1('');
    setUrl2('');
    setProgress(0);
  };

  const ComparisonMetric = ({ 
    label, 
    icon: Icon, 
    value1, 
    value2,
    higherIsBetter = true,
    suffix = ''
  }: { 
    label: string; 
    icon: any; 
    value1: number; 
    value2: number;
    higherIsBetter?: boolean;
    suffix?: string;
  }) => {
    const winner = higherIsBetter 
      ? (value1 > value2 ? 1 : value2 > value1 ? 2 : 0)
      : (value1 < value2 ? 1 : value2 < value1 ? 2 : 0);
    
    const diff = Math.abs(value1 - value2);
    const percentDiff = value2 !== 0 ? Math.round((diff / value2) * 100) : 0;

    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-[1fr_auto_1fr] gap-4 p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors"
      >
        <div className={`text-center space-y-1 ${winner === 1 ? 'text-success' : ''}`}>
          <motion.p 
            className="text-2xl md:text-3xl font-bold"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
          >
            {value1}{suffix}
          </motion.p>
          {winner === 1 && (
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="flex items-center justify-center gap-1 text-success text-xs"
            >
              <Trophy className="w-3 h-3" />
              <span>Winner</span>
            </motion.div>
          )}
        </div>
        
        <div className="flex flex-col items-center justify-center gap-1 px-4">
          <div className="p-2 bg-muted rounded-lg">
            <Icon className="w-4 h-4 text-muted-foreground" />
          </div>
          <span className="text-xs font-medium text-muted-foreground text-center">{label}</span>
          {winner !== 0 && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              {winner === 1 ? (
                <TrendingUp className="w-3 h-3 text-success" />
              ) : (
                <TrendingDown className="w-3 h-3 text-destructive" />
              )}
              <span>{percentDiff}%</span>
            </div>
          )}
          {winner === 0 && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Minus className="w-3 h-3" />
              <span>Tie</span>
            </div>
          )}
        </div>
        
        <div className={`text-center space-y-1 ${winner === 2 ? 'text-success' : ''}`}>
          <motion.p 
            className="text-2xl md:text-3xl font-bold"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
          >
            {value2}{suffix}
          </motion.p>
          {winner === 2 && (
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="flex items-center justify-center gap-1 text-success text-xs"
            >
              <Trophy className="w-3 h-3" />
              <span>Winner</span>
            </motion.div>
          )}
        </div>
      </motion.div>
    );
  };

  const getOverallWinner = () => {
    if (!result1 || !result2) return 0;
    
    let score1 = 0;
    let score2 = 0;
    
    if (result1.score > result2.score) score1++; else if (result2.score > result1.score) score2++;
    if (result1.images.length > result2.images.length) score1++; else if (result2.images.length > result1.images.length) score2++;
    if (result1.colors.length > result2.colors.length) score1++; else if (result2.colors.length > result1.colors.length) score2++;
    if (result1.fonts.detected.length > result2.fonts.detected.length) score1++; else if (result2.fonts.detected.length > result1.fonts.detected.length) score2++;
    if (result1.icons.svgCount > result2.icons.svgCount) score1++; else if (result2.icons.svgCount > result1.icons.svgCount) score2++;
    
    return score1 > score2 ? 1 : score2 > score1 ? 2 : 0;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-card via-card to-muted/20 border-border/50 p-0">
        <DialogTitle className="sr-only">Compare Websites</DialogTitle>
        
        <div className="p-6 md:p-8">
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between mb-8"
          >
            <div className="flex items-center gap-3">
              <motion.div 
                className="p-3 bg-gradient-to-br from-primary/20 to-accent/20 rounded-xl"
                whileHover={{ rotate: 10, scale: 1.05 }}
              >
                <GitCompare className="w-6 h-6 text-primary" />
              </motion.div>
              <div>
                <h2 className="text-xl md:text-2xl font-display font-bold">Compare Websites</h2>
                <p className="text-muted-foreground text-sm">Analyze and compare design elements side by side</p>
              </div>
            </div>
            
            {(result1 || result2) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={resetComparison}
                className="text-muted-foreground"
              >
                <X className="w-4 h-4 mr-1" />
                Reset
              </Button>
            )}
          </motion.div>

          {/* URL Inputs */}
          <div className="grid md:grid-cols-2 gap-4 md:gap-6 mb-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="space-y-2"
            >
              <label className="text-sm font-medium flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="text-xs font-bold text-primary">1</span>
                </div>
                First Website
              </label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  value={url1}
                  onChange={(e) => setUrl1(e.target.value)}
                  placeholder="apple.com"
                  className="h-12 pl-10 bg-muted/50 border-border/50 rounded-xl focus:ring-2 focus:ring-primary/20"
                  disabled={isComparing}
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-2"
            >
              <label className="text-sm font-medium flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-accent/30 flex items-center justify-center">
                  <span className="text-xs font-bold text-accent-foreground">2</span>
                </div>
                Second Website
              </label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  value={url2}
                  onChange={(e) => setUrl2(e.target.value)}
                  placeholder="google.com"
                  className="h-12 pl-10 bg-muted/50 border-border/50 rounded-xl focus:ring-2 focus:ring-primary/20"
                  disabled={isComparing}
                />
              </div>
            </motion.div>
          </div>

          {/* Progress Bar */}
          <AnimatePresence>
            {isComparing && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-6"
              >
                <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
                  <span>Analyzing websites...</span>
                  <span>{progress}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Compare Button */}
          {!result1 && !result2 && (
            <motion.div
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="mb-8"
            >
              <Button
                onClick={handleCompare}
                disabled={isComparing || !url1 || !url2}
                className="w-full h-14 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground rounded-xl font-medium text-lg shadow-lg shadow-primary/25 disabled:opacity-50"
              >
                {isComparing ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Analyzing Both Websites...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-2" />
                    Compare Now
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </>
                )}
              </Button>
            </motion.div>
          )}

          {/* Comparison Results */}
          <AnimatePresence mode="wait">
            {(result1 && result2) && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                {/* Score Headers */}
                <div className="grid grid-cols-[1fr_auto_1fr] gap-4 p-6 rounded-2xl bg-gradient-to-r from-primary/5 via-transparent to-accent/5 border border-border/50">
                  <div className="text-center space-y-2">
                    <p className="text-sm text-muted-foreground truncate max-w-[150px] mx-auto">
                      {new URL(result1.url).hostname}
                    </p>
                    <motion.p 
                      className="text-4xl md:text-5xl font-bold text-primary"
                      initial={{ scale: 0.5 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', bounce: 0.5 }}
                    >
                      {result1.score}
                    </motion.p>
                    <p className="text-xs text-muted-foreground">Quality Score</p>
                    {getOverallWinner() === 1 && (
                      <motion.div 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-success/20 text-success rounded-full text-xs font-medium"
                      >
                        <Trophy className="w-3 h-3" />
                        Overall Winner
                      </motion.div>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-center">
                    <div className="w-px h-full bg-border" />
                    <span className="px-4 text-xl font-bold text-muted-foreground">VS</span>
                    <div className="w-px h-full bg-border" />
                  </div>
                  
                  <div className="text-center space-y-2">
                    <p className="text-sm text-muted-foreground truncate max-w-[150px] mx-auto">
                      {new URL(result2.url).hostname}
                    </p>
                    <motion.p 
                      className="text-4xl md:text-5xl font-bold text-accent-foreground"
                      initial={{ scale: 0.5 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', bounce: 0.5 }}
                    >
                      {result2.score}
                    </motion.p>
                    <p className="text-xs text-muted-foreground">Quality Score</p>
                    {getOverallWinner() === 2 && (
                      <motion.div 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-success/20 text-success rounded-full text-xs font-medium"
                      >
                        <Trophy className="w-3 h-3" />
                        Overall Winner
                      </motion.div>
                    )}
                  </div>
                </div>

                {/* Detailed Metrics */}
                <div className="space-y-3">
                  <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <BarChart3 className="w-4 h-4" />
                    Detailed Comparison
                  </h3>
                  
                  <ComparisonMetric 
                    label="Quality Score" 
                    icon={Zap} 
                    value1={result1.score} 
                    value2={result2.score}
                    suffix=""
                  />
                  <ComparisonMetric 
                    label="Images Found" 
                    icon={Image} 
                    value1={result1.images.length} 
                    value2={result2.images.length}
                  />
                  <ComparisonMetric 
                    label="Colors Used" 
                    icon={Palette} 
                    value1={result1.colors.length} 
                    value2={result2.colors.length}
                  />
                  <ComparisonMetric 
                    label="Font Families" 
                    icon={Type} 
                    value1={result1.fonts.detected.length} 
                    value2={result2.fonts.detected.length}
                    higherIsBetter={false}
                  />
                  <ComparisonMetric 
                    label="SVG Icons" 
                    icon={Eye} 
                    value1={result1.icons.svgCount} 
                    value2={result2.icons.svgCount}
                  />
                </div>

                {/* New Comparison Button */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <Button
                    onClick={resetComparison}
                    variant="outline"
                    className="w-full h-12 rounded-xl"
                  >
                    <ArrowUpRight className="w-4 h-4 mr-2" />
                    Compare Different Websites
                  </Button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Empty State */}
          {!result1 && !result2 && !isComparing && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-center py-8"
            >
              <motion.div
                animate={{ 
                  rotate: [0, 5, -5, 0],
                  scale: [1, 1.05, 1]
                }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <GitCompare className="w-16 h-16 mx-auto text-muted-foreground/20 mb-4" />
              </motion.div>
              <p className="text-muted-foreground mb-2">
                Enter two website URLs above to compare their design elements
              </p>
              <p className="text-xs text-muted-foreground/70">
                Compare colors, fonts, images, icons, and overall quality scores
              </p>
            </motion.div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
