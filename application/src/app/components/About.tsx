'use client';
import React from 'react';
import aboutBg from '@/../public/aboutBg.png';
import about from '@/../public/about.png';
import AnimatedButton from '@/components/my-ui/animated-button';
import Security from '@/../public/svgs/security-check.svg';
import Image from 'next/image';
import { RiArrowRightSLine } from 'react-icons/ri';

const About = () => {
  return (
    <div className="relative mt-20 flex flex-col items-center">
      <h1 className="text-4xl font-bold text-center">
        Securely Store Your Credentials with <br />
        Cutting-Edge Blockchain Technology
      </h1>
      <p className="text-center mt-[0.62rem] text-xl opacity-50 font-medium">
        Use social login integrations, lower user friction,
        <br /> and facilitate more transactions.
      </p>
      <div
        className="flex flex-row w-[1280px] h-[567px] bg-cover mt-10 bg-center"
        style={{
          backgroundImage: `url(${aboutBg.src})`,
          WebkitMaskImage:
            'radial-gradient(ellipse at center, rgba(0,0,0,1) 40%, rgba(0,0,0,0) 100%)',
          maskImage:
            'radial-gradient(ellipse at center, rgba(0,0,0,1) 40%, rgba(0,0,0,0) 100%)',
        }}
      >
        <div className="w-[640px] z-10 h-[567px]opacity-50 flex flex-col justify-left items-left pl-[3.5rem]">
          <div className="inline-flex items-center text-white text-[2.5rem] font-medium mt-[9.4rem] whitespace-nowrap">
            Optimized for security&nbsp;
            <Image src={Security} alt="security" width="45" className="pt-2" />
          </div>

          <span className="text-white text-2xl mt-6 opacity-60 w-[28.5rem]">
            Designed with a focus on security, the system employs robust
            encryption protocols, regular security updates, and advanced
            authentication measures to ensure a highly secure environment.
          </span>
          <AnimatedButton
            classes="bg-BGBlue text-white text-lg mt-8 whitespace-nowrap overflow-hidden text-ellipsis h-10 w-[12rem]"
            onClick={() => console.log('Clicked')}
          >
            Learn more <RiArrowRightSLine />
          </AnimatedButton>
        </div>
        <Image
          src={about}
          alt=""
          width={700}
          height={300}
          style={{
            rotate: '10deg',
            pointerEvents: 'none',
            userSelect: 'none',
          }}
        />
      </div>
    </div>
  );
};

export default About;
