'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import api from '../../../../../../lib/axios'; 
import { Trainer } from '@/types'; 
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Form from '@/components/Forms';

interface FormData {
  trainerName: string;
  courseId: number;
}

const EditTrainer = () => {
  const router = useRouter();
  const { trainerId } = useParams(); // Get the `userId` from the URL
  const [trainer, setTrainer] = useState<Trainer | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch user data on mount
  useEffect(() => {
    if (trainerId) {
      const fetchUser = async () => {
        try {
          const response = await api.get(`/trainers/${trainerId}`);
          setTrainer(response.data.trainer);
        } catch (err) {
          setError('Failed to fetch trainer');
        } finally {
          setLoading(false);
        }
      };
      fetchUser();
    }
  }, [trainerId]);

  // Handle form submission
  const handleSubmit = async (data: FormData) => {
    console.log(data);
    try {
      await api.put(`/trainers/${trainerId}`, data);
      toast.success('Trainer updated successfully!', {
        position: 'top-right',
        autoClose: 2000, 
      });

      setTimeout(() => {
        router.push('/dashboard/trainers');
      }, 2000);
    } catch (err) {
      toast.error('Failed to update trainer', {
        position: 'top-right',
        autoClose: 3000, 
      });
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className='text-red-500'>{error}</div>;

  const inputs = [
    {
      label: 'Trainer Name',
      type: 'text',
      value: String(trainer?.trainerName),
    },
    {
      label: 'Course Id',
      type: 'number',
      value: String(trainer?.courseId),
    }
  ];

  return (
    <div className='p-6'>
      <ToastContainer />{' '}
      <h3 className='text-2xl font-bold mb-4'>Edit Trainer</h3>
      <Form<FormData>
        Input={inputs} onSubmit={handleSubmit} />
    </div>
  );
};

export default EditTrainer;
