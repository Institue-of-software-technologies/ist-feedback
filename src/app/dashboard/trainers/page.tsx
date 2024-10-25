'use client';

import React, { useEffect, useState } from 'react';
import api from '../../../../lib/axios'; 
import { Trainer } from '@/types'; 
import { useRouter } from 'next/navigation';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useUser } from '@/context/UserContext';
import Table from '@/components/Tables';

const TrainerManagement: React.FC = () => {
  const { user } = useUser();
  const [trainer, setTrainer] = useState<Trainer[]>([]);
  const [loading, setLoading] = useState<boolean>(true); 
  const [filteredTrainer, setFilteredTrainer] = useState<Trainer[]>([]); 
  const [search, setSearch] = useState<string>('');
  const router = useRouter();

  // Fetch users from your API
  useEffect(() => {
    const fetchTrainers = async () => {
      try {
        const response = await api.get('/trainers', {
          method: 'GET',
        });
          setTrainer(response.data.trainer);
          setFilteredTrainer(response.data.trainer);
      } catch (err) {
         toast.error('Failed to fetch trainer', {
          position: 'top-right',
          autoClose: 3000,
        });
      }
      finally {
        setLoading(false);
      }
    };

    fetchTrainers();
  }, []);

  // Handle user deletion
  const handleDelete = async (confirmDelete: Trainer) => {
    if (confirmDelete) {
      try {
        await api.delete(`/trainers/${confirmDelete.id}`);
        setTrainer(
          trainer.filter((trainer) => trainer.id !== confirmDelete.id)
        );
        setFilteredTrainer(
          filteredTrainer.filter(
            (filteredTrainer) => filteredTrainer.id !== confirmDelete.id
          )
        );
        toast.success('Trainer deleted successfully', {
          position: 'top-right',
          autoClose: 2000,
        });
      } catch (err) {
        toast.error('Failed to delete trainer', {
          position: 'top-right',
          autoClose: 3000,
        });
      }
    }
  };

  const handleSearch = (value: string) => {
    console.log(search);
    setSearch(value);

    if (value.trim() === '') {
      setFilteredTrainer(trainer); 
    } else {
      const filtered = trainer.filter((trainer) =>
        trainer.trainerName.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredTrainer(filtered);
    }
  };


  const handleEdit = (trainer: Trainer) => {
    toast.info('Redirecting to edit trainer...', {
      position: 'top-right',
      autoClose: 2000,
    });
    router.push(`/dashboard/trainers/edit/${trainer.id}`);
  };

  if (loading) {
    return <div className='text-center'>Loading...</div>;
  }

  const columns = [
    { header: 'trainerName', accessor: 'trainerName' },
    { header: 'Course', accessor: 'course.courseName' },
  ];

  return (
    <div>
      <ToastContainer />
      <Table<Trainer>
        columns={columns}
        data={filteredTrainer}
        onSearch={handleSearch}
        onEdit={
          user && user.permissions.includes('update_trainers')
            ? handleEdit
            : undefined
        }
        onDelete={
          user && user.permissions.includes('delete_trainers')
            ? handleDelete
            : undefined
        }
      />
    </div>
  );
};

export default TrainerManagement;
