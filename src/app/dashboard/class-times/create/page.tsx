"use client";

import React from "react";
import 'react-toastify/dist/ReactToastify.css';
import Form from "@/components/Forms";
import api from "../../../../../lib/axios";
import { toast, ToastContainer } from "react-toastify";
import { useRouter } from "next/navigation";

interface FormData {
  classTimes: string;
}

const NewClassTimeForm: React.FC = () => {
  const router = useRouter();
  const onSubmit = async (data: FormData) => {
    try {
      await api.post("/class-times", data);
      toast.success("class time created successfully!", { position: "top-right", autoClose: 3000 });
      // Delay the redirect to allow the toast to display
      setTimeout(() => {
        router.push('/dashboard/class-times'); // Redirect to the class-time list
      }, 2000);
    } catch (error) {
      console.error("Failed to create class time", error);
      toast.error("Failed to create class time", { position: "top-right", autoClose: 3000 });
    }
  };

  const inputs = [
    { label: "classTime", type: "text" },
    { label: "classTimeStart",type: "time"},
    { label: "classTimeEnd",type: "time"},
  ];

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow">
      <ToastContainer />
      <h2 className="text-2xl font-bold mb-4">Create New class Time</h2>
      <Form<FormData>
        Input={inputs}
        onSubmit={onSubmit}
      />
    </div>
  );
};

export default NewClassTimeForm
