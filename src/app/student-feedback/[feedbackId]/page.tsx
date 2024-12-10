"use client";

import { Feedback, FeedbackQuestionSelect } from '@/types';
import React, { useEffect, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from '../../../../lib/axios';
import { useParams, useRouter } from 'next/navigation';
import { useUser } from '@/context/UserContext';
import Loading from '../../loading';
import { showToast } from '@/components/ToastMessage';

interface FormValues {
    [key: string]: string | number;
}

export default function StudentFeedback() {
    const [feedback, setFeedback] = useState<Feedback | null>(null);
    const [feedbackQuestion, setFeedbackQuestion] = useState<FeedbackQuestionSelect[] | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { feedbackId } = useParams();
    const router = useRouter();
    const { user } = useUser();
    const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<FormValues>();

    const numbers = Array.from({ length: 10 }, (_, i) => i + 1);

    useEffect(() => {
        if (feedbackId) {
            const fetchFeedback = async () => {
                try {
                    const response = await api.get(`/feedback/${feedbackId}`);
                    setFeedback(response.data.feedback);
                    setFeedbackQuestion(response.data.feedbackQuestions);
                } catch (err) {
                    console.log(err);
                    setError('Failed to fetch feedback');
                    showToast.error('Failed to fetch feedback');
                } finally {
                    setLoading(false);
                }
            };
            fetchFeedback();
        }
    }, [feedbackId]);

    const onSubmit: SubmitHandler<FormValues> = async (data) => {
        setIsLoading(true);
        const formattedData = Object.entries(data)
            .map(([key, value]) => {
                if (key.startsWith("question-")) {
                    const questionID = parseInt(key.replace("question-", ""), 10);
                    const descriptionKey = `description-${questionID}`;
                    const description = data[descriptionKey] || null;

                    return {
                        feedbackId: feedback?.id,
                        questionId: questionID,
                        answer: value,
                        description: description,
                    };
                }
                return null;
            })
            .filter(item => item !== null);

        try {
            await api.post('/feedback/answer', { formData: formattedData });
            showToast.success("Feedback submitted successfully!");
            setTimeout(() => {
                router.push(`/`);
            }, 3000);
        } catch (error) {
            console.log(error);
            showToast.error('Failed to submit feedback');
        } finally {
            setIsLoading(false);
        }
    };

    if (loading) return <Loading />;
    if (error) return <div className="text-red-500">{error}</div>;

    if (!user?.permissions.includes('view_feedback')) {
        return <div>You do not have access to this page.</div>;
    }

    return (
        <div className="bg-gray-100 min-h-screen text-black p-4">
            <ToastContainer />
            <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-lg shadow-lg p-6">
                <h1 className="text-center text-2xl font-bold text-red-600">
                    STUDENT FEEDBACK QUESTIONS FOR <b>{feedback?.module.course.courseName} {feedback?.intake.intakeName}</b>
                </h1>

                {feedbackQuestion && feedbackQuestion.length > 0 ? (
                    feedbackQuestion.map((question, index) => {
                        const questionKey = `question-${question.feedbackQuestion.id}`;
                        const descriptionKey = `description-${question.feedbackQuestion.id}`;
                        const isRequired = question.feedbackQuestion.required;

                        return (
                            <div key={question.feedbackQuestion.id} className="my-3">
                                <h3 className="text-lg font-semibold">
                                    {index + 1}. {question.feedbackQuestion.questionText}
                                    <span className={`text-sm ${isRequired ? 'text-red-500' : 'text-gray-600'}`}>
                                        {isRequired ? '(Required)' : '(Optional)'}
                                    </span>
                                </h3>

                                {/* Open-ended Question */}
                                {question.feedbackQuestion.questionType === "open-ended" && (
                                    <textarea
                                        className="w-full mt-5 p-2 border rounded"
                                        placeholder="Type your response here..."
                                        rows={5}
                                        {...register(questionKey, {
                                            required: isRequired && "This field is required",
                                        })}
                                    />
                                )}

                                {question.feedbackQuestion.answerOption.map((option) => {
                                    const selectedOption = watch(questionKey);
                                    const isSelected = selectedOption === option.optionText;

                                    return (
                                        <div key={option.id} className="mb-2">
                                            <div className="flex items-center">
                                                <input
                                                    type="radio"
                                                    id={`option-${question.feedbackQuestion.id}-${option.id}`}
                                                    value={option.optionText}
                                                    {...register(questionKey, {
                                                        required: isRequired && "This field is required",
                                                        onChange: () => {
                                                            question.feedbackQuestion.answerOption.forEach((opt) => {
                                                                if (opt.optionText !== option.optionText) {
                                                                    setValue(`description-${question.feedbackQuestion.id}`, "");
                                                                }
                                                            });
                                                        },
                                                    })}
                                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                                />
                                                <label
                                                    htmlFor={`option-${question.feedbackQuestion.id}-${option.id}`}
                                                    className="ml-2 block text-lg text-gray-900"
                                                >
                                                    {option.optionText}
                                                </label>
                                            </div>

                                            {isSelected && option.description && (
                                                <div className="mt-2">
                                                    <textarea
                                                        rows={3}
                                                        id={`description-${question.feedbackQuestion.id}-${option.id}`}
                                                        placeholder="Add your description"
                                                        className="w-full p-2 border rounded"
                                                        {...register(`description-${question.feedbackQuestion.id}`)}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}


                                {/* Close-ended Question */}
                                {question.feedbackQuestion.questionType === "close-ended" && (
                                    question.feedbackQuestion.answerOption.map((option) => {
                                        const selectedOption = watch(questionKey);
                                        const isSelected = selectedOption === option.optionText;

                                        return (
                                            <div key={option.id} className="mb-2">
                                                <div className="flex items-center">
                                                    <input
                                                        type="radio"
                                                        id={`option-${question.feedbackQuestion.id}-${option.id}`}
                                                        value={option.optionText}
                                                        {...register(questionKey, {
                                                            required: isRequired && "This field is required",
                                                            onChange: () => setValue(descriptionKey, ""),
                                                        })}
                                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                                    />
                                                    <label
                                                        htmlFor={`option-${question.feedbackQuestion.id}-${option.id}`}
                                                        className="ml-2 block text-lg text-gray-900"
                                                    >
                                                        {option.optionText}
                                                    </label>
                                                </div>

                                                {isSelected && option.description && (
                                                    <div className="mt-2">
                                                        <textarea
                                                            rows={3}
                                                            id={`description-${question.feedbackQuestion.id}-${option.id}`}
                                                            placeholder="Add your description"
                                                            className="w-full p-2 border rounded"
                                                            {...register(descriptionKey)}
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })
                                )}

                                {/* Rating Question */}
                                {question.feedbackQuestion.questionType === "rating" && (
                                    <div className="mt-4">
                                        <div className="flex justify-center items-center overflow-x-auto">
                                            {numbers.map((number) => (
                                                <button
                                                    key={number}
                                                    type="button"
                                                    className={`h-10 w-14 inline-flex items-center justify-center text-base font-medium border border-gray-300 
                            ${watch(questionKey) === number ? "bg-red-600 text-white" : "bg-white text-gray-800"} 
                            focus:outline-none focus:ring-2 focus:ring-red-600`}
                                                    onClick={() => {
                                                        setValue(questionKey, number);
                                                        setValue(descriptionKey, ""); // Reset description when rating changes
                                                    }}
                                                >
                                                    {number}
                                                </button>
                                            ))}
                                        </div>

                                        {/* Description for low ratings */}
                                        {Number(watch(questionKey)) <= 4 && Number(watch(questionKey)) >= 1 && (
                                            <div className="mt-4">
                                                <textarea
                                                    rows={3}
                                                    id={descriptionKey}
                                                    placeholder="Add your description"
                                                    className="w-full p-2 border rounded"
                                                    {...register(descriptionKey, {
                                                        required: "Please provide a description for your rating",
                                                    })}
                                                />
                                                {errors[descriptionKey] && (
                                                    <p className="text-red-500 text-sm mt-1">{errors[descriptionKey]?.message}</p>
                                                )}
                                            </div>
                                        )}
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
                        disabled={isLoading}
                        className={`px-6 py-2 text-lg font-semibold bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {isLoading ? "Submitting..." : "Submit"}
                    </button>
                </div>
            </form>
        </div>
    );
}
