import React, { useState } from 'react';

interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {}

const LazyImage: React.FC<LazyImageProps> = ({ src, className, style, ...props }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <img
      src={src}
      className={className}
      loading="lazy"
      onLoad={() => setIsLoaded(true)}
      style={{
        ...style,
        opacity: isLoaded ? 1 : 0,
        transition: 'opacity 0.5s ease-in-out',
        willChange: 'opacity',
        backgroundColor: isLoaded ? 'transparent' : '#f0f0f0', // Placeholder background
      }}
      {...props}
    />
  );
};

export default LazyImage;
