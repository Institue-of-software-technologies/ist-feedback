"use client";
import { Feedback, FeedbackQuestionSelect } from '@/types';
import React, { useEffect, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from '../../../../lib/axios';
import { useParams, useRouter } from 'next/navigation';
import { useUser } from '@/context/UserContext';

interface FormValues {
    [key: string]: string | number; // This allows dynamic keys for each question
}

export default function StudentFeedback() {
    const [feedback, setFeedback] = useState<Feedback | null>(null);
    const [feedbackQuestion, setFeedbackQuestion] = useState<FeedbackQuestionSelect[] | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const { feedbackId } = useParams();
    const router = useRouter();
    const { user } = useUser();
    console.log(user)
    const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<FormValues>();

    const numbers = Array.from({ length: 10 }, (_, i) => i + 1);

    useEffect(() => {
        if (feedbackId) {
            const fetchFeedback = async () => {
                try {
                    const response = await api.get(`/feedback/${feedbackId}`);
                    setFeedback(response.data.feedback);
                    setFeedbackQuestion(response.data.feedbackQuestions)

                } catch (err) {
                    setError('Failed to fetch feedback');
                    toast.error('Failed to fetch feedback', { position: "top-right", autoClose: 3000 });
                } finally {
                    setLoading(false);
                }
            };
            fetchFeedback();
        }
    }, [feedbackId]);

    const onSubmit: SubmitHandler<FormValues> = async (data) => {
        const formattedData = Object.entries(data).map(([key, value]) => {
            // Extract the question ID from the key (e.g., "question-1" becomes 1)
            const questionID = parseInt(key.replace("question-", ""), 10);
            return {
                feedbackId: feedback?.id,
                questionId: questionID,
                answer: value
            };
        });

        try {
            const response = await api.post('/feedback/answer', { formData: formattedData });
            toast.success("Feedback submitted successfully!", { position: "top-right", autoClose: 3000 });
            console.log(response)
            setTimeout(() => {
                router.push(`/`);
            }, 3000);
        } catch (error) {
            toast.error('Failed to submit feedback', { position: "top-right", autoClose: 3000 });
        }
    };


    if (loading) return <div>Loading...</div>;
    if (error) return <div className="text-red-500">{error}</div>;

    if (!user?.permissions.includes('view_feedback')) {
        return <div>You do not have access to this page.</div>;
      }

    return (
        <div className="bg-gray-100 min-h-screen text-black p-4">
            <ToastContainer />
            <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-lg shadow-lg p-6">
                <h1 className="text-center text-2xl font-bold text-red-600">
                    STUDENT FEEDBACK QUESTIONS FOR <b>{feedback?.trainer.course.courseName} {feedback?.intake.intakeName}</b>
                </h1>

                <div className="border border-gray-200 shadow-lg rounded-lg p-6 bg-white w-full sm:max-w-3xl lg:max-w-5xl mx-auto mt-8">
                    <div className="flex flex-col sm:flex-row sm:justify-between mb-4 space-y-4 sm:space-y-0">
                        <div>
                            <p className="text-lg font-semibold text-gray-800">Trainer Name: <span className="font-normal text-gray-600">{feedback?.trainer.trainerName}</span></p>
                            <p className="text-md text-gray-700 mt-4">Course: <span className="font-normal">{feedback?.trainer.course.courseName}</span></p>
                            <p className="text-md text-gray-700 mt-1">Class Time: <span className="font-normal">{feedback?.classTime.classTime}</span></p>
                        </div>
                        <div className="text-left sm:text-right">
                            <p className="text-lg font-semibold text-gray-800 mt-5">Module Name: <span className="font-normal text-gray-600">{feedback?.module.moduleName}</span></p>
                            <p className="text-md text-gray-700 mt-1">Intake Name: <span className="font-normal">{feedback?.intake.intakeName}</span></p>
                        </div>
                    </div>
                </div>


                {feedbackQuestion && feedbackQuestion.length > 0 ? (
                    feedbackQuestion.map((question, index) => {
                        const questionKey = `question-${question.feedbackQuestion.id}`;
                        return (
                            <div key={question.feedbackQuestion.id} className="my-3">
                                <h3 className="text-lg font-semibold">{index + 1}. {question.feedbackQuestion.questionText}</h3>

                                {question.feedbackQuestion.questionType === "open-ended" && (
                                    <textarea
                                        className="w-full mt-5 p-2 border rounded"
                                        placeholder="Type your response here..."
                                        rows={5}
                                        {...register(questionKey, { required: "This field is required" })}
                                    />
                                )}

                                {question.feedbackQuestion.answerOption.map((option) => (
                                    <div key={option.id} className="flex items-center mb-2">
                                        <input
                                            type="radio"
                                            id={`option-${question.feedbackQuestion.id}-${option.id}`}
                                            value={option.optionText}
                                            {...register(questionKey, { required: "This field is required" })}
                                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                        />
                                        <label htmlFor={`option-${question.feedbackQuestion.id}-${option.id}`} className="ml-2 block text-lg text-gray-900">
                                            {option.optionText}
                                        </label>
                                    </div>
                                ))}

                                {question.feedbackQuestion.questionType === "rating" && (
                                    <div className="flex justify-center items-center mt-7 overflow-x-auto">
                                        {numbers.map((number) => (
                                            <button
                                                key={number}
                                                type="button"
                                                className={`h-10 w-14 md:h-10 md:w-32 sm:h-12 sm:w-32 lg:h-14 lg:w-28 inline-flex items-center justify-center text-base lg:text-xl font-medium border border-gray-300 
                            ${watch(questionKey) === number ? "bg-red-600 text-white" : "bg-white text-gray-800"} 
                            focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 
                            hover:bg-red-600 hover:text-white whitespace-nowrap`}
                                                onClick={() => setValue(questionKey, number)}
                                            >
                                                {number}
                                            </button>
                                        ))}
                                    </div>
                                )}

                                {errors[questionKey] && (
                                    <p className="text-red-500 text-sm mt-1">{errors[questionKey]?.message}</p>
                                )}
                            </div>
                        );
                    })
                ) : (
                    <p>No questions available</p>
                )}

                <div className="flex justify-center mt-6">
                    <button
                        type="submit"
                        className="px-6 py-2 text-lg font-semibold bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2"
                    >
                        Submit Feedback
                    </button>
                </div>
            </form>
        </div>
    );

}
