"use client";

import React, { useState } from "react";
import 'react-toastify/dist/ReactToastify.css';
import Form from "@/components/Forms";
import api from "../../../../../lib/axios";
import { Input } from "@/components/Forms"
import { toast, ToastContainer } from "react-toastify";
import { useRouter } from "next/navigation";

interface FormData {
  questionText?: string;
  questionType: 'open-ended' | 'closed-ended' | 'rating' | null;
  options?: string[]; // For closed-ended options
}

const FeedbackQuestionCreate: React.FC = () => {
  const router = useRouter();
  
  // State to manage form data and whether to show the second form
  const [formData, setFormData] = useState<FormData>({ questionType: null, options: [""] });
  const [showDetailsForm, setShowDetailsForm] = useState(false);

  // Handles submission for the final form (open-ended/closed-ended)
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

  // Handles submission for the question type selection form
  const handleQuestionTypeSelection = (data: { questionType: 'open-ended' | 'closed-ended' | 'rating' }) => {
    setFormData({ ...formData, questionType: data.questionType });
    setShowDetailsForm(true); // Show the second form after question type is selected
  };

  // Go back to the question type selection
  const handleGoBack = () => {
    setShowDetailsForm(false); // Hide the details form and show the question type selection form
  };

  // Add a new option to the closed-ended question
  const handleAddOption = () => {
    setFormData(prev => ({
      ...prev,
      options: [...(prev.options || []), ""]
    }));
  };

  // Remove an option from the closed-ended question
  const handleRemoveOption = (index: number) => {
    setFormData(prev => ({
      ...prev,
      options: (prev.options || []).filter((_, i) => i !== index)
    }));
  };

  // Handle input change for options
  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...(formData.options || [])];
    newOptions[index] = value;
    setFormData(prev => ({
      ...prev,
      options: newOptions
    }));
  };

  // Initial form for selecting the question type
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

            {/* Question text input */}
            <input
              type="text"
              placeholder="Enter your question"
              value={formData.questionText || ""}
              onChange={(e) =>
                setFormData({ ...formData, questionText: e.target.value })
              }
              className="border p-2 w-full mb-2"
            />

            {/* Dynamically render the options */}
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
              onClick={() => onSubmit(formData)}
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

export default FeedbackQuestionCreate;
