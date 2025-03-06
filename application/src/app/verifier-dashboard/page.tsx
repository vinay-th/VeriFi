'use client';
import React from 'react';
import { GoHome, GoShareAndroid } from 'react-icons/go';
import { IoDocumentOutline } from 'react-icons/io5';
import { VscGitPullRequestGoToChanges } from 'react-icons/vsc';
import { PieChartComponent } from '@/components/ui/pie-chart';
import RecentRequests from '../components/student/RecentRequests';
import PendingVerifications from '../components/student/PendingVerifications';
import DocumentsShared from '../components/student/DocumentsShared';
import Avatar from '@/../public/svgs/avatar.svg';
import DocumentsTable from '../components/student/DocumentsTable';
import Developers from '../components/Developers';
import VerifierNavbar from '../components/verifier/VerifierNavbar';
import VerifierSidebar from '../components/verifier/VerifierSidebar';

const Page = () => {
  const [selected, setSelected] = React.useState('Dashboard');

  const handleClick = (item: string) => {
    setSelected(item);
  };

  return (
    <div className="flex flex-1 h-screen w-screen bg-[#49465F] ">
      {/* Sidebar */}
      <div className="bg-[#5A5473] w-fit">
        <VerifierSidebar>
          <div className="flex flex-col gap-6 p-4">
            {['Dashboard', 'Document', 'Shares', 'Requests'].map((item) => (
              <div
                key={item}
                className={`w-full h-12 rounded-lg cursor-pointer flex items-center p-3 ${
                  selected === item ? 'bg-[rgb(173,166,234)]' : ''
                }`}
                onClick={() => handleClick(item)}
              >
                {item === 'Dashboard' && <GoHome size={20} className="mr-2" />}
                {item === 'Document' && (
                  <IoDocumentOutline size={20} className="mr-2" />
                )}
                {item === 'Shares' && (
                  <GoShareAndroid size={20} className="mr-2" />
                )}
                {item === 'Requests' && (
                  <VscGitPullRequestGoToChanges size={20} className="mr-2" />
                )}
                {item}
              </div>
            ))}
          </div>
        </VerifierSidebar>
      </div>

      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Navbar */}
        <div className="h-16 bg-[#3D3A52] flex items-center shadow-md">
          <VerifierNavbar />
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-x-hidden p-10 text-white">
          <div className="flex flex-row gap-10">
            <PieChartComponent
              height={412}
              width={325}
              title="Current Documents"
              data={[
                { label: 'Marksheet', value: 20, fill: 'hsl(var(--chart-1))' },
                { label: 'Tests', value: 30, fill: 'hsl(var(--chart-2))' },
                {
                  label: 'Certificates',
                  value: 10,
                  fill: 'hsl(var(--chart-3))',
                },
              ]}
            />
            <div className="flex flex-col gap-10">
              <RecentRequests />
              <PendingVerifications verifications={1} />
            </div>
            <div>
              <DocumentsShared data={{ top: 5, second: 4, third: 1 }} />
            </div>
          </div>
          <div className="relative flex flex-row gap-10 mt-6">
            <DocumentsTable height={500} width={750} />
            <div
              className="absolute w-56 h-56 bottom-3 right-64 rounded-full"
              style={{
                backgroundImage: `url(${Avatar.src})`,
                backgroundSize: 'cover',
              }}
            ></div>
            <Developers height={254} width={450} />
            <div
              className="absolute w-56 h-56 bottom-3 right-64 rounded-full"
              style={{
                backgroundImage: `url(${Avatar.src})`,
                backgroundSize: 'cover',
              }}
            ></div>
            <div className="absolute w-64 h-36 bottom-10 -right-16 rounded-lg bg-[#EFEEFC] items-center justify-center flex flex-col p-4 text-center">
              <h2 className="font-Rubik text-black text-4xl font-bold tracking-wide">
                How you doing??
              </h2>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
