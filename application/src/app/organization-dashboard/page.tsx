'use client';
import React from 'react';
import { GoHome } from 'react-icons/go';
import { IoDocumentOutline } from 'react-icons/io5';
import { VscGitPullRequestGoToChanges } from 'react-icons/vsc';
import OrganizationNavbar from '../components/organization/OrganizationNavbar';
import OrganizationSidebar from '../components/organization/OrganizationSidebar';
import RequestAccess from '../components/organization/RequestAccess';
import ActiveRequests from '../components/organization/ActiveRequests';
import DocumentViewer from '../components/organization/DocumentViewer';
import { useUser } from '@clerk/nextjs';

export default function OrganizationDashboard() {
  const [selected, setSelected] = React.useState('Dashboard');
  const { user } = useUser();

  if (!user) {
    return null;
  }

  const handleClick = (item: string) => {
    setSelected(item);
  };

  return (
    <div className="flex flex-1 h-screen w-screen bg-[#49465F] ">
      {/* Sidebar */}
      <div className="bg-[#5A5473] w-fit">
        <OrganizationSidebar>
          <div className="flex flex-col gap-6 p-4">
            {['Dashboard', 'Vault', 'Requests'].map((item) => (
              <div
                key={item}
                className={`w-full h-12 rounded-lg cursor-pointer flex items-center p-3 text-white transition-colors ${
                  selected === item ? 'bg-[rgb(173,166,234)] shadow-md' : 'hover:bg-[#686282]'
                }`}
                onClick={() => handleClick(item)}
              >
                {item === 'Dashboard' && <GoHome size={20} className="mr-3" />}
                {item === 'Vault' && (
                  <IoDocumentOutline size={20} className="mr-3" />
                )}
                {item === 'Requests' && (
                  <VscGitPullRequestGoToChanges size={20} className="mr-3" />
                )}
                <span className="font-medium">{item}</span>
              </div>
            ))}
          </div>
        </OrganizationSidebar>
      </div>

      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-hidden relative">
        {/* Navbar */}
        <div className="h-16 bg-[#3D3A52] flex items-center shadow-md">
          <OrganizationNavbar />
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-10 text-white relative z-10 custom-dashboard-scroll">
          <div className="flex flex-col xl:flex-row gap-8 pb-10">
            {/* Left Column */}
            <div className="flex flex-col md:flex-row xl:flex-col gap-8 w-full xl:w-[450px] shrink-0">
              <div className="w-full">
                <RequestAccess />
              </div>
              <div className="w-full h-[500px]">
                <ActiveRequests />
              </div>
            </div>
            
            {/* Right Column */}
            <div className="flex-1 min-w-[300px] h-[800px]">
              <DocumentViewer />
            </div>
          </div>
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
}
