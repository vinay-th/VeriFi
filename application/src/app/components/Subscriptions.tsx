'use client';
import { Card } from '@/components/ui/card';
import SubscriptionBg from '@/../public/subscription-bg.png';
import React from 'react';
import AnimatedButton from '@/components/my-ui/animated-button';
import { FaCheck } from 'react-icons/fa';

const Subscriptions = () => {
  return (
    <div
      className="h-[1000px] relative mt-20 flex flex-col items-center overflow-visible"
      style={{
        backgroundImage: `url(${SubscriptionBg.src})`,
        backgroundSize: '100% 90%',
        backgroundPosition: 'center 100px',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <h1 className="text-6xl text-center font-semibold">Flexible plans</h1>
      <p className="text-center text-2xl mt-6 opacity-50 font-thin">
        Our pricing component is designed to provide a<br /> clear, intuitive,
        and conversion-focused experience for users selecting a plan.
      </p>
      <div className="flex flex-row gap-8">
        <Card className="h-[42rem] w-[20rem] mt-8 bg-transparent rounded-2xl flex flex-col items-left justify-left border-0 gap-3">
          <span className="mt-[19.4rem] flex flex-row items-center text-xl gap-2 border-b-2 w-44 border-white border-opacity-40 pb-4">
            API Access
          </span>
          <span className="mt-6 flex flex-row items-center text-xl gap-2 border-b-2 w-44 border-white border-opacity-40 pb-4">
            Documents
          </span>
          <span className="mt-6 flex flex-row items-center text-xl gap-2 border-b-2 w-44 border-white border-opacity-40 pb-4">
            Support
          </span>
          <span className="mt-6 flex flex-row items-center text-xl gap-2 border-b-2 w-44 border-white border-opacity-40 pb-4">
            Integrations
          </span>
        </Card>
        <Card className="h-[42rem] w-[30rem] mt-8 border-[0.01px] border-white bg-transparent rounded-2xl flex flex-col items-left justify-left p-6 gap-3 border-opacity-60">
          <h3 className="text-lg font-medium text-[#9D79EC]">
            VeriFi White-Label Solution
          </h3>
          <p className="text-3xl text-white">
            <span className="text-base">$</span>49/mo
          </p>
          <p className="text-xl">For businesses & organizations</p>
          <AnimatedButton classes="bg-BGBlue text-white w-40">
            Get Started
          </AnimatedButton>
          <span className="mt-28 flex flex-row items-center text-xl gap-2 border-b-2 border-[#9D79EC] border-opacity-60 pb-4">
            <FaCheck className="text-[#9D79EC]" /> Basic
          </span>
          <span className="mt-6 flex flex-row items-center text-xl gap-2 border-b-2 border-[#9D79EC] border-opacity-60 pb-4">
            <FaCheck className="text-[#9D79EC]" /> 100
          </span>
          <span className="mt-6 flex flex-row items-center text-xl gap-2 border-b-2 border-[#9D79EC] border-opacity-60 pb-4">
            <FaCheck className="text-[#9D79EC]" /> Standard
          </span>
          <span className="mt-6 flex flex-row items-center text-xl gap-2 border-b-2 border-[#9D79EC] border-opacity-60 pb-4">
            <FaCheck className="text-[#9D79EC]" /> Limited
          </span>
        </Card>
        <Card className="h-[42rem] w-[30rem] mt-8 border-[0.01px] border-white bg-transparent rounded-2xl flex flex-col items-left justify-left p-8 gap-3 border-opacity-75">
          <h3 className="text-lg font-medium text-[#9D79EC]">
            VeriFi University Suite
          </h3>
          <p className="text-3xl text-white">
            <span className="text-base">$</span>249/mo
          </p>
          <p className="text-xl">For educational institutions</p>
          <AnimatedButton classes="bg-BGBlue text-white w-40">
            Get Started
          </AnimatedButton>
          <span className="mt-28 flex flex-row items-center text-xl gap-2 border-b-2 border-[#9D79EC] border-opacity-60 pb-4">
            <FaCheck className="text-[#9D79EC]" /> Advance
          </span>
          <span className="mt-6 flex flex-row items-center text-xl gap-2 border-b-2 border-[#9D79EC] border-opacity-60 pb-4">
            <FaCheck className="text-[#9D79EC]" /> 500
          </span>
          <span className="mt-6 flex flex-row items-center text-xl gap-2 border-b-2 border-[#9D79EC] border-opacity-60 pb-4">
            <FaCheck className="text-[#9D79EC]" /> Dedicated
          </span>
          <span className="mt-6 flex flex-row items-center text-xl gap-2 border-b-2 border-[#9D79EC] border-opacity-60 pb-4">
            <FaCheck className="text-[#9D79EC]" /> Full
          </span>
        </Card>
      </div>
    </div>
  );
};

export default Subscriptions;
