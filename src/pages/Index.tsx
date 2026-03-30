import { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Globe,
  Image,
  Type,
  Palette,
  Shapes,
  Zap,
  RefreshCw,
  ExternalLink,
  LayoutDashboard,
  Monitor,
} from 'lucide-react';
import { UrlInput } from '@/components/UrlInput';
import { QualityScore } from '@/components/QualityScore';
import { ImageGallery } from '@/components/ImageGallery';
import { FontDisplay } from '@/components/FontDisplay';
import { ColorPalette } from '@/components/ColorPalette';
import { IconDisplay } from '@/components/IconDisplay';
import { AnimationDisplay } from '@/components/AnimationDisplay';
import { LoadingState } from '@/components/LoadingState';
import { TechStack } from '@/components/TechStack';
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
import { ResponsivePreview } from '@/components/ResponsivePreview';
import { ScoreBreakdown } from '@/components/ScoreBreakdown';
import { useWebsiteAnalyzer } from '@/hooks/useWebsiteAnalyzer';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { useAnalysisStats } from '@/hooks/useAnalysisStats';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';

const Index = () => {
  const { analyzeWebsite, isLoading, error, result } = useWebsiteAnalyzer();
  const stats = useAnalysisStats(result);
  const [showCompare, setShowCompare] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [activeResultTab, setActiveResultTab] = useState('overview');
  const urlInputRef = useRef<HTMLInputElement>(null);

  const toggleTheme = useCallback(() => {
    document.documentElement.classList.toggle('dark');
    const isDark = document.documentElement.classList.contains('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }, []);

  // Global keyboard shortcuts
  useKeyboardShortcuts({
    onSearch: () => setShowCommandPalette(true),
    onHistory: () => window.dispatchEvent(new CustomEvent('app:navigate', { detail: '/history' })),
    onCompare: () => setShowCompare(true),
    onExport: () => result && setShowExport(true),
    onToggleTheme: toggleTheme,
    onEscape: () => {
      setShowCommandPalette(false);
      setShowCompare(false);
      setShowExport(false);
      setShowShortcuts(false);
    },
    onAnalyze: () => urlInputRef.current?.focus(),
  });

  // Sidebar action events
  useEffect(() => {
    const onCommand = () => setShowCommandPalette(true);
    const onCompare = () => setShowCompare(true);
    const onExport = () => result && setShowExport(true);
    const onShortcuts = () => setShowShortcuts(true);

    window.addEventListener('app:commandPalette', onCommand as EventListener);
    window.addEventListener('app:compare', onCompare as EventListener);
    window.addEventListener('app:export', onExport as EventListener);
    window.addEventListener('app:shortcuts', onShortcuts as EventListener);

    return () => {
      window.removeEventListener('app:commandPalette', onCommand as EventListener);
      window.removeEventListener('app:compare', onCompare as EventListener);
      window.removeEventListener('app:export', onExport as EventListener);
      window.removeEventListener('app:shortcuts', onShortcuts as EventListener);
    };
  }, [result]);

  const resultTabs = [
    { value: 'overview', icon: LayoutDashboard, label: 'Overview' },
    { value: 'colors', icon: Palette, label: 'Colors' },
    { value: 'fonts', icon: Type, label: 'Fonts' },
    { value: 'images', icon: Image, label: 'Images' },
    { value: 'icons', icon: Shapes, label: 'Icons' },
    { value: 'animations', icon: Zap, label: 'Motion' },
    { value: 'preview', icon: Monitor, label: 'Preview' },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="px-4 sm:px-6 pt-8 sm:pt-12 md:pt-16 pb-6 sm:pb-8">
        <div className="max-w-3xl mx-auto text-center">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/5 text-primary text-xs font-medium rounded-full border border-primary/10 mb-5 sm:mb-6"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
            Analyze any website instantly
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-bold tracking-tight text-balance mb-3 sm:mb-4"
          >
            Discover the design DNA
            <br />
            <span className="gradient-text">of any website</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground text-sm sm:text-base max-w-lg mx-auto mb-6 sm:mb-8 px-2 leading-relaxed"
          >
            Extract colors, fonts, images, and icons. Get actionable insights on performance, accessibility, and SEO — all in seconds.
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
            className="max-w-xl mx-auto px-4 sm:px-6 mb-6 sm:mb-8"
          >
            <div className="p-3 sm:p-4 bg-destructive/5 border border-destructive/20 rounded-xl">
              <p className="text-destructive font-medium text-xs sm:text-sm mb-1">{error}</p>
              <p className="text-[10px] sm:text-xs text-muted-foreground">
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
            className="max-w-7xl mx-auto px-4 sm:px-6"
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
            className="max-w-7xl mx-auto px-4 sm:px-6 pb-12 sm:pb-20"
          >
            {/* Result Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-4 sm:mb-6"
            >
              <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
                <a 
                  href={result.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline font-medium flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm"
                >
                  <Globe className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span className="truncate max-w-[200px] sm:max-w-xs">{result.url}</span>
                  <ExternalLink className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                </a>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => analyzeWebsite(result.url)}
                  className="text-muted-foreground hover:text-foreground text-[10px] sm:text-xs h-7 sm:h-8"
                >
                  <RefreshCw className="w-3 h-3 mr-1" />
                  Re-analyze
                </Button>
              </div>
            </motion.div>

            <Tabs value={activeResultTab} onValueChange={setActiveResultTab} className="w-full">
              <TabsList className="w-full flex flex-wrap justify-center bg-muted/50 p-1 rounded-xl h-auto mb-4 sm:mb-6 max-w-2xl mx-auto gap-0.5 sm:gap-1">
                {resultTabs.map((tab) => (
                  <TabsTrigger 
                    key={tab.value}
                    value={tab.value} 
                    className="flex-1 min-w-[50px] sm:min-w-[60px] max-w-[100px] sm:max-w-[120px] flex items-center justify-center gap-1 sm:gap-1.5 data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-lg py-1.5 sm:py-2.5 text-[10px] sm:text-xs transition-all"
                  >
                    <tab.icon className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="hidden sm:inline">{tab.label}</span>
                  </TabsTrigger>
                ))}
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="mt-0">
                <div className="grid lg:grid-cols-[1fr_320px] gap-4">
                  <div className="space-y-4">
                    <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.05 }}>
                      <AnalysisSummary
                        url={result.url}
                        score={result.score}
                        colorCount={stats?.colorCount || 0}
                        fontCount={stats?.fontCount || 0}
                        imageCount={stats?.imageCount || 0}
                        animationCount={stats?.animationCount || 0}
                        onExport={() => setShowExport(true)}
                      />
                    </motion.div>
                    
                    <div className="grid sm:grid-cols-2 gap-4">
                      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.15 }}>
                        <PerformanceInsights 
                          meta={result.meta} 
                          images={result.images}
                          score={result.score}
                        />
                      </motion.div>
                      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.25 }}>
                        <AccessibilityScore
                          images={result.images}
                          meta={result.meta}
                          colors={result.colors}
                          fonts={result.fonts}
                        />
                      </motion.div>
                    </div>

                    <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.35 }}>
                      <DesignInsights
                        colors={result.colors}
                        fonts={result.fonts}
                        animations={result.animations}
                        score={result.score}
                      />
                    </motion.div>

                    {/* Score Breakdown with Suggestions */}
                    <motion.div
                      initial={{ opacity: 0, y: 24 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.45 }}
                    >
                      <ScoreBreakdown
                        score={result.score}
                        scoreBreakdown={(result as any).scoreBreakdown}
                        scoreReasons={(result as any).scoreReasons}
                        suggestions={(result as any).suggestions}
                      />
                    </motion.div>
                  </div>

                  <div className="space-y-4">
                    <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }}>
                      <QualityScore score={result.score} meta={result.meta} />
                    </motion.div>
                    <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 }}>
                      <SEOOverview url={result.url} meta={result.meta} images={result.images} />
                    </motion.div>
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

              {/* Preview Tab */}
              <TabsContent value="preview" className="mt-0">
                <ResponsivePreview url={result.url} />
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
  );
};

export default Index;
