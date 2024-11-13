"use client";

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import api from '../../../../../../lib/axios'; // Update path to your axios lib
import { Permission } from '@/types'; // Update path to your User type
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Form from '@/components/Forms';

interface FormData {
  permissionName: string;
}

const EditPermission = () => {
  const router = useRouter();
  const { permissionId } = useParams(); // Get the `userId` from the URL
  const [permission, setPermission] = useState<Permission | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch user data on mount
  useEffect(() => {
    if (permissionId) {
      const fetchUser = async () => {
        try {
          const response = await api.get(`/permissions/${permissionId}`);
          setPermission(response.data.permission);
        } catch (err) {
          console.log(err)
          setError('Failed to fetch user');
        } finally {
          setLoading(false);
        }
      };
      fetchUser();
    }
  }, [permissionId]);

  // Handle form submission
  const handleSubmit = async (data: FormData) => {
    try {
      await api.put(`/permissions/${permissionId}`, data);
      toast.success('permissions updated successfully!', {
        position: "top-right",
        autoClose: 2000, // Automatically close the toast after 2 seconds
      });
      
      // Delay the redirect to allow the toast to display
      setTimeout(() => {
        router.push('/dashboard/permissions'); // Redirect to the user list
      }, 2000);
    } catch (err) {
      console.log(err)
      toast.error('Failed to update user', {
        position: "top-right",
        autoClose: 3000, // Automatically close the toast after 3 seconds
      });
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  const inputs= [
    { label: "permissionName", type: "text",value: permission?.permissionName}
  ];

  return (
    <div className="p-6">
      <ToastContainer /> {/* Add the ToastContainer to render toast notifications */}

      <h3 className="text-2xl font-bold mb-4">Edit User</h3>
          <Form<FormData>
              Input={inputs} 
              onSubmit={handleSubmit} 
          />
    </div>
  );
};

export default EditPermission;
