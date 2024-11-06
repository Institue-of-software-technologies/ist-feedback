'use client';

import React, { useEffect, useState } from 'react';
import api from '../../../../lib/axios'; 
import { Trainer } from '@/types'; 
import { useRouter } from 'next/navigation';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useUser } from '@/context/UserContext';
import Table from '@/components/Tables';
import Loading from '../loading';  // Import the Loading component

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

  if (loading) return <Loading />;

  const columns = [
    { header: 'trainerName', accessor: 'trainerName' },
    { header: 'email', accessor: 'email' },
    { header: 'Course', accessor: 'course.courseName' },
  ];

  return (
    <div>
      <ToastContainer />
      {filteredTrainer && filteredTrainer.length === 0 ? (
        <div className="text-center p-4">
          <p>No Trainer available at the moment.</p>
        </div>
      ) : (
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
      )}
    </div>
  );
};

export default TrainerManagement;
