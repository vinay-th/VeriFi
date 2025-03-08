'use client';
import React, { useEffect, useRef } from 'react';
import aboutBg from '@/../public/aboutBg.png';
import media from '@/../public/media.png';
import about from '@/../public/about.png';
import asset from '@/../public/asset.png';
import AnimatedButton from '@/components/my-ui/animated-button';
import Security from '@/../public/svgs/security-check.svg';
import Image from 'next/image';
import { RiArrowRightSLine, RiFileDamageLine } from 'react-icons/ri';
import { IoExtensionPuzzleOutline, IoOptionsSharp } from 'react-icons/io5';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { AnimatedShinyText } from '@/components/magicui/animated-shiny-text';
import { cn } from '@/lib/utils';
// import OrbitingIcons from '@/components/my-ui/orbiting-icons';
// import { FaGithub, FaInstagram, FaLinkedinIn, FaX } from 'react-icons/fa6';

// import Logo from '@/../public/Logo.png';

gsap.registerPlugin(ScrollTrigger);

const About = () => {
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const textRef = useRef(null);
  const imageRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(
      titleRef.current,
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 1.5,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: titleRef.current,
          start: 'top 80%',
        },
      }
    );

    gsap.fromTo(
      subtitleRef.current,
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 1.5,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: subtitleRef.current,
          start: 'top 80%',
        },
      }
    );

    gsap.fromTo(
      textRef.current,
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 1.5,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: textRef.current,
          start: 'top 80%',
        },
      }
    );

    gsap.fromTo(
      imageRef.current,
      { opacity: 0, rotate: '20deg' },
      {
        opacity: 1,
        rotate: '10deg',
        duration: 1.5,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: imageRef.current,
          start: 'top 80%',
        },
      }
    );
  }, []);

  const [hovered, setHovered] = React.useState(false);

  return (
    <div className="relative mt-20 flex flex-col items-center">
      <h1 ref={titleRef} className="text-4xl font-bold text-center">
        Securely Store Your Credentials with <br />
        Cutting-Edge Blockchain Technology
      </h1>
      <p
        ref={subtitleRef}
        className="text-center mt-[0.62rem] text-xl opacity-50 font-medium"
      >
        Use social login integrations, lower user friction,
        <br /> and facilitate more transactions.
      </p>
      <div
        className="flex flex-row w-[1280px] h-[567px] bg-cover mt-10 bg-center border border-white-500 rounded-3xl"
        style={{
          backgroundImage: `url(${aboutBg.src})`,
        }}
      >
        <div className="w-[640px] z-10 h-[567px] opacity-50 flex flex-col justify-left items-left pl-[3.5rem]">
          <div
            ref={textRef}
            className="inline-flex items-center text-white text-[2.5rem] font-medium mt-[9.4rem] whitespace-nowrap"
          >
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
          ref={imageRef}
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
      <div className="flex flex-row w-[1280px] h-[567px] bg-cover mt-10 bg-center justify-between">
        <div className="w-[700px] z-10 h-[567px] flex flex-col justify-left items-left px-[3.5rem] py-[2.5rem] border border-white-500 rounded-3xl">
          <div
            ref={textRef}
            className="inline-flex items-center text-white text-[2.5rem] font-medium whitespace-nowrap"
          >
            Extensibility&nbsp;
            <IoExtensionPuzzleOutline />
          </div>

          <span className="text-white text-2xl mt-6 opacity-60 w-[28.5rem]">
            VeriFi&apos;s modular design allows easy integration of new
            blockchains, verification services, and custom workflows.
          </span>
          <div
            className="w-full relative z-10 h-[18.8rem]  flex flex-col justify-left items-left pl-[3.5rem] mt-[2.5rem] border border-white-500 rounded-3xl"
            style={{
              backgroundImage: `url(${asset.src})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            {hovered && (
              <div
                className={cn(
                  'absolute top-[2rem] left-[14rem] rounded-full border text-base text-white transition-all ease-in border-white/5 bg-neutral-900 hover:bg-neutral-800 w-[16rem] h-[2rem] flex items-center justify-center'
                )}
              >
                <AnimatedShinyText className="inline-flex items-center justify-center px-4 py-1 transition ease-out hover:duration-300 hover:text-neutral-400">
                  <RiFileDamageLine />
                  <span>&nbsp;The document is tampered</span>
                </AnimatedShinyText>
              </div>
            )}
            <div
              className="w-12 h-12 rounded-full bg-transparent absolute top-[5.8rem] left-[20.75rem]"
              onMouseEnter={() => setHovered(true)}
              onMouseLeave={() => setHovered(false)}
            />
          </div>
        </div>
        <div
          className="w-[500px] z-10 h-[567px] flex flex-col justify-left items-left px-[3.5rem] py-[2.5rem] border border-white-500 rounded-3xl"
          style={{
            backgroundImage: `url(${media.src})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div
            ref={textRef}
            className="inline-flex items-center text-white text-[2.5rem] font-medium whitespace-nowrap"
          >
            Infinite Options&nbsp;
            <IoOptionsSharp />
          </div>

          <span className="text-white text-2xl mt-6 opacity-60 w-[28.5rem]">
            VeriFi&apos;s provides multiple usecases and options for users to
            choose from.
          </span>
          {/* <OrbitingIcons
            icons={[FaGithub, FaLinkedinIn, FaInstagram, FaX]}
            urls={['/star', '/sparkle', '/globe', '/rocket']}
            width={300}
            centralLogo={
              <Image src={Logo} className="h-12 w-12" alt="Central Logo" />
            }
          /> */}
        </div>
      </div>
    </div>
  );
};

export default About;
