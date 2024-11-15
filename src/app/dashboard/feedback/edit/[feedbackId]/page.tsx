'use client';

import React, { useState, useEffect, forwardRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import api from '../../../../../../lib/axios';
import { ClassTime, Intake, Module, Trainer, FeedbackQuestion } from '@/types';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useForm } from 'react-hook-form';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { showToast } from '@/components/ToastMessage';

interface FormData {
  trainerId: string;
  classTimeId: string;
  moduleId: string;
  intakeId: string;
  feedbackQuestions: string[];
  tokenExpiration: Date;
}

interface CustomInputProps {
  value?: string;
  onClick?: () => void;
}

const EditFeedback = () => {
  const router = useRouter();
  const { feedbackId } = useParams();
  const [, setFeedbacks] = useState(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [intakes, setIntakes] = useState<Intake[]>([]);
  const [classTimes, setClassTimes] = useState<ClassTime[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [feedbackQuestions, setFeedbackQuestions] = useState<FeedbackQuestion[]>([]);
  const [selectedFeedbackQuestions, setSelectedFeedbackQuestions] = useState<string[]>([]);

  const { register, handleSubmit, setValue } = useForm<FormData>();

  useEffect(() => {
    if (feedbackId) {
      const fetchFeedbacks = async () => {
        try {
          const response = await api.get(`/feedback/${feedbackId}`);
          const feedback = response.data.feedback;
          const questions = response.data.feedbackQuestions;

          setFeedbacks(feedback);

          setValue('trainerId', feedback.trainerId?.toString() || '');
          setValue('classTimeId', feedback.classTimeId?.toString() || '');
          setValue('moduleId', feedback.moduleId?.toString() || '');
          setValue('intakeId', feedback.intakeId?.toString() || '');

          const selectedQuestions = questions.map((fq: { feedbackQuestion: { id: number } }) => fq.feedbackQuestion.id.toString());
          setSelectedFeedbackQuestions(selectedQuestions);
          setValue('feedbackQuestions', selectedQuestions);

          const tokenExpiration = new Date(feedback.tokenExpiration);
          setSelectedDate(tokenExpiration);
        } catch (err) {
          console.log("Failed to fetch feedback", err);
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
        const [trainersResponse, intakesResponse, classTimesResponse, modulesResponse, feedbackQuestionsResponse] = await Promise.all([
          api.get(`/trainers`),
          api.get(`/intakes`),
          api.get(`/class-times`),
          api.get(`/modules`),
          api.get(`/feedback-questions`)
        ]);
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
        tokenExpiration: selectedDate,
        multiSelectField: selectedFeedbackQuestions,
      });
      showToast.success('Feedback updated successfully!');
      setTimeout(() => {
        router.push('/dashboard/feedback');
      }, 2000);
    } catch (err) {
      console.log(err)
      showToast.error('Failed to update feedback');
    }
  };

  const toggleQuestionSelection = (questionId: string) => {
    setSelectedFeedbackQuestions((prevSelected) => {
      const isAlreadySelected = prevSelected.includes(questionId);
      const updatedSelected = isAlreadySelected
        ? prevSelected.filter(id => id !== questionId) // Remove if already selected
        : [...prevSelected, questionId];               // Add if not selected
      setValue('feedbackQuestions', updatedSelected);
      return updatedSelected;
    });
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
              <option key={trainer.id} value={trainer.id.toString()}>
                {trainer.trainerName}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="classTimeId">Class Time</label>
          <select id="classTimeId" {...register('classTimeId')} className="mt-1 block w-full p-2 border border-gray-300 rounded-md">
            {classTimes.map(classTime => (
              <option key={classTime.id} value={classTime.id.toString()}>
                {classTime.classTime}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="feedbackQuestions">Feedback Questions</label>
          <div className="mt-2">
            {feedbackQuestions.map(question => (
              <div key={question.id} className="flex items-center mb-2">
                <input
                  type="checkbox"
                  id={`question-${question.id}`}
                  value={question.id.toString()}
                  checked={selectedFeedbackQuestions.includes(question.id.toString())}
                  onChange={() => toggleQuestionSelection(question.id.toString())}
                  className="mr-2"
                />
                <label htmlFor={`question-${question.id}`} className="text-sm">
                  {question.questionText}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="moduleId">Module</label>
          <select id="moduleId" {...register('moduleId')} className="mt-1 block w-full p-2 border border-gray-300 rounded-md">
            {modules.map(module => (
              <option key={module.id} value={module.id.toString()}>
                {module.moduleName}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="intakeId">Intake</label>
          <select id="intakeId" {...register('intakeId')} className="mt-1 block w-full p-2 border border-gray-300 rounded-md">
            {intakes.map(intake => (
              <option key={intake.id} value={intake.id.toString()}>
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