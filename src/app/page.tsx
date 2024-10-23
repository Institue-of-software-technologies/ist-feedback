"use client"

import React, { useEffect, useState } from "react";
import api from "../../lib/axios";
import { toast, ToastContainer } from "react-toastify";
import Form from '@/components/Forms';
import {  useRouter } from "next/navigation";
import 'react-toastify/dist/ReactToastify.css';

interface FormData {
  enterToken: string;
}

export default function Home() {
  const router = useRouter();
  const [feedback, setFeedback] = useState();
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkFeedBackAvailability = async () => {
      try {
        const response = await api.get('/feedback');
        console.log(response);
        setFeedback(response.data.feedback);
      } catch (err) {
        toast.error('Failed to fetch feedback', { position: "top-right", autoClose: 3000 });
      } finally {
        setLoading(false);
      }
    };
    checkFeedBackAvailability();
  }, []);

  const onSubmit = async (data: FormData) => {
    try {
      await api.get(`/feedback/token/${data.enterToken}`);
      toast.success("Token found redirecting...", { position: "top-right", autoClose: 3000 });
      // Delay the redirect to allow the toast to display
      setTimeout(() => {
        router.push(`/studets-feedback/${data.enterToken}`);
        // router.push('/dashboard/users'); // Redirect to the user list
      }, 2000);
    } catch (error) {
      console.error("Failed to create token", error);
      toast.error("Token not avilable", { position: "top-right", autoClose: 3000 });
    }
  };

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }
  const inputs = [
    { label: "enterToken", type: "text" },
  ];

  return (
    <div>
      {feedback ? (
        <div className="flex flex-col items-center justify-center min-h-screen p-10 bg-gray-100">
          <ToastContainer />
          <div className="bg-white shadow-md rounded-lg p-6 text-center">
            <div className="p-4">
              <Form<FormData>
                Input={inputs}
                onSubmit={onSubmit}
                buttonColor="bg-red-600"
                buttonText="Submit Token"
                hoverColor="hover:bg-red-700"
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-gray-100">
          <div className="bg-white shadow-md rounded-lg p-6 text-center">
            <h1 className="text-2xl font-semibold text-red-600">No Feedback Available</h1>
            <p className="mt-2 text-gray-500">
              Currently, there are no feedback entries available. Please check back later or contact support for more information.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

