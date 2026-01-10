import { motion } from 'framer-motion';
import { Globe, Sparkles, Image, Type, Palette, Shapes, Zap } from 'lucide-react';
import { UrlInput } from '@/components/UrlInput';
import { QualityScore } from '@/components/QualityScore';
import { ImageGallery } from '@/components/ImageGallery';
import { FontDisplay } from '@/components/FontDisplay';
import { ColorPalette } from '@/components/ColorPalette';
import { IconDisplay } from '@/components/IconDisplay';
import { AnimationDisplay } from '@/components/AnimationDisplay';
import { LoadingState } from '@/components/LoadingState';
import { useWebsiteAnalyzer } from '@/hooks/useWebsiteAnalyzer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Index = () => {
  const { analyzeWebsite, isLoading, error, result } = useWebsiteAnalyzer();

  return (
    <div className="min-h-screen bg-background">
      {/* Decorative background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-secondary/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="py-8 px-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-7xl mx-auto flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-xl">
                <Globe className="w-6 h-6 text-primary" />
              </div>
              <span className="text-xl font-display font-semibold">WebVision</span>
            </div>
          </motion.div>
        </header>

        {/* Hero Section */}
        <section className="px-4 py-12 md:py-20">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="mb-6"
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium">
                <Sparkles className="w-4 h-4" />
                Analyze any website instantly
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl md:text-6xl font-display font-bold mb-6 text-balance"
            >
              Discover the{' '}
              <span className="gradient-text">Design DNA</span>
              {' '}of Any Website
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg md:text-xl text-muted-foreground mb-12 max-w-2xl mx-auto"
            >
              Extract colors, fonts, images, icons, and animations from any URL. 
              Get a quality score and see exactly what makes a website tick.
            </motion.p>

            <UrlInput onAnalyze={analyzeWebsite} isLoading={isLoading} />
          </div>
        </section>

        {/* Error State */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto px-4 mb-8"
          >
            <div className="glass-card p-6 border-destructive/50 bg-destructive/5">
              <p className="text-destructive font-medium">
                {error}
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Please check the URL and try again. Some websites may block analysis requests.
              </p>
            </div>
          </motion.div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="max-w-7xl mx-auto px-4">
            <LoadingState />
          </div>
        )}

        {/* Results */}
        {result && !isLoading && (
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="max-w-7xl mx-auto px-4 pb-20"
          >
            {/* Analyzed URL */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-12"
            >
              <p className="text-sm text-muted-foreground mb-2">Analysis complete for</p>
              <a 
                href={result.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline font-medium"
              >
                {result.url}
              </a>
            </motion.div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Left Column - Quality Score */}
              <div className="lg:col-span-1">
                <QualityScore score={result.score} meta={result.meta} />
              </div>

              {/* Right Column - Design Elements */}
              <div className="lg:col-span-2">
                <Tabs defaultValue="images" className="w-full">
                  <TabsList className="grid grid-cols-5 mb-6 bg-muted/50 p-1 rounded-xl">
                    <TabsTrigger value="images" className="flex items-center gap-2 data-[state=active]:bg-card rounded-lg">
                      <Image className="w-4 h-4" />
                      <span className="hidden sm:inline">Images</span>
                    </TabsTrigger>
                    <TabsTrigger value="colors" className="flex items-center gap-2 data-[state=active]:bg-card rounded-lg">
                      <Palette className="w-4 h-4" />
                      <span className="hidden sm:inline">Colors</span>
                    </TabsTrigger>
                    <TabsTrigger value="fonts" className="flex items-center gap-2 data-[state=active]:bg-card rounded-lg">
                      <Type className="w-4 h-4" />
                      <span className="hidden sm:inline">Fonts</span>
                    </TabsTrigger>
                    <TabsTrigger value="icons" className="flex items-center gap-2 data-[state=active]:bg-card rounded-lg">
                      <Shapes className="w-4 h-4" />
                      <span className="hidden sm:inline">Icons</span>
                    </TabsTrigger>
                    <TabsTrigger value="animations" className="flex items-center gap-2 data-[state=active]:bg-card rounded-lg">
                      <Zap className="w-4 h-4" />
                      <span className="hidden sm:inline">Motion</span>
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="images">
                    <ImageGallery images={result.images} />
                  </TabsContent>

                  <TabsContent value="colors">
                    <ColorPalette colors={result.colors} />
                  </TabsContent>

                  <TabsContent value="fonts">
                    <FontDisplay fonts={result.fonts} />
                  </TabsContent>

                  <TabsContent value="icons">
                    <IconDisplay icons={result.icons} />
                  </TabsContent>

                  <TabsContent value="animations">
                    <AnimationDisplay animations={result.animations} />
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </motion.section>
        )}

        {/* Feature Cards - Show when no result */}
        {!result && !isLoading && (
          <section className="max-w-6xl mx-auto px-4 pb-20">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="grid md:grid-cols-3 gap-6"
            >
              {[
                {
                  icon: Palette,
                  title: 'Color Extraction',
                  description: 'Discover the complete color palette used across the website'
                },
                {
                  icon: Type,
                  title: 'Typography Analysis',
                  description: 'Identify all fonts and typefaces with live previews'
                },
                {
                  icon: Image,
                  title: 'Image Gallery',
                  description: 'View all images with zoom and download options'
                },
                {
                  icon: Shapes,
                  title: 'Icon Detection',
                  description: 'Find SVGs and identify icon libraries in use'
                },
                {
                  icon: Zap,
                  title: 'Animation Analysis',
                  description: 'Discover CSS animations and transitions'
                },
                {
                  icon: Sparkles,
                  title: 'Quality Score',
                  description: 'Get a comprehensive quality rating with insights'
                },
              ].map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
                  className="glass-card p-6 hover:shadow-elevated transition-shadow duration-300"
                >
                  <div className="p-3 bg-primary/10 rounded-xl w-fit mb-4">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm">{feature.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </section>
        )}
      </div>
    </div>
  );
};

export default Index;
