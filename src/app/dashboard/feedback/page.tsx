"use client";
import React, { useEffect, useState } from 'react';
import api from '../../../../lib/axios'; // Adjust this path to your axios setup
import { Feedback } from '@/types'; // Adjust this path to your Feedback type definition
import { useRouter } from 'next/navigation';
import { toast, ToastContainer } from 'react-toastify';
import { useUser } from '@/context/UserContext';
import 'react-toastify/dist/ReactToastify.css';
import Table from '@/components/Tables';  // Ensure this is the correct path
import Loading from '../loading';  // Import the Loading component
import { TableColumn } from 'react-data-table-component';  // Import TableColumn from the data table component library

const FeedBackManagement: React.FC = () => {
  const { user } = useUser();
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filteredFeedback, setFilteredFeedback] = useState<Feedback[]>([]);
  const [, setSearch] = useState<string>('');
  const router = useRouter();

  // Fetch feedback from your API
  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const response = await api.get('/feedback', {
          method: 'GET',
        });

        if (response?.data?.feedbacks && Array.isArray(response.data.feedbacks)) {
          setFeedbacks(response.data.feedbacks);
          setFilteredFeedback(response.data.feedbacks);
        } else {
          throw new Error('Invalid response format');
        }
      } catch (err) {
        console.error('Failed to fetch feedbacks:', err);
        toast.error('Failed to fetch feedbacks', { position: "top-right", autoClose: 3000 });
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
        toast.success('Feedback deleted successfully', { position: "top-right", autoClose: 2000 });
      } catch (err) {
        toast.error('Failed to delete feedback', { position: "top-right", autoClose: 3000 });
      }
    }
  };

  const handleSearch = (value: string) => {
    setSearch(value);

    if (value.trim() === '') {
      setFilteredFeedback(feedbacks);
    } else {
      const filtered = feedbacks.filter(feedback =>
        feedback.studentToken.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredFeedback(filtered);
    }
  };

  const handleEdit = (feedback: Feedback) => {
    toast.info('Redirecting to edit Feedback...', { position: "top-right", autoClose: 1500 });
    router.push(`/dashboard/feedback/edit/${feedback.id}`);
  };

  if (loading) return <Loading />;

  const columns: TableColumn<Feedback>[] = [
    { name: 'Student Token', selector: row => row.studentToken },
    { name: 'Trainer Name', selector: row => row.trainer.trainerName },
    { name: 'Course', selector: row => row.trainer.course.courseName },
    { name: 'Class Time', selector: row => row.classTime.classTime },
    { name: 'Intake Name', selector: row => row.intake.intakeName },
    { name: 'Intake Year', selector: row => row.intake.intakeYear },
    {
      name: 'Token Expiration',
      selector: row => row.tokenExpiration,
      width: "400px",
    },
  ];

  return (
    <div className="overflow-x-auto p-4">
      <ToastContainer />
      {filteredFeedback && filteredFeedback.length === 0 ? (
        <div className="text-center p-4">
          <p>No Feedbacks available at the moment.</p>
        </div>
      ) : (
        <Table
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
