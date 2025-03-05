'use client';
import React from 'react';
import StudentNavbar from '@/app/components/student/StudentNavbar';
import StudentSidebar from '../components/student/StudentSidebar';
import { GoHome, GoShareAndroid } from 'react-icons/go';
import { IoDocumentOutline } from 'react-icons/io5';
import { VscGitPullRequestGoToChanges } from 'react-icons/vsc';

const Page = () => {
  const [selected, setSelected] = React.useState('Dashboard');

  const handleClick = (item: string) => {
    setSelected(item);
  };

  return (
    <div className="flex bg-[#49465F]">
      <StudentSidebar>
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
                  <GoShareAndroid
                    className="mt-[0.1rem] mr-[0.1rem]"
                    size={20}
                  />
                  Shares
                </div>
              ) : (
                <div
                  className="w-40 h-12 rounded-lg cursor-pointer p-3  flex flex-row"
                  onClick={() => handleClick('Shares')}
                >
                  <GoShareAndroid
                    className="mt-[0.1rem] mr-[0.1rem]"
                    size={20}
                  />
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
      </StudentSidebar>
      <StudentNavbar />
    </div>
  );
};

export default Page;
