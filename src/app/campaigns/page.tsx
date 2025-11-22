'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';
import { formatDistanceToNowStrict, isPast, parseISO } from 'date-fns';

interface Campaign {
  id: string;
  title: string;
  description: string;
  target_amount: number;
  current_amount: number;
  end_date: string; // end_date 추가
}

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCampaigns = async () => {
      const { data, error } = await supabase
        .from('campaigns')
        .select('id, title, description, target_amount, current_amount, end_date');

      if (error) {
        console.error('Error fetching campaigns:', error);
        setError(error.message);
      } else {
        setCampaigns(data || []);
      }
      setLoading(false);
    };

    fetchCampaigns();
  }, []);

  if (loading) {
    return <p className="text-center text-lg mt-8">Loading campaigns...</p>;
  }

  if (error) {
    return <p className="text-center text-lg mt-8 text-red-600">Error: {error}</p>;
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-24 bg-gray-50">
      <h1 className="text-4xl font-bold text-center mb-10 text-gray-800">All Campaigns</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-5xl">
        {campaigns.length === 0 ? (
          <p className="col-span-full text-center text-xl text-gray-600">No campaigns found. Be the first to create one!</p>
        ) : (
          campaigns.map((campaign) => {
            const hasEnded = isPast(parseISO(campaign.end_date));
            const remainingTime = formatDistanceToNowStrict(parseISO(campaign.end_date), { addSuffix: true });
            return (
              <div key={campaign.id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                <h2 className="text-2xl font-semibold mb-2 text-gray-800">{campaign.title}</h2>
                <p className="text-gray-600 mb-4 line-clamp-3">{campaign.description}</p>
                <div className="text-gray-700 mb-4">
                  <p>Target: ${campaign.target_amount.toLocaleString()}</p>
                  <p>Current: ${campaign.current_amount.toLocaleString()}</p>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                    <div
                      className="bg-indigo-600 h-2.5 rounded-full"
                      style={{ width: `${Math.min(100, (campaign.current_amount / campaign.target_amount) * 100)}%` }}
                    ></div>
                  </div>
                  <p className="text-sm font-medium mt-1">
                    Progress: {((campaign.current_amount / campaign.target_amount) * 100).toFixed(2)}%
                  </p>
                </div>
                <p className={`text-sm font-medium ${hasEnded ? 'text-red-600' : 'text-green-600'}`}>
                  {hasEnded ? 'Funding Ended' : `Ends ${remainingTime}`}
                </p>
                <Link href={`/campaigns/${campaign.id}`} className="text-indigo-600 hover:text-indigo-800 font-medium mt-2 block">
                  View Details
                </Link>
              </div>
            );
          })
        )}
      </div>
    </main>
  );
}
