import { useState, useEffect } from 'react';
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
  ArrowUpRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';

interface ResponsivePreviewProps {
  url: string;
}

type DeviceType = 'mobile' | 'tablet-portrait' | 'tablet-landscape' | 'laptop' | 'desktop';

const devices = [
  { type: 'mobile' as DeviceType, icon: Smartphone, width: 375, height: 667, label: 'Mobile', desc: 'iPhone SE' },
  { type: 'tablet-portrait' as DeviceType, icon: Tablet, width: 768, height: 1024, label: 'Tablet', desc: 'iPad Portrait' },
  { type: 'tablet-landscape' as DeviceType, icon: Tablet, width: 1024, height: 768, label: 'Tablet L', desc: 'iPad Landscape' },
  { type: 'laptop' as DeviceType, icon: Laptop, width: 1366, height: 768, label: 'Laptop', desc: '13" Laptop' },
  { type: 'desktop' as DeviceType, icon: Monitor, width: 1920, height: 1080, label: 'Desktop', desc: 'Full HD' },
];

export function ResponsivePreview({ url }: ResponsivePreviewProps) {
  const [device, setDevice] = useState<DeviceType>('desktop');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [key, setKey] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [loadTimeout, setLoadTimeout] = useState<NodeJS.Timeout | null>(null);

  const currentDevice = devices.find(d => d.type === device) || devices[4];

  // Many sites block iframe embedding - detect this with a timeout
  useEffect(() => {
    setIsLoading(true);
    setHasError(false);
    
    // Set a timeout - if iframe doesn't load in 8 seconds, assume it's blocked
    const timeout = setTimeout(() => {
      if (isLoading) {
        setHasError(true);
        setIsLoading(false);
      }
    }, 8000);
    
    setLoadTimeout(timeout);
    
    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [key, url]);

  const getPreviewStyles = () => {
    switch (device) {
      case 'mobile': 
        return { maxWidth: '375px', height: '600px' };
      case 'tablet-portrait': 
        return { maxWidth: '768px', height: '600px' };
      case 'tablet-landscape': 
        return { maxWidth: '100%', height: '500px' };
      case 'laptop': 
        return { maxWidth: '100%', height: '500px' };
      default: 
        return { maxWidth: '100%', height: '500px' };
    }
  };

  const handleIframeLoad = () => {
    if (loadTimeout) clearTimeout(loadTimeout);
    setIsLoading(false);
    // Note: Some sites may load but show a blank page due to CSP/X-Frame-Options
  };

  const handleRefresh = () => {
    setIsLoading(true);
    setHasError(false);
    setKey(k => k + 1);
  };

  const handleDeviceChange = (newDevice: DeviceType) => {
    setDevice(newDevice);
  };

  // Generate a screenshot service URL as fallback
  const getScreenshotUrl = () => {
    // Using a simple approach - just show the user how to view it
    return url;
  };

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
              <p className="text-xs text-muted-foreground">See how the website looks on different devices</p>
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
                    onClick={() => handleDeviceChange(d.type)}
                    className={`gap-1.5 h-9 px-3 transition-all ${device === d.type ? 'shadow-md' : ''}`}
                  >
                    <d.icon className={`w-4 h-4 ${d.type.includes('landscape') ? 'rotate-90' : ''}`} />
                    <span className="hidden sm:inline text-xs font-medium">{d.label}</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="font-semibold">{d.desc}</p>
                  <p className="text-xs text-muted-foreground">{d.width} × {d.height}px</p>
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
                  <RotateCcw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
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
            className="w-full bg-white dark:bg-gray-900 rounded-xl overflow-hidden shadow-2xl transition-all duration-500 relative border-8 border-gray-800 dark:border-gray-700"
            style={getPreviewStyles()}
          >
            {/* Device frame notch for mobile */}
            {device === 'mobile' && (
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-6 bg-gray-800 dark:bg-gray-700 rounded-b-xl z-20" />
            )}
            
            {isLoading && !hasError && (
              <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-10">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-10 h-10 border-3 border-primary border-t-transparent rounded-full animate-spin" />
                  <span className="text-sm text-muted-foreground font-medium">Loading preview...</span>
                  <span className="text-xs text-muted-foreground/60">This may take a moment</span>
                </div>
              </div>
            )}
            
            {hasError ? (
              <div className="absolute inset-0 bg-background flex items-center justify-center z-10 p-6">
                <div className="text-center max-w-sm">
                  <div className="w-16 h-16 mx-auto mb-4 bg-amber-500/10 rounded-full flex items-center justify-center">
                    <AlertTriangle className="w-8 h-8 text-amber-500" />
                  </div>
                  <h4 className="font-semibold text-foreground mb-2">Preview Unavailable</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    This website blocks iframe embedding for security reasons. This is common for major sites like Google, Facebook, etc.
                  </p>
                  <Button asChild className="gap-2">
                    <a href={url} target="_blank" rel="noopener noreferrer">
                      <Globe className="w-4 h-4" />
                      Open Website Directly
                      <ArrowUpRight className="w-3 h-3" />
                    </a>
                  </Button>
                  <p className="text-xs text-muted-foreground mt-4">
                    Tip: Use your browser's developer tools (F12) to test responsive views
                  </p>
                </div>
              </div>
            ) : (
              <iframe
                key={key}
                src={url}
                title="Website Preview"
                className="w-full h-full border-0"
                sandbox="allow-scripts allow-same-origin allow-forms"
                onLoad={handleIframeLoad}
                onError={() => {
                  setHasError(true);
                  setIsLoading(false);
                }}
              />
            )}
          </motion.div>
        </div>

        {/* Info bar */}
        <div className="px-4 py-3 border-t border-border bg-muted/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-background rounded-lg border border-border">
              <currentDevice.icon className={`w-4 h-4 text-primary ${currentDevice.type.includes('landscape') ? 'rotate-90' : ''}`} />
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
              <currentDevice.icon className={`w-5 h-5 ${currentDevice.type.includes('landscape') ? 'rotate-90' : ''}`} />
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
                  onClick={() => handleDeviceChange(d.type)}
                  className="gap-1.5"
                >
                  <d.icon className={`w-4 h-4 ${d.type.includes('landscape') ? 'rotate-90' : ''}`} />
                  {d.label}
                </Button>
              ))}
            </div>
            
            <div className="flex-1 flex justify-center items-start overflow-auto p-4 bg-muted/20 rounded-xl">
              <motion.div
                layout
                className="w-full h-full bg-white dark:bg-gray-900 rounded-xl overflow-hidden shadow-2xl relative border-4 border-gray-800"
                style={{ 
                  maxWidth: device === 'desktop' || device === 'laptop' ? '100%' : currentDevice.width,
                }}
              >
                {hasError ? (
                  <div className="absolute inset-0 bg-background flex items-center justify-center z-10 p-6">
                    <div className="text-center">
                      <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-3" />
                      <p className="text-sm text-muted-foreground mb-4">Preview blocked by website security</p>
                      <Button asChild size="sm">
                        <a href={url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Open Website
                        </a>
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    {isLoading && (
                      <div className="absolute inset-0 bg-background/80 flex items-center justify-center z-10">
                        <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
                      </div>
                    )}
                    <iframe
                      key={`fullscreen-${key}`}
                      src={url}
                      title="Website Preview"
                      className="w-full h-full border-0"
                      sandbox="allow-scripts allow-same-origin allow-forms"
                      onLoad={handleIframeLoad}
                    />
                  </>
                )}
              </motion.div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  );
}
