
import React from 'react';
import { cn } from './utils';

interface FadeInProps {
  children: React.ReactNode;
  duration?: number;
  delay?: number;
  className?: string;
}

export const FadeIn = ({ 
  children, 
  duration = 300, 
  delay = 0,
  className 
}: FadeInProps) => {
  return (
    <div 
      className={cn("opacity-0 animate-fade-in", className)}
      style={{ 
        animationDuration: `${duration}ms`,
        animationDelay: `${delay}ms`,
        animationFillMode: 'forwards'
      }}
    >
      {children}
    </div>
  );
};

interface SlideInProps {
  children: React.ReactNode;
  direction?: 'up' | 'down' | 'left' | 'right';
  duration?: number;
  delay?: number;
  className?: string;
}

export const SlideIn = ({ 
  children, 
  direction = 'up',
  duration = 300, 
  delay = 0,
  className 
}: SlideInProps) => {
  const getAnimationClass = () => {
    switch (direction) {
      case 'up': return 'animate-slide-up';
      case 'down': return 'animate-slide-down';
      case 'left': return 'translate-x-4 opacity-0';
      case 'right': return '-translate-x-4 opacity-0';
      default: return 'animate-slide-up';
    }
  };
  
  const getTransformClass = () => {
    if (direction === 'left' || direction === 'right') {
      return 'transform transition-all ease-out-cubic';
    }
    return '';
  };
  
  return (
    <div 
      className={cn(getAnimationClass(), getTransformClass(), className)}
      style={{ 
        animationDuration: `${duration}ms`,
        animationDelay: `${delay}ms`,
        animationFillMode: 'forwards',
        transitionDuration: `${duration}ms`,
        transitionDelay: `${delay}ms`
      }}
    >
      {children}
    </div>
  );
};

export const staggeredChildren = (count: number, baseDelay = 50) => {
  return Array.from({ length: count }, (_, i) => i * baseDelay);
};
