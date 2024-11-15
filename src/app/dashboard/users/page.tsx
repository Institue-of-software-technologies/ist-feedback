"use client";

import React, { useEffect, useState } from 'react';
import api from '../../../../lib/axios'; // Adjust this path to your axios setup
import { User } from '@/types'; // Adjust this path to your User type definition
import { useRouter } from 'next/navigation';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useUser } from '@/context/UserContext';
import Table from '@/components/Tables';
import Loading from '../loading';  // Import the Loading component
import { showToast } from '@/components/ToastMessage';


const UserManagement: React.FC = () => {
  const { user } = useUser();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true); // State to handle delete confirmation
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);  // Holds the filtered users
  const [search, setSearch] = useState<string>('');
  const router = useRouter();

  // Fetch users from your API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get('/users', {
          method: 'GET',
        });
        setUsers(response.data);
        setFilteredUsers(response.data);
      } catch (err) {
        console.log(err)
        showToast.error('Failed to fetch users');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Handle user deletion
  const handleDelete = async (confirmDelete: User) => {
    if (confirmDelete) {
      try {
        await api.delete(`/users/${confirmDelete.id}`);
        setUsers(users.filter(user => user.id !== confirmDelete.id));
        setFilteredUsers(filteredUsers.filter(user => user.id !== confirmDelete.id));
        showToast.success('User deleted successfully');
      } catch (err) {
        console.log(err)
        showToast.error('Failed to delete user');
      }
    }
  };

  const handleSearch = (value: string) => {
    console.log(search)
    setSearch(value);

    // Filter the users based on the search query
    if (value.trim() === '') {
      setFilteredUsers(users);  // Show all if search is empty
    } else {
      const filtered = users.filter(user =>
        user.username.toLowerCase().includes(value.toLowerCase()) ||
        user.email.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  };

  // Handle user editing
  const handleEdit = (user: User) => {
    showToast.info('Redirecting to edit user...');
    router.push(`/dashboard/users/edit/${user.id}`);
  };

  if (loading) return <Loading />

  const columns = [
    { header: 'Username', accessor: 'username' },
    { header: 'Email', accessor: 'email' },
    { header: 'Role', accessor: 'role.roleName' },
  ];

  return (
    <div>
      <ToastContainer /> {/* Include ToastContainer for rendering toasts */}
      <Table<User>
        columns={columns}
        data={filteredUsers}
        onSearch={handleSearch}
        onEdit={user && user.permissions.includes('update_users') ? handleEdit : undefined}
        onDelete={user && user.permissions.includes('update_users') ? handleDelete : undefined}
      />
    </div>
  );
};

export default UserManagement;
