import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Flame, Target, Layers, RefreshCw, Loader2, Quote, ArrowUpRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { AnimatedNumber } from '@/components/AnimatedNumber';
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

const fadeUp = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] as const },
};

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

  // Split summary into compact bullet-style sentences
  const summaryPoints = data
    ? data.summary
        .split(/(?<=[.!?])\s+/)
        .map((s) => s.trim())
        .filter(Boolean)
        .slice(0, 4)
    : [];

  return (
    <div className="space-y-4">
      {/* Header strip */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <Badge
            variant="outline"
            className="h-6 px-2 gap-1.5 rounded-full border-primary/25 bg-primary/8 text-primary text-[10px] font-semibold tracking-wide uppercase"
          >
            <Sparkles className="w-3 h-3" />
            AI Generated
          </Badge>
          {data?.vibe && (
            <Badge variant="outline" className="h-6 px-2 rounded-full border-border/50 bg-muted/40 text-[10px] uppercase tracking-wide font-medium">
              {data.vibe}
            </Badge>
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={fetchInsights}
          disabled={loading}
          className="h-7 px-2.5 text-[11px] text-muted-foreground hover:text-foreground gap-1.5"
        >
          {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : <RefreshCw className="w-3 h-3" />}
          Regenerate
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Design Summary — bullet insight blocks */}
        <Card className="overflow-hidden shimmer hover-lift">
          <CardHeader className="pb-2 pt-5 px-5">
            <CardTitle className="flex items-center gap-2 text-[13px] font-semibold uppercase tracking-wider text-muted-foreground">
              <span className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary/15 to-primary/5 border border-primary/15 flex items-center justify-center">
                <Sparkles className="w-3.5 h-3.5 text-primary" />
              </span>
              Design Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="px-5 pb-5">
            {loading && (
              <div className="space-y-2">
                <Skeleton className="h-3 w-11/12" />
                <Skeleton className="h-3 w-9/12" />
                <Skeleton className="h-3 w-10/12" />
              </div>
            )}
            {error && <p className="text-xs text-destructive">{error}</p>}
            {data && (
              <ul className="space-y-2 max-w-prose">
                {summaryPoints.map((s, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 * i, duration: 0.3 }}
                    className="flex items-start gap-2.5 text-[13px] leading-relaxed text-foreground/85"
                  >
                    <span className="mt-[7px] w-1.5 h-1.5 rounded-full bg-gradient-to-br from-primary to-primary/50 shrink-0 shadow-[0_0_6px_hsl(var(--primary)/0.5)]" />
                    <span>{s}</span>
                  </motion.li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        {/* Roast — quote-style */}
        <Card className="relative overflow-hidden shimmer hover-lift">
          <span
            aria-hidden
            className="pointer-events-none absolute -top-10 -right-10 w-40 h-40 rounded-full opacity-60"
            style={{ background: 'radial-gradient(circle, hsl(25 95% 60%/0.18), transparent 70%)' }}
          />
          <CardHeader className="pb-2 pt-5 px-5 relative">
            <CardTitle className="flex items-center gap-2 text-[13px] font-semibold uppercase tracking-wider text-muted-foreground">
              <span className="w-7 h-7 rounded-lg bg-gradient-to-br from-orange-500/15 to-orange-500/5 border border-orange-500/15 flex items-center justify-center">
                <Flame className="w-3.5 h-3.5 text-orange-500" />
              </span>
              Friendly Roast
            </CardTitle>
          </CardHeader>
          <CardContent className="px-5 pb-5 relative">
            {loading && (
              <div className="space-y-2">
                <Skeleton className="h-3 w-10/12" />
                <Skeleton className="h-3 w-8/12" />
              </div>
            )}
            {data && (
              <motion.figure
                {...fadeUp}
                className="relative pl-5 max-w-prose"
              >
                <Quote className="absolute -left-0.5 top-0 w-4 h-4 text-orange-500/50 -scale-x-100" />
                <blockquote className="text-[13.5px] leading-relaxed italic text-foreground/85 font-medium">
                  {data.roast}
                </blockquote>
              </motion.figure>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Trends */}
      <Card>
        <CardHeader className="pb-2 pt-5 px-5">
          <CardTitle className="flex items-center gap-2 text-[13px] font-semibold uppercase tracking-wider text-muted-foreground">
            <span className="w-7 h-7 rounded-lg bg-gradient-to-br from-accent/40 to-accent/10 border border-border/40 flex items-center justify-center">
              <Layers className="w-3.5 h-3.5 text-foreground/70" />
            </span>
            Detected Design Trends
          </CardTitle>
        </CardHeader>
        <CardContent className="px-5 pb-5">
          {loading && <Skeleton className="h-8 w-full" />}
          {data && (
            <div className="flex flex-wrap gap-2">
              {data.trends.length === 0 && (
                <p className="text-xs text-muted-foreground">No standout trends detected.</p>
              )}
              {data.trends.map((t, i) => (
                <motion.button
                  key={t}
                  type="button"
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.04 * i, type: 'spring', stiffness: 320, damping: 22 }}
                  className="group relative h-7 px-3 rounded-full text-[11.5px] font-medium tracking-tight
                    bg-gradient-to-br from-primary/8 to-primary/4
                    border border-primary/20 text-foreground/85
                    hover:border-primary/40 hover:text-foreground
                    hover:shadow-[0_0_0_3px_hsl(var(--primary)/0.08)]
                    transition-all duration-300"
                >
                  <span className="relative">{t}</span>
                </motion.button>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Hero / CTA */}
      <Card>
        <CardHeader className="pb-2 pt-5 px-5">
          <CardTitle className="flex items-center justify-between text-[13px] font-semibold uppercase tracking-wider text-muted-foreground gap-3">
            <span className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-gradient-to-br from-success/15 to-success/5 border border-success/15 flex items-center justify-center">
                <Target className="w-3.5 h-3.5 text-success" />
              </span>
              Hero & CTA Analysis
            </span>
            {data && <ConversionRing score={data.hero.conversion_score} />}
          </CardTitle>
        </CardHeader>
        <CardContent className="px-5 pb-5 space-y-4">
          {loading && <Skeleton className="h-32 w-full" />}
          {data && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <Metric label="Headline" value={data.hero.headline} />
                <Metric label="Hierarchy" value={data.hero.hierarchy} />
                <Metric label="CTA Visibility" value={data.hero.cta_visibility} />
              </div>
              {data.hero.tips.length > 0 && (
                <div className="pt-3 border-t border-border/40">
                  <div className="flex items-center justify-between mb-2.5">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                      Quick Wins
                    </p>
                    <span className="text-[10px] text-muted-foreground/70">{data.hero.tips.length} suggestions</span>
                  </div>
                  <ul className="space-y-1.5 max-w-prose">
                    {data.hero.tips.map((t, i) => (
                      <motion.li
                        key={i}
                        initial={{ opacity: 0, x: -6 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.04 * i }}
                        className="group flex items-start gap-2.5 text-[13px] leading-relaxed text-foreground/85 rounded-lg px-2 -mx-2 py-1 hover:bg-muted/40 transition-colors"
                      >
                        <ArrowUpRight className="mt-[3px] w-3.5 h-3.5 text-primary shrink-0 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                        <span>{t}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border/40 bg-gradient-to-br from-muted/40 to-muted/10 p-3 hover:border-primary/25 hover:shadow-[0_0_0_3px_hsl(var(--primary)/0.05)] transition-all duration-300">
      <p className="text-[9.5px] font-semibold uppercase tracking-[0.14em] text-muted-foreground mb-1.5">{label}</p>
      <p className="text-[12.5px] text-foreground/90 leading-snug">{value}</p>
    </div>
  );
}

function ConversionRing({ score }: { score: number }) {
  const pct = Math.max(0, Math.min(100, score));
  const r = 14;
  const c = 2 * Math.PI * r;
  const dash = (pct / 100) * c;
  const color =
    pct >= 75 ? 'hsl(var(--success))' : pct >= 50 ? 'hsl(var(--primary))' : 'hsl(var(--warning))';
  return (
    <div className="flex items-center gap-2">
      <div className="relative w-9 h-9">
        <svg viewBox="0 0 36 36" className="w-9 h-9 -rotate-90">
          <circle cx="18" cy="18" r={r} fill="none" stroke="hsl(var(--border))" strokeWidth="3" opacity="0.4" />
          <motion.circle
            cx="18"
            cy="18"
            r={r}
            fill="none"
            stroke={color}
            strokeWidth="3"
            strokeLinecap="round"
            initial={{ strokeDasharray: `0 ${c}` }}
            animate={{ strokeDasharray: `${dash} ${c}` }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold tabular-nums text-foreground">
          {pct}
        </span>
      </div>
      <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium normal-case">
        Conversion
      </span>
    </div>
  );
}
