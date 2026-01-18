import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Monitor, 
  Tablet, 
  Smartphone, 
  ExternalLink,
  Maximize2,
  RotateCcw,
  Laptop,
  Check
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

  const currentDevice = devices.find(d => d.type === device) || devices[4];

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
    setIsLoading(false);
  };

  const handleRefresh = () => {
    setIsLoading(true);
    setKey(k => k + 1);
  };

  return (
    <TooltipProvider>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card border border-border rounded-xl overflow-hidden"
      >
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 border-b border-border bg-muted/30">
          <div className="flex items-center gap-1 flex-wrap">
            {devices.map((d) => (
              <Tooltip key={d.type}>
                <TooltipTrigger asChild>
                  <Button
                    variant={device === d.type ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => {
                      setDevice(d.type);
                      setIsLoading(true);
                    }}
                    className="gap-1.5 h-8 px-2 sm:px-3"
                  >
                    <d.icon className={`w-4 h-4 ${d.type.includes('landscape') ? 'rotate-90' : ''}`} />
                    <span className="hidden md:inline text-xs">{d.label}</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="font-medium">{d.desc}</p>
                  <p className="text-xs text-muted-foreground">{d.width} × {d.height}px</p>
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
          
          <div className="flex items-center gap-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleRefresh}
                  className="h-8 w-8"
                >
                  <RotateCcw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Refresh</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsFullscreen(true)}
                  className="h-8 w-8"
                >
                  <Maximize2 className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Fullscreen</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  asChild
                  className="h-8 w-8"
                >
                  <a href={url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Open in new tab</TooltipContent>
            </Tooltip>
          </div>
        </div>

        {/* Preview */}
        <div className="p-4 bg-muted/10 flex justify-center overflow-x-auto">
          <motion.div
            layout
            className="w-full bg-white rounded-lg overflow-hidden shadow-lg transition-all duration-300 relative"
            style={getPreviewStyles()}
          >
            {isLoading && (
              <div className="absolute inset-0 bg-muted/50 flex items-center justify-center z-10">
                <div className="flex flex-col items-center gap-2">
                  <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  <span className="text-xs text-muted-foreground">Loading preview...</span>
                </div>
              </div>
            )}
            <iframe
              key={key}
              src={url}
              title="Website Preview"
              className="w-full h-full border-0"
              sandbox="allow-scripts allow-same-origin"
              onLoad={handleIframeLoad}
            />
          </motion.div>
        </div>

        {/* Info bar */}
        <div className="px-4 py-2 border-t border-border bg-muted/20 flex flex-col xs:flex-row items-start xs:items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <currentDevice.icon className={`w-3.5 h-3.5 text-muted-foreground ${currentDevice.type.includes('landscape') ? 'rotate-90' : ''}`} />
              <span className="text-xs font-medium">{currentDevice.desc}</span>
            </div>
            <span className="text-xs text-muted-foreground">
              {currentDevice.width} × {currentDevice.height}px
            </span>
          </div>
          <div className="flex items-center gap-2">
            {!isLoading && (
              <span className="text-xs text-success flex items-center gap-1">
                <Check className="w-3 h-3" /> Loaded
              </span>
            )}
            <span className="text-xs text-muted-foreground truncate max-w-[200px] sm:max-w-xs">
              {url}
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
                  onClick={() => {
                    setDevice(d.type);
                    setIsLoading(true);
                  }}
                  className="gap-1.5"
                >
                  <d.icon className={`w-4 h-4 ${d.type.includes('landscape') ? 'rotate-90' : ''}`} />
                  {d.label}
                </Button>
              ))}
            </div>
            
            <div className="flex-1 flex justify-center items-start overflow-auto p-4 bg-muted/20 rounded-lg">
              <motion.div
                layout
                className="w-full h-full bg-white rounded-lg overflow-hidden shadow-xl relative"
                style={{ 
                  maxWidth: device === 'desktop' || device === 'laptop' ? '100%' : currentDevice.width,
                }}
              >
                {isLoading && (
                  <div className="absolute inset-0 bg-muted/50 flex items-center justify-center z-10">
                    <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
                <iframe
                  key={`fullscreen-${key}`}
                  src={url}
                  title="Website Preview"
                  className="w-full h-full border-0"
                  sandbox="allow-scripts allow-same-origin"
                  onLoad={handleIframeLoad}
                />
              </motion.div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  );
}
