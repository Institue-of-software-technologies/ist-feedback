"use client";

import React, { useState } from "react";
import 'react-toastify/dist/ReactToastify.css';
import Form from "@/components/Forms";
import api from "../../../../../lib/axios";
import { Input } from "@/components/Forms";
import { toast, ToastContainer } from "react-toastify";
import { useRouter } from "next/navigation";

interface FormData {
  questionText?: string;
  questionType: 'open-ended' | 'closed-ended' | 'rating' | null;
  options?: { text: string; description?: boolean }[];
}

const FeedbackQuestionCreate: React.FC = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    questionType: null,
    options: [{ text: "", description: false }],
  });
  const [showDetailsForm, setShowDetailsForm] = useState(false);

  const onSubmit = async (data: FormData) => {
    try {
      await api.post("/feedback-questions", data);
      toast.success("Feedback question created successfully!", { position: "top-right", autoClose: 3000 });
      setTimeout(() => {
        router.push('/dashboard/feedback-questions');
      }, 2000);
    } catch (error) {
      console.error("Failed to create feedback question", error);
      toast.error("Failed to create feedback question.", { position: "top-right", autoClose: 3000 });
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
            onSubmit={onSubmit}
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
    </div>
  );
};

export default FeedbackQuestionCreate;
