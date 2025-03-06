'use client';
import Image from 'next/image';
import React from 'react';
import Logo from '@/../public/Logo.png';
import { IoSettingsOutline } from 'react-icons/io5';
import Link from 'next/link';

const VerifierSidebar = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="overflow-hidden flex flex-col justify-center items-center h-screen bg-[rgb(104,93,201)] w-[13.5rem] py-9 px-6 sticky top-0 select-none">
      <div className="">
        <div className="absolute rounded-full w-60 h-60 bg-[rgb(173,166,234)] opacity-5 top-[-100px] left-[-100px]"></div>
        <div className="absolute rounded-full w-48 h-48 bg-[rgb(133,125,206)] top-[-100px] left-[-100px]"></div>
        <div className="absolute rounded-full w-60 h-60 bg-[rgb(173,166,234)] opacity-5 top-[600px] left-[100px]"></div>
        <div className="absolute rounded-full w-48 h-48 bg-[rgb(133,125,206)] top-[650px] left-[150px]"></div>
      </div>
      <div className="logo absolute cursor-pointer top-5 pb-10 flex flex-col justify-center items-center">
        <Link
          href={`/`}
          className="relative flex flex-col justify-center items-center"
        >
          <Image src={Logo} alt="logo" width={64} height={64} />
          <span className="text-white my-4 text-3xl font-bold Roboto">
            VeriFi
          </span>
        </Link>
      </div>
      <div className="">{children}</div>
      <div className="my-10 border border-solid border-white w-10/12 opacity-25 bg-gradient-to-r from-[rgba(255,255,255,1)] to-[rgba(255,255,255,0)]"></div>
      <Link
        className="w-40 h-12 rounded-lg cursor-pointer p-3 hover:bg-[rgb(173,166,234)] flex flex-row"
        href="/"
      >
        <IoSettingsOutline className="mt-[0.1rem] mr-[0.1rem] " size={20} />
        Settings
      </Link>
    </div>
  );
};

export default VerifierSidebar;
