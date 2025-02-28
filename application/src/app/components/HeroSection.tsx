'use client';
import { Button } from '@/components/ui/button';
import React from 'react';
import { NavigationMenuDemo } from './top-navigation';

const HeroSection = () => {
  return (
    <div className="flex flex-col items-center w-full bg-BGBlue">
      <div className="hero-section flex flex-col items-center  text-white">
        <div className="flex flex-col pb-40 items-center gap-[0.625rem] bg-gray-600 h-[25.3rem] w-[85rem]">
          <NavigationMenuDemo />
          <Button> Hello </Button>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
