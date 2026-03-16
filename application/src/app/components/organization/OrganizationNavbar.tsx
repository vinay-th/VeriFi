'use client';

import React from 'react';
import Greeting from '../Greetings';
import UserTab from '../UserTab';

const OrganizationNavbar = () => {
  return (
    <div className="flex flex-row w-screen h-24 bg-[#3D3A52] justify-between items-center py-6 px-10 font-Rubik text-3xl text-white font-bold leading-[3rem]">
      <div>Organization Dashboard</div>
      <div className="w-fit h-12">
        <Greeting />
        <UserTab className="mr-10"/>
      </div>
    </div>
  );
};

export default OrganizationNavbar;
