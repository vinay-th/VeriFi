import { HeroOrbit } from './hero-orbit';
import { twMerge } from 'tailwind-merge';
import React from 'react';

interface OrbitingIconsProps {
  icons: Array<React.ComponentType<React.SVGProps<SVGSVGElement>>>;
  urls: string[];
  width: number;
  centralLogo: React.ReactNode;
}

const OrbitingIcons: React.FC<OrbitingIconsProps> = ({
  icons,
  urls,
  width,
  centralLogo,
}) => {
  return (
    <div
      className="relative mx-auto"
      style={{
        width: `${width}px`,
        height: `${width}px`,
      }}
    >
      {/* Central Logo */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
        {centralLogo}
      </div>

      {/* Orbiting Icons */}
      {icons.map((Icon, index) => {
        const orbitDuration = `${30 + 2}s`;
        const rotation = 100 * index;

        return (
          <HeroOrbit
            key={index}
            size={width}
            rotation={rotation}
            shouldOrbit={true}
            orbitDuration={orbitDuration}
            shouldSpin={false}
            spinDuration="6s"
          >
            <a
              href={urls[index]}
              target="_blank"
              rel="noopener noreferrer"
              className={twMerge(
                'block transition-transform duration-300',
                'hover:scale-110 hover:text-primary/90'
              )}
            >
              <Icon className="h-8 w-8" />
            </a>
          </HeroOrbit>
        );
      })}
    </div>
  );
};

export default OrbitingIcons;
