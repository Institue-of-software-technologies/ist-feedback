"use client";
import istLogo from '../../../../public/assets/image/cropedImag.png';
import Link from 'next/link';
import Image from 'next/image';
import React, { useState } from 'react';
import { useRouter } from "next/navigation";
import { useUser } from '@/context/UserContext';
import api from '../../../../lib/axios';
import { ToastContainer } from 'react-toastify';
import { showToast } from '@/components/ToastMessage';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Add loading state
  const { setUser } = useUser();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true); // Start loading when the form is submitted
    try {
      const response = await api.post('/auth/login', {
        email: email,
        password: password,
        rememberMe: rememberMe,
      });
  
      const useRolesPermissions = response.data.client;
  
      router.push('/dashboard');
      localStorage.setItem('userRolesPermissions', JSON.stringify(useRolesPermissions));
      setUser(useRolesPermissions);
  
      if (response.status !== 200) {
        throw new Error(`error: ${response.data.message}`);
      }
  
    } catch (error: unknown) {
      console.error('Login failed', error);
  
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
    } finally {
      setIsLoading(false); // Stop loading once the request is done
    }
  };
  
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <ToastContainer />
      <div className="bg-white shadow-md rounded-lg p-8 max-w-sm w-full">
        <div className="text-center">
          {/* Logo */}
          <div className="mb-1">
            <Image
              className="mx-auto w-[100px] h-[75px]"
              src={istLogo}
              alt="ist_logo"
              width={100}
              height={100}
            />
          </div>

          {/* Welcome Back and Login Section */}
          <h4 className="font-medium mb-2 text-black">
            <b>Welcome Back,</b>
          </h4>

          <h2 className="mt-4 border-b-2 border-red-600 pb-1 mx-auto w-fit text-black">
            <b>LOGIN</b>
          </h2>

          <h5 className="text-gray-600 mt-2">
            Please Insert Your Credentials
          </h5>
        </div>

        {/* Form Section */}
        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm text-black"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="relative mt-1">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'} // Toggle between 'text' and 'password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm text-black"
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)} // Toggle visibility on button click
                className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-400"
              >
                {showPassword ? (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7S2 12 2 12z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                ) : (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M2.458 12C3.732 7.943 7.522 5 12 5c4.478 0 8.268 2.943 9.542 7-.292.992-.734 1.93-1.318 2.782M15 12a3 3 0 01-6 0m10.317 2.783A9.969 9.969 0 0112 19c-4.478 0-8.268-2.943-9.542-7a9.973 9.973 0 011.318-2.783"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="rememberMe"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
              />
              <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-900">
                Remember Me
              </label>
            </div>

            <div className="text-sm">
              <Link href="/forgot-password" className="font-medium text-red-600 hover:text-red-500">
                Forgot your password?
              </Link>
            </div>
          </div>

          {/* Submit Button with Spinner */}
          <button
            type="submit"
            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={isLoading} // Disable button when loading
          >
            {isLoading ? (
              <div className="flex items-center">
                <svg
                  className="animate-spin h-5 w-5 mr-2 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  ></path>
                </svg>
                Logging in...
              </div>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          Don’t have an account?{" "}
          <Link href="/register" className="font-medium text-red-600 hover:text-red-500">
            Sign up here
          </Link>
        </p>
      </div>
    </div>
  );
}
