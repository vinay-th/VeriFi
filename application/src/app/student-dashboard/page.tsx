'use client';
import React from 'react';
import StudentNavbar from '@/app/components/student/StudentNavbar';
import StudentSidebar from '../components/student/StudentSidebar';
import { GoHome, GoShareAndroid } from 'react-icons/go';
import { IoDocumentOutline } from 'react-icons/io5';
import { VscGitPullRequestGoToChanges } from 'react-icons/vsc';
import ContextProvider from '../components/student/ContextProvider';
import DocumentList from '../components/student/DocumentList';
import PendingRequests from '../components/student/PendingRequests';
import { DocumentProvider } from '@/contexts/DocumentContext';

const Page = () => {
  const [selected, setSelected] = React.useState('Dashboard');

  const handleClick = (item: string) => {
    setSelected(item);
  };

  const renderContent = () => {
    switch (selected) {
      case 'Document':
        return (
          <div className="flex-1 overflow-x-hidden p-10">
            <DocumentList />
          </div>
        );
      case 'Requests':
        return (
          <div className="flex-1 overflow-x-hidden p-10">
            <PendingRequests />
          </div>
        );
      default:
        return <ContextProvider />;
    }
  };

  return (
    <DocumentProvider>
      <div className="flex flex-1 h-screen w-screen bg-[#49465F] ">
        {/* Sidebar */}
        <div className="bg-[#5A5473] w-fit">
          <StudentSidebar>
            <div className="flex flex-col gap-6 p-4">
              {['Dashboard', 'Document', 'Shares', 'Requests'].map((item) => (
                <div
                  key={item}
                  className={`w-full h-12 rounded-lg cursor-pointer flex items-center p-3 ${
                    selected === item ? 'bg-[rgb(173,166,234)]' : ''
                  }`}
                  onClick={() => handleClick(item)}
                >
                  {item === 'Dashboard' && (
                    <GoHome size={20} className="mr-2" />
                  )}
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
          </StudentSidebar>
        </div>

        {/* Main Content */}
        <div className="flex flex-col flex-1 overflow-hidden">
          {/* Navbar */}
          <div className="h-16 bg-[#3D3A52] flex items-center shadow-md">
            <StudentNavbar />
          </div>

          {/* Content Area */}
          {renderContent()}
        </div>
      </div>
    </DocumentProvider>
  );
};

export default Page;
