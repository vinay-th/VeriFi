'use client';

import { useUser } from '@clerk/nextjs';
import RequestAccess from '@/app/components/organization/RequestAccess';
import DocumentViewer from '@/app/components/organization/DocumentViewer';
import ActiveRequests from '@/app/components/organization/ActiveRequests';

export default function OrganizationDashboard() {
  const { user } = useUser();

  if (!user) {
    return null;
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#F5F5F5]">
      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Organization Dashboard
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Request Access Card */}
            <RequestAccess />

            {/* Document Viewer */}
            <DocumentViewer />

            {/* Active Requests */}
            <ActiveRequests />
          </div>
        </div>
      </main>
    </div>
  );
}
