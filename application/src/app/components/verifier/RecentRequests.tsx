import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { FiMeh } from 'react-icons/fi';
import React from 'react';

const RecentRequests = ({ request }: { request?: string }) => {
  return (
    <div>
      <Card className="bg-[#EFEEFC] text-black rounded-xl p-6 pb-2">
        <CardTitle className="font-Rubik text-2xl font-semibold leading-9 ">
          Recent Requests
        </CardTitle>
        <CardContent>
          <div className="flex flex-row justify-center mb-0 mt-2 items-center gap-4 text-[#660012]">
            {request ? (
              <div>
                <div className="flex flex-row justify-between p-4 bg-[#FFD6DD] rounded-lg w-4/5">
                  {request}
                </div>
              </div>
            ) : (
              <div className="flex flex-row justify-between p-4 bg-[#FFD6DD] rounded-lg w-52">
                No requests found <FiMeh size={30} />
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RecentRequests;
