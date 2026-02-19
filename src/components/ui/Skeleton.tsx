import React from 'react';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  width?: string | number;
  height?: string | number;
}

export const Skeleton: React.FC<SkeletonProps> = ({ 
  className = '', 
  width, 
  height, 
  style, 
  ...props 
}) => {
  return (
    <div 
      className={`skeleton ${className}`} 
      style={{ 
        width: width, 
        height: height,
        ...style 
      }} 
      {...props} 
    />
  );
};
