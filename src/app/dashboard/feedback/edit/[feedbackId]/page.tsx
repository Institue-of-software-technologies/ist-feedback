'use client';

import React, { useState, useEffect, forwardRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import api from '../../../../../../lib/axios';
import { ClassTime, Feedback, FeedbackQuestion, Intake, Module, Trainer } from '@/types';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useForm } from 'react-hook-form';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface FormData {
  trainerId: string;
  classTimeId: string;
  moduleId: string;
  intakeId: string;
  feedbackQuestion: string;
  tokenExpiration: Date;
}

interface CustomInputProps {
  value?: string;
  onClick?: () => void;
}

const EditFeedback = () => {
  const router = useRouter();
  const { feedbackId } = useParams();
  const [, setFeedbacks] = useState<Feedback | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [intakes, setIntakes] = useState<Intake[]>([]);
  const [classTimes, setClassTimes] = useState<ClassTime[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [feedbackQuestions, setFeedbackQuestions] = useState<FeedbackQuestion[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const { register, handleSubmit, setValue } = useForm<FormData>();

  useEffect(() => {
    if (feedbackId) {
      const fetchFeedbacks = async () => {
        try {
          const response = await api.get(`/feedback/${feedbackId}`);
          setFeedbacks(response.data.feedback);
          // Set default values for the form fields
          setValue('trainerId', response.data.feedback.trainer.id);
          setValue('classTimeId', response.data.feedback.classTime.id);
          setValue('moduleId', response.data.feedback.module.id);
          setValue('intakeId', response.data.feedback.intake.id);

          // Set the selected date for the DatePicker
          const tokenExpiration = new Date(response.data.feedback.tokenExpiration);
          setSelectedDate(tokenExpiration);
        } catch (err) {
          setError('Failed to fetch feedback');
        } finally {
          setLoading(false);
        }
      };
      fetchFeedbacks();
    }
  }, [feedbackId, setValue]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [trainersResponse, intakesResponse, classTimesResponse, modulesResponse,feedbackQuestionsResponse] = await Promise.all([
          api.get(`/trainers`),
          api.get(`/intakes`),
          api.get(`/class-times`),
          api.get(`/modules`),
          api.get(`/feedback-questions`)
        ]);
        console.log(fetchData)
        setTrainers(trainersResponse.data.trainer);
        setIntakes(intakesResponse.data.intake);
        setClassTimes(classTimesResponse.data.classTime);
        setModules(modulesResponse.data);
        setFeedbackQuestions(feedbackQuestionsResponse.data.questions);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    fetchData();
  }, []);

  const handleFormSubmit = async (data: FormData) => {
    try {
      await api.put(`/feedback/${feedbackId}`, {
        ...data,
        tokenExpiration: selectedDate, // Make sure to send the selected date
      });
      toast.success('Feedback updated successfully!', {
        position: 'top-right',
        autoClose: 2000,
      });
      setTimeout(() => {
        router.push('/dashboard/feedback');
      }, 2000);
    } catch (err) {
      toast.error('Failed to update feedback', {
        position: 'top-right',
        autoClose: 3000,
      });
    } feedbackQuestions
  };

  const CustomInput = forwardRef<HTMLInputElement, CustomInputProps>(
    ({ value, onClick }, ref) => (
      <div className="relative w-full">
        <input
          onClick={onClick}
          value={value || ""}
          ref={ref}
          readOnly
          className="w-full p-2 bg-gray-100 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-400"
          placeholder="Select date and time"
        />
      </div>
    )
  );

  CustomInput.displayName = "CustomInput";

  if (loading) return <div>Loading...</div>;
  if (error) return <div className='text-red-500'>{error}</div>;

  return (
    <div className='p-6'>
      <ToastContainer />
      <h3 className='text-2xl font-bold mb-4'>Edit Feedback</h3>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <div>
          <label htmlFor="trainerId">Trainer</label>
          <select id="trainerId" {...register('trainerId')} className="mt-1 block w-full p-2 border border-gray-300 rounded-md">
            {trainers.map(trainer => (
              <option key={trainer.id} value={trainer.id}>
                {trainer.trainerName} - {trainer.course.courseName}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="classTimeId">Class Time</label>
          <select id="classTimeId" {...register('classTimeId')} className="mt-1 block w-full p-2 border border-gray-300 rounded-md">
            {classTimes.map(classTime => (
              <option key={classTime.id} value={classTime.id}>
                {classTime.classTime}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label htmlFor="feedbackQuestion">Feedback Question</label>
          <select id="feedbackQuestion" {...register('feedbackQuestion')} className="mt-1 block w-full p-2 border border-gray-300 rounded-md">
            {feedbackQuestions.map(feedbackQuestion => (
              <option key={feedbackQuestion.id} value={feedbackQuestion.id}>
                {feedbackQuestion.questionText}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="moduleId">Module</label>
          <select id="moduleId" {...register('moduleId')} className="mt-1 block w-full p-2 border border-gray-300 rounded-md">
            {modules.map(module => (
              <option key={module.id} value={module.id}>
                {module.moduleName}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="intakeId">Intake</label>
          <select id="intakeId" {...register('intakeId')} className="mt-1 block w-full p-2 border border-gray-300 rounded-md">
            {intakes.map(intake => (
              <option key={intake.id} value={intake.id}>
                {intake.intakeName}
              </option>
            ))}
          </select>
        </div>


        <div className="flex flex-col mb-3">
          <label htmlFor="tokenExpiration" className="mb-1">Token Expiration</label>
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            customInput={<CustomInput />}
            showTimeSelect
            dateFormat="MMMM d, yyyy h:mm aa"
            className="w-full mt-1"
          />
        </div>

        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Submit
        </button>
      </form>
    </div>
  );
};

export default EditFeedback;