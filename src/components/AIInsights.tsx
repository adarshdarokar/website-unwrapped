import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Flame, Target, Layers, RefreshCw, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/integrations/supabase/client';
import type { AnalysisResult } from '@/hooks/useWebsiteAnalyzer';

interface Insights {
  summary: string;
  roast: string;
  vibe: string;
  trends: string[];
  hero: {
    headline: string;
    hierarchy: string;
    cta_visibility: string;
    conversion_score: number;
    tips: string[];
  };
}

interface Props {
  result: AnalysisResult;
}

export function AIInsights({ result }: Props) {
  const [data, setData] = useState<Insights | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchInsights = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data: res, error: err } = await supabase.functions.invoke('ai-insights', {
        body: { url: result.url, analysis: result },
      });
      if (err) throw err;
      if (res?.error) throw new Error(res.error);
      setData(res);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load AI insights');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInsights();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [result.url]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Design Summary */}
        <Card className="overflow-hidden">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <span className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-primary" />
              </span>
              AI Design Summary
              {data?.vibe && <Badge variant="secondary" className="ml-auto">{data.vibe}</Badge>}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading && <Skeleton className="h-20 w-full" />}
            {error && <p className="text-xs text-destructive">{error}</p>}
            {data && (
              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm leading-relaxed text-foreground/90"
              >
                {data.summary}
              </motion.p>
            )}
          </CardContent>
        </Card>

        {/* Roast */}
        <Card className="overflow-hidden">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <span className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center">
                <Flame className="w-4 h-4 text-orange-500" />
              </span>
              Friendly Roast
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading && <Skeleton className="h-20 w-full" />}
            {data && (
              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-sm leading-relaxed italic text-foreground/90"
              >
                "{data.roast}"
              </motion.p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Trends */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <span className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
              <Layers className="w-4 h-4 text-accent-foreground" />
            </span>
            Detected Design Trends
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading && <Skeleton className="h-10 w-full" />}
          {data && (
            <div className="flex flex-wrap gap-2">
              {data.trends.length === 0 && (
                <p className="text-xs text-muted-foreground">No standout trends detected.</p>
              )}
              {data.trends.map((t, i) => (
                <motion.div
                  key={t}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.05 * i }}
                >
                  <Badge variant="outline" className="px-3 py-1 text-xs border-primary/30 bg-primary/5">
                    {t}
                  </Badge>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Hero / CTA */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between text-base">
            <span className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-success/10 flex items-center justify-center">
                <Target className="w-4 h-4 text-success" />
              </span>
              Hero & CTA Analysis
            </span>
            {data && (
              <span className="text-xs font-mono text-muted-foreground">
                Conversion <span className="text-foreground font-semibold">{data.hero.conversion_score}/100</span>
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {loading && <Skeleton className="h-32 w-full" />}
          {data && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <Field label="Headline" value={data.hero.headline} />
                <Field label="Hierarchy" value={data.hero.hierarchy} />
                <Field label="CTA Visibility" value={data.hero.cta_visibility} />
              </div>
              {data.hero.tips.length > 0 && (
                <div className="pt-2 border-t border-border/40">
                  <p className="text-xs font-medium text-muted-foreground mb-2">Quick wins</p>
                  <ul className="space-y-1.5">
                    {data.hero.tips.map((t, i) => (
                      <motion.li
                        key={i}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.05 * i }}
                        className="flex items-start gap-2 text-sm"
                      >
                        <span className="mt-1 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                        <span className="text-foreground/85">{t}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button variant="outline" size="sm" onClick={fetchInsights} disabled={loading}>
          {loading ? <Loader2 className="w-3 h-3 mr-1 animate-spin" /> : <RefreshCw className="w-3 h-3 mr-1" />}
          Regenerate
        </Button>
      </div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border/40 bg-muted/30 p-3">
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">{label}</p>
      <p className="text-xs text-foreground/90 leading-snug">{value}</p>
    </div>
  );
}
