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
  options?: string[];
}

const EditQuestion = () => {
  const router = useRouter();
  const { questionId } = useParams();
  const [question, setQuestion] = useState<FeedbackQuestion | null>(null);
  const [formData, setFormData] = useState<FormData>({
    questionText: "",
    questionType: "open-ended",
    options: [""]
  });
  const [showDetailsForm, setShowDetailsForm] = useState(false); // Whether to show the second form
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch feedback question data on mount
  useEffect(() => {
    if (questionId) {
      const fetchQuestion = async () => {
        try {
          const response = await api.get(`/feedback-questions/${questionId}`);
          const fetchedQuestion = response.data.question;
          setQuestion(fetchedQuestion);
          setFormData({
            questionText: fetchedQuestion.questionText,
            questionType: fetchedQuestion.questionType,
            options: fetchedQuestion.options || [""]
          });
        } catch (err) {
          setError('Failed to fetch feedback question');
        } finally {
          setLoading(false);
        }
      };
      fetchQuestion();
    }
  }, [questionId]);

  // Handle the form submission for the second form (open-ended or closed-ended)
  const handleSubmit = async (data: FormData) => {
    try {
      await api.put(`/feedback-questions/${questionId}`, data);
      toast.success('Feedback question updated successfully!', {
        position: "top-right",
        autoClose: 2000,
      });
      setTimeout(() => {
        router.push('/dashboard/feedback-questions');
      }, 2000);
    } catch (err) {
      toast.error('Failed to update feedback question', {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  // Handle the first form submission for selecting the question type
  const handleQuestionTypeSelection = (data: { questionType: 'open-ended' | 'closed-ended' | 'rating' }) => {
    setFormData({ ...formData, questionType: data.questionType });
    setShowDetailsForm(true); // Show the second form based on question type
  };

  // Handle adding a new option for closed-ended questions
  const handleAddOption = () => {
    setFormData((prev) => ({
      ...prev,
      options: [...(prev.options || []), ""]
    }));
  };

  // Handle removing an option for closed-ended questions
  const handleRemoveOption = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      options: (prev.options || []).filter((_, i) => i !== index)
    }));
  };

  // Handle option input change for closed-ended questions
  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...(formData.options || [])];
    newOptions[index] = value;
    setFormData((prev) => ({
      ...prev,
      options: newOptions
    }));
  };

  // Go back to the question type selection form
  const handleGoBack = () => {
    setShowDetailsForm(false); // Go back to the first form
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  // First form for selecting the question type
  const typeSelectionInputs: Input[] = [
    {
      label: "questionType",
      type: "select",
      name: "questionType",
      value: formData.questionType,
      options: [
        { label: "Open Ended", value: "open-ended" },
        { label: "Closed Ended", value: "closed-ended" },
        { label: "Rating", value: "rating" },
      ],
    },
  ];

  // Second form for open-ended questions
  const openEndedInputs: Input[] = [
    { label: "questionText", type: "text", name: "questionText", value: formData.questionText },
    { label: "questionType", type: "hidden", name: "questionType", value: "open-ended" },
  ];

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow">
      <ToastContainer />
      <h2 className="text-2xl font-bold mb-4">Edit Feedback Question</h2>

      {/* First form for question type selection */}
      {!showDetailsForm && (
        <Form<{ questionType: 'open-ended' | 'closed-ended' | 'rating' }>
          Input={typeSelectionInputs}
          onSubmit={handleQuestionTypeSelection}
        />
      )}

      {/* Second form based on selected question type */}
      {showDetailsForm && formData.questionType === 'open-ended' && (
        <>
          <div>
            <h1>Type the question below</h1>
          </div>
          <Form<FormData>
            Input={openEndedInputs}
            onSubmit={handleSubmit}
          />
          <button
            onClick={handleGoBack}
            className="mt-4 px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
          >
            Back
          </button>
        </>
      )}

      {showDetailsForm && formData.questionType === 'closed-ended' && (
        <>
          <div>
            <h1>Type the question below and the answers</h1>

            {/* Question text input */}
            <input
              type="text"
              placeholder="Enter your question"
              value={formData.questionText}
              onChange={(e) => setFormData({ ...formData, questionText: e.target.value })}
              className="border p-2 w-full mb-2"
            />

            {/* Render the options dynamically */}
            {formData.options?.map((option, index) => (
              <div key={index} className="flex items-center mb-2">
                <input
                  type="text"
                  placeholder={`Option ${index + 1}`}
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  className="border p-2 flex-grow"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveOption(index)}
                  className="ml-2 px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Remove
                </button>
              </div>
            ))}

            {/* Button to add a new option */}
            <button
              type="button"
              onClick={handleAddOption}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Add Answer
            </button>

            {/* Submit Button */}
            <button
              onClick={() => handleSubmit(formData)}
              className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Submit
            </button>

            {/* Back Button */}
            <button
              onClick={handleGoBack}
              className="mt-4 ml-4 px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
            >
              Back
            </button>
          </div>
        </>
      )}

      {/* Rating question type placeholder */}
      {showDetailsForm && formData.questionType === 'rating' && (
        <>
          <div>Rating question form not implemented yet</div>
          <button
            onClick={handleGoBack}
            className="mt-4 px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
          >
            Back
          </button>
        </>
      )}
    </div>
  );
};

export default EditQuestion;