'use client';

import React, { useEffect, useRef } from 'react';
import { NavigationMenuDemo } from './top-navigation';
import AnimatedButton from '@/components/my-ui/animated-button';
import { Button } from '@/components/ui/button';
import { RiArrowRightSLine } from 'react-icons/ri';
import useMousePosition from '@/lib/use-mouse-pos';
import { motion } from 'framer-motion';
import { AuroraText } from '@/components/magicui/aurora-text';
import InfiniteSVGScroller from '@/components/magicui/infinite-svg';
import gsap from 'gsap';
import next from '@/../public/Tech/next.svg';
import typecsript from '@/../public/Tech/typecsript.svg';
import ipfs from '@/../public/Tech/ipfs.svg';
import ethereum from '@/../public/Tech/ethereum.svg';
import metamask from '@/../public/Tech/metamask.svg';
import Link from 'next/link';

const HeroSection = () => {
  const { x, y } = useMousePosition();

  // GSAP Refs
  const heroRef = useRef(null);
  const titleRef = useRef(null);
  const auroraRef = useRef(null);
  const btnRef = useRef(null);
  const textRef = useRef(null);

  useEffect(() => {
    // GSAP Hero Title Animation
    gsap.fromTo(
      titleRef.current,
      { opacity: 0, y: 50, scale: 0.9 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1.5,
        ease: 'power3.out',
        delay: 0.2,
      }
    );

    // GSAP Aurora Text Animation
    gsap.fromTo(
      auroraRef.current,
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 1.8, ease: 'power3.out', delay: 0.5 }
    );

    // GSAP Buttons Animation
    gsap.fromTo(
      btnRef.current,
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 1.5,
        ease: 'power3.out',
        delay: 0.8,
        stagger: 0.2,
      }
    );

    // GSAP Paragraph Animation
    gsap.fromTo(
      textRef.current,
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out', delay: 0.6 }
    );
  }, []);

  const svgSources = [
    { src: next.src, width: 100, height: 100 },
    { src: typecsript.src, width: 100, height: 100 },
    { src: ipfs.src, width: 100, height: 100 },
    { src: ethereum.src, width: 100, height: 100 },
    { src: metamask.src, width: 100, height: 100 },
  ];

  return (
    <div
      ref={heroRef}
      className="flex flex-col items-center w-full overflow-hidden"
    >
      {/* Adjusted width and overflow */}
      <div className="hero-section flex flex-col items-center w-full">
        <div className="flex flex-col pb-52 items-center gap-[0.625rem] bg-gray-600 w-full max-w-[80rem] rounded-b-3xl hero-bg">
          <NavigationMenuDemo />

          <div className="flex flex-col items-center mt-14 p-10">
            <AnimatedButton classes="my-custom-button">
              Verify documents in seconds
            </AnimatedButton>

            <h1 ref={titleRef} className="hero-title body p-10 text-center">
              Empowering Credential Verification Through
              <br /> Blockchain Technology
            </h1>

            <motion.div
              ref={auroraRef}
              animate={{
                WebkitMaskPosition: `${x}px ${y}px`,
                maskPosition: `${x - 250}px ${y - 250}px`,
              }}
              transition={{ type: 'tween', ease: 'backOut', duration: 0.5 }}
              className="hero-title mask top-[190px] absolute p-10 text-center rounded-3xl"
            >
              Empowering Credential
              <AuroraText> Verification </AuroraText>
              Through
              <br /> <AuroraText> Blockchain </AuroraText> Technology
            </motion.div>

            <p ref={textRef} className="hero-sub-title text-center">
              VeriFI revolutionizes the way educational credentials are verified
              by utilizing blockchain technology for enhanced security and
              transparency. Our platform gives students control over their
              documents while simplifying the verification process for
              institutions and employers.
            </p>

            <div ref={btnRef} className="flex flex-row items-center gap-4">
              <Link href="/get-started">
                <AnimatedButton classes="bg-BGBlue text-white text-lg mt-8 whitespace-nowrap overflow-hidden text-ellipsis h-10">
                  Get Started <RiArrowRightSLine />
                </AnimatedButton>
              </Link>
              <div className="text-white text-lg">
                <Link href="/get-started">
                  <Button
                    variant={'invert'}
                    className="rounded-full text-white text-lg mt-8"
                  >
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className="relative flex w-full flex-col items-center justify-center overflow-visible my-10 mt-20 h-52">
          <div className="rotate-[-5deg]">
            <InfiniteSVGScroller
              svgSources={svgSources}
              scrollSpeed={70}
              itemWidth={100}
              gap={70}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
