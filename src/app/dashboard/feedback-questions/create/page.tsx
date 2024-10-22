"use client";

import React from "react";
import 'react-toastify/dist/ReactToastify.css';
import Form from "@/components/Forms";
import api from "../../../../../lib/axios";
import { toast, ToastContainer } from "react-toastify";
import { useRouter } from "next/navigation";

interface FormData {
  questionText: string;
}

const FeedbackQuestionCreate: React.FC = () => {
    const router = useRouter();
    const onSubmit = async (data: FormData) => {
        try {
          await api.post("/feedback-questions", data);
          toast.success("Feedback question created successfully!", { position: "top-right", autoClose: 3000 });
          // Delay the redirect to allow the toast to display
          setTimeout(() => {
            router.push('/dashboard/feedback-questions'); // Redirect to the user list
          }, 2000);
        } catch (error) {
          console.error("Failed to create feedback question", error);
          toast.error("Failed to create feedback question.", { position: "top-right", autoClose: 3000 });
        }
      };

  const inputs= [
      { label: "Question", type: "text" },
  ];

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow">
      <ToastContainer />
        <h2 className="text-2xl font-bold mb-4">Create New Feedback Question</h2>
        <Form<FormData>
            Input={inputs} 
            onSubmit={onSubmit} 
        />
    </div>
);
};

export default FeedbackQuestionCreate;