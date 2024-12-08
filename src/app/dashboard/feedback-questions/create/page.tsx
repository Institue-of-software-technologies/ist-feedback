"use client";

import React, { useState } from "react";
import 'react-toastify/dist/ReactToastify.css';
import Form from "@/components/Forms";
import api from "../../../../../lib/axios";
import { Input } from "@/components/Forms";
import { ToastContainer } from "react-toastify";
import { useRouter } from "next/navigation";
import { showToast } from "@/components/ToastMessage";

interface FormData {
  questionText?: string;
  questionType: 'open-ended' | 'closed-ended' | 'rating' | null;
  options?: { text: string; description?: boolean }[];
  minRating?: number;
  maxRating?: number;
}

const FeedbackQuestionCreate: React.FC = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    questionType: null,
    options: [{ text: "", description: false }],
    minRating: 1,
    maxRating: 10,
  });
  const [showDetailsForm, setShowDetailsForm] = useState(false);
  const [formLoading, setFormLoading] = useState<boolean>(false);

  const onSubmit = async (data: FormData) => {
    setFormLoading(true);
    try {
      await api.post("/feedback-questions", data);
      showToast.success("Feedback question created successfully!");
      setTimeout(() => {
        router.push('/dashboard/feedback-questions');
      }, 2000);
    } catch (error) {
      console.error("Failed to create feedback question", error);
      showToast.error("Failed to create feedback question.");
    }
    finally {
      setFormLoading(false);
    }
  };

  const handleQuestionTypeSelection = (data: { questionType: 'open-ended' | 'closed-ended' | 'rating' }) => {
    setFormData({ ...formData, questionType: data.questionType });
    setShowDetailsForm(true);
  };

  const handleGoBack = () => {
    setShowDetailsForm(false);
  };

  const handleAddOption = () => {
    setFormData(prev => ({
      ...prev,
      options: [...(prev.options || []), { text: "", description: false }]
    }));
  };

  const handleRemoveOption = (index: number) => {
    setFormData(prev => ({
      ...prev,
      options: (prev.options || []).filter((_, i) => i !== index)
    }));
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...(formData.options || [])];
    newOptions[index].text = value;
    setFormData(prev => ({
      ...prev,
      options: newOptions
    }));
  };

  const toggleDescription = (index: number) => {
    const newOptions = [...(formData.options || [])];
    newOptions[index].description = !newOptions[index].description;
    setFormData(prev => ({
      ...prev,
      options: newOptions
    }));
  };

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

  // Form for open-ended question
  const openEndedInputs: Input[] = [
    { label: "questionText", type: "text", name: "questionText" },
    { label: "questionType", type: "hidden", name: "questionType", value: "open-ended" },
  ];
  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow">
      <ToastContainer />
      <h2 className="text-2xl font-bold mb-4">Create New Feedback Question</h2>

      {!showDetailsForm && (
        <Form<{ questionType: 'open-ended' | 'closed-ended' | 'rating' }>
          Input={typeSelectionInputs}
          onSubmit={handleQuestionTypeSelection}
          loading={formLoading}
        />
      )}
      {/* Second form based on selected question type */}
      
      {/* Form for Open-Ended questions */}
      {showDetailsForm && formData.questionType === 'open-ended' && (
        <>
          <div>
            <h1>Type the question below</h1>
          </div>
          <Form<FormData>
            Input={openEndedInputs}
            onSubmit={onSubmit}
            loading={formLoading}
          />
          <button
            onClick={handleGoBack}
            className="mt-4 px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
          >
            Back
          </button>
        </>
      )}

      {/* Form for Closed-Ended questions */}
      {showDetailsForm && formData.questionType === 'closed-ended' && (
        <>
          <div>
            <h1>Type the question below and the answers</h1>

            <input
              type="text"
              placeholder="Enter your question"
              value={formData.questionText || ""}
              onChange={(e) => setFormData({ ...formData, questionText: e.target.value })}
              className="border p-2 w-full mb-2"
            />

            {formData.options?.map((option, index) => (
              <div key={index} className="flex flex-col mb-2">
                <div className="flex items-center mb-2">
                  <input
                    type="text"
                    placeholder={`Option ${index + 1}`}
                    value={option.text}
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
                <div className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    checked={option.description || false}
                    onChange={() => toggleDescription(index)}
                    className="mr-2"
                  />
                  <span>Add Description</span>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={handleAddOption}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Add Answer
            </button>

            <button
              onClick={() => onSubmit(formData)}
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
                value={formData.maxRating || 10}
                min={1}
                max={5}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    maxRating: parseInt(e.target.value, 10) || 10,
                  })
                }
                className="border p-2 w-20"
              />
            </div>

            <div className="flex items-center mb-2 mx-auto">
              <label className="mr-2">Max: 10</label>
            </div>

            <button
              onClick={() => onSubmit(formData)}
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

export default FeedbackQuestionCreate;
