import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Monitor,
  Tablet,
  Smartphone,
  ExternalLink,
  Maximize2,
  RotateCcw,
  Laptop,
  Check,
  AlertTriangle,
  Globe,
  ArrowUpRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from '@/components/ui/tooltip';
import { supabase } from '@/integrations/supabase/client';

interface ResponsivePreviewProps {
  url: string;
}

type DeviceType = 'mobile' | 'tablet-portrait' | 'tablet-landscape' | 'laptop' | 'desktop';

type EmbedCheckResult = {
  embeddable: boolean;
  reason?: string;
};

const devices = [
  {
    type: 'mobile' as DeviceType,
    icon: Smartphone,
    width: 375,
    height: 667,
    label: 'Mobile',
    desc: 'Phone',
  },
  {
    type: 'tablet-portrait' as DeviceType,
    icon: Tablet,
    width: 768,
    height: 1024,
    label: 'Tablet',
    desc: 'Tablet',
  },
  {
    type: 'tablet-landscape' as DeviceType,
    icon: Tablet,
    width: 1024,
    height: 768,
    label: 'Tablet L',
    desc: 'Tablet (L)',
  },
  {
    type: 'laptop' as DeviceType,
    icon: Laptop,
    width: 1366,
    height: 768,
    label: 'Laptop',
    desc: 'Laptop',
  },
  {
    type: 'desktop' as DeviceType,
    icon: Monitor,
    width: 1920,
    height: 1080,
    label: 'Desktop',
    desc: 'Desktop',
  },
];

function getPreviewStyles(device: DeviceType) {
  switch (device) {
    case 'mobile':
      return { maxWidth: '375px', height: '600px' };
    case 'tablet-portrait':
      return { maxWidth: '768px', height: '600px' };
    case 'tablet-landscape':
      return { maxWidth: '100%', height: '520px' };
    case 'laptop':
      return { maxWidth: '100%', height: '520px' };
    default:
      return { maxWidth: '100%', height: '520px' };
  }
}

