"use client";

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import api from '../../../../../../lib/axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Form, { Input } from '@/components/Forms';
import { FeedbackQuestion } from '@/db/models/FeedbackQuestion';

interface FormData {
  questionText: string;
  questionType: 'open-ended' | 'closed-ended' | 'rating';
}

const EditQuestion = () => {
  const router = useRouter();
  const { questionId } = useParams();
  const [question, setQuestion] = useState<FeedbackQuestion | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch feedback question data on mount
  useEffect(() => {
    if (questionId) {
      const fetchQuestion = async () => {
        try {
          const response = await api.get(`/feedback-questions/${questionId}`);
          setQuestion(response.data.question);
        } catch (err) {
          setError('Failed to fetch feedback question');
        } finally {
          setLoading(false);
        }
      };
      fetchQuestion();
    }
  }, [questionId]);

  // Handle form submission
  const handleSubmit = async (data: FormData) => {
    console.log(data)
    try {
      await api.put(`/feedback-questions/${questionId}`, data);
      toast.success('Feedback question updated successfully!', {
        position: "top-right",
        autoClose: 2000,
      });
      
      // Delay the redirect to allow the toast to display
      setTimeout(() => {
        router.push('/dashboard/feedback-questions');
      }, 2000);
    } catch (err) {
      toast.error('Failed to update feedback questions', {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  const inputs: Input[] = [
    { 
      label: "questionText", 
      type: "text", 
      value: question?.questionText,
      name: "questionText"
    },
    { 
      label: "questionType", 
      type: "select", 
      value: question?.questionType,
      name: "questionType",
      options: [
        { label: "Open Ended", value: "open-ended" }, 
        { label: "Closed Ended", value: "closed-ended" }, 
        { label: "Rating", value: "rating" }
      ] 
    }
  ];   

  return (
    <div className="p-6">
      <ToastContainer /> {/* Add the ToastContainer to render toast notifications */}

      <h3 className="text-2xl font-bold mb-4">Edit Feedback Question</h3>
          <Form<FormData>
              Input={inputs} 
              onSubmit={handleSubmit} 
          />
    </div>
  );
};

export default EditQuestion;
