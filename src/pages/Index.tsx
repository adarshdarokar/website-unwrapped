import { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Image, Type, Palette, Shapes, Zap, RefreshCw, ExternalLink, History, Command, GitCompare, Share2, Menu, X, Keyboard, LayoutDashboard, Eye, Search as SearchIcon, Gauge } from 'lucide-react';
import { UrlInput } from '@/components/UrlInput';
import { QualityScore } from '@/components/QualityScore';
import { ImageGallery } from '@/components/ImageGallery';
import { FontDisplay } from '@/components/FontDisplay';
import { ColorPalette } from '@/components/ColorPalette';
import { IconDisplay } from '@/components/IconDisplay';
import { AnimationDisplay } from '@/components/AnimationDisplay';
import { LoadingState } from '@/components/LoadingState';
import { ThemeToggle } from '@/components/ThemeToggle';
import { TechStack } from '@/components/TechStack';
import { UserMenu } from '@/components/UserMenu';
import { CompareWebsites } from '@/components/CompareWebsites';
import { ExportAnalysis } from '@/components/ExportAnalysis';
import { QuickActions } from '@/components/QuickActions';
import { RecentAnalyses } from '@/components/RecentAnalyses';
import { CommandPalette } from '@/components/CommandPalette';
import { KeyboardShortcutsHelp } from '@/components/KeyboardShortcutsHelp';
import { HeroPreviewCard } from '@/components/HeroPreviewCard';
import { TrustSection } from '@/components/TrustSection';
import { FeatureRow } from '@/components/FeatureRow';
import { PerformanceInsights } from '@/components/PerformanceInsights';
import { AccessibilityScore } from '@/components/AccessibilityScore';
import { DesignInsights } from '@/components/DesignInsights';
import { SEOOverview } from '@/components/SEOOverview';
import { AnalysisSummary } from '@/components/AnalysisSummary';
import { useWebsiteAnalyzer } from '@/hooks/useWebsiteAnalyzer';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { useAnalysisStats } from '@/hooks/useAnalysisStats';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const Index = () => {
  const { analyzeWebsite, isLoading, error, result } = useWebsiteAnalyzer();
  const stats = useAnalysisStats(result);
  const [showCompare, setShowCompare] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeResultTab, setActiveResultTab] = useState('overview');
  const navigate = useNavigate();
  const urlInputRef = useRef<HTMLInputElement>(null);

  const toggleTheme = useCallback(() => {
    document.documentElement.classList.toggle('dark');
    const isDark = document.documentElement.classList.contains('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }, []);

  useKeyboardShortcuts({
    onSearch: () => setShowCommandPalette(true),
    onHistory: () => navigate('/history'),
    onCompare: () => setShowCompare(true),
    onExport: () => result && setShowExport(true),
    onToggleTheme: toggleTheme,
    onEscape: () => {
      setShowCommandPalette(false);
      setShowCompare(false);
      setShowExport(false);
      setShowShortcuts(false);
      setMobileMenuOpen(false);
    },
    onAnalyze: () => urlInputRef.current?.focus(),
  });

  const resultTabs = [
    { value: 'overview', icon: LayoutDashboard, label: 'Overview' },
    { value: 'colors', icon: Palette, label: 'Colors' },
    { value: 'fonts', icon: Type, label: 'Fonts' },
    { value: 'images', icon: Image, label: 'Images' },
    { value: 'icons', icon: Shapes, label: 'Icons' },
    { value: 'animations', icon: Zap, label: 'Motion' },
  ];

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/50">
          <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
            <motion.div 
              className="flex items-center gap-2.5 cursor-pointer"
              whileHover={{ opacity: 0.8 }}
              onClick={() => window.location.reload()}
            >
              <div className="p-1.5 bg-primary/10 rounded-lg">
                <Globe className="w-5 h-5 text-primary" />
              </div>
              <span className="text-lg font-display font-semibold">WebVision</span>
            </motion.div>
            
            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowCommandPalette(true)}
                    className="gap-2 text-muted-foreground hover:text-foreground"
                  >
                    <Command className="w-4 h-4" />
                    <kbd className="hidden lg:inline px-1.5 py-0.5 text-[10px] font-mono bg-muted rounded">⌘K</kbd>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Quick actions</TooltipContent>
              </Tooltip>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/history')}
                className="gap-2 text-muted-foreground hover:text-foreground"
              >
                <History className="w-4 h-4" />
                <span className="hidden lg:inline">History</span>
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowCompare(true)}
                className="gap-2 text-muted-foreground hover:text-foreground"
              >
                <GitCompare className="w-4 h-4" />
                <span className="hidden lg:inline">Compare</span>
              </Button>
              
              {result && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowExport(true)}
                  className="gap-2 text-muted-foreground hover:text-foreground"
                >
                  <Share2 className="w-4 h-4" />
                  <span className="hidden lg:inline">Export</span>
                </Button>
              )}

              <div className="w-px h-5 bg-border mx-1" />
              
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowShortcuts(true)}
                className="text-muted-foreground hover:text-foreground"
              >
                <Keyboard className="w-4 h-4" />
              </Button>
              
              <ThemeToggle />
              <UserMenu />
            </div>

            {/* Mobile */}
            <div className="flex md:hidden items-center gap-1">
              <ThemeToggle />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="md:hidden border-t border-border/50 bg-card"
              >
                <div className="p-4 space-y-2">
                  <Button variant="ghost" className="w-full justify-start" onClick={() => { setShowCommandPalette(true); setMobileMenuOpen(false); }}>
                    <Command className="w-4 h-4 mr-2" /> Quick Actions
                  </Button>
                  <Button variant="ghost" className="w-full justify-start" onClick={() => { navigate('/history'); setMobileMenuOpen(false); }}>
                    <History className="w-4 h-4 mr-2" /> History
                  </Button>
                  <Button variant="ghost" className="w-full justify-start" onClick={() => { setShowCompare(true); setMobileMenuOpen(false); }}>
                    <GitCompare className="w-4 h-4 mr-2" /> Compare
                  </Button>
                  <div className="pt-2 border-t border-border/50">
                    <UserMenu />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </header>

        {/* Hero Section */}
        <section className="px-4 pt-12 md:pt-20 pb-8">
          <div className="max-w-3xl mx-auto text-center">
            <motion.span 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-block px-3 py-1 bg-primary/5 text-primary text-xs font-medium rounded-full border border-primary/10 mb-5"
            >
              Analyze any website instantly
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-2xl sm:text-3xl md:text-4xl font-display font-semibold tracking-tight text-balance mb-3"
            >
              Discover the design DNA
              <br />
              <span className="text-muted-foreground">of any website</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-muted-foreground text-sm md:text-base max-w-md mx-auto mb-6"
            >
              Extract colors, fonts, images, and icons. Get insights on performance, accessibility, and SEO.
            </motion.p>

            <UrlInput onAnalyze={analyzeWebsite} isLoading={isLoading} inputRef={urlInputRef} />
            
            {/* Preview Card - only show when no result */}
            {!result && !isLoading && <HeroPreviewCard />}
            
            {/* Feature Row */}
            {!result && !isLoading && <FeatureRow />}
            
            {/* Trust Section */}
            {!result && !isLoading && <TrustSection />}
            
            {/* Quick Actions */}
            {!result && !isLoading && <QuickActions onAnalyze={analyzeWebsite} isLoading={isLoading} />}
            
            {/* Recent Analyses */}
            {!result && !isLoading && <RecentAnalyses />}
          </div>
        </section>

        {/* Error State */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-xl mx-auto px-4 mb-8"
            >
              <div className="p-4 bg-destructive/5 border border-destructive/20 rounded-xl">
                <p className="text-destructive font-medium text-sm mb-1">{error}</p>
                <p className="text-xs text-muted-foreground">
                  Please check the URL and try again.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Loading State */}
        <AnimatePresence>
          {isLoading && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-7xl mx-auto px-4"
            >
              <LoadingState />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results */}
        <AnimatePresence>
          {result && !isLoading && (
            <motion.section
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-7xl mx-auto px-4 pb-20"
            >
              {/* Result Header */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-6"
              >
                <div className="flex items-center justify-center gap-3 flex-wrap">
                  <a 
                    href={result.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:underline font-medium flex items-center gap-2 text-sm"
                  >
                    <Globe className="w-4 h-4" />
                    <span className="truncate max-w-xs">{result.url}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => analyzeWebsite(result.url)}
                    className="text-muted-foreground hover:text-foreground text-xs"
                  >
                    <RefreshCw className="w-3 h-3 mr-1" />
                    Re-analyze
                  </Button>
                </div>
              </motion.div>

              <Tabs value={activeResultTab} onValueChange={setActiveResultTab} className="w-full">
                <TabsList className="w-full grid grid-cols-6 bg-muted/50 p-1 rounded-xl h-auto mb-6 max-w-2xl mx-auto">
                  {resultTabs.map((tab) => (
                    <TabsTrigger 
                      key={tab.value}
                      value={tab.value} 
                      className="flex items-center justify-center gap-1.5 data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-lg py-2.5 text-xs transition-all"
                    >
                      <tab.icon className="w-4 h-4" />
                      <span className="hidden sm:inline">{tab.label}</span>
                    </TabsTrigger>
                  ))}
                </TabsList>

                {/* Overview Tab */}
                <TabsContent value="overview" className="mt-0">
                  <div className="grid lg:grid-cols-3 gap-4">
                    {/* Left Column - Main Score & Summary */}
                    <div className="lg:col-span-2 space-y-4">
                      <AnalysisSummary
                        url={result.url}
                        score={result.score}
                        colorCount={stats?.colorCount || 0}
                        fontCount={stats?.fontCount || 0}
                        imageCount={stats?.imageCount || 0}
                        animationCount={stats?.animationCount || 0}
                        onExport={() => setShowExport(true)}
                      />
                      
                      <div className="grid sm:grid-cols-2 gap-4">
                        <PerformanceInsights 
                          meta={result.meta} 
                          images={result.images}
                          score={result.score}
                        />
                        <AccessibilityScore
                          images={result.images}
                          meta={result.meta}
                          colors={result.colors}
                          fonts={result.fonts}
                        />
                      </div>
                    </div>

                    {/* Right Column - Insights */}
                    <div className="space-y-4">
                      <QualityScore score={result.score} meta={result.meta} />
                      <SEOOverview url={result.url} meta={result.meta} images={result.images} />
                      <DesignInsights
                        colors={result.colors}
                        fonts={result.fonts}
                        animations={result.animations}
                        score={result.score}
                      />
                    </div>
                  </div>
                </TabsContent>

                {/* Colors Tab */}
                <TabsContent value="colors" className="mt-0">
                  <div className="grid lg:grid-cols-[1fr_280px] gap-4">
                    <ColorPalette colors={result.colors} />
                    <div className="space-y-4">
                      <QualityScore score={result.score} meta={result.meta} />
                      <TechStack meta={result.meta} fonts={result.fonts} icons={result.icons} />
                    </div>
                  </div>
                </TabsContent>

                {/* Fonts Tab */}
                <TabsContent value="fonts" className="mt-0">
                  <div className="grid lg:grid-cols-[1fr_280px] gap-4">
                    <FontDisplay fonts={result.fonts} />
                    <div className="space-y-4">
                      <QualityScore score={result.score} meta={result.meta} />
                      <TechStack meta={result.meta} fonts={result.fonts} icons={result.icons} />
                    </div>
                  </div>
                </TabsContent>

                {/* Images Tab */}
                <TabsContent value="images" className="mt-0">
                  <div className="grid lg:grid-cols-[1fr_280px] gap-4">
                    <ImageGallery images={result.images} />
                    <div className="space-y-4">
                      <QualityScore score={result.score} meta={result.meta} />
                      <TechStack meta={result.meta} fonts={result.fonts} icons={result.icons} />
                    </div>
                  </div>
                </TabsContent>

                {/* Icons Tab */}
                <TabsContent value="icons" className="mt-0">
                  <div className="grid lg:grid-cols-[1fr_280px] gap-4">
                    <IconDisplay icons={result.icons} />
                    <div className="space-y-4">
                      <QualityScore score={result.score} meta={result.meta} />
                      <TechStack meta={result.meta} fonts={result.fonts} icons={result.icons} />
                    </div>
                  </div>
                </TabsContent>

                {/* Animations Tab */}
                <TabsContent value="animations" className="mt-0">
                  <div className="grid lg:grid-cols-[1fr_280px] gap-4">
                    <AnimationDisplay animations={result.animations} />
                    <div className="space-y-4">
                      <QualityScore score={result.score} meta={result.meta} />
                      <TechStack meta={result.meta} fonts={result.fonts} icons={result.icons} />
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </motion.section>
          )}
        </AnimatePresence>

        {/* Footer */}
        {!result && !isLoading && (
          <motion.footer
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="py-8 text-center"
          >
            <p className="text-xs text-muted-foreground/60">
              Built for designers & developers
            </p>
          </motion.footer>
        )}

        {/* Modals */}
        <CompareWebsites isOpen={showCompare} onClose={() => setShowCompare(false)} />
        <ExportAnalysis isOpen={showExport} onClose={() => setShowExport(false)} result={result} />
        <CommandPalette 
          isOpen={showCommandPalette} 
          onClose={() => setShowCommandPalette(false)}
          onCompare={() => setShowCompare(true)}
          onExport={() => setShowExport(true)}
          onAnalyze={analyzeWebsite}
          hasResult={!!result}
        />
        <KeyboardShortcutsHelp isOpen={showShortcuts} onClose={() => setShowShortcuts(false)} />
      </div>
    </TooltipProvider>
  );
};

export default Index;
