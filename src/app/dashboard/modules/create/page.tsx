"use client";

import React from "react";
import 'react-toastify/dist/ReactToastify.css';
import Form from "@/components/Forms";
import api from "../../../../../lib/axios"; // Adjust the path as needed
import { toast, ToastContainer } from "react-toastify";
import { useRouter } from "next/navigation";

interface FormData {
  moduleName: string;
  courseId: number;
}

const NewModuleForm: React.FC = () => {
    const router = useRouter();

    const onSubmit = async (data: FormData) => {
        try {
          await api.post("/modules", data); // Updated to post to the modules endpoint
          toast.success("Module created successfully!", { position: "top-right", autoClose: 3000 });
          
          // Delay the redirect to allow the toast to display
          setTimeout(() => {
            router.push('/dashboard/modules'); // Redirect to the module list
          }, 2000);
        } catch (error) {
          console.error("Failed to create module", error);
          toast.error("Failed to create module", { position: "top-right", autoClose: 3000 });
        }
    };

    const inputs = [
      { label: "moduleName", type: "text" },
      { label: "courseId", type: "number" } // Assuming you link the module to a course
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
