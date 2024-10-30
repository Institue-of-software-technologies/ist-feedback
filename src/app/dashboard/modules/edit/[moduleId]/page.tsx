"use client";

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import api from '../../../../../../lib/axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Form from '@/components/Forms';
import { Module } from '@/db/models/Module';
import { Course } from '@/types';

interface FormData {
  moduleName: string;
  courseId: string;
}

const EditModule = () => {
  const router = useRouter();
  const { moduleId } = useParams(); // Get the `moduleId` from the URL
  const [module, setModule] = useState<Module | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch module data on mount
  useEffect(() => {
    if (moduleId) {
      const fetchModule = async () => {
        try {
          const response = await api.get(`/modules/${moduleId}`);
          setModule(response.data.courseModule);
        } catch (err) {
          setError('Failed to fetch module');
        } finally {
          setLoading(false);
        }
      };
      fetchModule();

      const fetchCourses = async () => {
        try {
          const response = await api.get(`/courses`);
          setCourses(response.data.course);
        } catch (err) {
          setError('Failed to fetch courses');
        } finally {
          setLoading(false);
        }
      };
      fetchCourses();
    }
  }, [moduleId]);

  // Handle form submission
  const handleSubmit = async (data: FormData) => {
    try {
      await api.put(`/modules/${moduleId}`, data);
      toast.success('Module updated successfully!', {
        position: "top-right",
        autoClose: 2000, // Automatically close the toast after 2 seconds
      });

      // Delay the redirect to allow the toast to display
      setTimeout(() => {
        router.push('/dashboard/modules'); // Redirect to the module list
      }, 2000);
    } catch (err) {
      toast.error('Failed to update module', {
        position: "top-right",
        autoClose: 3000, // Automatically close the toast after 3 seconds
      });
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  // Form inputs for editing module
  const inputs = [
    { label: "moduleName", type: "text", value: module?.moduleName },
    {
      label: "course",
      type: "select", 
      value: module?.course?.courseName, // Set the default courseId here
      options: courses.map((course) => ({
        label: course.courseName,
        value: course.id
      }))
    },
  ];

  return (
    <div className="p-6">
      <ToastContainer /> {/* Add the ToastContainer to render toast notifications */}
      <h3 className="text-2xl font-bold mb-4">Edit Module</h3>
      <Form<FormData>
        Input={inputs}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default EditModule;

