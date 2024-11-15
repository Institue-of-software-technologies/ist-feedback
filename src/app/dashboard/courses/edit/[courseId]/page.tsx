"use client";

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import api from '../../../../../../lib/axios'; // Update path to your axios lib
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Form from '@/components/Forms';
import { Course } from '@/types';
import { showToast } from '@/components/ToastMessage';
interface FormData {
  permissionName: string;
}

const EditCourse = () => {
  const router = useRouter();
  const { courseId } = useParams(); // Get the `userId` from the URL
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch user data on mount
  useEffect(() => {
    if (courseId) {
      const fetchCourse = async () => {
        try {
          const response = await api.get(`/courses/${courseId}`);
          setCourse(response.data.course);
        } catch (err) {
          console.log(err)
          setError('Failed to fetch course');
        } finally {
          setLoading(false);
        }
      };
      fetchCourse();
    }
  }, [courseId]);

  // Handle form submission
  const handleSubmit = async (data: FormData) => {
    try {
      await api.put(`/courses/${courseId}`, data);
      showToast.success('course updated successfully!');

      // Delay the redirect to allow the toast to display
      setTimeout(() => {
        router.push('/dashboard/courses');
      }, 2000);
    } catch (err) {
      console.log(err)
      showToast.error('Failed to update course',);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  const inputs = [
    { label: "courseName", type: "text", value: course?.courseName }
  ];

  return (
    <div className="p-6">
      <ToastContainer /> {/* Add the ToastContainer to render toast notifications */}

      <h3 className="text-2xl font-bold mb-4">Edit Course</h3>
      <Form<FormData>
        Input={inputs}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default EditCourse;
