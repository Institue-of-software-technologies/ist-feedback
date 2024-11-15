"use client";

import React, { useEffect, useState } from "react";
import 'react-toastify/dist/ReactToastify.css';
import Form from "@/components/Forms";
import api from "../../../../../lib/axios";
import { ToastContainer } from "react-toastify";
import { useRouter } from "next/navigation";
import { Role } from "@/types";
import Loading from "@/app/loading";
import { showToast } from "@/components/ToastMessage";

interface FormData {
  username: string;
  email: string;
  password: string;
  roleId: number;
}

const NewUserForm: React.FC = () => {
  const router = useRouter();
  const [roles, setRoles] = useState<Role[]>([]);
  const [, setFilteredRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState<boolean>(true);


  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await api.get('/roles', {
          method: 'GET',
        });
        setRoles(response.data.roles);
        setFilteredRoles(response.data);
      } catch (err) {
        console.log(err)
        showToast.error('Failed to fetch roles');
      } finally {
        setLoading(false);
      }
    };

    fetchRoles();
  }, []);

  const onSubmit = async (data: FormData) => {
    try {
      await api.post("/users", data);
      showToast.success("User created successfully!");
      // Delay the redirect to allow the toast to display
      setTimeout(() => {
        router.push('/dashboard/users'); // Redirect to the user list
      }, 2000);
    } catch (error) {
      console.error("Failed to create user", error);
      showToast.error("Failed to create user");
    }
  };

  const inputs = [
    { label: "username", type: "text" },
    { label: "email", type: "email" },
    { label: "password", type: "password" },
    {
      label: 'roleId',
      type: 'select',
      options: roles.map((role) => ({
        label: role.roleName,
        value: role.id,
      })),
    },
  ];

  if (loading) return <Loading />


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
