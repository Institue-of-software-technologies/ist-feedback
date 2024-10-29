"use client";

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import api from '../../../../../../lib/axios'; // Update path to your axios lib
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Form from '@/components/Forms';
import { Course } from '@/types';
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
      const fetchUser = async () => {
        try {
          const response = await api.get(`/courses/${courseId}`);
          setCourse(response.data.course);
        } catch (err) {
          setError('Failed to fetch course');
        } finally {
          setLoading(false);
        }
      };
      fetchUser();
    }
  }, [courseId]);

  // Handle form submission
  const handleSubmit = async (data: FormData) => {
    console.log(data)
    try {
      await api.put(`/courses/${courseId}`, data);
      toast.success('courses updated successfully!', {
        position: "top-right",
        autoClose: 2000, // Automatically close the toast after 2 seconds
      });
      
      // Delay the redirect to allow the toast to display
      setTimeout(() => {
        router.push('/dashboard/courses'); // Redirect to the user list
      }, 2000);
    } catch (err) {
      toast.error('Failed to update user', {
        position: "top-right",
        autoClose: 3000, // Automatically close the toast after 3 seconds
      });
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  const inputs= [
    { label: "courseName", type: "text",value: course?.courseName}
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
