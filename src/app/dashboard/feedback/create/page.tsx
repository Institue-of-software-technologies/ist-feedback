"use client";

import React, { useEffect, useState } from "react";
import 'react-toastify/dist/ReactToastify.css';
import Form from "@/components/Forms";
import api from "../../../../../lib/axios";
import { toast, ToastContainer } from "react-toastify";
import { useRouter } from "next/navigation";
import { ClassTime, Intake, Module, Trainer } from "@/types";

interface FormData {
  trainerId: number,
  intakeId: number,
  classTimeId: number,
  moduleId: number,
  tokenExpiration: Date,
}

const NewFeedbackForm: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(true);
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [intakes, setIntakes] = useState<Intake[]>([]);
  const [classTimes, setClassTimes] = useState<ClassTime[]>([]);
  const [modules, setModules] = useState<Module[]>([]);


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
        setLoading(false);

      } catch (err) {
        console.log(err)
      };
    }
    const fetchIntakes = async () => {
      try {
        const response = await api.get(`/intakes`);
        setIntakes(response.data.intake);
        setLoading(false);

      } catch (err) {
        console.log(err)
      };
    }
    const fetchClassTimes = async () => {
      try {
        const response = await api.get(`/classTime`);
        setClassTimes(response.data.classTime);
        setLoading(false);

      } catch (err) {
        console.log(err)
      };
    }    

    const fetchModules = async () => {
      try {
        const response = await api.get(`/modules`);
        console.log(response)
        setModules(response.data);
        setLoading(false);

      } catch (err) {
        console.log(err)
      };
    }

    fetchTrainers()
    fetchIntakes()
    fetchClassTimes()    
    fetchModules()
  }, []);


  if (loading) {
    return <div className="text-center">Loading...</div>;
  }
  

  const inputs = [
    {
      label: "trainerId",
      type: "select",
      options: trainers.map((trainer) => ({
        label: trainer.trainerName,
        value: trainer.id,
      })),
    },
    {
      label: "moduleId",
      type: "select",
      options: modules.map((module) => ({
        label: `${module.moduleName} - ${module.courseId}`,
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
    {
      label: "classTimeId",
      type: "select", 
      options: classTimes.map((classTime) => ({
        label: classTime.classTime,
        value: classTime.id,
      })),
    },
    {
      label: "tokenExpiration",
      type: "date"
    }
  ];


  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow">
      <ToastContainer />
      <h2 className="text-2xl font-bold mb-4">Create New Feedback</h2>
      <Form<FormData>
        Input={inputs}
        onSubmit={onSubmit}
      />
    </div>
  );
};

export default NewFeedbackForm
