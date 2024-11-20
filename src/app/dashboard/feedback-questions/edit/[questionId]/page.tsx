"use client";

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import api from '../../../../../../lib/axios';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Form, { Input } from '@/components/Forms';
import { FeedbackQuestion } from '@/db/models/FeedbackQuestion';
import { AnswerOptions } from '@/types';
import { showToast } from '@/components/ToastMessage';

interface FormData {
  questionText?: string;
  questionType: 'open-ended' | 'closed-ended' | 'rating' | null;
  options?: { optionText: string; description?: boolean }[];
  minRating?: number;
  maxRating?: number;
}

const EditQuestion = () => {
  const router = useRouter();
  const { questionId } = useParams();
  const [, setQuestion] = useState<FeedbackQuestion | null>(null);
  const [formData, setFormData] = useState<FormData>({
    questionType: null,
    options: [{ optionText: "", description: false }],
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
            options: fetchedQuestion.options?.map((opt: AnswerOptions) => ({
              optionText: opt.optionText,
              description: opt.description || false,
            })) || [{ optionText: "", description: false }],
          });
        } catch (err) {
          console.log(err)
          setError('Failed to fetch feedback question');
        } finally {
          setLoading(false);
        }
      };
      fetchQuestion();
    }
  }, [questionId]);

  // Handle adding a new option for closed-ended questions
  const handleAddOption = () => {
    setFormData((prev) => ({
      ...prev,
      options: [...(prev.options || []), { optionText: "", description: false }],
    }));
  };

  // Handle removing an option for closed-ended questions
  const handleRemoveOption = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      options: (prev.options || []).filter((_, i) => i !== index),
    }));
  };

  // Handle changes in options (text or description checkbox)
  const handleOptionChange = (index: number, field: string, value: string | boolean) => {
    const newOptions = [...(formData.options || [])];
    newOptions[index] = { ...newOptions[index], [field]: value };
    setFormData((prev) => ({
      ...prev,
      options: newOptions,
    }));
  };

  // Handle the form submission for the second form (open-ended or closed-ended)
  const handleSubmit = async (data: FormData) => {
    try {
      await api.put(`/feedback-questions/${questionId}`, {
        ...data,
        options: formData.options?.map((option) => ({
          optionText: option.optionText,
          description: option.description, // Send description status to backend
        })),
        minRating: 1,
      });
      showToast.success('Feedback question updated successfully!');
      setTimeout(() => {
        router.push('/dashboard/feedback-questions');
      }, 2000);
    } catch (err) {
      console.log(err)
      showToast.error('Failed to update feedback question');
    }
  };

  // Handle the first form submission for selecting the question type
  const handleQuestionTypeSelection = (data: { questionType: 'open-ended' | 'closed-ended' | 'rating' }) => {
    setFormData({ ...formData, questionType: data.questionType });
    setShowDetailsForm(true); // Show the second form based on question type
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
                  value={option.optionText}
                  onChange={(e) => handleOptionChange(index, "optionText", e.target.value)}
                  className="border p-2 flex-grow"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveOption(index)}
                  className="ml-2 px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Remove
                </button>

                {/* Checkbox for enabling description */}
                <label className="ml-2 flex items-center">
                  <input
                    type="checkbox"
                    checked={option.description}
                    onChange={(e) => handleOptionChange(index, "description", e.target.checked)}
                    className="ml-2"
                  />
                  <span className="ml-1 text-gray-600">Enable Description</span>
                </label>
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

      {/* Form for Rating questions */}
      {showDetailsForm && formData.questionType === 'rating' && (
        <>
          <div>
            <h1>Type the rating question and specify the scale</h1>
            
            <input
              type="text"
              placeholder="Enter your question"
              value={formData.questionText || ""}
              onChange={(e) => setFormData({ ...formData, questionText: e.target.value })}
              className="border p-2 w-full mb-2"
            />

            <div className="flex items-center mb-2">
              <label className="mr-2">Maximum Rating:</label>
              <input
                type="number"
                value={formData.maxRating || 5}
                min={1}
                max={5}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    maxRating: parseInt(e.target.value, 10) || 5,
                  })
                }
                className="border p-2 w-20"
              />
            </div>

            <div className="flex items-center mb-2 mx-auto">
              <label className="mr-2">Max: 5</label>
            </div>

            <button
              onClick={() => handleSubmit(formData)}
              className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Submit
            </button>

            <button
              onClick={handleGoBack}
              className="mt-4 ml-4 px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
            >
              Back
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default EditQuestion;
