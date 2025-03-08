import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { FiMeh } from 'react-icons/fi';
import React, { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';

interface VerifiedDocument {
  document_id: string;
  student_id: string;
  ipfs_hash: string;
  url: string;
  verifier_id: string;
  document_name: string;
  createdAt: string;
  updatedAt: string;
  status: string;
  metadata: string;
}

const getRecentlyVerified = async (
  verifier_id: string
): Promise<VerifiedDocument | null> => {
  try {
    if (!verifier_id) {
      throw new Error('Verifier ID is required');
    }

    const response = await fetch(
      `/api/verifier/get-all-verified-documents?verifierId=${verifier_id}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': 'DADDY-IS-HOME',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    const data = await response.json();

    if (!Array.isArray(data)) {
      throw new Error('Invalid response format');
    }

    // Sort by createdAt and get the most recent
    const sortedData = data.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return sortedData[0] || null;
  } catch (error) {
    console.error('Failed to fetch verified documents:', error);
    return null;
  }
};

const RecentlyVerified = () => {
  const [verified, setVerified] = useState<VerifiedDocument | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useUser();

  useEffect(() => {
    const fetchVerified = async () => {
      if (!user?.id) return;

      try {
        setLoading(true);
        const lastVerified = await getRecentlyVerified(user.id);
        setVerified(lastVerified);
      } catch (error) {
        console.error('Error fetching verified documents:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVerified();
  }, [user?.id]);

  if (loading) {
    return (
      <div>
        <Card className="bg-[#EFEEFC] text-black rounded-xl p-6 pb-2">
          <CardTitle className="font-Rubik text-2xl font-semibold leading-9">
            Recent Verified
          </CardTitle>
          <CardContent>
            <div className="flex flex-row justify-center mb-0 mt-2 items-center gap-4 text-[#660012] w-full">
              <div className="flex flex-row p-4 bg-[#FFD6DD] rounded-lg w-full animate-pulse">
                Loading...
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <Card className="bg-[#EFEEFC] text-black rounded-xl p-6 pb-2">
        <CardTitle className="font-Rubik text-2xl font-semibold leading-9">
          Recent Verified
        </CardTitle>
        <CardContent>
          <div className="flex flex-row justify-center mb-0 mt-2 items-center gap-4 text-[#660012] w-full">
            {verified ? (
              <div>
                <div className="flex flex-row p-2 bg-[#FFD6DD] rounded-lg justify-center items-center w-full text-center">
                  <div className="border-r-2 border-solid border-white pr-2">
                    <div className="font-bold">Document</div>
                    <div>{verified.document_name}</div>
                  </div>
                  <div className="border-r-2 border-solid border-white pr-2 pl-2">
                    <div className="font-bold">Student</div>
                    <div>{verified.student_id}</div>
                  </div>
                  <div>
                    <div className="font-bold pl-2">Status</div>
                    <div>{verified.status}</div>
                  </div>
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

export default RecentlyVerified;
