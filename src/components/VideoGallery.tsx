import { useState } from 'react';
import { motion } from 'framer-motion';
import { Video as VideoIcon, ExternalLink, Play, Download, Film, Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useLazyList } from '@/hooks/useLazyList';

interface VideoItem {
  src: string;
  poster: string;
  type: string;
  title: string;
}

interface VideoGalleryProps {
  videos: VideoItem[];
}

const typeLabel: Record<string, string> = {
  video: 'Video',
  source: 'Video',
  file: 'File',
  youtube: 'YouTube',
  vimeo: 'Vimeo',
};

const typeColor: Record<string, string> = {
  video: 'from-primary/20 to-accent/20 text-primary',
  source: 'from-primary/20 to-accent/20 text-primary',
  file: 'from-blue-500/20 to-blue-600/20 text-blue-500',
  youtube: 'from-red-500/20 to-red-600/20 text-red-500',
  vimeo: 'from-cyan-500/20 to-cyan-600/20 text-cyan-500',
};

export function VideoGallery({ videos }: VideoGalleryProps) {
  const [selected, setSelected] = useState<VideoItem | null>(null);

  const isEmbed = (v: VideoItem) => v.type === 'youtube' || v.type === 'vimeo';

  const download = async (src: string, index: number) => {
    try {
      const res = await fetch(src);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const ext = (blob.type.split('/')[1] || 'mp4').split(';')[0];
      a.download = `video-${index + 1}.${ext}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success('Video downloaded');
    } catch {
      window.open(src, '_blank');
    }
  };

  if (!videos || videos.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-8 text-center"
      >
        <motion.div animate={{ y: [0, -4, 0] }} transition={{ duration: 2, repeat: Infinity }}>
          <Film className="w-12 h-12 mx-auto text-muted-foreground/40 mb-4" />
        </motion.div>
        <p className="text-muted-foreground">No videos found</p>
        <p className="text-muted-foreground/60 text-sm mt-1">
          Videos might be loaded via JavaScript or third-party players
        </p>
      </motion.div>
    );
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card-elevated p-4 sm:p-6 overflow-hidden"
      >
        <div className="flex items-center justify-between mb-4 sm:mb-6 gap-2">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="p-2 bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg">
              <VideoIcon className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-semibold">Videos</h3>
              <p className="text-xs sm:text-sm text-muted-foreground">{videos.length} found</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {videos.map((video, index) => (
            <motion.div
              key={video.src}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.03, type: 'spring', stiffness: 200 }}
              className="group relative aspect-video rounded-xl overflow-hidden bg-muted/30 border border-border/40 hover:border-primary/40 transition-all cursor-pointer shadow-sm hover:shadow-md"
              onClick={() => setSelected(video)}
            >
              {video.poster ? (
                <img
                  src={video.poster}
                  alt={video.title || 'Video thumbnail'}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  onError={(e) => ((e.target as HTMLImageElement).style.display = 'none')}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-muted/40 to-muted/20">
                  <VideoIcon className="w-10 h-10 text-muted-foreground/40" />
                </div>
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-90 group-hover:opacity-100 transition-opacity" />

              <div className="absolute top-2 left-2">
                <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-gradient-to-br ${typeColor[video.type] || typeColor.video} backdrop-blur-md border border-white/10`}>
                  {typeLabel[video.type] || 'Video'}
                </span>
              </div>

              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="w-12 h-12 rounded-full bg-white/95 flex items-center justify-center shadow-lg"
                >
                  <Play className="w-5 h-5 text-black fill-black ml-0.5" />
                </motion.div>
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-2.5">
                <p className="text-[11px] text-white/90 font-medium truncate">
                  {video.title || video.src.split('/').pop()?.split('?')[0] || 'Video'}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="max-w-4xl w-[95vw] p-0 bg-background border-border overflow-hidden">
          <VisuallyHidden>
            <DialogTitle>Video Preview</DialogTitle>
          </VisuallyHidden>
          {selected && (
            <div className="relative">
              <div className="bg-black flex items-center justify-center aspect-video">
                {isEmbed(selected) ? (
                  <iframe
                    src={selected.src}
                    title={selected.title || 'Video'}
                    className="w-full h-full"
                    allow="accelerated-2d-canvas; autoplay; encrypted-media; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <video
                    src={selected.src}
                    poster={selected.poster || undefined}
                    controls
                    autoPlay
                    className="w-full h-full"
                  />
                )}
              </div>

              <div className="p-4 border-t border-border/50">
                <p className="text-sm font-medium mb-1 truncate">
                  {selected.title || 'Untitled video'}
                </p>
                <p className="text-xs text-muted-foreground truncate mb-3">{selected.src}</p>
                <div className="flex gap-2">
                  {!isEmbed(selected) && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => download(selected.src, 0)}
                      className="flex-1 h-9 text-xs"
                    >
                      <Download className="w-3.5 h-3.5 mr-1.5" />
                      Download
                    </Button>
                  )}
                  <Button variant="outline" size="sm" asChild className="flex-1 h-9 text-xs">
                    <a href={selected.src} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-3.5 h-3.5 mr-1.5" />
                      Open Original
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
