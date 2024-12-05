"use client";
import { Feedback, FeedbackQuestionSelect } from '@/types';
import React, { useEffect, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from '../../../../lib/axios';
import { useParams, useRouter } from 'next/navigation';
import { useUser } from '@/context/UserContext';
import Loading from '../../loading';  // Import the Loading component
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
        setIsLoading(true); // Set loading to true when the form is submitted
        const formattedData = Object.entries(data).map(([key, value]) => {
            if (key.startsWith("question-")) {
                if (key.startsWith("description-")) {
                    return null;
                }
                const questionID = parseInt(key.replace("question-", ""), 10);

                // Construct the description key dynamically based on the question ID
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
        }).filter(item => item !== null);

        try {
            await api.post('/feedback/answer', { formData: formattedData });
            showToast.success("Feedback submitted successfully!");
            setTimeout(() => {
                router.push(`/`); // Redirect after a delay
            }, 3000);
        } catch (error) {
            console.log(error);
            showToast.error('Failed to submit feedback');
        } finally {
            setIsLoading(false); // Ensure loading is set to false after submission
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

                <div className="border border-gray-200 shadow-lg rounded-lg p-6 bg-white w-full sm:max-w-3xl lg:max-w-5xl mx-auto mt-8">
                    <div className="flex flex-col sm:flex-row sm:justify-between mb-4 space-y-4 sm:space-y-0">
                        <div>
                            <p className="text-lg font-semibold text-gray-800">Trainer Name: <span className="font-normal text-gray-600">{feedback?.courseTrainer.trainers_users.username}</span></p>
                            <p className="text-md text-gray-700 mt-4">Course: <span className="font-normal">{feedback?.module.course.courseName}</span></p>
                            <p className="text-md text-gray-700 mt-1">Class Time: <span className="font-normal">{feedback?.classTime.classTime}</span></p>
                        </div>
                        <div className="text-left sm:text-right">
                            <p className="text-lg font-semibold text-gray-800">Module Name: <span className="font-normal text-gray-600">{feedback?.module.moduleName}</span></p>
                            <p className="text-md text-gray-700 mt-1">Intake Name: <span className="font-normal">{feedback?.intake.intakeName}</span></p>
                            <p className="text-md text-gray-700 mt-1">Year: <span className="font-normal">{feedback?.intake.intakeYear}</span></p>
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
                                                        required: "This field is required",
                                                        onChange: () => {
                                                            // Clear the description field when a different option is selected
                                                            question.feedbackQuestion.answerOption.forEach((opt) => {
                                                                if (opt.optionText !== option.optionText) {
                                                                    setValue(`description-${question.feedbackQuestion.id}`, ""); // Clear the description field
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


                                {question.feedbackQuestion.questionType === "rating" && (
                                    <div className="mt-4">
                                        <div className="flex justify-center items-center overflow-x-auto">
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

                                        {/* Description field for rating */}
                                        <div className="mt-4">
                                            <textarea
                                                rows={3}
                                                id={`description-${question.feedbackQuestion.id}`}
                                                placeholder="Add your description"
                                                className="w-full p-2 border rounded"
                                                {...register(`description-${question.feedbackQuestion.id}`,)}
                                            />
                                            {errors[`description-${question.feedbackQuestion.id}`] && (
                                                <p className="text-red-500 text-sm mt-1">
                                                    {errors[`description-${question.feedbackQuestion.id}`]?.message}
                                                </p>
                                            )}
                                        </div>
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
                        className="px-6 py-2 text-lg font-semibold bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2"
                    >
                        {isLoading ? (
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
                                sending feedback...
                            </div>
                        ) : (
                            'Submit Feedback'
                        )}
                    </button>

                </div>
            </form>
        </div>
    );
}
