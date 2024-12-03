"use client";

import React, { useEffect, useState } from "react";
import 'react-toastify/dist/ReactToastify.css';
import Form from "@/components/Forms";
import api from "../../../../../lib/axios"; // Adjust the path as needed
import { ToastContainer } from "react-toastify";
import { useRouter } from "next/navigation";
import { Course } from "@/types";
import { showToast } from "@/components/ToastMessage";

interface FormData {
  moduleName: string;
  courseName: string;
}

const NewModuleForm: React.FC = () => {
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        const response = await api.get(`/courses`);
        setCourses(response.data.course);
        setLoading(false);
      } catch (err) {
        console.log(err)
      };
    }
    fetchPermissions()
  }, []);

  const onSubmit = async (data: FormData) => {
    try {
      await api.post("/modules", data); // Updated to post to the modules endpoint
      showToast.success("Module created successfully!");

      // Delay the redirect to allow the toast to display
      setTimeout(() => {
        router.push('/dashboard/modules'); // Redirect to the module list
      }, 2000);
    } catch (error) {
      console.error("Failed to create module", error);
      showToast.error("Failed to create module");
    }
  };
  if (loading) return <div>Loading...</div>;

  const inputs = [
    { label: "moduleName", type: "text" },
    {
      label: "course",
      type: "select", // Assuming your Form component supports this type correctly.
      options: courses.map((course) => ({
        label: course.courseName,
        value: course.id,
      })),
    }, // Assuming you link the module to a course
  ];


  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow">
      <ToastContainer />
      <h2 className="text-2xl font-bold mb-4">Create New Module</h2>
      <Form<FormData>
        Input={inputs}
        onSubmit={onSubmit}
      />
    </div>
  );
};

export default NewModuleForm;
