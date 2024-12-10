"use client";

import React, { useEffect, useState } from "react";
import 'react-toastify/dist/ReactToastify.css';
import Form from "@/components/Forms";
import api from "../../../../../lib/axios";
import { ToastContainer } from "react-toastify";
import { useRouter } from "next/navigation";
import { Role } from "@/types";
import { Course } from "@/types";
import Loading from "@/app/loading";
import { showToast } from "@/components/ToastMessage";
import axios from "axios";

interface FormData {
  username: string;
  email: string;
  password: string;
  roleId: number;
}

const NewUserForm: React.FC = () => {
  const router = useRouter();
  const [roles, setRoles] = useState<Role[]>([]);
  const [course, setCourse] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [formLoading, setFormLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await api.get('/roles', {
          method: 'GET',
        });
        setRoles(response.data.roles);
      } catch (err) {
        console.log(err)
        showToast.error('Failed to fetch roles');
      } finally {
        setLoading(false);
      }
    };

    fetchRoles();

    const fetchCourse = async () => {
      try {
        const response = await api.get('/courses', {
          method: 'GET',
        });
        setCourse(response.data.course);
      } catch (err) {
        console.log(err)
        showToast.error('Failed to fetch courses');
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, []);

  const onSubmit = async (data: FormData) => {
    setFormLoading(true);
    try {
      await api.post("/users", data);
      showToast.success("User created successfully!");
      // Delay the redirect to allow the toast to display
      setTimeout(() => {
        router.push('/dashboard/users'); // Redirect to the user list
      }, 2000);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // Extract and display the error message if it's an AxiosError
        const errorMessage = error.response?.data?.message || 'An unexpected error occurred';
        showToast.error(`${errorMessage}`);
      } else if (error instanceof Error) {
        // Handle other types of errors
        showToast.error(`${error.message}`);
      } else {
        // Handle unexpected error types
        showToast.error('An unexpected error occurred');
      }
    }
    finally {
      setFormLoading(false);
    }
    finally {
      setFormLoading(false);
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
    {
      label: 'courseId',
      type: 'multiple',
      options: course.map((course) => ({
        label:`${course.courseName}`,
        value: course.id,
      })),
    },
  ];
  const extraButtons = [
    {
      label: 'Back',
      type: 'button',
      onClick: () => router.push('/dashboard/users'),
    }
  ];

  if (loading) return <Loading />


  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow">
      <ToastContainer />
      <h2 className="text-2xl font-bold mb-4">Create New User</h2>
      <Form<FormData>
        Input={inputs}
        onSubmit={onSubmit}
        loading={formLoading}
        addButton={extraButtons}
      />
       {/* Password Guidelines Section */}
       <div className="mt-8 bg-gray-100 p-4 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-4">Password Requirements</h2>
            <ul className="list-disc pl-5">
              <li className="text-sm text-gray-700">At least 8 characters long</li>
              <li className="text-sm text-gray-700">Includes both uppercase and lowercase letters</li>
              <li className="text-sm text-gray-700">Includes at least one number</li>
              <li className="text-sm text-gray-700">Includes at least one special character (e.g., !@#$%^&*)</li>
            </ul>
          </div>
    </div>
  );
};

export default NewUserForm
