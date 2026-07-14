import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface AnalysisResult {
  url: string;
  score: number;
  images: { src: string; alt: string }[];
  videos: { src: string; poster: string; type: string; title: string }[];
  fonts: {
    detected: string[];
    googleFonts: string[];
  };
  colors: string[];
  icons: {
    svgCount: number;
    svgs: string[];
    libraries: string[];
  };
  animations: {
    cssAnimations: string[];
    transitions: string[];
    keyframes: string[];
  };
  meta: {
    hasViewport: boolean;
    hasPreload: boolean;
    hasPreconnect: boolean;
    isHttps: boolean;
    imageCount: number;
    hasResponsiveImages: boolean;
  };
}

export function useWebsiteAnalyzer() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const analyzeWebsite = async (url: string): Promise<AnalysisResult | null> => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      // Validate URL
      let validUrl = url;
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        validUrl = 'https://' + url;
      }

      new URL(validUrl); // This will throw if invalid

      const { data, error: fnError } = await supabase.functions.invoke('analyze-website', {
        body: { url: validUrl }
      });

      if (fnError) {
        throw new Error(fnError.message);
      }

      if (data.error) {
        throw new Error(data.error);
      }

      setResult(data);
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to analyze website';
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Standalone analysis function that doesn't affect hook state
  const analyzeWebsiteStandalone = async (url: string): Promise<AnalysisResult | null> => {
    try {
      let validUrl = url;
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        validUrl = 'https://' + url;
      }

      new URL(validUrl);

      const { data, error: fnError } = await supabase.functions.invoke('analyze-website', {
        body: { url: validUrl }
      });

      if (fnError) {
        throw new Error(fnError.message);
      }

      if (data.error) {
        throw new Error(data.error);
      }

      return data;
    } catch (err) {
      return null;
    }
  };

  return { analyzeWebsite, analyzeWebsiteStandalone, isLoading, error, result };
}
