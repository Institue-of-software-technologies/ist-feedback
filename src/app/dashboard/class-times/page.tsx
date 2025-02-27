"use client";

import React, { useEffect, useState } from 'react';
import api from '../../../../lib/axios'; // Adjust this path to your axios setup
import { ClassTime } from '@/types'; // Adjust this path to your User type definition
import { useRouter } from 'next/navigation';
import { ToastContainer } from 'react-toastify';
import { useUser } from '@/context/UserContext';
import 'react-toastify/dist/ReactToastify.css';
import Table from '@/components/Tables';
import Loading from '../loading';  // Import the Loading component
import { showToast } from '@/components/ToastMessage';


const ClassTimeFormManagement: React.FC = () => {
  const { user } = useUser();
  const [classTimes, setClassTimes] = useState<ClassTime[]>([]);
  const [loading, setLoading] = useState<boolean>(true); // State to handle delete confirmation
  const [filteredClassTimes, setFilteredClassTimes] = useState<ClassTime[]>([]);  // Holds the filtered users
  const [, setSearch] = useState<string>('');
  const router = useRouter();

  // Fetch course from your API
  useEffect(() => {
    const fetchClassTime = async () => {
      try {
        const response = await api.get('/class-times', {
          method: 'GET',
        });
        setClassTimes(response.data.classTime);
        setFilteredClassTimes(response.data.classTime);
      } catch (err) {
        console.log(err);
        showToast.error('Failed to fetch Class Time');
      } finally {
        setLoading(false);
      }
    };

    fetchClassTime();
  }, []);

  // Handle course deletion
  const handleDelete = async (confirmDelete: ClassTime) => {
    if (confirmDelete) {
      try {
        await api.delete(`/class-times/${confirmDelete.id}`);
        setClassTimes(classTimes.filter(classTime => classTime.id !== confirmDelete.id));
        setFilteredClassTimes(filteredClassTimes.filter(filteredClassTimes => filteredClassTimes.id !== confirmDelete.id));
        showToast.success('Class Time deleted successfully');
      } catch (err) {
        console.log(err);
        showToast.error('Failed to delete Class Time');
      }
    }
  };

  const handleSearch = (value: string) => {
    setSearch(value);

    // Filter the course based on the search query
    if (value.trim() === '') {
      setFilteredClassTimes(classTimes);  // Show all if search is empty
    } else {
      const filtered = classTimes.filter(classTime =>
        classTime.classTime.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredClassTimes(filtered);
    }
  };

  // Handle course editing
  const handleEdit = (classTime: ClassTime) => {
    showToast.info('Redirecting to edit Class Time...',);
    router.push(`/dashboard/class-times/edit/${classTime.id}`);
  };

  if (loading) return <Loading />;

  const columns = [
    { header: 'classTime', accessor: 'classTime' },
  ];

  return (
    <div>
      <ToastContainer /> {/* Include ToastContainer for rendering toasts */}
      {filteredClassTimes.length === 0 ? (
        <div className="text-center p-4">
          <p>No Class Times available at the moment.</p>
        </div>
      ) : (
        <Table<ClassTime>
          columns={columns}
          data={filteredClassTimes}
          onSearch={handleSearch}
          onEdit={user && user.permissions.includes('update_courses') ? handleEdit : undefined}
          onDelete={user && user.permissions.includes('delete_courses') ? handleDelete : undefined}
        />
      )}
    </div>
  );
};

export default ClassTimeFormManagement;
