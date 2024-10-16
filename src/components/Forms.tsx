"use client";

import React from "react";
import { Path, useForm, FieldValues } from "react-hook-form";

interface Input {
  label: string;
  type: string;
  options?: { label: string; value: number }[]; 
}

interface FormProps<T extends FieldValues> {
  Input: Input[]; 
  onSubmit: (data: T) => void; 
}

const Form = <T extends FieldValues>({ Input, onSubmit }: FormProps<T>): JSX.Element => {
  const { register, handleSubmit } = useForm<T>();

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {Input.map((input) => (
        // Conditional rendering to handle potentially undefined input
        input && ( 
          <div key={input.label} className="mb-4"> 
            <label htmlFor={input.label} className="block text-sm font-medium text-gray-700">
              {input.label}
            </label>
            {input.type === "select" ? (
              <select
                id={input.label}
                {...register(input.label as Path<T>, { required: `${input.label} is required` })}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="">Select {input.label}</option>
                {input.options?.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            ) : (
              <input
                id={input.label}
                type={input.type}
                {...register(input.label as Path<T>, { required: `${input.label} is required` })}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            )}
            {/* {errors[input.label as Path<T>]?.message && ( 
            <p className="text-red-500 text-sm mt-1">
                {String(errors[input.label as Path<T>].message)} 
            </p>
            )} */}
          </div>
        )
      ))}
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
        Submit
      </button>
    </form>
  );
};

export default Form;


// form onSubmit={handleSubmit(onSubmit)}>
//         {/* Username */}
//         <div className="mb-4">
//           <label htmlFor="username" className="block text-sm font-medium text-gray-700">
//             Username
//           </label>
//           <input
//             id="username"
//             {...register("username", { required: "Username is required" })}
//             className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
//           />
//           {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>}
//         </div>

//         {/* Email */}
//         <div className="mb-4">
//           <label htmlFor="email" className="block text-sm font-medium text-gray-700">
//             Email
//           </label>
//           <input
//             id="email"
//             type="email"
//             {...register("email", { required: "Email is required" })}
//             className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
//           />
//           {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
//         </div>

//         {/* Password */}
//         <div className="mb-4">
//           <label htmlFor="password" className="block text-sm font-medium text-gray-700">
//             Password
//           </label>
//           <input
//             id="password"
//             type="password"
//             {...register("password", { required: "Password is required", minLength: { value: 6, message: "Password must be at least 6 characters long" } })}
//             className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
//           />
//           {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
//         </div>

//         {/* Role */}
//         <div className="mb-4">
//           <label htmlFor="roleId" className="block text-sm font-medium text-gray-700">
//             Role
//           </label>
//           <select
//             id="roleId"
//             {...register("roleId", { required: "Role is required" })}
//             className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
//           >
//             <option value="">Select Role</option>
//             <option value={1}>Super Admin</option>
//             <option value={2}>Admin</option>
//             <option value={3}>User</option>
//           </select>
//           {errors.roleId && <p className="text-red-500 text-sm mt-1">{errors.roleId.message}</p>}
//         </div>

//         {/* Submit Button */}
//         <button
//           type="submit"
//           disabled={isSubmitting}
//           className="w-full bg-blue-600 text-white p-2 rounded-md shadow hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
//         >
//           {isSubmitting ? "Creating..." : "Create User"}
//         </button>
//       </form>