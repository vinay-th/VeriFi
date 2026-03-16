'use client';
import React from 'react';
import { GoHome, GoShareAndroid } from 'react-icons/go';
import { IoDocumentOutline } from 'react-icons/io5';
import { VscGitPullRequestGoToChanges } from 'react-icons/vsc';
import PendingVerifications from '../components/student/PendingVerifications';
import Developers from '../components/Developers';
import VerifierNavbar from '../components/verifier/VerifierNavbar';
import VerifierSidebar from '../components/verifier/VerifierSidebar';
import VeriFiUploadCard from '../components/student/VerifiUploadCard';
import RecentlyVerified from '../components/verifier/RecentlyVerified';
import VerifiedDocuments from '../components/verifier/VerifiedDocuments';
import { DocumentProvider } from '@/contexts/DocumentContext';
import { useUser } from '@clerk/nextjs';

const Page = () => {
  const [selected, setSelected] = React.useState('Dashboard');
  const { user } = useUser();
  const verifierId = user?.id || '';

  const handleClick = (item: string) => {
    setSelected(item);
  };

  return (
    <div className="flex flex-1 h-screen w-screen bg-[#49465F]">
      {/* Sidebar */}
      <div className="bg-[#5A5473] w-fit">
        <VerifierSidebar>
          <div className="flex flex-col gap-6 p-4">
            {['Dashboard', 'Document', 'Shares', 'Requests'].map((item) => (
              <div
                key={item}
                className={`w-full h-12 rounded-lg cursor-pointer flex items-center p-3 transition-colors ${
                  selected === item ? 'bg-[rgb(173,166,234)] text-white shadow-md' : 'text-slate-200 hover:bg-[#686282]'
                }`}
                onClick={() => handleClick(item)}
              >
                {item === 'Dashboard' && <GoHome size={20} className="mr-3" />}
                {item === 'Document' && (
                  <IoDocumentOutline size={20} className="mr-3" />
                )}
                {item === 'Shares' && (
                  <GoShareAndroid size={20} className="mr-3" />
                )}
                {item === 'Requests' && (
                  <VscGitPullRequestGoToChanges size={20} className="mr-3" />
                )}
                <span className="font-medium">{item}</span>
              </div>
            ))}
          </div>
        </VerifierSidebar>
      </div>

      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-hidden relative">
        {/* Navbar */}
        <div className="h-16 bg-[#3D3A52] flex items-center shadow-md z-20">
          <VerifierNavbar />
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-8 text-white relative z-10 custom-dashboard-scroll">
          <DocumentProvider>
            
            {/* Top Grid Area (Original Verifier Tasks) */}
            <div className="flex flex-row gap-8 mb-8 flex-wrap lg:flex-nowrap">
              <div className="w-full lg:w-[325px] shrink-0 drop-shadow-xl transition-transform hover:-translate-y-1 duration-300">
                <VeriFiUploadCard />
              </div>
              
              <div className="flex flex-col gap-8 flex-1 min-w-[300px]">
                <div className="drop-shadow-xl transition-all hover:-translate-y-1 duration-300 hover:shadow-indigo-500/10">
                  <RecentlyVerified verifierId={verifierId} />
                </div>
                <div className="drop-shadow-xl transition-all hover:-translate-y-1 duration-300 hover:shadow-indigo-500/10">
                  <PendingVerifications accessId={1} />
                </div>
              </div>
              
              <div className="w-full xl:w-[450px] shrink-0 drop-shadow-xl transition-all hover:-translate-y-1 duration-300">
                <VerifiedDocuments verifierId={verifierId} />
              </div>
            </div>

          </DocumentProvider>
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        .custom-dashboard-scroll::-webkit-scrollbar {
          width: 8px;
        }
        .custom-dashboard-scroll::-webkit-scrollbar-track {
          background: rgba(40, 36, 61, 0.5);
        }
        .custom-dashboard-scroll::-webkit-scrollbar-thumb {
          background-color: rgba(90, 84, 115, 0.8);
          border-radius: 10px;
        }
        .custom-dashboard-scroll:hover::-webkit-scrollbar-thumb {
          background-color: rgba(173, 166, 234, 0.8);
        }
      `}} />
    </div>
  );
};

export default Page;
