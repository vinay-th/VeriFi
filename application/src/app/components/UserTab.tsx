'use client';
import { UserButton, useUser } from '@clerk/nextjs';
import React, { useState, useEffect } from 'react';
import { RiVerifiedBadgeFill } from 'react-icons/ri';

const UserTab = () => {
  const { user, isLoaded } = useUser();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Don't render anything until the component is mounted and Clerk is loaded
  if (!mounted || !isLoaded) {
    return (
      <div className="flex items-center gap-3 pr-4 rounded-lg">
        <div className="absolute left-[80rem] transform -translate-x-1/2">
          <div className="w-12 h-12 rounded-full bg-[#A379F7] animate-pulse" />
        </div>
        <span className="text-2xl flex flex-row justify-center items-center gap-2 leading-9 text-nowrap">
          <div className="h-8 w-32 bg-gray-200 animate-pulse rounded" />
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 pr-4 rounded-lg">
      <div className="absolute left-[80rem] transform -translate-x-1/2">
        <UserButton
          appearance={{
            elements: {
              userButtonBox: 'flex flex-row items-center gap-2',
              userButtonAvatarBox: 'w-12 h-12 rounded-full bg-[#A379F7]',
            },
            layout: {
              logoPlacement: 'outside',
            },
          }}
        />
      </div>
      <span className="text-2xl flex flex-row justify-center items-center gap-2 leading-9 text-nowrap">
        {user?.fullName}
        {user?.publicMetadata.role === 'verifier' && (
          <RiVerifiedBadgeFill className="text-cyan-600" />
        )}
      </span>
    </div>
  );
};

export default UserTab;
