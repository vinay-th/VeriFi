import { Button } from '@/components/ui/button';
import { Card, CardTitle } from '@/components/ui/card';
import { FaLaptopCode } from 'react-icons/fa';

import Link from 'next/link';
import React from 'react';

const Developers = ({ height, width }: { height: number; width: number }) => {
  return (
    <Card
      style={{ height, width }}
      className="bg-[#EFEEFC] text-black p-6 flex flex-col items-center justify-center"
    >
      <CardTitle className="font-Rubik text-2xl font-semibold leading-9 ">
        Meet your Developers
      </CardTitle>
      <div className="w-80 h-96 relative overflow-hidden rounded-lg mt-4 bg-[#9087E5] flex flex-col items-center justify-center text-center p-4">
        <div className="w-40 h-40 absolute top-16 -right-16 rounded-full mt-4 bg-white opacity-5"></div>
        <div
          className="w-52 h-52 absolute top-10 -right-20 rounded-full mt-4 border border-sky-100 opacity-5"
          style={{ borderWidth: 5 }}
        ></div>
        <div className="w-40 h-40 absolute -top-28 -left-16 rounded-full mt-4 bg-white opacity-5"></div>
        <div
          className="w-52 h-52 absolute -top-32 -left-20 rounded-full mt-4 border border-sky-100 opacity-5"
          style={{ borderWidth: 5 }}
        ></div>
        <h1 className="font-Rubik text-lg font-semibold text-white tracking-wide leading-6">
          FEATURED
        </h1>
        <span className="font-Rubik text-lg font-medium text-white tracking-wide leading-7">
          The rookie developers behind the scenes of VeriFi
        </span>
        <Link href={'/team'}>
          <Button className="flex bg-white items-center justify-center px-4 py-2 text-[#6A5AE0] font-Rubik font-semibold text-base mt-4 leading-6 rounded-xl hover:text-white whitespace-nowrap">
            <FaLaptopCode />
            Find Developers
          </Button>
        </Link>
      </div>
    </Card>
  );
};

export default Developers;
