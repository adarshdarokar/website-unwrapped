import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Monitor, 
  Tablet, 
  Smartphone, 
  ExternalLink,
  Maximize2,
  RotateCcw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface ResponsivePreviewProps {
  url: string;
}

type DeviceType = 'desktop' | 'tablet' | 'mobile';

const devices = [
  { type: 'mobile' as DeviceType, icon: Smartphone, width: 375, label: 'Mobile' },
  { type: 'tablet' as DeviceType, icon: Tablet, width: 768, label: 'Tablet' },
  { type: 'desktop' as DeviceType, icon: Monitor, width: 1280, label: 'Desktop' },
];

export function ResponsivePreview({ url }: ResponsivePreviewProps) {
  const [device, setDevice] = useState<DeviceType>('desktop');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [key, setKey] = useState(0);

  const currentDevice = devices.find(d => d.type === device) || devices[2];

  const getPreviewWidth = () => {
    switch (device) {
      case 'mobile': return 'max-w-[375px]';
      case 'tablet': return 'max-w-[768px]';
      default: return 'max-w-full';
    }
  };

  const getPreviewHeight = () => {
    switch (device) {
      case 'mobile': return 'h-[600px]';
      case 'tablet': return 'h-[700px]';
      default: return 'h-[500px]';
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card border border-border rounded-xl overflow-hidden"
      >
        {/* Toolbar */}
        <div className="flex items-center justify-between p-3 border-b border-border bg-muted/30">
          <div className="flex items-center gap-1">
            {devices.map((d) => (
              <Button
                key={d.type}
                variant={device === d.type ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setDevice(d.type)}
                className="gap-1.5 h-8"
              >
                <d.icon className="w-4 h-4" />
                <span className="hidden sm:inline text-xs">{d.label}</span>
              </Button>
            ))}
          </div>
          
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setKey(k => k + 1)}
              className="h-8 w-8"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsFullscreen(true)}
              className="h-8 w-8"
            >
              <Maximize2 className="w-4 h-4" />
            </Button>
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
          </div>
        </div>

        {/* Preview */}
        <div className="p-4 bg-muted/10 flex justify-center">
          <motion.div
            layout
            className={`${getPreviewWidth()} ${getPreviewHeight()} w-full bg-white rounded-lg overflow-hidden shadow-lg transition-all duration-300`}
          >
            <iframe
              key={key}
              src={url}
              title="Website Preview"
              className="w-full h-full border-0"
              sandbox="allow-scripts allow-same-origin"
            />
          </motion.div>
        </div>

        {/* Info bar */}
        <div className="px-4 py-2 border-t border-border bg-muted/20 flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            {currentDevice.width}px viewport
          </span>
          <span className="text-xs text-muted-foreground truncate max-w-xs">
            {url}
          </span>
        </div>
      </motion.div>

      {/* Fullscreen Dialog */}
      <Dialog open={isFullscreen} onOpenChange={setIsFullscreen}>
        <DialogContent className="max-w-6xl w-full h-[90vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <currentDevice.icon className="w-5 h-5" />
              {currentDevice.label} Preview
            </DialogTitle>
          </DialogHeader>
          
          <div className="flex-1 flex flex-col gap-4">
            <div className="flex items-center gap-2 justify-center">
              {devices.map((d) => (
                <Button
                  key={d.type}
                  variant={device === d.type ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setDevice(d.type)}
                  className="gap-1.5"
                >
                  <d.icon className="w-4 h-4" />
                  {d.label}
                </Button>
              ))}
            </div>
            
            <div className="flex-1 flex justify-center items-start overflow-auto p-4 bg-muted/20 rounded-lg">
              <motion.div
                layout
                className={`${getPreviewWidth()} w-full h-full bg-white rounded-lg overflow-hidden shadow-xl`}
                style={{ 
                  maxWidth: device === 'desktop' ? '100%' : currentDevice.width,
                }}
              >
                <iframe
                  key={`fullscreen-${key}`}
                  src={url}
                  title="Website Preview"
                  className="w-full h-full border-0"
                  sandbox="allow-scripts allow-same-origin"
                />
              </motion.div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
