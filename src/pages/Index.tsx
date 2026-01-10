import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Sparkles, Image, Type, Palette, Shapes, Zap, Code, RefreshCw, ExternalLink, Heart } from 'lucide-react';
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
import { useWebsiteAnalyzer } from '@/hooks/useWebsiteAnalyzer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';

const Index = () => {
  const { analyzeWebsite, isLoading, error, result } = useWebsiteAnalyzer();

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Animated gradient background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-gradient-to-br from-primary/10 via-accent/5 to-transparent rounded-full blur-3xl"
          animate={{ 
            x: [0, 50, 0],
            y: [0, 30, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div 
          className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-gradient-to-tr from-accent/10 via-secondary/5 to-transparent rounded-full blur-3xl"
          animate={{ 
            x: [0, -40, 0],
            y: [0, -50, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div 
          className="absolute top-1/2 left-1/2 w-[400px] h-[400px] bg-gradient-to-bl from-primary/5 to-transparent rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"
          animate={{ 
            rotate: [0, 360],
            scale: [1, 1.15, 1]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="py-6 px-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-7xl mx-auto flex items-center justify-between"
          >
            <motion.div 
              className="flex items-center gap-3"
              whileHover={{ scale: 1.02 }}
            >
              <motion.div 
                className="p-2.5 bg-gradient-to-br from-primary/20 to-accent/20 rounded-xl"
                whileHover={{ rotate: 10 }}
              >
                <Globe className="w-6 h-6 text-primary" />
              </motion.div>
              <div>
                <span className="text-xl font-display font-bold">WebVision</span>
                <span className="text-xs text-muted-foreground block">Design Analyzer</span>
              </div>
            </motion.div>
            
            <div className="flex items-center gap-3">
              <ThemeToggle />
            </div>
          </motion.div>
        </header>

        {/* Hero Section */}
        <section className="px-4 py-8 md:py-16">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="mb-6"
            >
              <motion.span 
                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary/10 to-accent/10 text-primary rounded-full text-sm font-medium border border-primary/20"
                whileHover={{ scale: 1.05 }}
              >
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                >
                  <Sparkles className="w-4 h-4" />
                </motion.div>
                Analyze any website instantly
              </motion.span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl md:text-6xl font-display font-bold mb-6 text-balance leading-tight"
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
              className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto"
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
              <div className="glass-card p-6 border-destructive/30 bg-destructive/5">
                <p className="text-destructive font-medium mb-2">
                  {error}
                </p>
                <p className="text-sm text-muted-foreground">
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
                className="text-center mb-10"
              >
                <p className="text-sm text-muted-foreground mb-2">Analysis complete for</p>
                <div className="flex items-center justify-center gap-3 flex-wrap">
                  <a 
                    href={result.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:underline font-medium flex items-center gap-2 max-w-lg truncate"
                  >
                    <Globe className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate">{result.url}</span>
                    <ExternalLink className="w-3 h-3 flex-shrink-0" />
                  </a>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => analyzeWebsite(result.url)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <RefreshCw className="w-4 h-4 mr-1" />
                    Re-analyze
                  </Button>
                </div>
              </motion.div>

              <div className="grid lg:grid-cols-3 gap-6">
                {/* Left Column */}
                <div className="space-y-6">
                  <QualityScore score={result.score} meta={result.meta} />
                  <TechStack meta={result.meta} fonts={result.fonts} icons={result.icons} />
                </div>

                {/* Right Column - Design Elements */}
                <div className="lg:col-span-2">
                  <Tabs defaultValue="images" className="w-full">
                    <TabsList className="grid grid-cols-5 mb-6 bg-muted/50 p-1.5 rounded-xl h-auto">
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
                          className="flex items-center gap-2 data-[state=active]:bg-card data-[state=active]:shadow-soft rounded-lg py-2.5 transition-all"
                        >
                          <tab.icon className="w-4 h-4" />
                          <span className="hidden sm:inline text-sm">{tab.label}</span>
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
              className="grid md:grid-cols-3 gap-5"
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
                  className="glass-card p-6 hover:shadow-elevated transition-all duration-300 group cursor-default"
                >
                  <motion.div 
                    className={`p-3 bg-gradient-to-br ${feature.gradient} rounded-xl w-fit mb-4 group-hover:scale-110 transition-transform`}
                  >
                    <feature.icon className="w-6 h-6 text-primary" />
                  </motion.div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm">{feature.description}</p>
                </motion.div>
              ))}
            </motion.div>

            {/* Made with love footer */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="text-center mt-16"
            >
              <p className="text-sm text-muted-foreground flex items-center justify-center gap-2">
                Made with <Heart className="w-4 h-4 text-rose-500 fill-rose-500" /> for designers & developers
              </p>
            </motion.div>
          </section>
        )}
      </div>
    </div>
  );
};

export default Index;
