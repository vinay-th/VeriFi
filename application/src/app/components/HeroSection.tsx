'use client';
import { Button } from '@/components/ui/button';
import React from 'react';
import { NavigationMenuDemo } from './top-navigation';
import AnimatedButton from '@/components/my-ui/animated-button';

const HeroSection = () => {
  return (
    <div className="flex flex-col items-center">
      <div className="hero-section flex flex-col items-center">
        <div className="flex flex-col pb-40 items-center gap-[0.625rem] bg-gray-600 w-[85rem] rounded-b-3xl hero-bg">
          <NavigationMenuDemo />
          <div className="flex flex-col items-center p-10 pb-40 ">
            <AnimatedButton classes="my-custom-button">
              Verify documents in seconds
            </AnimatedButton>
            <h1 className="hero-title p-5">
              Empowering Credential Verification Through
              <br /> Blockchain Technology
            </h1>
            <p className="hero-sub-title">
              VeriFI revolutionizes the way educational credentials are verified
              by utilizing blockchain technology for enhanced security and
              transparency. Our platform gives students control over their
              documents while simplifying the verification process for
              institutions and employers.
            </p>
            <Button
              className="bg-BGBlue text-white text-lg mt-8"
              onClick={() => console.log('Clicked')}
            >
              Get Started
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
