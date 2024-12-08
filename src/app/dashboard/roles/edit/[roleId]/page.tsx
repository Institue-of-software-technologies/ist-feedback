"use client";

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import api from '../../../../../../lib/axios'; // Update path to your axios lib
import { Permission, Role } from '@/types'; // Update path to your User type
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Form from '@/components/Forms';
import { showToast } from '@/components/ToastMessage';
import Loading from "@/app/loading";

interface FormData {
  permissionName: string;
}

const EditRoles = () => {
  const router = useRouter();
  const { roleId } = useParams(); // Get the `userId` from the URL
  const [role, setRole] = useState<Role | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [selectedPermissions, setSelectedPermissions] = useState<number[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [formLoading, setFormLoading] = useState<boolean>(false);

  // Fetch user data on mount
  useEffect(() => {
    if (roleId) {
      const fetchRole = async () => {
        try {
          const response = await api.get(`/roles/${roleId}`);
          setRole(response.data.role);
          // Access permissionId from the nested structure
          const permissionIds = response.data.permissions.map(
            (perm: { permission: { id: number } }) => perm.permission.id
          );
          setSelectedPermissions(permissionIds);
        } catch (err) {
          console.log(err)
          setError('Failed to fetch user');
        } finally {
          setLoading(false);
        }
      };
      fetchRole();

      const fetchPermissions = async () => {
        try {
          const response = await api.get(`/permissions`);
          setPermissions(response.data.permission);
          setLoading(false);
        } catch (err) {
          console.log(err);
        }
      };
      fetchPermissions();
    }
  }, [roleId]);


  // Handle form submission
  const handleSubmit = async (data: FormData) => {
    setFormLoading(true);
    try {
      await api.put(`/roles/${roleId}`, data);
      showToast.success('role updated successfully!');

      // Delay the redirect to allow the toast to display
      setTimeout(() => {
        router.push('/dashboard/roles'); // Redirect to the user list
      }, 2000);
    } catch (err) {
      console.log(err);
      showToast.error('Failed to update roles');
    }
    finally {
      setFormLoading(false);
    }
  };

  if (loading) return <Loading />
  if (error) return <div className="text-red-500">{error}</div>;

  const inputs = [
    { label: "roleName", type: "text", value: role?.roleName },
    {
      label: "Permissions",
      type: "multiple",
      defaultSelect: selectedPermissions,
      options: permissions.map((perm) => ({
        label: perm.permissionName, // Use the nested permissionName
        value: perm.id, // Use the nested permission id
      })),
    },
  ];
  const extraButtons = [
    {
      label: 'Back',
      type: 'button',
      onClick: () => router.push('/dashboard/roles'),
    }
  ];
  

  return (
    <div className="p-6">
      <ToastContainer /> {/* Add the ToastContainer to render toast notifications */}

      <h3 className="text-2xl font-bold mb-4">Edit roles</h3>
      <Form<FormData>
        Input={inputs}
        onSubmit={handleSubmit}
        loading={formLoading}
        addButton={extraButtons}
      />
    </div>
  );
};

export default EditRoles;
