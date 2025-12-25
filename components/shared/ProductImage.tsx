"use client";

import { useState } from "react";
import { ImageIcon } from "lucide-react";

interface ProductImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackSrc?: string;
}

export default function ProductImage({
  src,
  alt,
  className = "",
  fallbackSrc,
}: ProductImageProps) {
  const [imageError, setImageError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(src);

  const handleImageError = () => {
    if (!imageError && fallbackSrc && currentSrc !== fallbackSrc) {
      // Try fallback URL
      setCurrentSrc(fallbackSrc);
    } else {
      // Show placeholder
      setImageError(true);
    }
  };

  if (imageError) {
    return (
      <div
        className={`bg-gray-100 flex items-center justify-center ${className}`}
      >
        <ImageIcon className="w-8 h-8 text-gray-300" />
      </div>
    );
  }

  return (
    <img
      src={currentSrc}
      alt={alt}
      className={className}
      onError={handleImageError}
      loading="lazy"
    />
  );
}
