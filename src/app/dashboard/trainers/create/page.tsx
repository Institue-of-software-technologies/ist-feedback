'use client';

import React, { useEffect, useState } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import Form from '@/components/Forms';
import api from '../../../../../lib/axios';
import { ToastContainer } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { Course } from '@/types';
import { showToast } from '@/components/ToastMessage';

interface FormData {
  trainerName: string;
  courseName: string;
}

const NewTrainerForm: React.FC = () => {
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [formLoading, setFormLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await api.get(`/courses`);
        setCourses(response.data.course);
        setLoading(false);
      } catch (err) {
        console.log(err);
      }
    };
    fetchCourses();
  }, []);

  const onSubmit = async (data: FormData) => {
    setFormLoading(true);
    try {
      await api.post('/trainers', data);
      showToast.success('Trainer created successfully!');

      setTimeout(() => {
        router.push('/dashboard/trainers');
      }, 2000);
    } catch (error) {
      console.error('Failed to create trainer', error);
      showToast.error('Failed to create trainer');
    }
    finally {
      setFormLoading(false);
    }
  };

  const inputs = [
    { label: 'trainerName', type: 'text' },
    { label: 'email', type: 'text' },
    {
      label: 'course',
      type: 'select',
      options: courses.map((course) => ({
        label: course.courseName,
        value: course.id,
      })),
    },
  ];
  const extraButtons = [
    {
      label: 'Back',
      type: 'button',
      onClick: () => router.push('/dashboard/trainers'),
    }
  ];
  

  if (loading) return <div>Loading...</div>
  return (
    <div className='max-w-md mx-auto bg-white p-6 rounded-lg shadow'>
      <ToastContainer />
      <h2 className='text-2xl font-bold mb-4'>Create New Trainer</h2>
      <Form<FormData> Input={inputs} onSubmit={onSubmit} loading={formLoading} addButton={extraButtons}/>
    </div>
  );
};

export default NewTrainerForm;
