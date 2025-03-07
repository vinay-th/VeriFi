import React from 'react';
import Greeting from '../Greetings';
import UserTab from '../UserTab';
import { ClerkProvider } from '@clerk/nextjs';

const VerifierNavbar = () => {
  return (
    <div className="flex flex-row w-screen h-24 bg-[#4b495e] justify-between items-center py-6 px-10 font-Rubik text-3xl text-white font-bold leading-[3rem]">
      <div>Verifier Dashboard</div>
      <ClerkProvider>
        <div className="w-fit h-12">
          <Greeting />
          <UserTab />
        </div>
      </ClerkProvider>
    </div>
  );
};

export default VerifierNavbar;
