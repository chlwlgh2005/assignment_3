'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';

const formSchema = z.object({
  title: z.string().min(1, { message: 'Title is required.' }),
  description: z.string().min(1, { message: 'Description is required.' }),
  targetAmount: z.number().min(1, { message: 'Target amount must be at least 1.' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
});

type FormData = z.infer<typeof formSchema>;

export default function EditCampaignPage() {
  const { id } = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    if (!id) return;

    const fetchCampaign = async () => {
      const { data, error } = await supabase
        .from('campaigns')
        .select('title, description, target_amount, password')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching campaign for edit:', error);
        setError(error.message);
      } else if (data) {
        reset({ ...data, targetAmount: data.target_amount });
      }
      setLoading(false);
    };

    fetchCampaign();
  }, [id, reset]);

  const onSubmit = async (data: FormData) => {
    if (!id) return;

    const { title, description, targetAmount, password } = data;

    // First, verify the password
    const { data: campaignData, error: fetchError } = await supabase
      .from('campaigns')
      .select('password')
      .eq('id', id)
      .single();

    if (fetchError || !campaignData || campaignData.password !== password) {
      alert('Incorrect password.');
      return;
    }

    const { data: updatedCampaign, error } = await supabase
      .from('campaigns')
      .update({ title, description, target_amount: targetAmount })
      .eq('id', id)
      .select('id')
      .single();

    if (error) {
      console.error('Error updating campaign:', error);
      alert('Error updating campaign: ' + error.message);
    } else {
      console.log('Campaign updated:', updatedCampaign);
      alert('Campaign Updated Successfully!');
      router.push(`/campaigns/${id}`);
    }
  };

  if (loading) {
    return <p className="text-center text-lg mt-8">Loading campaign for edit...</p>;
  }

  if (error) {
    return <p className="text-center text-lg mt-8 text-red-600">Error: {error}</p>;
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-24 bg-gray-50">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">Edit Campaign</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
            <input
              type="text"
              id="title"
              {...register('title')}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
            {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>}
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              id="description"
              {...register('description')}
              rows={4}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            ></textarea>
            {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>}
          </div>

          <div>
            <label htmlFor="targetAmount" className="block text-sm font-medium text-gray-700">Target Funding Amount</label>
            <input
              type="number"
              id="targetAmount"
              {...register('targetAmount', { valueAsNumber: true })}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
            {errors.targetAmount && <p className="mt-1 text-sm text-red-600">{errors.targetAmount.message}</p>}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password (for editing)</label>
            <input
              type="password"
              id="password"
              {...register('password')}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
            {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>}
          </div>

          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Update Campaign
          </button>
          <Link
            href={`/campaigns/${id}`}
            className="mt-4 w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            Cancel
          </Link>
        </form>
      </div>
    </main>
  );
}
