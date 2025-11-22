'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { addDays } from 'date-fns'; // date-fns에서 addDays 함수 임포트

const formSchema = z.object({
  title: z.string().min(1, { message: 'Title is required.' }),
  description: z.string().min(1, { message: 'Description is required.' }),
  targetAmount: z.number().min(1, { message: 'Target amount must be at least 1.' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
  durationDays: z.number().min(1, { message: 'Duration must be at least 1 day.' }), // 기간 필드 추가
});

type FormData = z.infer<typeof formSchema>;

export default function CreateCampaignPage() {
  const router = useRouter();
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: FormData) => {
    const { title, description, targetAmount, password, durationDays } = data;

    const endDate = addDays(new Date(), durationDays); // 현재 날짜에 기간(일)을 더하여 종료 날짜 계산

    const { data: campaign, error } = await supabase
      .from('campaigns')
      .insert([{
        title, description, target_amount: targetAmount, password, current_amount: 0, end_date: endDate.toISOString()
      }]);

    if (error) {
      console.error('Error creating campaign:', error);
      alert('Error creating campaign: ' + error.message);
    } else {
      console.log('Campaign created:', campaign);
      alert('Campaign Created Successfully!');
      router.push('/home'); // Redirect to home page after creation
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-24 bg-gray-50">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">Create New Campaign</h1>
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
            <label htmlFor="durationDays" className="block text-sm font-medium text-gray-700">Funding Duration (Days)</label>
            <input
              type="number"
              id="durationDays"
              {...register('durationDays', { valueAsNumber: true })}
              min={1}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
            {errors.durationDays && <p className="mt-1 text-sm text-red-600">{errors.durationDays.message}</p>}
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
            Create Campaign
          </button>
        </form>
      </div>
    </main>
  );
}
