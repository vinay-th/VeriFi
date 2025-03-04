import React from 'react';
import StudentNavbar from '@/app/components/StudentNavbar';
import getRole from '@/lib/get-role';
import { redirect } from 'next/navigation';
import StudentSidebar from '../components/StudentSidebar';

const page = async () => {
  const role = await getRole();

  if (role !== 'student') {
    redirect('/get-started');
  }

  return (
    <div className="flex bg-[#49465F]">
      <StudentSidebar />
      <StudentNavbar />
    </div>
  );
};

export default page;
