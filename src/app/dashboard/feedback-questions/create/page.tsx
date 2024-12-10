"use client";

import React, { useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import "react-toastify/dist/ReactToastify.css";
import Form from "@/components/Forms";
import api from "../../../../../lib/axios";
import { ToastContainer } from "react-toastify";
import { useRouter } from "next/navigation";
import { showToast } from "@/components/ToastMessage";

interface FormData {
  questionText?: string;
  questionType: "open-ended" | "closed-ended" | "rating" | null;
  options?: { text: string; description?: boolean }[];
  minRating?: number;
  maxRating?: number;
  required?: boolean;
}

const FeedbackQuestionCreate: React.FC = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    questionType: null,
    options: [{ text: "", description: false }],
    minRating: 1,
    maxRating: 10,
    required: false, // Default value for required field
  });
  const [showDetailsForm, setShowDetailsForm] = useState(false);

  const onSubmit = async (data: FormData) => {
    try {
      await api.post("/feedback-questions", data);
      showToast.success("Feedback question created successfully!");
      setTimeout(() => {
        router.push("/dashboard/feedback-questions");
      }, 2000);
    } catch (error) {
      console.error("Failed to create feedback question", error);
      showToast.error("Failed to create feedback question.");
    }
  };

  const handleQuestionTypeSelection = (data: { questionType: "open-ended" | "closed-ended" | "rating" }) => {
    setFormData({ ...formData, questionType: data.questionType });
    setShowDetailsForm(true);
  };

  const handleGoBack = () => {
    setShowDetailsForm(false);
  };

  const handleAddOption = () => {
    setFormData((prev) => ({
      ...prev,
      options: [...(prev.options || []), { text: "", description: false }],
    }));
  };

  const handleRemoveOption = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      options: (prev.options || []).filter((_, i) => i !== index),
    }));
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...(formData.options || [])];
    newOptions[index].text = value;
    setFormData((prev) => ({
      ...prev,
      options: newOptions,
    }));
  };

  const toggleDescription = (index: number) => {
    const newOptions = [...(formData.options || [])];
    newOptions[index].description = !newOptions[index].description;
    setFormData((prev) => ({
      ...prev,
      options: newOptions,
    }));
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow">
      <ToastContainer />
      <h2 className="text-2xl font-bold mb-4">Create New Feedback Question</h2>

      {!showDetailsForm && (
        <Form<{ questionType: "open-ended" | "closed-ended" | "rating" }>
          Input={[
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
          ]}
          onSubmit={handleQuestionTypeSelection}
        />
      )}

      {showDetailsForm && (
        <div>
          <label className="block text-lg font-medium mb-2">Question Text</label>
          <input
            type="text"
            value={formData.questionText || ""}
            onChange={(e) => setFormData({ ...formData, questionText: e.target.value })}
            placeholder="Enter your question"
            className="border p-2 w-full mb-4"
          />

          <label className="block text-lg font-medium mb-2">Is this question required?</label>
          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              checked={formData.required || false}
              onChange={(e) => setFormData({ ...formData, required: e.target.checked })}
              className="mr-2"
            />
            <span>{formData.required ? "Required" : "Optional"}</span>
          </div>

          {/* Closed-Ended Questions */}
          {formData.questionType === "closed-ended" && (
            <div>
              <h3 className="text-lg font-medium mb-2">Answer Options</h3>
              {formData.options?.map((option, index) => (
                <div key={index} className="grid items-center mb-2">
                  <input
                    type="text"
                    placeholder={`Option ${index + 1}`}
                    value={option.text}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    className="border p-2 flex-grow mr-2"
                  />
                  <button
                    onClick={() => handleRemoveOption(index)}
                    className="bg-red-500 text-white px-4 py-2 mt-2 rounded"
                  >
                    Remove
                  </button>
                  <div className="items-center mb-2">
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
                onClick={handleAddOption}
                className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
              >
                Add Option
              </button>
            </div>
          )}

          {/* Rating Questions */}
          {formData.questionType === "rating" && (
            <div>
              <h3 className="text-lg font-medium mb-2">Rating Question</h3>
              <div className="flex items-center mb-4">
                <label className="mr-2">Minimum Rating:</label>
                <input
                  type="number"
                  value={formData.minRating || 1}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      minRating: parseInt(e.target.value, 10) || 1,
                    })
                  }
                  className="border p-2 w-20"
                />
              </div>
              <div className="flex items-center mb-4">
                <label className="mr-2">Maximum Rating:</label>
                <input
                  type="number"
                  value={formData.maxRating || 10}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      maxRating: parseInt(e.target.value, 10) || 10,
                    })
                  }
                  className="border p-2 w-20"
                />
              </div>
            </div>
          )}

          <button
            onClick={() => onSubmit(formData)}
            className="bg-green-500 text-white px-4 py-2 rounded mt-4"
          >
            Submit
          </button>
          <button
            onClick={handleGoBack}
            className="bg-gray-500 text-white px-4 py-2 rounded mt-4 ml-2"
          >
            Back
          </button>
        </div>
      )}
    </div>
  );
};

export default FeedbackQuestionCreate;
