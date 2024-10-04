"use client";

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import api from '../../../../../../lib/axios'; // Update path to your axios lib
import { User } from '@/types'; // Update path to your User type
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EditUser = () => {
  const router = useRouter();
  const { userId } = useParams(); // Get the `userId` from the URL
  const [user, setUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({ username: '', email: '', roleId: '' });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch user data on mount
  useEffect(() => {
    if (userId) {
      const fetchUser = async () => {
        try {
          const response = await api.get(`/users/${userId}`);
          setUser(response.data);
          setFormData({ 
            username: response.data.username, 
            email: response.data.email, 
            roleId: response.data.roleId 
          });
        } catch (err) {
          setError('Failed to fetch user');
        } finally {
          setLoading(false);
        }
      };
      fetchUser();
    }
  }, [userId]);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.put(`/users/${userId}`, formData);
      toast.success('User updated successfully!', {
        position: "top-right",
        autoClose: 2000, // Automatically close the toast after 2 seconds
      });
      
      // Delay the redirect to allow the toast to display
      setTimeout(() => {
        router.push('/dashboard/users'); // Redirect to the user list
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

  return (
    <div className="p-6">
      <ToastContainer /> {/* Add the ToastContainer to render toast notifications */}

      <h3 className="text-2xl font-bold mb-4">Edit User</h3>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Username</label>
          <input 
            type="text" 
            value={formData.username}
            onChange={e => setFormData({ ...formData, username: e.target.value })}
            className="mt-1 p-2 border border-gray-300 rounded w-full" 
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input 
            type="email" 
            value={formData.email}
            onChange={e => setFormData({ ...formData, email: e.target.value })}
            className="mt-1 p-2 border border-gray-300 rounded w-full" 
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Role</label>
          <select 
            value={formData.roleId}
            onChange={e => setFormData({ ...formData, roleId: e.target.value })}
            className="mt-1 p-2 border border-gray-300 rounded w-full"
          >
            <option value="1">Super Admin</option>
            <option value="2">Admin</option>
          </select>
        </div>
        <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">
          Update User
        </button>
      </form>
    </div>
  );
};

export default EditUser;
