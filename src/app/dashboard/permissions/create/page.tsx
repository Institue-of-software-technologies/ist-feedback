"use client";

import React, { useState } from "react";
import 'react-toastify/dist/ReactToastify.css';
import Form from "@/components/Forms";
import api from "../../../../../lib/axios";
import { ToastContainer } from "react-toastify";
import { useRouter } from "next/navigation";
import { showToast } from "@/components/ToastMessage";

interface FormData {
  permissionName: string;
}

const NewPermissionForm: React.FC = () => {
  const router = useRouter();
  const [formLoading, setFormLoading] = useState<boolean>(false);
  const onSubmit = async (data: FormData) => {
    setFormLoading(true);
    try {
      await api.post("/permissions", data);
      showToast.success("Permission created successfully!");
      // Delay the redirect to allow the toast to display
      setTimeout(() => {
        router.push('/dashboard/permissions'); // Redirect to the permissions list
      }, 2000);
    } catch (error) {
      console.error("Failed to create permissions", error);
      showToast.error("Failed to create permissions");
    }
    finally {
      setFormLoading(false);
    }
  };

  const inputs = [
    { label: "permissionName", type: "text" },
  ];
  const extraButtons = [
    {
      label: 'Back',
      type: 'button',
      onClick: () => router.push('/dashboard/permissions'),
    }
  ];
 

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow">
      <ToastContainer />
      <h2 className="text-2xl font-bold mb-4">Create New permissions</h2>
      <Form<FormData>
        Input={inputs}
        onSubmit={onSubmit}
        loading={formLoading}
        addButton={extraButtons}
      />
    </div>
  );
};

export default NewPermissionForm
