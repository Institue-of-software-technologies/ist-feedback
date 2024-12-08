'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import api from '../../../../../../lib/axios';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { showToast } from '@/components/ToastMessage';
import Form from '@/components/Forms';
import Loading from '@/app/loading';
import { ClassTime, Feedback, FeedbackQuestion, Intake, Module, User } from '@/types';

interface FormData {
  trainerId: number;
  classTimeId: number;
  moduleId: number;
  intakeId: number;
  feedbackQuestions: string[];
  tokenStartTime: string;
  tokenExpiration: string;
}

const EditFeedback = () => {
  const router = useRouter();
  const { feedbackId } = useParams();
  const [loading, setLoading] = useState<boolean>(true);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [trainers, setTrainers] = useState<User[]>([]);
  const [intakes, setIntakes] = useState<Intake[]>([]);
  const [classTimes, setClassTimes] = useState<ClassTime[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [feedbackQuestions, setFeedbackQuestions] = useState<FeedbackQuestion[]>([]);
  const [selectedFeedbackQuestions, setSelectedFeedbackQuestions] = useState<number[]>([]);
  const [tokenStartTime, setTokenStartTime] = useState<Date | null>(null);
  const [tokenExpiration, setTokenExpiration] = useState<Date | null>(null);
  const [formLoading, setFormLoading] = useState<boolean>(false);

  useEffect(() => {
    if (feedbackId) {
      const fetchFeedbacks = async () => {
        try {
          const response = await api.get(`/feedback/${feedbackId}`);
          const feedback = response.data.feedback;
          const questions = response.data.feedbackQuestions;

          setFeedback(feedback);
          setSelectedFeedbackQuestions(questions.map((fq: { feedbackQuestion: { id: number } }) => fq.feedbackQuestion.id));

          setTokenStartTime(new Date(feedback.tokenStartTime));
          setTokenExpiration(new Date(feedback.tokenExpiration));
        } catch (err) {
          console.log('Failed to fetch feedback', err);
        } finally {
          setLoading(false);
        }
      };
      fetchFeedbacks();
    }
  }, [feedbackId]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [trainersResponse, intakesResponse, classTimesResponse, modulesResponse, feedbackQuestionsResponse] = await Promise.all([
          api.get(`/trainers`),
          api.get(`/intakes`),
          api.get(`/class-times`),
          api.get(`/modules`),
          api.get(`/feedback-questions`),
        ]);
        setTrainers(trainersResponse.data.trainers);
        setIntakes(intakesResponse.data.intake);
        setClassTimes(classTimesResponse.data.classTime);
        setModules(modulesResponse.data);
        setFeedbackQuestions(feedbackQuestionsResponse.data.questions);
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    };

    fetchData();
  }, []);

  const handleFormSubmit = async (data:FormData) => {
    setFormLoading(true);
    try {
      await api.put(`/feedback/${feedbackId}`,data);
      showToast.success('Feedback updated successfully!');
      setTimeout(() => {
        router.push('/dashboard/feedback');
      }, 2000);
    } catch (err) {
      console.log(err);
      showToast.error('Failed to update feedback');
    }
    finally {
      setFormLoading(false);
    }
  };

  if (loading) return <Loading />;

  const inputs = [
    {
      label: 'trainerId',
      type: 'select',
      value: feedback?.courseTrainer.trainerId,
      options: trainers.map((trainer) => ({
        label: trainer.username,
        value: trainer.id,
      })),
    },
    {
      label: 'classTimeId',
      type: 'select',
      value: feedback?.classTimeId,
      options: classTimes.map((classTime) => ({
        label: classTime.classTime,
        value: classTime.id,
      })),
    },
    {
      label: 'FeedbackQuestions',
      type: 'multiple',
      defaultSelect: selectedFeedbackQuestions,
      options: feedbackQuestions.map((question) => ({
        label: question.questionText,
        value: question.id,
      })),
    },
    {
      label: 'model',
      type: 'select',
      value: feedback?.moduleId,
      options: modules.map((module) => ({
        label: module.moduleName,
        value: module.id,
      })),
    },
    {
      label: 'intakeId',
      type: 'select',
      value: feedback?.intakeId,
      options: intakes.map((intake) => ({
        label: intake.intakeName,
        value: intake.id,
      })),
    },
    {
      label: 'tokenStartTime',
      type: 'date',
      valueDate: tokenStartTime,
    },
    {
      label: 'tokenExpiration',
      type: 'date',
      valueDate: tokenExpiration,
    },
  ];
  const extraButtons = [
    {
      label: 'Back',
      type: 'button',
      onClick: () => router.push('/dashboard/feedback'),
    }
  ];
  

  return (
    <div className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow">
      <ToastContainer />
      <h3 className="text-2xl font-bold mb-4">Edit Feedback</h3>
      <Form<FormData>
        Input={inputs}
        onSubmit={handleFormSubmit}
        loading={formLoading}
        addButton={extraButtons}
      />
    </div>
  );
};

export default EditFeedback;
