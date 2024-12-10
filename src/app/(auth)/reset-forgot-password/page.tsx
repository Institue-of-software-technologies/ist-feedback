"use client"
import { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import api from "../../../../lib/axios";
import { useRouter, useSearchParams } from "next/navigation";
import 'react-toastify/dist/ReactToastify.css';
import { showToast } from "@/components/ToastMessage";
import Form from "@/components/Forms";
import Loading from '@/app/loading';

interface FormData {
  NewPassword: string;
  ConfirmPassword: string;
}

export default function ResetPassword() {
  const [isLoading, setIsLoading] = useState(true); // Add loading state
  const [formLoading, setFormLoading] = useState<boolean>(false);
  const [tokenAuthenticated, setTokenAuthenticated] = useState<boolean>(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const email = searchParams.get('email');


  useEffect(() => {
    const checkResetToken = async () => {
      try {
        const response = await api.get(`/auth/reset-password/${token}`);
        if (response.status === 200) {
          setTokenAuthenticated(true);
        }
      } catch (error) {
        console.log(error);
        setTokenAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    }
    checkResetToken();
  }, [router, token]);

  const handleSubmit = async (data: FormData) => {
    console.log(data);
    setFormLoading(true);

    const passwordRegex = new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[^\s]{8,}$/);

    // Validate password strength
    if (!passwordRegex.test(data.NewPassword)) {
      showToast.error(
        "Password must be at least 8 characters long, contain uppercase, lowercase, a digit, and a special character.",
        { position: "top-right", autoClose: 4000 }
      );
      setIsLoading(false);
      return;
    }

    // Check if the passwords match
    if (data.NewPassword !== data.ConfirmPassword) {
      showToast.error("Passwords do not match!");
      setIsLoading(false);
      return;
    }

    try {
      const password = data.NewPassword;
      const response = await api.post('/auth/reset-password', { token, email, password });

      if (response.status === 200) {
        showToast.success(response.data.message);
        setTimeout(() => {
          router.push('/login'); // Navigate only on success
        }, 3000);
      } else {
        showToast.error(response.data.message || 'Password reset failed.');
      }
    } catch (error: unknown) {
      console.error(error);
      showToast.error('Invalid token or server error');
    } finally {
      setIsLoading(false);
      setFormLoading(false);
    }
  };


  const inputs = [
    { label: "NewPassword", type: "password" },
    { label: "ConfirmPassword", type: "password" }
  ];

  if (isLoading) return <Loading />

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <ToastContainer />
      {tokenAuthenticated ? (
        <div className="bg-white shadow-md rounded-lg p-8 max-w-sm w-full">
          <div className="text-center">

            {/* Welcome Back and Login Section */}
            <h1 className="font-medium mt-4 mb-2 text-black">
              <b>Reset password</b>
            </h1>

            <h5 className="text-gray-600 mt-2">
              Enter you new password for <span style={{ color: "#DC2626" }}><b>{email}</b></span>
            </h5>
          </div>
          <Form<FormData>
            Input={inputs}
            onSubmit={handleSubmit}
            buttonColor="bg-red-600"
            buttonText="Reset password"
            loading={formLoading}
            hoverColor="hover:bg-red-700"
          />
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-gray-100">
          <div className="bg-white shadow-md rounded-lg p-6 text-center max-w-md w-full">
            <h1 className="text-2xl font-semibold text-red-600">Password Reset Token Expired</h1>
            <p className="mt-2 text-gray-500">
              Your password reset token has expired. Please navigate to the login form and click the &quot;Forgot Password&quot; link to receive a new reset link.
            </p>
            <a
              href="/login"
              className="mt-4 inline-block px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition"
            >
              Go to Login
            </a>
            <p className="mt-2 text-gray-400 text-sm">
              You will be redirected to the login page in 5 seconds.
            </p>
          </div>
        </div>

      )}

    </div>
  )
}