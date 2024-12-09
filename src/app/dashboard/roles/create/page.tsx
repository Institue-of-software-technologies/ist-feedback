"use client";

import React, { useEffect, useState } from "react";
import 'react-toastify/dist/ReactToastify.css';
import Form from "@/components/Forms";
import api from "../../../../../lib/axios";
import { ToastContainer } from "react-toastify";
import { useRouter } from "next/navigation";
import { Permission } from "@/types";
import { showToast } from "@/components/ToastMessage";
import Loading from "@/app/loading";

interface FormData {
  roleName: string;
  permissions: string[];
}


const CreateRole: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const router = useRouter();
  const [formLoading, setFormLoading] = useState<boolean>(false);

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
    setFormLoading(true);
    try {
      console.log("Form Data Submitted:", data);
      await api.post("/roles", data);
      showToast.success("Role created successfully!");
      setTimeout(() => router.push('/dashboard/roles'), 2000);
    } catch (error) {
      console.error("Failed to create role", error);
      showToast.error("Failed to create role");
    }
    finally {
      setFormLoading(false);
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
  const extraButtons = [
    {
      label: 'Back',
      type: 'button',
      onClick: () => router.push('/dashboard/roles'),
    }
  ];
  

  console.log(permissions);
  if (loading) return <Loading />


  return (

    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow">
      <ToastContainer />
      <h2 className="text-2xl font-bold mb-4">Create New Role</h2>
      <Form<FormData>
        Input={inputs}
        onSubmit={onSubmit}
        loading={formLoading}
        addButton={extraButtons}
      />
    </div>
  );
};

export default CreateRole;
