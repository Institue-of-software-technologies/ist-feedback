"use client";

import React, { useEffect, useState } from "react";
import 'react-toastify/dist/ReactToastify.css';
import Form from "@/components/Forms";
import api from "../../../../../lib/axios";
import { toast, ToastContainer } from "react-toastify";
import { useRouter } from "next/navigation";
import { ClassTime, FeedbackQuestion, Intake, Module, Trainer } from "@/types";

interface FormData {
  trainerId: number;
  intakeId: number;
  classTimeId: number;
  moduleId: number;
  questionId: number;
  tokenExpiration: Date;
}

const NewFeedbackForm: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(true);
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [intakes, setIntakes] = useState<Intake[]>([]);
  const [classTimes, setClassTimes] = useState<ClassTime[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [questions, setQuestions] = useState<FeedbackQuestion[]>([]);
  const [step, setStep] = useState<number>(1);

  const onSubmit = async (data: FormData) => {
    try {
      await api.post("/feedback", data);
      toast.success("Feedback created successfully!", { position: "top-right", autoClose: 3000 });
      setTimeout(() => {
        router.push('/dashboard/feedback');
      }, 1000);
    } catch (error) {
      console.error("Failed to create feedback", error);
      toast.error("Failed to create feedback", { position: "top-right", autoClose: 3000 });
    }
  };

  useEffect(() => {
    const fetchTrainers = async () => {
      try {
        const response = await api.get(`/trainers`);
        setTrainers(response.data.trainer);
      } catch (err) {
        console.log(err);
      }
    };
    const fetchQuestions = async () => {
      try {
        const response = await api.get(`/feedback-questions`);
        setQuestions(response.data.questions);
      } catch (err) {
        console.log(err);
      }
    };
    const fetchIntakes = async () => {
      try {
        const response = await api.get(`/intakes`);
        setIntakes(response.data.intake);
      } catch (err) {
        console.log(err);
      }
    };
    const fetchClassTimes = async () => {
      try {
        const response = await api.get(`/class-times`);
        setClassTimes(response.data.classTime);
      } catch (err) {
        console.log(err);
      }
    };
    const fetchModules = async () => {
      try {
        const response = await api.get(`/modules`);
        setModules(response.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchTrainers();
    fetchIntakes();
    fetchClassTimes();
    fetchModules();
    fetchQuestions();
    setLoading(false);
  }, []);

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  const step1Inputs = [
    {
      label: "trainerId",
      type: "select",
      options: trainers.map((trainer) => ({
        label: `${trainer.trainerName} - ${trainer.course.courseName}`,
        value: trainer.id,
      })),
    },
    {
      label: "moduleId",
      type: "select",
      options: modules.map((module) => ({
        label: `${module.moduleName} - ${module.course.courseName}`,
        value: module.id,
      })),
    },
    {
      label: "intakeId",
      type: "select",
      options: intakes.map((intake) => ({
        label: `${intake.intakeName} - ${intake.intakeYear}`,
        value: intake.id,
      })),
    },
  ];

  const step2Inputs = [
    {
      label: "classTimeId",
      type: "select",
      options: classTimes.map((classTime) => ({
        label: classTime.classTime,
        value: classTime.id,
      })),
    },
    {
      label: "questionId",
      type: "multiple",
      options: questions.map((question) => ({
        label: `${question.questionText} - ${question.questionType}`,
        value: question.id,
      })),
    },
    {
      label: "tokenExpiration",
      type: "date",
    },
  ];

  const handleNextStep = () => setStep((prev) => prev + 1);
  const handlePrevStep = () => setStep((prev) => prev - 1);

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow">
      <ToastContainer />
      <h2 className="text-2xl font-bold mb-4">Create New Feedback - Step {step}</h2>
      <Form<FormData>
        Input={step === 1 ? step1Inputs : step2Inputs}
        onSubmit={step === 2 ? onSubmit : handleNextStep}
      />
      <div className="flex justify-between mt-4">
        {step > 1 && (
          <button onClick={handlePrevStep} className="bg-gray-300 text-gray-800 px-4 py-2 rounded">
            Previous
          </button>
        )}
        {step === 1 && (
          <button onClick={handleNextStep} className="bg-blue-500 text-white px-4 py-2 rounded">
            Next
          </button>
        )}
      </div>
    </div>
  );
};

export default NewFeedbackForm;
