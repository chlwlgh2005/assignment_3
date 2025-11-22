'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { formatDistanceToNowStrict, isPast, parseISO } from 'date-fns';

interface Campaign {
  id: string;
  title: string;
  description: string;
  target_amount: number;
  current_amount: number;
  end_date: string;
}

export default function CampaignDetailsPage() {
  const { id } = useParams();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [contributionAmount, setContributionAmount] = useState<number>(0);

  useEffect(() => {
    if (!id) return;

    const fetchCampaign = async () => {
      const { data, error } = await supabase
        .from('campaigns')
        .select('id, title, description, target_amount, current_amount, end_date')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching campaign:', error);
        setError(error.message);
      } else {
        setCampaign(data);
      }
      setLoading(false);
    };

    fetchCampaign();
  }, [id]);

  const handleContribution = async () => {
    if (!campaign || contributionAmount <= 0) return;

    const newCurrentAmount = campaign.current_amount + contributionAmount;
    const { data, error } = await supabase
      .from('campaigns')
      .update({ current_amount: newCurrentAmount })
      .eq('id', campaign.id)
      .select('id, title, description, target_amount, current_amount, end_date')
      .single();

    if (error) {
      console.error('Error contributing to campaign:', error);
      alert('Error contributing: ' + error.message);
    } else {
      setCampaign(data);
      setContributionAmount(0);
      alert(`Successfully contributed $${contributionAmount.toLocaleString()}!`);
    }
  };

  if (loading) {
    return <p className="text-center text-lg mt-8">Loading campaign details...</p>;
  }

  if (error) {
    return <p className="text-center text-lg mt-8 text-red-600">Error: {error}</p>;
  }

  if (!campaign) {
    return <p className="text-center text-lg mt-8">Campaign not found.</p>;
  }

  const progress = Math.min(100, (campaign.current_amount / campaign.target_amount) * 100);
  const hasEnded = isPast(parseISO(campaign.end_date));
  const remainingTime = formatDistanceToNowStrict(parseISO(campaign.end_date), { addSuffix: true });

  return (
    <main className="flex min-h-screen flex-col items-center p-24 bg-gray-50">
      <div className="w-full max-w-2xl bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-4 text-gray-800">{campaign.title}</h1>
        <p className="text-gray-700 mb-6">{campaign.description}</p>

        <div className="mb-6">
          <p className="text-lg font-medium text-gray-800">Target Funding: ${campaign.target_amount.toLocaleString()}</p>
          <p className="text-lg font-medium text-gray-800">Current Funding: ${campaign.current_amount.toLocaleString()}</p>
          <div className="w-full bg-gray-200 rounded-full h-4 mt-2">
            <div
              className="bg-green-600 h-4 rounded-full text-xs flex items-center justify-center text-white"
              style={{ width: `${progress}%` }}
            >
              {progress.toFixed(2)}%
            </div>
          </div>
        </div>

        <p className={`text-lg font-medium mb-4 ${hasEnded ? 'text-red-600' : 'text-green-600'}`}>
          {hasEnded ? 'Funding Ended' : `Funding Ends ${remainingTime}`}
        </p>

        <div className="mt-6 p-4 border rounded-md bg-gray-50">
          <h2 className="text-xl font-semibold mb-3 text-gray-800">Contribute to this Campaign</h2>
          <input
            type="number"
            value={contributionAmount}
            onChange={(e) => setContributionAmount(parseFloat(e.target.value))}
            min="0"
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm mb-3"
            placeholder="Enter amount to contribute"
            disabled={hasEnded} // 기간이 종료되면 입력 비활성화
          />
          <button
            onClick={handleContribution}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            disabled={contributionAmount <= 0 || hasEnded} // 기간이 종료되거나 금액이 0이하면 버튼 비활성화
          >
            Contribute
          </button>
        </div>

        <div className="mt-6 text-center">
          <Link href={`/campaigns/${campaign.id}/edit`} className="text-indigo-600 hover:text-indigo-800 font-medium mr-4">
            Edit Campaign
          </Link>
          <Link href="/campaigns" className="text-gray-600 hover:text-gray-800 font-medium">
            Back to All Campaigns
          </Link>
        </div>
      </div>
    </main>
  );
}
