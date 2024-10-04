"use client";

import React from "react";
import { useRouter, useParams } from 'next/navigation';
import { useForm } from "react-hook-form";
import api from '../../../../../lib/axios'; // Adjust the import as needed
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface FormData {
  username: string;
  email: string;
  password: string;
  roleId: number;
}

const NewUserForm: React.FC = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    try {
      await api.post("/users", data);
      toast.success("User created successfully!", { position: "top-right", autoClose: 3000 });
      reset(); // Reset form after successful submission
      // Delay the redirect to allow the toast to display
      setTimeout(() => {
        router.push('/dashboard/users'); // Redirect to the user list
      }, 2000);
    } catch (error) {
      console.error("Failed to create user", error);
      toast.error("Failed to create user", { position: "top-right", autoClose: 3000 });
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow">
      <ToastContainer /> {/* Include ToastContainer for rendering toasts */}
      
      <h2 className="text-2xl font-bold mb-4">Create New User</h2>
      
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Username */}
        <div className="mb-4">
          <label htmlFor="username" className="block text-sm font-medium text-gray-700">
            Username
          </label>
          <input
            id="username"
            {...register("username", { required: "Username is required" })}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
          {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>}
        </div>

        {/* Email */}
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            id="email"
            type="email"
            {...register("email", { required: "Email is required" })}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
        </div>

        {/* Password */}
        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            id="password"
            type="password"
            {...register("password", { required: "Password is required", minLength: { value: 6, message: "Password must be at least 6 characters long" } })}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
          {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
        </div>

        {/* Role */}
        <div className="mb-4">
          <label htmlFor="roleId" className="block text-sm font-medium text-gray-700">
            Role
          </label>
          <select
            id="roleId"
            {...register("roleId", { required: "Role is required" })}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="">Select Role</option>
            <option value={1}>Super Admin</option>
            <option value={2}>Admin</option>
            <option value={3}>User</option>
          </select>
          {errors.roleId && <p className="text-red-500 text-sm mt-1">{errors.roleId.message}</p>}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 text-white p-2 rounded-md shadow hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          {isSubmitting ? "Creating..." : "Create User"}
        </button>
      </form>
    </div>
  );
};

export default NewUserForm;
