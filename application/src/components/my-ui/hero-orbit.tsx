import { twMerge } from 'tailwind-merge';
import { PropsWithChildren } from 'react';

interface HeroOrbitProps {
  size: number;
  rotation: number;
  shouldOrbit?: boolean;
  shouldSpin?: boolean;
  orbitDuration?: string;
  spinDuration?: string;
}

export const HeroOrbit = ({
  children,
  size,
  rotation,
  shouldOrbit = false,
  shouldSpin = false,
  orbitDuration = '30s',
  spinDuration = '6s',
}: PropsWithChildren<HeroOrbitProps>) => {
  return (
    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
      <div
        className={twMerge(shouldOrbit && 'animate-spin')}
        style={{
          animationDuration: orbitDuration,
          width: `${size}px`,
          height: `${size}px`,
        }}
      >
        <div
          className="flex items-start justify-start"
          style={{ transform: `rotate(${rotation}deg)` }}
        >
          <div
            className={twMerge(shouldSpin && 'animate-spin')}
            style={{ animationDuration: spinDuration }}
          >
            <div style={{ transform: `rotate(-${rotation}deg)` }}>
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