export function ResponsivePreview({ url }: ResponsivePreviewProps) {
  const [device, setDevice] = useState<DeviceType>('desktop');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [key, setKey] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [errorReason, setErrorReason] = useState<string | null>(null);
  const [loadTimeout, setLoadTimeout] = useState<number | null>(null);
  const [embedCheck, setEmbedCheck] = useState<EmbedCheckResult | null>(null);
  const [isCheckingEmbed, setIsCheckingEmbed] = useState(false);

  const currentDevice = useMemo(
    () => devices.find((d) => d.type === device) || devices[4],
    [device]
  );

  const previewStyles = useMemo(() => getPreviewStyles(device), [device]);

  const checkEmbeddable = async (): Promise<EmbedCheckResult | null> => {
    try {
      const { data, error } = await supabase.functions.invoke('check-embed', {
        body: { url },
      });
      if (error) return null;
      if (!data || typeof data.embeddable !== 'boolean') return null;
      return { embeddable: data.embeddable, reason: data.reason };
    } catch {
      return null;
    }
  };

  useEffect(() => {
    let cancelled = false;

    setIsLoading(true);
    setHasError(false);
    setErrorReason(null);

    // Clear any previous timers
    if (loadTimeout) window.clearTimeout(loadTimeout);

    // Pre-check embeddability via backend headers (best-effort)
    setIsCheckingEmbed(true);
    setEmbedCheck(null);

    checkEmbeddable().then((res) => {
      if (cancelled) return;
      setIsCheckingEmbed(false);
      setEmbedCheck(res);

      if (res && res.embeddable === false) {
        setHasError(true);
        setErrorReason(res.reason ?? 'This site blocks iframe embedding');
        setIsLoading(false);
      }
    });

    // If iframe doesn't resolve within 10s, show fallback
    const timeout = window.setTimeout(() => {
      // If we’re still loading, we assume it’s blocked/slow.
      setHasError(true);
      setErrorReason('Preview timed out (likely blocked by the website)');
      setIsLoading(false);
    }, 10000);
    setLoadTimeout(timeout);

    return () => {
      cancelled = true;
      window.clearTimeout(timeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, url]);

  const handleIframeLoad = () => {
    if (loadTimeout) window.clearTimeout(loadTimeout);
    setIsLoading(false);

    // Some browsers still render a "refused to connect" page inside the iframe.
    // We can’t introspect cross-origin content reliably, so we provide a clear fallback CTA.
  };

  const handleIframeError = () => {
    if (loadTimeout) window.clearTimeout(loadTimeout);
    setHasError(true);
    setErrorReason('Preview failed to load');
    setIsLoading(false);
  };

  const handleRefresh = () => {
    setIsLoading(true);
    setHasError(false);
    setErrorReason(null);
    setKey((k) => k + 1);
  };

  const Fallback = ({ compact }: { compact?: boolean }) => (
    <div className="absolute inset-0 bg-background flex items-center justify-center z-10 p-6">
      <div className="text-center max-w-sm">
        <div className="w-16 h-16 mx-auto mb-4 bg-amber-500/10 rounded-full flex items-center justify-center">
          <AlertTriangle className="w-8 h-8 text-amber-500" />
        </div>
        <h4 className="font-semibold text-foreground mb-2">Preview Unavailable</h4>
        <p className="text-sm text-muted-foreground mb-4">
          {errorReason ??
            'This website blocks iframe embedding for security reasons (very common).'}
        </p>
        <div className="flex items-center justify-center gap-2">
          <Button asChild className="gap-2">
            <a href={url} target="_blank" rel="noopener noreferrer">
              <Globe className="w-4 h-4" />
              Open Website
              <ArrowUpRight className="w-3 h-3" />
            </a>
          </Button>
          {!compact && (
            <Button variant="outline" onClick={handleRefresh} className="gap-2">
              <RotateCcw className="w-4 h-4" />
              Retry
            </Button>
          )}
        </div>
        <p className="text-xs text-muted-foreground mt-4">
          Tip: Use your browser’s responsive mode for full fidelity.
        </p>
      </div>
    </div>
  );

  return (
    <TooltipProvider>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card border border-border rounded-xl overflow-hidden"
      >
        {/* Header */}
        <div className="p-4 border-b border-border bg-gradient-to-r from-primary/5 to-transparent">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-primary/10 rounded-xl">
              <Monitor className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-sm">Responsive Preview</h3>
              <p className="text-xs text-muted-foreground">
                See how the website looks on different devices
              </p>
            </div>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 border-b border-border bg-muted/20">
          <div className="flex items-center gap-1 flex-wrap">
            {devices.map((d) => (
              <Tooltip key={d.type}>
                <TooltipTrigger asChild>
                  <Button
                    variant={device === d.type ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setDevice(d.type)}
                    className={`gap-1.5 h-9 px-3 transition-all ${
                      device === d.type ? 'shadow-sm' : ''
                    }`}
                  >
                    <d.icon
                      className={`w-4 h-4 ${
                        d.type.includes('landscape') ? 'rotate-90' : ''
                      }`}
                    />
                    <span className="hidden sm:inline text-xs font-medium">
                      {d.label}
                    </span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="font-semibold">{d.desc}</p>
                  <p className="text-xs text-muted-foreground">
                    {d.width} × {d.height}px
                  </p>
                </TooltipContent>
              </Tooltip>
            ))}
          </div>

          <div className="flex items-center gap-1.5">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRefresh}
                  className="h-9 px-3 gap-2"
                >
                  <RotateCcw
                    className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`}
                  />
                  <span className="hidden sm:inline text-xs">Refresh</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Reload preview</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsFullscreen(true)}
                  className="h-9 px-3 gap-2"
                >
                  <Maximize2 className="w-4 h-4" />
                  <span className="hidden sm:inline text-xs">Fullscreen</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Open fullscreen</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="default"
                  size="sm"
                  asChild
                  className="h-9 px-3 gap-2"
                >
                  <a href={url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-4 h-4" />
                    <span className="hidden sm:inline text-xs">Open Site</span>
                  </a>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Open in new tab</TooltipContent>
            </Tooltip>
          </div>
        </div>

        {/* Preview Area */}
        <div className="p-6 bg-gradient-to-br from-muted/30 to-muted/10 flex justify-center overflow-x-auto min-h-[400px]">
          <motion.div
            layout
            className="w-full bg-background rounded-xl overflow-hidden shadow-xl transition-all duration-500 relative border border-border"
            style={previewStyles}
          >
            {/* Device frame notch for mobile */}
            {device === 'mobile' && (
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-6 bg-muted rounded-b-xl z-20 border-x border-b border-border" />
            )}

            {(isLoading || isCheckingEmbed) && !hasError && (
              <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-10">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  <span className="text-sm text-muted-foreground font-medium">
                    {isCheckingEmbed ? 'Preparing preview…' : 'Loading preview…'}
                  </span>
                  <span className="text-xs text-muted-foreground/70">
                    Some sites may block embedding
                  </span>
                </div>
              </div>
            )}

            {hasError ? (
              <Fallback />
            ) : (
              <iframe
                key={key}
                src={url}
                title="Website Preview"
                className="w-full h-full border-0"
                referrerPolicy="no-referrer-when-downgrade"
                onLoad={handleIframeLoad}
                onError={handleIframeError}
              />
            )}
          </motion.div>
        </div>

        {/* Info bar */}
        <div className="px-4 py-3 border-t border-border bg-muted/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-background rounded-lg border border-border">
              <currentDevice.icon
                className={`w-4 h-4 text-primary ${
                  currentDevice.type.includes('landscape') ? 'rotate-90' : ''
                }`}
              />
              <span className="text-sm font-medium">{currentDevice.desc}</span>
            </div>
            <div className="text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded">
              {currentDevice.width} × {currentDevice.height}px
            </div>
          </div>
          <div className="flex items-center gap-3">
            {!isLoading && !hasError && (
              <span className="text-xs text-emerald-500 flex items-center gap-1.5 font-medium">
                <Check className="w-3.5 h-3.5" /> Preview Active
              </span>
            )}
            {hasError && (
              <span className="text-xs text-amber-500 flex items-center gap-1.5 font-medium">
                <AlertTriangle className="w-3.5 h-3.5" /> Blocked by site
              </span>
            )}
            <span className="text-xs text-muted-foreground truncate max-w-[150px] sm:max-w-xs font-mono">
              {url.replace(/^https?:\/\//, '')}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Fullscreen Dialog */}
      <Dialog open={isFullscreen} onOpenChange={setIsFullscreen}>
        <DialogContent className="max-w-[95vw] w-full h-[90vh] p-4">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <currentDevice.icon
                className={`w-5 h-5 ${
                  currentDevice.type.includes('landscape') ? 'rotate-90' : ''
                }`}
              />
              {currentDevice.desc} Preview
            </DialogTitle>
          </DialogHeader>

          <div className="flex-1 flex flex-col gap-4 h-full">
            <div className="flex items-center gap-2 justify-center flex-wrap">
              {devices.map((d) => (
                <Button
                  key={d.type}
                  variant={device === d.type ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setDevice(d.type)}
                  className="gap-1.5"
                >
                  <d.icon
                    className={`w-4 h-4 ${
                      d.type.includes('landscape') ? 'rotate-90' : ''
                    }`}
                  />
                  {d.label}
                </Button>
              ))}
            </div>

            <div className="flex-1 flex justify-center items-start overflow-auto p-4 bg-muted/20 rounded-xl">
              <motion.div
                layout
                className="w-full h-full bg-background rounded-xl overflow-hidden shadow-xl relative border border-border"
                style={{
                  maxWidth:
                    device === 'desktop' || device === 'laptop'
                      ? '100%'
                      : currentDevice.width,
                }}
              >
                {hasError ? (
                  <Fallback compact />
                ) : (
                  <>
                    {isLoading && (
                      <div className="absolute inset-0 bg-background/80 flex items-center justify-center z-10">
                        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                      </div>
                    )}
                    <iframe
                      key={`fullscreen-${key}`}
                      src={url}
                      title="Website Preview"
                      className="w-full h-full border-0"
                      referrerPolicy="no-referrer-when-downgrade"
                      onLoad={handleIframeLoad}
                      onError={handleIframeError}
                    />
                  </>
                )}
              </motion.div>
            </div>

            {embedCheck?.reason && (
              <p className="text-xs text-muted-foreground text-center">
                Embed check: {embedCheck.reason}
              </p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  );
}

