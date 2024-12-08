"use client"
import { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import api from "../../../../lib/axios";
import { useRouter, useSearchParams } from "next/navigation";
import 'react-toastify/dist/ReactToastify.css';
import { showToast } from "@/components/ToastMessage";
import Form from "@/components/Forms";
import Loading from '@/app/loading';
import { User } from "@/types";

interface FormData {
  NewPassword: string;
  ConfirmPassword: string;
}

export default function ResetPassword() {
  const [isLoading, setIsLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [formLoading, setFormLoading] = useState<boolean>(false);
  const [tokenAuthenticated, setTokenAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const email = searchParams.get('email');
  const userId = searchParams.get('user');


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
    const fetchUser = async () => {
      try {
        const response = await api.get(`/users/${userId}`);
        setUser(response.data.user);
        console.log(response.data.user);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();

  }, [router, token,userId]);

  const handleSubmit = async (data: FormData) => {
    console.log(data);
    setFormLoading(true);

    const passwordRegex = new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/);

    // Validate password strength
    if (!passwordRegex.test(data.NewPassword)) {
      showToast.error(
        "Password must be at least 8 characters long, contain uppercase, lowercase, a digit, and a special character.",
        { position: "top-right", autoClose: 4000 }
      );
      setIsLoading(false);
      setFormLoading(false);
      return;
    }

    // Check if the passwords match
    if (data.NewPassword !== data.ConfirmPassword) {
      showToast.error("Passwords do not match!");
      setIsLoading(false);
      setFormLoading(false);
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

  const sendNotification = async () => {
    setLoading(true);
    try {
      const response = await api.post('/notification',
        {
          title: 'Password Reset Link Request',
          message: `User with the email ${email} has requested to resend the password reset link.`,
          priority: 'normal',
          email: email
        });
      if (response.status === 201) {
        showToast.success("Notification send successfully");
        setTimeout(() => {
          router.push('/login'); // Redirect to the user list
        }, 2000);
      }
    } catch (err) {
      console.error(err);
      showToast.error('Invalid token or server error');
    } finally {
      setLoading(false);
    }
  };

  const inputs = [
    { label: "NewPassword", type: "password" },
    { label: "ConfirmPassword", type: "password" }
  ];

  if (isLoading) return <Loading />

  if (user && user.acceptInvite) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-gray-100">
        <div className="bg-white shadow-md rounded-lg p-6 text-center max-w-lg w-full">
          <h1 className="text-2xl font-semibold text-green-600">Invite Already Accepted</h1>
          <p className="mt-2 text-gray-500">
            You have already accepted the invitation. Please proceed to log in with your credentials.
          </p>
          <button
            onClick={() => router.push('/login')}
            className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
          >
            Go to Login
          </button>
          <p className="mt-2 text-gray-400 text-sm">
            If you need assistance, please contact support.
          </p>
        </div>
      </div>
    );
  }

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
          <div className="bg-white shadow-md rounded-lg p-6 text-center max-w-lg w-full">
            <h1 className="text-2xl font-semibold text-red-600">Invitation Link Expired</h1>
            <p className="mt-2 text-gray-500">
              The invitation link you received has expired. Please click the button below to notify the admin to resend a new link.
            </p>
            <button
              type="submit"
              onClick={sendNotification}
              className={`bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={loading} // Disable button while loading
            >
              {loading ? (
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
                  sending notification...
                </div>

              ) : (
                "Notify Admin to Resend Link"
              )}
            </button>
            <p className="mt-2 text-gray-400 text-sm">
              If you have any questions, please contact support.
            </p>
          </div>
        </div>
      )}

    </div>
  )
}