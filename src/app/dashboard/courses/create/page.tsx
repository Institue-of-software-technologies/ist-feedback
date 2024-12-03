"use client";

import React, { useEffect, useState } from "react";
import 'react-toastify/dist/ReactToastify.css';
import Form from "@/components/Forms";
import api from "../../../../../lib/axios";
import { ToastContainer } from "react-toastify";
import { useRouter } from "next/navigation";
import { showToast } from "@/components/ToastMessage";
import Loading from '../../loading';

interface FormData {
  courseName: string;
}

const NewCourseForm: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(()=>{
    setLoading(false);
  },[])

  const onSubmit = async (data: FormData) => {
    try {
      await api.post("/courses", data);
      showToast.success("Course created successfully!");
      // Delay the redirect to allow the toast to display
      setTimeout(() => {
        router.push('/dashboard/courses'); // Redirect to the user list
      }, 2000);
    } catch (error) {
      console.error("Failed to create courses", error);
      showToast.error("Failed to create courses");
    } finally {
      setLoading(false);
    }
  };
  
  const inputs = [
    { label: "courseName", type: "text" }
  ];
  if (loading) return <Loading />;

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow">
      <ToastContainer />
      <h2 className="text-2xl font-bold mb-4">Create New Course</h2>
      <Form<FormData>
        Input={inputs}
        onSubmit={onSubmit}
      />
    </div>
  );
};

export default NewCourseForm
