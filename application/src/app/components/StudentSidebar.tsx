'use client';
import Image from 'next/image';
import React from 'react';
import Logo from '@/../public/Logo.png';
import { GoHome, GoShareAndroid } from 'react-icons/go';
import { IoDocumentOutline, IoSettingsOutline } from 'react-icons/io5';
import { VscGitPullRequestGoToChanges } from 'react-icons/vsc';
import Link from 'next/link';

const StudentSidebar = () => {
  const [selected, setSelected] = React.useState('Dashboard');

  const handleClick = (item: string) => {
    setSelected(item);
  };

  return (
    <div className="overflow-hidden flex flex-col justify-center items-center h-screen bg-[rgb(104,93,201)] w-[13.5rem] py-9 px-6 sticky top-0">
      <div className="">
        <div className="absolute rounded-full w-60 h-60 bg-[rgb(173,166,234)] opacity-5 top-[-100px] left-[-100px]"></div>
        <div className="absolute rounded-full w-48 h-48 bg-[rgb(133,125,206)] top-[-100px] left-[-100px]"></div>
        <div className="absolute rounded-full w-60 h-60 bg-[rgb(173,166,234)] opacity-5 top-[600px] left-[100px]"></div>
        <div className="absolute rounded-full w-48 h-48 bg-[rgb(133,125,206)] top-[650px] left-[150px]"></div>
      </div>
      <div className="logo relative pb-10 flex flex-col justify-center items-center">
        <Image src={Logo} alt="logo" width={64} height={64} />
        <span className="text-white my-6 text-3xl font-bold Roboto">
          VeriFi
        </span>
      </div>
      <div className="col-1 flex flex-col">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-4">
            {selected === 'Dashboard' ? (
              <div
                className="w-40 h-12 bg-[rgb(173,166,234)] rounded-lg cursor-pointer p-3 flex flex-row"
                onClick={() => handleClick('Dashboard')}
              >
                <GoHome className="mt-[0.1rem] mr-[0.1rem]" size={20} />
                Dashboard
              </div>
            ) : (
              <div
                className="w-40 h-12 rounded-lg cursor-pointer p-3 flex flex-row"
                onClick={() => handleClick('Dashboard')}
              >
                <GoHome className="mt-[0.1rem] mr-[0.1rem]" size={20} />
                Dashboard
              </div>
            )}
            {selected === 'Document' ? (
              <div
                className="w-40 h-12 bg-[rgb(173,166,234)] rounded-lg cursor-pointer p-3  flex flex-row"
                onClick={() => handleClick('Document')}
              >
                <IoDocumentOutline
                  className="mt-[0.1rem] mr-[0.1rem]"
                  size={20}
                />
                Document
              </div>
            ) : (
              <div
                className="w-40 h-12 rounded-lg cursor-pointer p-3  flex flex-row"
                onClick={() => handleClick('Document')}
              >
                <IoDocumentOutline
                  className="mt-[0.1rem] mr-[0.1rem]"
                  size={20}
                />
                Document
              </div>
            )}
            {selected === 'Shares' ? (
              <div
                className="w-40 h-12 bg-[rgb(173,166,234)] rounded-lg cursor-pointer p-3  flex flex-row"
                onClick={() => handleClick('Shares')}
              >
                <GoShareAndroid className="mt-[0.1rem] mr-[0.1rem]" size={20} />
                Shares
              </div>
            ) : (
              <div
                className="w-40 h-12 rounded-lg cursor-pointer p-3  flex flex-row"
                onClick={() => handleClick('Shares')}
              >
                <GoShareAndroid className="mt-[0.1rem] mr-[0.1rem]" size={20} />
                Shares
              </div>
            )}
            {selected === 'Requests' ? (
              <div
                className="w-40 h-12 bg-[rgb(173,166,234)] rounded-lg cursor-pointer p-3  flex flex-row"
                onClick={() => handleClick('Requests')}
              >
                <VscGitPullRequestGoToChanges
                  className="mt-[0.1rem] mr-[0.1rem]"
                  size={20}
                />
                Requests
              </div>
            ) : (
              <div
                className="w-40 h-12 rounded-lg cursor-pointer p-3  flex flex-row"
                onClick={() => handleClick('Requests')}
              >
                <VscGitPullRequestGoToChanges
                  className="mt-[0.1rem] mr-[0.1rem]"
                  size={20}
                />
                Requests
              </div>
            )}
          </div>
        </div>
      </div>
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

export default StudentSidebar;
