import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Sparkles, Image, Type, Palette, Shapes, Zap, Code, RefreshCw, ExternalLink, Heart, GitCompare, Share2, Menu, X } from 'lucide-react';
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
import { useWebsiteAnalyzer } from '@/hooks/useWebsiteAnalyzer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';

const Index = () => {
  const { analyzeWebsite, isLoading, error, result } = useWebsiteAnalyzer();
  const [showCompare, setShowCompare] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Animated gradient background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          className="absolute top-0 left-1/4 w-[400px] md:w-[600px] h-[400px] md:h-[600px] bg-gradient-to-br from-primary/10 via-accent/5 to-transparent rounded-full blur-3xl"
          animate={{ 
            x: [0, 50, 0],
            y: [0, 30, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div 
          className="absolute bottom-1/4 right-1/4 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-gradient-to-tr from-accent/10 via-secondary/5 to-transparent rounded-full blur-3xl"
          animate={{ 
            x: [0, -40, 0],
            y: [0, -50, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div 
          className="absolute top-1/2 left-1/2 w-[250px] md:w-[400px] h-[250px] md:h-[400px] bg-gradient-to-bl from-primary/5 to-transparent rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"
          animate={{ 
            rotate: [0, 360],
            scale: [1, 1.15, 1]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="py-4 md:py-6 px-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-7xl mx-auto flex items-center justify-between"
          >
            <motion.div 
              className="flex items-center gap-2 md:gap-3"
              whileHover={{ scale: 1.02 }}
            >
              <motion.div 
                className="p-2 md:p-2.5 bg-gradient-to-br from-primary/20 to-accent/20 rounded-xl"
                whileHover={{ rotate: 10 }}
              >
                <Globe className="w-5 h-5 md:w-6 md:h-6 text-primary" />
              </motion.div>
              <div>
                <span className="text-lg md:text-xl font-display font-bold">WebVision</span>
                <span className="text-[10px] md:text-xs text-muted-foreground block">Design Analyzer</span>
              </div>
            </motion.div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-2">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  variant="ghost"
                  onClick={() => setShowCompare(true)}
                  className="rounded-xl text-muted-foreground hover:text-foreground"
                >
                  <GitCompare className="w-4 h-4 mr-2" />
                  Compare
                </Button>
              </motion.div>
              
              {result && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.02 }} 
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    variant="ghost"
                    onClick={() => setShowExport(true)}
                    className="rounded-xl text-muted-foreground hover:text-foreground"
                  >
                    <Share2 className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                </motion.div>
              )}
              
              <ThemeToggle />
              <UserMenu />
            </div>

            {/* Mobile Menu Button */}
            <div className="flex md:hidden items-center gap-2">
              <ThemeToggle />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="rounded-xl"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </motion.div>

          {/* Mobile Menu */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="md:hidden mt-4 overflow-hidden"
              >
                <div className="glass-card p-4 space-y-2">
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setShowCompare(true);
                      setMobileMenuOpen(false);
                    }}
                    className="w-full justify-start rounded-xl"
                  >
                    <GitCompare className="w-4 h-4 mr-2" />
                    Compare Websites
                  </Button>
                  
                  {result && (
                    <Button
                      variant="ghost"
                      onClick={() => {
                        setShowExport(true);
                        setMobileMenuOpen(false);
                      }}
                      className="w-full justify-start rounded-xl"
                    >
                      <Share2 className="w-4 h-4 mr-2" />
                      Export Analysis
                    </Button>
                  )}
                  
                  <div className="pt-2 border-t border-border/50">
                    <UserMenu />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </header>

        {/* Hero Section */}
        <section className="px-4 py-6 md:py-16">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="mb-4 md:mb-6"
            >
              <motion.span 
                className="inline-flex items-center gap-2 px-3 md:px-4 py-1.5 md:py-2 bg-gradient-to-r from-primary/10 to-accent/10 text-primary rounded-full text-xs md:text-sm font-medium border border-primary/20"
                whileHover={{ scale: 1.05 }}
              >
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                >
                  <Sparkles className="w-3 h-3 md:w-4 md:h-4" />
                </motion.div>
                Analyze any website instantly
              </motion.span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-3xl sm:text-4xl md:text-6xl font-display font-bold mb-4 md:mb-6 text-balance leading-tight"
            >
              Discover the{' '}
              <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
                Design DNA
              </span>
              {' '}of Any Website
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-base md:text-xl text-muted-foreground mb-8 md:mb-10 max-w-2xl mx-auto px-4"
            >
              Extract colors, fonts, images, icons, and animations from any URL. 
              Get a quality score and see exactly what makes a website tick.
            </motion.p>

            <UrlInput onAnalyze={analyzeWebsite} isLoading={isLoading} />
          </div>
        </section>

        {/* Error State */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className="max-w-2xl mx-auto px-4 mb-8"
            >
              <div className="glass-card p-4 md:p-6 border-destructive/30 bg-destructive/5">
                <p className="text-destructive font-medium mb-2 text-sm md:text-base">
                  {error}
                </p>
                <p className="text-xs md:text-sm text-muted-foreground">
                  Please check the URL and try again. Some websites may block analysis requests due to CORS policies.
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
              transition={{ duration: 0.5 }}
              className="max-w-7xl mx-auto px-4 pb-20"
            >
              {/* Analyzed URL Header */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-6 md:mb-10"
              >
                <p className="text-xs md:text-sm text-muted-foreground mb-2">Analysis complete for</p>
                <div className="flex items-center justify-center gap-2 md:gap-3 flex-wrap">
                  <a 
                    href={result.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:underline font-medium flex items-center gap-2 max-w-xs md:max-w-lg truncate text-sm md:text-base"
                  >
                    <Globe className="w-3 h-3 md:w-4 md:h-4 flex-shrink-0" />
                    <span className="truncate">{result.url}</span>
                    <ExternalLink className="w-2.5 h-2.5 md:w-3 md:h-3 flex-shrink-0" />
                  </a>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => analyzeWebsite(result.url)}
                    className="text-muted-foreground hover:text-foreground text-xs md:text-sm"
                  >
                    <RefreshCw className="w-3 h-3 md:w-4 md:h-4 mr-1" />
                    Re-analyze
                  </Button>
                </div>
              </motion.div>

              <div className="grid lg:grid-cols-3 gap-4 md:gap-6">
                {/* Left Column */}
                <div className="space-y-4 md:space-y-6">
                  <QualityScore score={result.score} meta={result.meta} />
                  <TechStack meta={result.meta} fonts={result.fonts} icons={result.icons} />
                </div>

                {/* Right Column - Design Elements */}
                <div className="lg:col-span-2">
                  <Tabs defaultValue="images" className="w-full">
                    <TabsList className="grid grid-cols-5 mb-4 md:mb-6 bg-muted/50 p-1 md:p-1.5 rounded-xl h-auto">
                      {[
                        { value: 'images', icon: Image, label: 'Images' },
                        { value: 'colors', icon: Palette, label: 'Colors' },
                        { value: 'fonts', icon: Type, label: 'Fonts' },
                        { value: 'icons', icon: Shapes, label: 'Icons' },
                        { value: 'animations', icon: Zap, label: 'Motion' },
                      ].map((tab) => (
                        <TabsTrigger 
                          key={tab.value}
                          value={tab.value} 
                          className="flex items-center justify-center gap-1 md:gap-2 data-[state=active]:bg-card data-[state=active]:shadow-soft rounded-lg py-2 md:py-2.5 transition-all"
                        >
                          <tab.icon className="w-3.5 h-3.5 md:w-4 md:h-4" />
                          <span className="hidden sm:inline text-xs md:text-sm">{tab.label}</span>
                        </TabsTrigger>
                      ))}
                    </TabsList>

                    <TabsContent value="images" className="mt-0">
                      <ImageGallery images={result.images} />
                    </TabsContent>

                    <TabsContent value="colors" className="mt-0">
                      <ColorPalette colors={result.colors} />
                    </TabsContent>

                    <TabsContent value="fonts" className="mt-0">
                      <FontDisplay fonts={result.fonts} />
                    </TabsContent>

                    <TabsContent value="icons" className="mt-0">
                      <IconDisplay icons={result.icons} />
                    </TabsContent>

                    <TabsContent value="animations" className="mt-0">
                      <AnimationDisplay animations={result.animations} />
                    </TabsContent>
                  </Tabs>
                </div>
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        {/* Feature Cards - Show when no result */}
        {!result && !isLoading && (
          <section className="max-w-6xl mx-auto px-4 pb-20">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-5"
            >
              {[
                {
                  icon: Palette,
                  title: 'Color Extraction',
                  description: 'Discover the complete color palette with one-click copy',
                  gradient: 'from-rose-500/20 to-pink-500/20'
                },
                {
                  icon: Type,
                  title: 'Typography Analysis',
                  description: 'Identify all fonts with live previews from Google Fonts',
                  gradient: 'from-violet-500/20 to-purple-500/20'
                },
                {
                  icon: Image,
                  title: 'Image Gallery',
                  description: 'View and download all images with zoom functionality',
                  gradient: 'from-blue-500/20 to-cyan-500/20'
                },
                {
                  icon: Shapes,
                  title: 'Icon Detection',
                  description: 'Find SVGs and identify popular icon libraries',
                  gradient: 'from-orange-500/20 to-amber-500/20'
                },
                {
                  icon: Zap,
                  title: 'Animation Analysis',
                  description: 'Discover CSS animations, transitions, and keyframes',
                  gradient: 'from-green-500/20 to-emerald-500/20'
                },
                {
                  icon: Code,
                  title: 'Tech Stack',
                  description: 'Identify frameworks, libraries, and best practices',
                  gradient: 'from-indigo-500/20 to-blue-500/20'
                },
              ].map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
                  whileHover={{ y: -4, scale: 1.02 }}
                  className="glass-card p-5 md:p-6 hover:shadow-elevated transition-all duration-300 group cursor-default"
                >
                  <motion.div 
                    className={`p-2.5 md:p-3 bg-gradient-to-br ${feature.gradient} rounded-xl w-fit mb-3 md:mb-4 group-hover:scale-110 transition-transform`}
                  >
                    <feature.icon className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                  </motion.div>
                  <h3 className="text-base md:text-lg font-semibold mb-1 md:mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-xs md:text-sm">{feature.description}</p>
                </motion.div>
              ))}
            </motion.div>

            {/* Made with love footer */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="text-center mt-12 md:mt-16"
            >
              <p className="text-xs md:text-sm text-muted-foreground flex items-center justify-center gap-2">
                Made with <Heart className="w-3 h-3 md:w-4 md:h-4 text-rose-500 fill-rose-500" /> for designers & developers
              </p>
            </motion.div>
          </section>
        )}
      </div>

      {/* Modals */}
      <CompareWebsites isOpen={showCompare} onClose={() => setShowCompare(false)} />
      <ExportAnalysis isOpen={showExport} onClose={() => setShowExport(false)} result={result} />
    </div>
  );
};

export default Index;
