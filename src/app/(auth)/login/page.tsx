"use client";
import istLogo from '../../../../public/assets/image/cropedImag.png';
import '../../../css/loginPage.css';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { useRouter } from "next/navigation";
import { useUser } from '@/context/UserContext';
import api from '../../../../lib/axios';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const { setUser } = useUser();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const response = await api.post('/auth/login', {
        email: email,
        password: password,
        rememberMe: rememberMe
      })
      const useRolesPermissions =response.data.client
      localStorage.setItem('userRolesPermissions', JSON.stringify(useRolesPermissions))

      setUser(useRolesPermissions);

      router.push('/dashboard')

      if (response.status !== 200) {
        throw new Error(`error: ${response.data.message}`);
      }

    } catch (error) {
      console.error('Login failed', error);
      alert('Invalid credentials');
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-md rounded-lg p-8 max-w-sm w-full">
        <div className="text-center">
          {/* Logo */}
          <div className="mb-1">
            <Image
              className="mx-auto w-[100px] h-[75px]"
              src={istLogo} // Update with the correct path to your logo
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
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm text-black"
            />
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
              <Link href="#" className="font-medium text-red-600 hover:text-red-500">
                Forgot your password?
              </Link>
            </div>
          </div>

          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Sign In
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
