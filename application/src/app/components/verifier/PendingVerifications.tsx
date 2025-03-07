import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { FiSmile } from 'react-icons/fi';
import React from 'react';

const PendingVerifications = ({
  verifications,
}: {
  verifications?: number;
}) => {
  return (
    <div>
      <Card className="bg-[#EFEEFC] text-black rounded-xl p-6 pb-2">
        <CardTitle className="font-Rubik text-2xl font-semibold leading-9 ">
          Pending Verifications
        </CardTitle>
        <CardContent>
          <div className="flex flex-row justify-center mb-0 mt-2 items-center gap-4 text-[#660012]">
            {verifications ? (
              <div>
                <div className="whitespace-nowrap justify-between p-4 bg-[#FF6681] rounded-lg w-full">
                  {verifications === 1
                    ? '1 verification pending'
                    : `${verifications} verifications pending`}
                </div>
              </div>
            ) : (
              <div className="flex flex-row justify-between p-4 bg-[#FFD6DD] rounded-lg w-52">
                No verifications <FiSmile size={30} />
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PendingVerifications;
