"use client";

import React, { useEffect, useState } from 'react';
import { ExclamationTriangleIcon, PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';
import api from '../../../../lib/axios'; // Adjust this path to your axios setup
import { User } from '@/types'; // Adjust this path to your User type definition
import { useRouter } from 'next/navigation';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null); // State to handle delete confirmation
  const router = useRouter();

  // Fetch users from your API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get('/users', {
          method: 'GET',
        });
        setUsers(response.data);
      } catch (err) {
        toast.error('Failed to fetch users', { position: "top-right", autoClose: 3000 });
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Handle user deletion
  const handleDelete = async () => {
    if (confirmDelete) {
      try {
        await api.delete(`/users/${confirmDelete}`);
        setUsers(users.filter(user => user.id !== confirmDelete));
        toast.success('User deleted successfully', { position: "top-right", autoClose: 2000 });
      } catch (err) {
        toast.error('Failed to delete user', { position: "top-right", autoClose: 3000 });
      } finally {
        setConfirmDelete(null); // Close the confirmation modal
      }
    }
  };

  // Handle user editing
  const handleEdit = (user: User) => {
    toast.info('Redirecting to edit user...', { position: "top-right", autoClose: 2000 });
    router.push(`/dashboard/users/edit/${user.id}`);
  };

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  return (
    <div className="p-6">
      <ToastContainer /> {/* Include ToastContainer for rendering toasts */}

      <h3 className="text-2xl font-bold mb-4">View All Users</h3>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 border-b text-left">Username</th>
              <th className="py-2 px-4 border-b text-left">Email</th>
              <th className="py-2 px-4 border-b text-left">Role</th>
              <th className="py-2 px-4 border-b text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="py-2 px-4 border-b">{user.username}</td>
                <td className="py-2 px-4 border-b">{user.email}</td>
                <td className="py-2 px-4 border-b">{user.role.roleName}</td> {/* Display roleName */}
                <td className="py-2 px-4 border-b">
                  <button
                    className="text-blue-500 hover:underline inline-flex items-center"
                    onClick={() => handleEdit(user)}
                  >
                    <PencilSquareIcon className="h-5 w-5 mr-1" />
                    Edit
                  </button>
                  <button
                    className="text-red-500 hover:underline inline-flex items-center ml-4"
                    onClick={() => setConfirmDelete(user.id)}
                  >
                    <TrashIcon className="h-5 w-5 mr-1" />
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>

      {/* Confirmation Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 shadow-lg max-w-sm w-full">
            <div className="flex items-center justify-center mb-4">
              <ExclamationTriangleIcon className="h-6 w-6 text-yellow-500 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">Confirm Deletion</h3>
            </div>
            <p className="text-gray-600 text-center mb-4">Are you sure you want to delete this user? This action cannot be undone.</p>
            <div className="flex justify-end space-x-2">
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                onClick={() => setConfirmDelete(null)}
              >
                Cancel
              </button>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                onClick={handleDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
