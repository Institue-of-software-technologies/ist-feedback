"use client";

import React, { useEffect, useState } from 'react';
import api from '../../../../lib/axios'; // Adjust this path to your axios setup
import { Role } from '@/types'; // Adjust this path to your User type definition
import { useRouter } from 'next/navigation';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useUser } from '@/context/UserContext';
import Table from '@/components/Tables';
import Loading from '../loading';  // Import the Loading component
import { showToast } from '@/components/ToastMessage';


const RoleManagement: React.FC = () => {
  const { user } = useUser();
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState<boolean>(true); // State to handle delete confirmation
  const [filteredRoles, setFilteredRoles] = useState<Role[]>([]);  // Holds the filtered users
  const [search, setSearch] = useState<string>('');
  const router = useRouter();

  // Fetch users from your API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get('/roles', {
          method: 'GET',
        });
        // console.log(response);
        setRoles(response.data.roles);
        setFilteredRoles(response.data.roles);
      } catch (err) {
        console.log(err);
        showToast.error('Failed to fetch users');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Handle user deletion
  const handleDelete = async (confirmDelete: Role) => {
    if (confirmDelete) {
      try {
        await api.delete(`/roles/${confirmDelete.id}`);
        setRoles(roles.filter(role => role.id !== confirmDelete.id));
        setFilteredRoles(roles.filter(role => role.id !== confirmDelete.id));
        showToast.success('Role deleted successfully');
      } catch (err) {
        console.log(err)
        showToast.error('Failed to delete role');
      }
    }
  };

  const handleSearch = (value: string) => {
    console.log(search)
    setSearch(value);

    // Filter the users based on the search query
    if (value.trim() === '') {
      setFilteredRoles(roles);  // Show all if search is empty
    } else {
      const filtered = roles.filter(role =>
        role.roleName.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredRoles(filtered);
    }
  };

  // Handle user editing
  const handleEdit = (role: Role) => {
    showToast.info('Redirecting to edit user...');
    router.push(`/dashboard/roles/edit/${role.id}`);
  };

  if (loading) return <Loading />

  const columns = [
    { header: 'Role', accessor: 'roleName' },
  ];

  // console.log(roles)

  return (
    <div>
      <ToastContainer /> {/* Include ToastContainer for rendering toasts */}
      <Table<Role>
        columns={columns}
        data={filteredRoles}
        onSearch={handleSearch}
        onEdit={user && user.permissions.includes('update_users') ? handleEdit : undefined}
        onDelete={user && user.permissions.includes('update_users') ? handleDelete : undefined}
      />
    </div>
  );
};

export default RoleManagement;
