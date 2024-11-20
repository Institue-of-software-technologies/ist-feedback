"use client";

import React, { useEffect, useState } from 'react';
import api from '../../../../lib/axios'; // Adjust this path to your axios setup
import { Feedback } from '@/types'; // Adjust this path to your User type definition
import { useRouter } from 'next/navigation';
import { ToastContainer } from 'react-toastify';
import { useUser } from '@/context/UserContext';
import 'react-toastify/dist/ReactToastify.css';
import Table from '@/components/Tables';
import Loading from '../loading';  // Import the Loading component
import { showToast } from '@/components/ToastMessage';

const FeedBackManagement: React.FC = () => {
  const { user } = useUser();
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filteredFeedback, setFilteredFeedback] = useState<Feedback[]>([]);
  const [search, setSearch] = useState<string>('');
  const router = useRouter();

  // Fetch feedback from your API
  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const response = await api.get('/feedback', {
          method: 'GET',
        });

        // Ensure response contains 'feedbacks' array (plural)
        if (response?.data?.feedbacks && Array.isArray(response.data.feedbacks)) {
          setFeedbacks(response.data.feedbacks);
          setFilteredFeedback(response.data.feedbacks);
        } else {
          throw new Error('Invalid response format');
        }
      } catch (err) {
        console.error('Failed to fetch feedbacks:', err);
        showToast.error('Failed to fetch feedbacks');
      } finally {
        setLoading(false);
      }
    };

    fetchFeedbacks();
  }, []);

  // Handle feedback deletion
  const handleDelete = async (confirmDelete: Feedback) => {
    if (confirmDelete) {
      try {
        await api.delete(`/feedback/${confirmDelete.id}`);
        setFeedbacks(feedbacks.filter(feedback => feedback.id !== confirmDelete.id));
        setFilteredFeedback(filteredFeedback.filter(feedback => feedback.id !== confirmDelete.id));
        showToast.success('Feedback deleted successfully');
      } catch (err) {
        console.log(err)
        showToast.error('Failed to delete feedback');
      }
    }
  };

  const handleSearch = (value: string) => {
    console.log(search);
    setSearch(value);

    // Filter the feedback based on the search query
    if (value.trim() === '') {
      setFilteredFeedback(feedbacks);  // Show all if search is empty
    } else {
      const filtered = feedbacks.filter(feedback =>
        feedback.studentToken.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredFeedback(filtered);
    }
  };

  // Handle feedback editing
  const handleEdit = (feedback: Feedback) => {
    showToast.info('Redirecting to edit Feedback...');
    router.push(`/dashboard/feedback/edit/${feedback.id}`);
  };

  if (loading) return <Loading />;

  const columns = [
    { header: 'Student Token', accessor: 'studentToken' },
    { header: 'Trainer Name', accessor: 'trainer.trainerName' },
    { header: 'Course', accessor: 'trainer.course.courseName' },
    { header: 'Module Name', accessor: 'module.moduleName' },
    // { header: 'Course Name', accessor: 'module.course.courseName' },
    { header: 'Class Time', accessor: 'classTime.classTime' },
    { header: 'Intake Name', accessor: 'intake.intakeName' },
    { header: 'Intake Year', accessor: 'intake.intakeYear' },
    {
      header: 'Token Start Time',
      accessor: 'tokenStartTime',
      Cell: ({ value }: { value: string }) => {
        const date = new Date(value);
        return date.toLocaleString('en-KE', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: '2-digit',
          hour: '2-digit',
          hour12: false,
          timeZoneName: 'short',
        });
      },
    },
    {
      header: 'Token Expiration',
      accessor: 'tokenExpiration',
      Cell: ({ value }: { value: string }) => {
        const date = new Date(value);


        return date.toLocaleString('en-KE', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: '2-digit',
          hour: '2-digit',
          hour12: false,
          timeZoneName: 'short',
        });
      },
    }
  ];

  return (
    <div>
      <ToastContainer /> {/* Include ToastContainer for rendering toasts */}
      {filteredFeedback && filteredFeedback.length === 0 ? (
        <div className="text-center p-4">
          <p>No Feedbacks available at the moment.</p>
        </div>
      ) : (
        <Table<Feedback>
          columns={columns}
          data={filteredFeedback}
          onSearch={handleSearch}
          onEdit={user && user.permissions.includes('update_feedbacks') ? handleEdit : undefined}
          onDelete={user && user.permissions.includes('delete_feedbacks') ? handleDelete : undefined}
        />
      )}
    </div>
  );
};

export default FeedBackManagement;