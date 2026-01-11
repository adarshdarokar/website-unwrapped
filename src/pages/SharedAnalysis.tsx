import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Globe, ArrowLeft, Calendar, ExternalLink, Share2, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { ThemeToggle } from '@/components/ThemeToggle';
import { QualityScore } from '@/components/QualityScore';
import { TechStack } from '@/components/TechStack';
import { ImageGallery } from '@/components/ImageGallery';
import { ColorPalette } from '@/components/ColorPalette';
import { FontDisplay } from '@/components/FontDisplay';
import { IconDisplay } from '@/components/IconDisplay';
import { AnimationDisplay } from '@/components/AnimationDisplay';
import { Image, Palette, Type, Shapes, Zap } from 'lucide-react';

interface SharedAnalysisData {
  id: string;
  url: string;
  score: number | null;
  created_at: string;
  analysis_data: any;
}

const SharedAnalysis = () => {
  const { shareId } = useParams();
  const [analysis, setAnalysis] = useState<SharedAnalysisData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (shareId) {
      fetchAnalysis();
    }
  }, [shareId]);

  const fetchAnalysis = async () => {
    try {
      const { data, error } = await supabase
        .from('saved_analyses')
        .select('*')
        .eq('share_id', shareId)
        .single();

      if (error) throw error;
      
      if (!data) {
        setError('Analysis not found');
        return;
      }

      setAnalysis(data);
    } catch (error: any) {
      setError(error.message || 'Failed to load analysis');
    } finally {
      setLoading(false);
    }
  };

  const copyLink = async () => {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    toast.success('Link copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (error || !analysis) {
    return (
      <div className="min-h-screen bg-background">
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <motion.div 
            className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-gradient-to-br from-primary/10 via-accent/5 to-transparent rounded-full blur-3xl"
            animate={{ x: [0, 50, 0], y: [0, 30, 0] }}
            transition={{ duration: 15, repeat: Infinity }}
          />
        </div>
        
        <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="p-4 bg-destructive/10 rounded-2xl w-fit mx-auto mb-6">
              <Globe className="w-12 h-12 text-destructive" />
            </div>
            <h1 className="text-2xl font-display font-bold mb-3">{error || 'Analysis not found'}</h1>
            <p className="text-muted-foreground mb-6">This analysis may have been deleted or doesn't exist</p>
            <Link to="/">
              <Button className="rounded-xl">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Go Home
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  const result = analysis.analysis_data;

  return (
    <div className="min-h-screen bg-background">
      {/* Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          className="absolute top-0 left-1/4 w-[400px] md:w-[600px] h-[400px] md:h-[600px] bg-gradient-to-br from-primary/10 via-accent/5 to-transparent rounded-full blur-3xl"
          animate={{ x: [0, 50, 0], y: [0, 30, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div 
          className="absolute bottom-1/4 right-1/4 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-gradient-to-tr from-accent/10 via-secondary/5 to-transparent rounded-full blur-3xl"
          animate={{ x: [0, -40, 0], y: [0, -50, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="py-4 md:py-6 px-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link to="/">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button variant="ghost" size="icon" className="rounded-xl">
                    <ArrowLeft className="w-5 h-5" />
                  </Button>
                </motion.div>
              </Link>
              <div className="flex items-center gap-2">
                <div className="p-2 bg-gradient-to-br from-primary/20 to-accent/20 rounded-xl">
                  <Share2 className="w-5 h-5 text-primary" />
                </div>
                <span className="text-xl font-display font-bold">Shared Analysis</span>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={copyLink}
                className="rounded-xl"
              >
                {copied ? (
                  <Check className="w-4 h-4 mr-2 text-green-500" />
                ) : (
                  <Copy className="w-4 h-4 mr-2" />
                )}
                {copied ? 'Copied!' : 'Copy Link'}
              </Button>
              <ThemeToggle />
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 pb-20">
          {/* Analysis Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-2">
              <Calendar className="w-4 h-4" />
              <span>Analyzed on {format(new Date(analysis.created_at), 'MMMM d, yyyy')}</span>
            </div>
            <a 
              href={analysis.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-lg md:text-xl font-medium text-primary hover:underline"
            >
              <Globe className="w-5 h-5" />
              {analysis.url}
              <ExternalLink className="w-4 h-4" />
            </a>
          </motion.div>

          {result && (
            <div className="grid lg:grid-cols-3 gap-4 md:gap-6">
              {/* Left Column */}
              <div className="space-y-4 md:space-y-6">
                <QualityScore score={result.score} meta={result.meta} />
                <TechStack meta={result.meta} fonts={result.fonts} icons={result.icons} />
              </div>

              {/* Right Column */}
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
          )}
        </main>
      </div>
    </div>
  );
};

export default SharedAnalysis;
