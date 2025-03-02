import React, { useState, useRef } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const AnimatedButton = ({
  classes,
  children,
  onClick,
}: {
  classes?: string;
  children: React.ReactNode;
  onClick?: () => void;
}) => {
  const [gradientPosition, setGradientPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setGradientPosition({ x, y });
    }
  };

  return (
    <Button
      onClick={onClick}
      ref={buttonRef}
      className={cn(
        'relative px-6 py-2 text-white font-bold rounded-full bg-[#050024] overflow-hidden border-none flex items-center gap-2 hover:translate-x-1 transition-transform duration-300 ease-in-out',
        classes
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={isHovered ? handleMouseMove : undefined}
    >
      <span className="relative z-10 flex items-center gap-2">{children}</span>

      {/* Glowing border */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          padding: '2px', // Adjust glow width as needed
          background: `radial-gradient(circle at ${gradientPosition.x}px ${gradientPosition.y}px, #DE98F7, transparent 70%)`,
          mask: `linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)`,
          maskComposite: 'destination-out',
        }}
      >
        {/* Button background */}
        <div className="w-full h-full bg-[#050024] rounded-full"></div>
      </div>
    </Button>
  );
};

export default AnimatedButton;
