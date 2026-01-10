import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Image as ImageIcon, X, ExternalLink } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

interface ImageGalleryProps {
  images: { src: string; alt: string }[];
}

export function ImageGallery({ images }: ImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<{ src: string; alt: string } | null>(null);
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());

  const handleImageError = (src: string) => {
    setFailedImages(prev => new Set(prev).add(src));
  };

  const validImages = images.filter(img => !failedImages.has(img.src));

  if (validImages.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-8 text-center"
      >
        <ImageIcon className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
        <p className="text-muted-foreground">No images found on this website</p>
      </motion.div>
    );
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-primary/10 rounded-xl">
            <ImageIcon className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Images</h3>
            <p className="text-sm text-muted-foreground">{validImages.length} images found</p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {validImages.slice(0, 12).map((image, index) => (
            <motion.div
              key={image.src}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => setSelectedImage(image)}
              className="aspect-square rounded-xl overflow-hidden bg-muted cursor-pointer group relative hover:ring-2 hover:ring-primary/50 transition-all"
            >
              <img
                src={image.src}
                alt={image.alt || 'Website image'}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                onError={() => handleImageError(image.src)}
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                <span className="text-white text-xs truncate">{image.alt || 'Image'}</span>
              </div>
            </motion.div>
          ))}
        </div>

        {validImages.length > 12 && (
          <p className="text-center text-sm text-muted-foreground mt-4">
            +{validImages.length - 12} more images
          </p>
        )}
      </motion.div>

      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-3xl bg-card/95 backdrop-blur-xl">
          <VisuallyHidden>
            <DialogTitle>Image Preview</DialogTitle>
          </VisuallyHidden>
          <AnimatePresence>
            {selectedImage && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="relative"
              >
                <img
                  src={selectedImage.src}
                  alt={selectedImage.alt || 'Website image'}
                  className="w-full rounded-lg"
                />
                <div className="mt-4 flex items-center justify-between">
                  <p className="text-sm text-muted-foreground truncate flex-1">
                    {selectedImage.alt || 'No alt text'}
                  </p>
                  <a
                    href={selectedImage.src}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-primary hover:underline"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Open original
                  </a>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </DialogContent>
      </Dialog>
    </>
  );
}
