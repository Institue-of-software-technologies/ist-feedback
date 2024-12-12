"use client"

import React, { useEffect, useState } from "react";
import api from "../../lib/axios";
import { ToastContainer } from "react-toastify";
import Form from '@/components/Forms';
import { useRouter } from "next/navigation";
import 'react-toastify/dist/ReactToastify.css';
import { Feedback } from "@/types";
import { useUser } from "@/context/UserContext";
import Image from 'next/image';
import istLogo from '../../public/assets/image/cropedImag.png';
import Loading from './loading';  // Import the Loading component
import { showToast } from "@/components/ToastMessage";
import { AxiosError } from "axios";

interface FormData {
  Token: string;
  AdminNo: string;
}

export default function Home() {
  const router = useRouter();
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [cookie, setCookie] = useState<boolean>(true);
  const [formLoading, setFormLoading] = useState<boolean>(false);
  const { setUser } = useUser();

  useEffect(() => {

    const checkFeedBackAvailability = async () => {
      try {
        const response = await api.get('/feedback');
        setFeedback(response.data.feedbacks || []);
      } catch (err) {
        console.log(err)
        showToast.error('Failed to fetch feedback');
      } finally {
        setLoading(false);
      }
    };
    checkFeedBackAvailability();

    const getClientCookie = async () => {
      try {
        const response = await api.get('/feedback/answer');
        const hasCookie = response.data.myCookie === 'true' || response.data.myCookie === true;
        setCookie(hasCookie);
      } catch (error) {
        console.log(error);
      }
    };
    getClientCookie();
  }, []);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const sessionResponse = await api.get("/auth/session", {
          withCredentials: true,
        });
  
        if (sessionResponse.status !== 200) {
          console.error("Failed to fetch session:", sessionResponse.data);
          // Handle error, e.g., display an error message to the user
          return;
        }
  
        router.push("/dashboard");
      } catch (error) {
        console.error("Error fetching session:", error);
        // Handle error, e.g., display a generic error message to the user
      }
    };
  
    fetchSession();
  }, [router]);


  const onSubmit = async (data: FormData) => {
    setFormLoading(true);
    try {
      const response = await api.get(`/feedback/token/${data.Token}`);
      const { status, message, token } = response.data;

      if (status === "active") {
        localStorage.setItem('userRolesPermissions', JSON.stringify(response.data));
        setUser(response.data);
        showToast.success("Token Active! Redirecting...");

        setTimeout(() => {
          router.push(`/student-feedback/${token.id}`);
        }, 2000);
      } else {
        showToast.error(message);
      }
    } catch (error) {
      if (error instanceof AxiosError && error.response?.data?.message) {
        showToast.error(error.response.data.message);
      } else {
        showToast.error("An unexpected error occurred. Please try again.");
      }
    }
 finally {
      setFormLoading(false);
    }
  };



  if (loading) return <Loading />;

  const inputs = [
    { label: "Token", type: "text" }
  ];

  return (
    <div>
      {feedback.length > 0 ? (
        <div className="flex flex-col items-center justify-center min-h-screen p-10 bg-gray-100">
          <ToastContainer />
          {cookie === true ? (
            <div className="bg-white shadow-lg rounded-lg p-8 lg:w-[28rem] text-center">
              <div className="flex flex-col items-center space-y-4">
                <Image
                  className="mx-auto w-24 h-24"
                  src={istLogo}
                  alt="IST logo"
                  width={96}
                  height={96}
                />
                <p className="text-lg font-semibold text-gray-800">
                  Thank you for submitting your feedback!
                </p>
                <p className="text-gray-500">
                  This page is now closed as we have already received your input.
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-white shadow-md rounded-lg p-6 lg:w-96">
              <div className="p-4">
                <div className="text-center">
                  {/* Logo */}
                  <div className="mb-1">
                    <Image
                      className="mx-auto w-[100px] h-[75px]"
                      src={istLogo}
                      alt="IST logo"
                      width={100}
                      height={100}
                    />
                  </div>

                  {/* Feedback Prompt */}
                  <h4 className="font-medium mb-2 text-black">
                    <b>Enter Feedback Token</b>
                  </h4>
                  <h5 className="text-gray-600 mt-2">
                    Your feedback helps us improve please share your thoughts!
                  </h5>
                </div>
                <Form<FormData>
                  Input={inputs}
                  onSubmit={onSubmit}
                  buttonColor="bg-red-600"
                  buttonText="Submit Token"
                  loading={formLoading}
                  hoverColor="hover:bg-red-700"
                />
              </div>
            </div>
          )}

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
