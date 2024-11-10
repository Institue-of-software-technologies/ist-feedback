"use client";

import React, { useEffect, useState } from 'react';
import api from '../../../../lib/axios';
import { FeedbackQuestion } from '@/types';
import { useRouter } from 'next/navigation';
import { toast, ToastContainer } from 'react-toastify';
import { useUser } from '@/context/UserContext';
import 'react-toastify/dist/ReactToastify.css';
import Table from '@/components/Tables';
import Loading from '../loading';  // Import the Loading component

const FeedbackQuestions: React.FC = () => {
  const { user } = useUser();
  const [questions, setQuestions] = useState<FeedbackQuestion[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filteredquestion, setFilteredquestion] = useState<FeedbackQuestion[]>([]);
  const [search, setSearch] = useState<string>('');
  const router = useRouter();

  // Fetch feedback question from your API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get('/feedback-questions', {
          method: 'GET',
        });
        console.log(response);
        setQuestions(response.data.questions);
        setFilteredquestion(response.data.questions);
      } catch (err) {
        toast.error('Failed to fetch feedback questions', { position: "top-right", autoClose: 3000 });
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Handle feedback question deletion
  const handleDelete = async (confirmDelete: FeedbackQuestion) => {
    if (confirmDelete) {
      try {
        await api.delete(`/feedback-questions/${confirmDelete.id}`);
        setQuestions(questions.filter(question => question.id !== confirmDelete.id));
        setFilteredquestion(filteredquestion.filter(filteredquestion => filteredquestion.id !== confirmDelete.id));
        toast.success('Feedback question deleted successfully', { position: "top-right", autoClose: 2000 });
      } catch (err) {
        toast.error('Failed to delete feedback question', { position: "top-right", autoClose: 3000 });
      }
    }
  };

  const handleSearch = (value: string) => {
    console.log(search)
    setSearch(value);

    // Filter the feedback question based on the search query
    if (value.trim() === '') {
      setFilteredquestion(questions);  // Show all if search is empty
    } else {
      const filtered = questions.filter(question =>
        question.questionText.toLowerCase().includes(value.toLowerCase()) || question.questionType.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredquestion(filtered);
    }
  };

  // Handle feedback question editing
  const handleEdit = (question: FeedbackQuestion) => {
    toast.info('Redirecting to edit user...', { position: "top-right", autoClose: 2000 });
    router.push(`/dashboard/feedback-questions/edit/${question.id}`);
  };

  if (loading) return <Loading />;

  const columns = [
    { header: 'questionText', accessor: 'questionText' },
    { header: 'questionType', accessor: 'questionType' }
  ];

  return (
    <div>
      <ToastContainer /> {/* Include ToastContainer for rendering toasts */}
      {filteredquestion && filteredquestion.length === 0 ? (
        <div className="text-center p-4">
          <p>No feedback questions available at the moment.</p>
        </div>
      ) : (
          <Table<FeedbackQuestion>
            columns={columns}
            data={filteredquestion}
            onSearch={handleSearch}
            onEdit={user && user.permissions.includes('update_feedback_questions') ? handleEdit : undefined}
            onDelete={user && user.permissions.includes('delete_feedback_questions') ? handleDelete : undefined}
          />
      )}
    </div>
  );
};

export default FeedbackQuestions;
