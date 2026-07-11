import React, { useState, useEffect } from 'react';
import { ImageOff, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CityImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallback?: 'business' | 'product' | 'profile' | 'hero' | 'event' | 'transport';
  containerClassName?: string;
}

const FALLBACK_IMAGES = {
  business: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80',
  product: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80',
  profile: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&q=80',
  hero: 'https://images.unsplash.com/photo-1517404215738-15263e9f9178?w=1200&q=80',
  event: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800&q=80',
  transport: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&q=80'
};

export const CityImage: React.FC<CityImageProps> = ({ 
  src, 
  alt, 
  fallback = 'business', 
  className, 
  containerClassName,
  onAnimationStart,
  onDragStart,
  onDragEnd,
  onDrag,
  onLoadStart,
  onLoad,
  onError,
  ...props 
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    if (src) {
      setIsLoading(true);
      setError(false);
    }
  }, [src]);

  const handleLoad = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    setIsLoading(false);
    setError(false);
    if (onLoad) onLoad(e as any);
  };

  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    if (retryCount < 2) {
      setRetryCount(prev => prev + 1);
    } else {
      setIsLoading(false);
      setError(true);
    }
    if (onError) onError(e as any);
  };

  const imageSrc = (error || !src) ? FALLBACK_IMAGES[fallback] : src;

  return (
    <div className={`relative overflow-hidden bg-zinc-100 dark:bg-zinc-800 ${containerClassName || ''} group`}>
      <AnimatePresence mode="wait">
        {isLoading && (
          <motion.div 
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center bg-zinc-100 dark:bg-zinc-900 z-10"
          >
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="w-6 h-6 animate-spin text-emerald-600 opacity-40" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 animate-pulse">
                Syncing Asset...
              </span>
            </div>
            {/* Shimmer effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
          </motion.div>
        )}
      </AnimatePresence>
      
      <motion.img
        initial={{ opacity: 0, scale: 1.05 }}
        animate={{ 
          opacity: isLoading ? 0 : 1, 
          scale: isLoading ? 1.05 : 1 
        }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        src={imageSrc}
        alt={alt || 'FindAba Asset'}
        onLoad={handleLoad}
        onError={handleError}
        className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 ${className || ''}`}
        referrerPolicy="no-referrer"
        {...props}
      />

      {(error || !src) && !isLoading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-zinc-400 bg-zinc-50 dark:bg-zinc-800/50 p-4 text-center backdrop-blur-sm">
          <ImageOff className="w-8 h-8 mb-2 opacity-20" />
          <span className="text-[10px] font-black uppercase tracking-widest opacity-40">
            City Archive Missing
          </span>
          <p className="text-[8px] opacity-30 mt-1">Fallback data applied</p>
        </div>
      )}
    </div>
  );
};
