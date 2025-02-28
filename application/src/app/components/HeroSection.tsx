'use client';
import React from 'react';
import { NavigationMenuDemo } from './top-navigation';
import AnimatedButton from '@/components/my-ui/animated-button';
import { Button } from '@/components/ui/button';
import { RiArrowRightSLine } from 'react-icons/ri';

const HeroSection = () => {
  return (
    <div className="flex flex-col items-center">
      <div className="hero-section flex flex-col items-center">
        <div className="flex flex-col pb-52 items-center gap-[0.625rem] bg-gray-600 w-[85rem] rounded-b-3xl hero-bg">
          <NavigationMenuDemo />
          <div className="flex flex-col items-center p-10 pb-40 ">
            <AnimatedButton classes="my-custom-button">
              Verify documents in seconds
            </AnimatedButton>
            <h1 className="hero-title p-10">
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
            <div className="flex flex-row items-center gap-4">
              <AnimatedButton
                classes="bg-BGBlue text-white text-lg mt-8 whitespace-nowrap overflow-hidden text-ellipsis"
                onClick={() => console.log('Clicked')}
              >
                Get Started <RiArrowRightSLine />
              </AnimatedButton>
              <Button
                variant={'invert'}
                className="rounded-full text-white text-lg mt-8"
                onClick={() => console.log('Clicked')}
              >
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
