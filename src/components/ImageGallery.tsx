import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Image as ImageIcon, ExternalLink, Download, ZoomIn, Grid, List } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

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
      a.download = alt || 'image';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      window.open(src, '_blank');
    }
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
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <ImageIcon className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
        </motion.div>
        <p className="text-muted-foreground text-lg">No images found on this website</p>
        <p className="text-muted-foreground/60 text-sm mt-2">
          This could be because images are loaded dynamically via JavaScript
        </p>
      </motion.div>
    );
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card-elevated p-6 overflow-hidden"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <motion.div 
              className="p-2.5 bg-gradient-to-br from-primary/20 to-accent/20 rounded-xl"
              whileHover={{ scale: 1.05, rotate: 5 }}
            >
              <ImageIcon className="w-5 h-5 text-primary" />
            </motion.div>
            <div>
              <h3 className="text-lg font-semibold">Images</h3>
              <p className="text-sm text-muted-foreground">{validImages.length} images discovered</p>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="icon"
              onClick={() => setViewMode('grid')}
              className="w-8 h-8 rounded-lg"
            >
              <Grid className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="icon"
              onClick={() => setViewMode('list')}
              className="w-8 h-8 rounded-lg"
            >
              <List className="w-4 h-4" />
            </Button>
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
              {validImages.slice(0, 16).map((image, index) => (
                <motion.div
                  key={image.src}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05, type: 'spring', stiffness: 200 }}
                  whileHover={{ scale: 1.02, y: -4 }}
                  onClick={() => setSelectedImage(image)}
                  className="aspect-square rounded-xl overflow-hidden bg-gradient-to-br from-muted to-muted/50 cursor-pointer group relative shadow-soft hover:shadow-elevated transition-all duration-300"
                >
                  {!loadedImages.has(image.src) && (
                    <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-muted to-muted/30" />
                  )}
                  <img
                    src={image.src}
                    alt={image.alt || 'Website image'}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    onError={() => handleImageError(image.src)}
                    onLoad={() => handleImageLoad(image.src)}
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end p-3">
                    <div className="flex items-center gap-2 w-full">
                      <ZoomIn className="w-4 h-4 text-white" />
                      <span className="text-white text-xs truncate flex-1">{image.alt || 'View'}</span>
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
              className="space-y-2"
            >
              {validImages.slice(0, 10).map((image, index) => (
                <motion.div
                  key={image.src}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ x: 4 }}
                  className="flex items-center gap-4 p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer"
                  onClick={() => setSelectedImage(image)}
                >
                  <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                    <img
                      src={image.src}
                      alt={image.alt}
                      className="w-full h-full object-cover"
                      onError={() => handleImageError(image.src)}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{image.alt || 'Untitled image'}</p>
                    <p className="text-xs text-muted-foreground truncate">{image.src}</p>
                  </div>
                  <ExternalLink className="w-4 h-4 text-muted-foreground" />
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {validImages.length > 16 && (
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center text-sm text-muted-foreground mt-6 py-3 bg-muted/30 rounded-xl"
          >
            +{validImages.length - 16} more images found
          </motion.p>
        )}
      </motion.div>

      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-4xl bg-card/95 backdrop-blur-xl border-border/50">
          <VisuallyHidden>
            <DialogTitle>Image Preview</DialogTitle>
          </VisuallyHidden>
          {selectedImage && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative"
            >
              <img
                src={selectedImage.src}
                alt={selectedImage.alt || 'Website image'}
                className="w-full rounded-xl shadow-elevated"
              />
              <div className="mt-4 flex items-center justify-between gap-4">
                <p className="text-sm text-muted-foreground truncate flex-1">
                  {selectedImage.alt || 'No alt text provided'}
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => downloadImage(selectedImage.src, selectedImage.alt)}
                    className="rounded-lg"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                    className="rounded-lg"
                  >
                    <a href={selectedImage.src} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Open
                    </a>
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
