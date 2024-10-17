"use client";

import React, { useEffect, useState } from "react";
import 'react-toastify/dist/ReactToastify.css';
import Form from "@/components/Forms";
import api from "../../../../../lib/axios";
import { toast, ToastContainer } from "react-toastify";
import { useRouter } from "next/navigation";
import { Permission } from "@/types";

interface FormData {
  roleName: string;
  permissions: string[];
}


const CreateRole: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        const response = await api.get(`/permissions`);
        // setPermissions(response.data.permission);
        // console.log(response);
        setPermissions(response.data.permission);
        setLoading(false);
        // console.log(permissions)
      } catch (err) {
        console.log(err)
      };
    }
    fetchPermissions()
  }, []);

  const onSubmit = async (data: FormData) => {
    try {
      console.log("Form Data Submitted:", data);
      await api.post("/roles", data);
      toast.success("Role created successfully!", { position: "top-right", autoClose: 3000 });
      setTimeout(() => router.push('/dashboard/roles'), 2000);
    } catch (error) {
      console.error("Failed to create role", error);
      toast.error("Failed to create role", { position: "top-right", autoClose: 3000 });
    }
  };

  // console.log(`this is the array${permissions}`)

  const inputs = [
    { label: "roleName", type: "text", name: "roleName" },
    {
      label: "Permissions",
      type: "multiple", // Assuming your Form component supports this type correctly.
      options: permissions.map((permission) => ({
        label: permission.permissionName,
        value: permission.id,
      })),
    },
  ];

  console.log(permissions);
  if (loading) return <div>Loading...</div>;

  
  return (
    
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow">
      <ToastContainer />
      <h2 className="text-2xl font-bold mb-4">Create New Role</h2>
      <Form<FormData>
        Input={inputs}
        onSubmit={onSubmit}
      />
    </div>
  );
};

export default CreateRole;
