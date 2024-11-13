"use client"
import { useState } from "react";
import { ToastContainer,toast } from "react-toastify";
import api from "../../../../lib/axios";
import { useRouter, useSearchParams } from "next/navigation";
import 'react-toastify/dist/ReactToastify.css';

export default function ResetPassword(){
    const [isLoading, setIsLoading] = useState(false); // Add loading state
    const [confirmPassword, setConfirmPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [showNewPassword, setShowNewPassword] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get('token');
    const email = searchParams.get('email');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        const passwordRegex = new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/);
        if (!passwordRegex.test(newPassword)) {
            toast.error("Password must be at least 8 characters long, contain uppercase, lowercase, a digit, and a special character.", { position: "top-right", autoClose: 4000 });
            setIsLoading(false);
            return;
          }
        // Check if the passwords match
        if (newPassword !== confirmPassword) {
            toast.error("Passwords do not match!", { position: "top-right", autoClose: 3000 });
            setIsLoading(false);
            return; // Stop the submission if passwords don't match
        }

        try {
            const response = await api.post('/auth/reset-password', { token, email, newPassword });

            if (response.status === 200) {
                toast.success(response.data.message, { position: "top-right", autoClose: 3000 });
                setTimeout(() => {
                    router.push('/login');
                }, 3000);
            } else {
                toast.error(response.data.message, { position: "top-right", autoClose: 3000 });
            }
        } catch (error) {
            console.log(error);
            toast.error('Invalid email or server error', { position: "top-right", autoClose: 3000 });
        } finally {
            setIsLoading(false);
        }
    };

    return(
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
          <ToastContainer />
          <div className="bg-white shadow-md rounded-lg p-8 max-w-sm w-full">
            <div className="text-center">
    
            {/* Welcome Back and Login Section */}
            <h1 className="font-medium mt-4 mb-2 text-black">
                <b>Reset password</b>
            </h1>
    
            <h5 className="text-gray-600 mt-2">
                Enter you new password for <span style={{color:"#DC2626"}}><b>{email}</b></span>
            </h5>
            </div>
    
            {/* Form Section */}
            <form onSubmit={handleSubmit} className="space-y-6 mt-4">

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                 New Password
              </label>
              <div className="relative mt-1">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'} // Toggle between 'text' and 'password'
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm text-black"
                  placeholder="Enter New Password"
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

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                 Confirm Password
              </label>
              <div className="relative mt-1">
                <input
                  id="password"
                  type={showNewPassword ? 'text' : 'password'} // Toggle between 'text' and 'password'
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm text-black"
                  placeholder="Enter New Password"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)} // Toggle visibility on button click
                  className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-400"
                >
                  {showNewPassword ? (
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
                    Reseting...
                </div>
                ) : (
                'Reset Password'
                )}
            </button>
            </form>
          </div>
     </div>
    )
}