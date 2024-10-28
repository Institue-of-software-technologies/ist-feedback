"use client";

import React, { useEffect, useState } from 'react';
import api from '../../../../lib/axios'; // Adjust this path to your axios setup
import { Module } from '@/types'; // Adjust this path to your Module type definition
import { useRouter } from 'next/navigation';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useUser } from '@/context/UserContext';
import Table from '@/components/Tables';

const ModuleManagement: React.FC = () => {
  const { user } = useUser();
  const [courseModule, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filteredModules, setFilteredModules] = useState<Module[]>([]);
  const [search, setSearch] = useState<string>('');
  const router = useRouter();

  // Fetch modules from your API
  useEffect(() => {
    const fetchModules = async () => {
      try {
        const response = await api.get('/modules', {
          method: 'GET',
        });
        setModules(response.data);
        setFilteredModules(response.data);
      } catch (err) {
        toast.error('Failed to fetch modules', { position: "top-right", autoClose: 3000 });
      } finally {
        setLoading(false);
      }
    };

    fetchModules();
  }, []);

  // Handle module deletion
  const handleDelete = async (confirmDelete: Module) => {
    if (confirmDelete) {
      try {
        await api.delete(`/modules/${confirmDelete.id}`);
        setModules(courseModule.filter(module => module.id !== confirmDelete.id));
        setFilteredModules(filteredModules.filter(module => module.id !== confirmDelete.id));
        toast.success('Module deleted successfully', { position: "top-right", autoClose: 2000 });
      } catch (err) {
        toast.error('Failed to delete module', { position: "top-right", autoClose: 3000 });
      }
    }
  };

  const handleSearch = (value: string) => {
    console.log(search);
    
    setSearch(value);

    // Filter the modules based on the search query
    if (value.trim() === '') {
      setFilteredModules(courseModule);  // Show all if search is empty
    } else {
      const filtered = courseModule.filter(module =>
        module.moduleName.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredModules(filtered);
    }
  };
  
  // Handle module editing
  const handleEdit = (module: Module) => {
    toast.info('Redirecting to edit module...', { position: "top-right", autoClose: 2000 });
    router.push(`/dashboard/modules/edit/${module.id}`);
  };

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  const columns = [
    { header: 'Module Name', accessor: 'moduleName' },
    { header: 'Course ID', accessor: 'course.courseName' },
  ];

  return (
    <div>
      <ToastContainer /> {/* Include ToastContainer for rendering toasts */}
      {filteredModules && filteredModules.length === 0 ? (
        <div className="text-center p-4">
          <p>No Modules available at the moment.</p>
        </div>
      ) : (
      <Table<Module>
        columns={columns}
        data={filteredModules}
        onSearch={handleSearch}
        onEdit={user && user.permissions.includes('update_modules') ? handleEdit : undefined}
        onDelete={user && user.permissions.includes('delete_modules') ? handleDelete : undefined}
      />)}
    </div>
  );
};

export default ModuleManagement;
