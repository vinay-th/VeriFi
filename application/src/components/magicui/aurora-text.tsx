'use client';

import { cn } from '@/lib/utils';
import { motion, MotionProps } from 'motion/react';
import React from 'react';

interface AuroraTextProps
  extends Omit<React.HTMLAttributes<HTMLElement>, keyof MotionProps> {
  className?: string;
  children: React.ReactNode;
  as?: React.ElementType;
}

export function AuroraText({
  className,
  children,
  as: Component = 'span',
  ...props
}: AuroraTextProps) {
  const MotionComponent = motion.create(Component);

  return (
    <MotionComponent
      className={cn(
        'relative inline-block bg-[linear-gradient(90deg,#ff00ff,#00ffff)] bg-clip-text text-transparent animate-[aurora-border_6s_ease-in-out_infinite]',
        className
      )}
      {...props}
    >
      {children}
    </MotionComponent>
  );
}
