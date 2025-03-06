import { currentUser } from '@clerk/nextjs/server';
import { Loader2 } from 'lucide-react';
import { redirect } from 'next/navigation';
import React from 'react';

const Page = async () => {
  const user = await currentUser();

  if (!user) {
    redirect('/sign-up');
  }

  const role = user?.publicMetadata.role;

  console.log(role);

  if (role === 'admin') {
    redirect('/admin');
  } else if (role === 'student') {
    redirect('/student-dashboard');
  } else if (role === 'verifier') {
    redirect('/verifier-dashboard');
  } else if (role === 'organization') {
    redirect('/organization-dashboard');
  }

  return (
    <div className="flex justify-center items-center h-screen">
      <Loader2 size={64} className="animate-spin" />
    </div>
  );
};

export default Page;
