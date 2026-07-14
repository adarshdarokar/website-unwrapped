import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Image as ImageIcon, ExternalLink, Download, ZoomIn, Grid, List, X } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { toast } from 'sonner';

interface ImageGalleryProps {
  images: { src: string; alt: string }[];
}

export function ImageGallery({ images }: ImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<{ src: string; alt: string } | null>(null);
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());

  const handleImageError = (src: string) => {
    setFailedImages(prev => new Set(prev).add(src));
  };

  const handleImageLoad = (src: string) => {
    setLoadedImages(prev => new Set(prev).add(src));
  };

  const downloadImage = async (src: string, alt: string) => {
    try {
      const response = await fetch(src);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const extension = blob.type.split('/')[1] || 'jpg';
      a.download = `${alt || 'image'}.${extension}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      toast.success('Image downloaded');
    } catch {
      window.open(src, '_blank');
    }
  };

  const downloadAllImages = () => {
    validImages.slice(0, 10).forEach((img, index) => {
      setTimeout(() => {
        downloadImage(img.src, img.alt || `image-${index + 1}`);
      }, index * 200);
    });
    toast.success(`Downloading ${Math.min(validImages.length, 10)} images`);
  };

  const validImages = images.filter(img => !failedImages.has(img.src));

  if (validImages.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-8 text-center"
      >
        <motion.div
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <ImageIcon className="w-12 h-12 mx-auto text-muted-foreground/40 mb-4" />
        </motion.div>
        <p className="text-muted-foreground">No images found</p>
        <p className="text-muted-foreground/60 text-sm mt-1">
          Images might be loaded via JavaScript
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
              <ImageIcon className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-semibold">Images</h3>
              <p className="text-xs sm:text-sm text-muted-foreground">{validImages.length} found</p>
            </div>
          </div>
          
          <div className="flex items-center gap-1 sm:gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={downloadAllImages}
              className="flex items-center gap-1 px-2 sm:px-3 py-1.5 bg-primary/10 hover:bg-primary/20 text-primary text-xs font-medium rounded-lg transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">All</span>
            </motion.button>
            <div className="flex rounded-lg overflow-hidden border border-border/50">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 sm:p-2 transition-colors ${viewMode === 'grid' ? 'bg-primary/20 text-primary' : 'hover:bg-muted/50'}`}
              >
                <Grid className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 sm:p-2 transition-colors ${viewMode === 'list' ? 'bg-primary/20 text-primary' : 'hover:bg-muted/50'}`}
              >
                <List className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
            </div>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {viewMode === 'grid' ? (
            <motion.div
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3"
            >
              {validImages.map((image, index) => (
                <motion.div
                  key={image.src}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.03, type: 'spring', stiffness: 200 }}
                  className="aspect-[4/3] rounded-xl overflow-hidden bg-card cursor-pointer group relative border border-border/30 hover:border-primary/30 transition-all duration-300 shadow-sm hover:shadow-md image-preserve"
                  onClick={() => setSelectedImage(image)}
                >
                  {!loadedImages.has(image.src) && (
                    <div className="absolute inset-0 animate-pulse bg-muted/50" />
                  )}
                  <img
                    src={image.src}
                    alt={image.alt || 'Website image'}
                    className="w-full h-full object-contain bg-card transition-transform duration-300 group-hover:scale-102"
                    onError={() => handleImageError(image.src)}
                    onLoad={() => handleImageLoad(image.src)}
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-3">
                    <div className="flex items-center gap-1 text-white text-xs font-medium">
                      <ZoomIn className="w-3.5 h-3.5" />
                      <span>View</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-1.5"
            >
              {validImages.map((image, index) => (
                <motion.div
                  key={image.src}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.03 }}
                  className="flex items-center gap-3 p-2 rounded-lg bg-muted/20 hover:bg-muted/40 transition-colors cursor-pointer group"
                  onClick={() => setSelectedImage(image)}
                >
                  <div className="w-12 h-12 rounded overflow-hidden bg-card flex-shrink-0 image-preserve">
                    <img
                      src={image.src}
                      alt={image.alt}
                      className="w-full h-full object-cover"
                      onError={() => handleImageError(image.src)}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{image.alt || 'Untitled'}</p>
                    <p className="text-xs text-muted-foreground truncate">{image.src}</p>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        downloadImage(image.src, image.alt);
                      }}
                      className="p-1.5 hover:bg-muted rounded"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

      </motion.div>

      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-3xl w-[95vw] p-0 bg-background border-border overflow-hidden [&>button]:hidden">
          <VisuallyHidden>
            <DialogTitle>Image Preview</DialogTitle>
          </VisuallyHidden>
          {selectedImage && (
            <div className="relative">
              {/* Single Close button */}
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-3 right-3 z-10 p-2 bg-background/90 hover:bg-background border border-border rounded-full transition-colors shadow-sm"
              >
                <X className="w-4 h-4 text-foreground" />
              </button>
              
              {/* Image - preserved brightness in dark mode */}
              <div className="bg-muted/10 flex items-center justify-center min-h-[300px] max-h-[70vh] image-preserve">
                <img
                  src={selectedImage.src}
                  alt={selectedImage.alt || 'Website image'}
                  className="max-w-full max-h-[70vh] w-auto h-auto object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>
              
              {/* Footer */}
              <div className="p-4 border-t border-border/50">
                <p className="text-sm font-medium mb-1 truncate">
                  {selectedImage.alt || 'No alt text'}
                </p>
                <p className="text-xs text-muted-foreground truncate mb-3">
                  {selectedImage.src}
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => downloadImage(selectedImage.src, selectedImage.alt)}
                    className="flex-1 h-9 text-xs"
                  >
                    <Download className="w-3.5 h-3.5 mr-1.5" />
                    Download
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                    className="flex-1 h-9 text-xs"
                  >
                    <a href={selectedImage.src} target="_blank" rel="noopener noreferrer">
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
