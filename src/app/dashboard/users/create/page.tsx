"use client";

import React from "react";
import 'react-toastify/dist/ReactToastify.css';
import Form from "@/components/Forms";
import api from "../../../../../lib/axios";
import { toast, ToastContainer } from "react-toastify";
import { useRouter } from "next/navigation";

interface FormData {
  username: string;
  email: string;
  password: string;
  roleId: number;
}

const NewUserForm: React.FC = () => {
    const router = useRouter();
    const onSubmit = async (data: FormData) => {
        try {
          await api.post("/users", data);
          toast.success("User created successfully!", { position: "top-right", autoClose: 3000 });
          // Delay the redirect to allow the toast to display
          setTimeout(() => {
            router.push('/dashboard/users'); // Redirect to the user list
          }, 2000);
        } catch (error) {
          console.error("Failed to create user", error);
          toast.error("Failed to create user", { position: "top-right", autoClose: 3000 });
        }
      };

  const inputs= [
      { label: "username", type: "text" },
      { label: "email", type: "email" },
      { label: "password", type: "password" },
      {
          label: "roleId",
          type: "select",
          options: [
              { label: "Super Admin", value: 1 },
              { label: "Admin", value: 2 },
              { label: "User", value: 3 },
          ],
      },
  ];

  return (
      <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow">
        <ToastContainer />
          <h2 className="text-2xl font-bold mb-4">Create New User</h2>
          <Form<FormData>
              Input={inputs} 
              onSubmit={onSubmit} 
          />
      </div>
  );
};

export default NewUserForm
