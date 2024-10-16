"use client";

import React, { useEffect, useState } from 'react';
import api from '../../../../lib/axios'; // Adjust this path to your axios setup
import { Permission} from '@/types'; // Adjust this path to your User type definition
import { useRouter } from 'next/navigation';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useUser } from '@/context/UserContext';
import Table from '@/components/Tables';


const PermissionManagement: React.FC = () => {
  const { user } = useUser();
  const [permission, setPermission] = useState<Permission[]>([]);
  const [loading, setLoading] = useState<boolean>(true); // State to handle delete confirmation
  const [filteredPermission, setFilteredPermission] = useState<Permission[]>([]);  // Holds the filtered users
  const [search, setSearch] = useState<string>('');
  const router = useRouter();

  // Fetch users from your API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get('/permissions', {
          method: 'GET',
        });
        console.log(response);
        setPermission(response.data.permission);
        setFilteredPermission(response.data.permission);
      } catch (err) {
        toast.error('Failed to fetch users', { position: "top-right", autoClose: 3000 });
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Handle user deletion
  const handleDelete = async (confirmDelete: Permission) => {
    if (confirmDelete) {
      try {
        await api.delete(`/permissions/${confirmDelete.id}`);
        setPermission(permission.filter(permission => permission.id !== confirmDelete.id));
        setFilteredPermission(filteredPermission.filter(filteredPermission => filteredPermission.id !== confirmDelete.id));
        toast.success('Permission deleted successfully', { position: "top-right", autoClose: 2000 });
      } catch (err) {
        toast.error('Failed to delete permission', { position: "top-right", autoClose: 3000 });
      }
    }
  };

  const handleSearch = (value: string) => {
    console.log(search)
    setSearch(value);

    // Filter the users based on the search query
    if (value.trim() === '') {
      setFilteredPermission(permission);  // Show all if search is empty
    } else {
      const filtered = permission.filter(permission =>
        permission.permissionName.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredPermission(filtered);
    }
  };
  
  // Handle user editing
  const handleEdit = (permission: Permission) => {
    toast.info('Redirecting to edit user...', { position: "top-right", autoClose: 2000 });
    router.push(`/dashboard/permissions/edit/${permission.id}`);
  };

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  const columns = [
    { header: 'permissionName', accessor: 'permissionName' }
  ];

  return (
    <div>
      <ToastContainer /> {/* Include ToastContainer for rendering toasts */}
        <Table<Permission>
          columns={columns}
          data={filteredPermission}
          onSearch={handleSearch}
          onEdit={user && user.permissions.includes('update_users')?handleEdit:undefined}
          onDelete={user && user.permissions.includes('update_users')?handleDelete:undefined}
        />
    </div>
  );
};

export default PermissionManagement;
