"use client"
import { useState } from "react";
import { ToastContainer } from "react-toastify";
import api from "../../../../lib/axios";
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from "next/navigation";
import { showToast } from "@/components/ToastMessage";

export default function ForgotPassword() {
  const [isLoading, setIsLoading] = useState(false); // Add loading state
  const [email, setEmail] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true); // Start loading when the form is submitted

    try {
      const response = await api.post('/auth/forgot-password', { email });

      // Correct condition for status check
      if (response.status === 200) {
        showToast.success(response.data.message, { position: "top-right", autoClose: 3000 });

        // Redirect after showing success message
        setTimeout(() => {
          router.push('/login');
        }, 3000);  // Delay of 3 seconds for toast to show before redirect
      } else {
        showToast.error(response.data.message, { position: "top-right", autoClose: 3000 });
      }
    } catch (error) {
      // Handle invalid email or other errors
      showToast.error('Invalid email or server error', { position: "top-right", autoClose: 3000 });
      console.log(error)
    } finally {
      setIsLoading(false); // Stop loading once the request is done
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <ToastContainer />
      <div className="bg-white shadow-md rounded-lg p-8 max-w-sm w-full">
        <div className="text-center">


          <h2 className="mt-4 border-b-2 border-red-600 pb-1 mx-auto w-fit text-black">
            <b>Forgot</b> your password?
          </h2>

          {/* Welcome Back and Login Section */}
          <h1 className="font-medium mt-4 mb-2 text-black">
            <b>Reset password</b>
          </h1>

          <h5 className="text-gray-600 mt-2">
            We will email you instructions on how to reset your password
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
                Sending...
              </div>
            ) : (
              'Send link'
            )}
          </button>
        </form>
      </div>
    </div>
  )
}