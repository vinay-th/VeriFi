'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

interface InfiniteSVGScrollerProps {
  svgSources: { src: string; width: number; height: number }[];
  scrollSpeed?: number;
  itemWidth?: number;
  gap?: number;
  direction?: 'horizontal' | 'vertical';
}

const InfiniteSVGScroller: React.FC<InfiniteSVGScrollerProps> = ({
  svgSources,
  scrollSpeed = 50, // Pixels per second
  itemWidth = 200,
  gap = 30,
  direction = 'horizontal',
}) => {
  const totalSize = (itemWidth + gap) * svgSources.length; // One full cycle size

  return (
    <div
      style={{
        overflow: 'hidden',
        width: '100%',
        height: direction === 'vertical' ? '500px' : `${itemWidth + 50}px`,
        position: 'relative',
        display: 'flex',
      }}
    >
      <motion.div
        style={{
          display: 'flex',
          flexDirection: direction === 'horizontal' ? 'row' : 'column',
          flexWrap: 'nowrap',
          width: direction === 'horizontal' ? `${totalSize * 2}px` : 'auto',
          height: direction === 'vertical' ? `${totalSize * 2}px` : 'auto',
        }}
        animate={{
          x: direction === 'horizontal' ? [`0px`, `-${totalSize}px`] : `0px`,
          y: direction === 'vertical' ? [`0px`, `-${totalSize}px`] : `0px`,
        }}
        transition={{
          duration: totalSize / scrollSpeed, // Speed-based animation
          ease: 'linear',
          repeat: Infinity,
          repeatType: 'loop', // Perfect loop transition
        }}
      >
        {/* Duplicate the array to make the transition seamless */}
        {[...svgSources, ...svgSources, ...svgSources].map((svg, index) => (
          <Image
            key={index}
            src={svg.src}
            alt={`SVG ${index}`}
            width={svg.width}
            height={svg.height}
            style={{
              width: `${itemWidth}px`,
              height: 'auto',
              marginRight: direction === 'horizontal' ? `${gap}px` : '0',
              marginBottom: direction === 'vertical' ? `${gap}px` : '0',
              flexShrink: 0,
            }}
          />
        ))}
      </motion.div>
    </div>
  );
};

export default InfiniteSVGScroller;
