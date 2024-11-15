"use client";

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import api from '../../../../../../lib/axios'; // Update path to your axios lib
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Form from '@/components/Forms';
import { ClassTime } from '@/types';
import { showToast } from '@/components/ToastMessage';

interface FormData {
  classTimes: string;
}

const EditClassTime = () => {
  const router = useRouter();
  const { classTimesId } = useParams(); // Get the `userId` from the URL
  const [classTimes, setClassTimes] = useState<ClassTime | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch user data on mount
  useEffect(() => {
    if (classTimesId) {
      const fetchUser = async () => {
        try {
          const response = await api.get(`/class-times/${classTimesId}`);
          console.log(response)
          setClassTimes(response.data.classTimes);
        } catch (err) {
          console.log(err);
          setError('Failed to fetch class Times');
        } finally {
          setLoading(false);
        }
      };
      fetchUser();
    }
  }, [classTimesId]);

  // Handle form submission
  const handleSubmit = async (data: FormData) => {
    console.log(data)
    try {
      await api.put(`/class-times/${classTimesId}`, data);
      showToast.success('Class Time updated successfully!');

      // Delay the redirect to allow the toast to display
      setTimeout(() => {
        router.push('/dashboard/class-times'); // Redirect to the Class Times list
      }, 2000);
    } catch (err) {
      console.log(err);
      showToast.error('Failed to update Class Times');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  const inputs = [
    { label: "classTime", type: "text", value: classTimes?.classTime },
    { label: "classTimeStart", type: "time", value: classTimes?.classTimeStart },
    { label: "classTimeEnd", type: "time", value: classTimes?.classTimeEnd }
  ];

  return (
    <div className="p-6">
      <ToastContainer /> {/* Add the ToastContainer to render toast notifications */}

      <h3 className="text-2xl font-bold mb-4">Edit Class Time</h3>
      <Form<FormData>
        Input={inputs}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default EditClassTime;
