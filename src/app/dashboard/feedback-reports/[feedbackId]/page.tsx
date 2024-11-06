"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import Loading from '../../loading'
import axios from "../../../../../lib/axios";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface FeedbackAnswer {
    id: number;
    questionId: number;
    answerText: string;
    feedback: {
        id: number;
        trainer: {
            email: string;
            trainerName: string;
            course: {
                courseName: string;
            };
        };
        module: {
            moduleName: string;
        };
        intake: {
            intakeName: string;
            intakeYear: string;
        };
        classTime: {
            classTime: string;
        };
    };
    question: {
        id: number;
        questionText: string;
        questionType: string;
        answerOption: { id: number; optionText: string }[];
    };
}

interface FeedbackQuestion {
    id: number;
    questionText: string;
    questionType: string;
    responses: { [answerText: string]: { count: number; percentage: string } };
}

type SendPDFParams = {
    pdfBytes: Uint8Array;
    receiverEmail: string;
    receiverName: string;
};

export default function FeedbackQuestionID() {
    const [loading, setLoading] = useState(true);
    const [questions, setQuestions] = useState<FeedbackQuestion[]>([]);
    const [error, setError] = useState<string | null>(null);
    const { feedbackId } = useParams();
    const [feedbackReport, setFeedbackReport] = useState<FeedbackAnswer[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (feedbackId) {
            const fetchFeedbackData = async () => {
                try {
                    const response = await axios.get(`/feedback-reports/${feedbackId}`);
                    const { feedbackReport } = response.data;
                    setFeedbackReport(feedbackReport);

                    const questionMap: { [questionId: number]: FeedbackQuestion } = {};

                    feedbackReport.forEach((answer: FeedbackAnswer) => {
                        const { questionId, answerText, question } = answer;

                        if (!questionMap[questionId]) {
                            questionMap[questionId] = {
                                id: questionId,
                                questionText: question.questionText,
                                questionType: question.questionType,
                                responses: {},
                            };
                        }

                        questionMap[questionId].responses[answerText] = {
                            count: (questionMap[questionId].responses[answerText]?.count || 0) + 1,
                            percentage: "0%", // Placeholder, will calculate percentage next
                        };
                    });

                    const questionArray = Object.values(questionMap).map((question) => {
                        const totalResponses = Object.values(question.responses).reduce(
                            (sum, { count }) => sum + count,
                            0
                        );
                        question.responses = Object.fromEntries(
                            Object.entries(question.responses).map(([answerText, { count }]) => [
                                answerText,
                                {
                                    count,
                                    percentage: ((count / totalResponses) * 100).toFixed(2) + "%",
                                },
                            ])
                        );
                        return question;
                    });

                    setQuestions(questionArray);
                } catch (err) {
                    setError("Failed to fetch feedback question");
                } finally {
                    setLoading(false);
                }
            };
            fetchFeedbackData();
        }
    }, [feedbackId]);

    const downloadPDF = async () => {
        if (feedbackReport.length === 0) {
            alert("Feedback report is not available for this ID.");
            return;
        }

        const pdfDoc = await PDFDocument.create();
        let page = pdfDoc.addPage([600, 800]);
        const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
        const titleFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
        let yPosition = 750;

        // Style settings
        const headerFontSize = 12;
        const titleFontSize = 20;
        const questionFontSize = 14;
        const tableFontSize = 10;
        const lineSpacing = 15;

        const feedbackDetails = feedbackReport[0].feedback;

        // Header details (Trainer, Course, Module, Intake, Class Time)
        page.drawText(`Trainer: ${feedbackDetails.trainer.trainerName}`, { x: 50, y: yPosition, size: headerFontSize, font });
        yPosition -= lineSpacing;
        page.drawText(`Course: ${feedbackDetails.trainer.course.courseName}`, { x: 50, y: yPosition, size: headerFontSize, font });
        yPosition -= lineSpacing;
        page.drawText(`Module: ${feedbackDetails.module.moduleName}`, { x: 50, y: yPosition, size: headerFontSize, font });
        yPosition -= lineSpacing;
        page.drawText(`Intake: ${feedbackDetails.intake.intakeName} - ${feedbackDetails.intake.intakeYear}`, { x: 50, y: yPosition, size: headerFontSize, font });
        yPosition -= lineSpacing;
        page.drawText(`Class Time: ${feedbackDetails.classTime.classTime}`, { x: 50, y: yPosition, size: headerFontSize, font });
        yPosition -= lineSpacing * 2;

        // Report Title
        page.drawText("Feedback Report", {
            x: 50,
            y: yPosition,
            size: titleFontSize,
            font: titleFont,
            color: rgb(0, 0.53, 0.71),
        });
        yPosition -= 40;

        questions.forEach((question) => {
            // Question text
            page.drawText(question.questionText, {
                x: 50,
                y: yPosition,
                size: questionFontSize,
                font: titleFont,
                color: rgb(0, 0, 0),
            });
            yPosition -= 20;

            // Table headers
            page.drawText("Answer", { x: 50, y: yPosition, size: tableFontSize, font, color: rgb(0.2, 0.2, 0.2) });
            page.drawText("Responses", { x: 250, y: yPosition, size: tableFontSize, font, color: rgb(0.2, 0.2, 0.2) });
            page.drawText("Percentage", { x: 350, y: yPosition, size: tableFontSize, font, color: rgb(0.2, 0.2, 0.2) });
            yPosition -= lineSpacing;

            // Table rows for each response
            Object.entries(question.responses).forEach(([answerText, { count, percentage }]) => {
                page.drawText(answerText, { x: 50, y: yPosition, size: tableFontSize, font });
                page.drawText(count.toString(), { x: 250, y: yPosition, size: tableFontSize, font });
                page.drawText(percentage, { x: 350, y: yPosition, size: tableFontSize, font });
                yPosition -= lineSpacing;

                // Page overflow check
                if (yPosition < 50) {
                    yPosition = 750;
                    page = pdfDoc.addPage([600, 800]);
                }
            });

            yPosition -= 20; // Extra space between questions
        });

        // Download PDF
        const pdfBytes = await pdfDoc.save();
        const blob = new Blob([pdfBytes], { type: "application/pdf" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `feedback_report_${feedbackId}.pdf`;
        link.click();
        URL.revokeObjectURL(url);
    };

    const sendPDF = async ({ pdfBytes, receiverEmail, receiverName }: SendPDFParams): Promise<void> => {
        setIsLoading(true);
        const formData = new FormData();
        formData.append("pdf", new Blob([pdfBytes], { type: "application/pdf" }), "feedback_report.pdf");
        formData.append("email", receiverEmail);
        formData.append("name", receiverName);

        try {
            const response = await axios.post("/feedback-reports/sendFeedBackPDF", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            if (response.status === 200) {
                toast.success('PDF report sent successfully!', {
                    position: 'top-right',
                    autoClose: 2000,
                  });
            } else {
                alert();
                toast.error("Failed to send PDF report.", {
                    position: 'top-right',
                    autoClose: 3000,
                  })
            }
        } catch (error) {
            console.error("Error sending PDF:", error);
            toast.error("An error occurred while sending the PDF report.", {
                position: 'top-right',
                autoClose: 3000,
              })
        } finally {
            setIsLoading(false); // Stop loading once the request is done
        }
    };

    const generatePDF = async () => {
        if (feedbackReport.length === 0) {
            alert("Feedback report is not available for this ID.");
            return;
        }

        const pdfDoc = await PDFDocument.create();
        let page = pdfDoc.addPage([600, 800]);
        const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
        const titleFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
        let yPosition = 750;

        const headerFontSize = 12;
        const titleFontSize = 20;
        const questionFontSize = 14;
        const tableFontSize = 10;
        const lineSpacing = 15;

        const feedbackDetails = feedbackReport[0].feedback;

        page.drawText(`Trainer: ${feedbackDetails.trainer.trainerName}`, { x: 50, y: yPosition, size: headerFontSize, font });
        yPosition -= lineSpacing;
        page.drawText(`Course: ${feedbackDetails.trainer.course.courseName}`, { x: 50, y: yPosition, size: headerFontSize, font });
        yPosition -= lineSpacing;
        page.drawText(`Module: ${feedbackDetails.module.moduleName}`, { x: 50, y: yPosition, size: headerFontSize, font });
        yPosition -= lineSpacing;
        page.drawText(`Intake: ${feedbackDetails.intake.intakeName} - ${feedbackDetails.intake.intakeYear}`, { x: 50, y: yPosition, size: headerFontSize, font });
        yPosition -= lineSpacing;
        page.drawText(`Class Time: ${feedbackDetails.classTime.classTime}`, { x: 50, y: yPosition, size: headerFontSize, font });
        yPosition -= lineSpacing * 2;

        page.drawText("Feedback Report", {
            x: 50,
            y: yPosition,
            size: titleFontSize,
            font: titleFont,
            color: rgb(0, 0.53, 0.71),
        });
        yPosition -= 40;

        questions.forEach((question) => {
            page.drawText(question.questionText, {
                x: 50,
                y: yPosition,
                size: questionFontSize,
                font: titleFont,
                color: rgb(0, 0, 0),
            });
            yPosition -= 20;

            page.drawText("Answer", { x: 50, y: yPosition, size: tableFontSize, font, color: rgb(0.2, 0.2, 0.2) });
            page.drawText("Responses", { x: 250, y: yPosition, size: tableFontSize, font, color: rgb(0.2, 0.2, 0.2) });
            page.drawText("Percentage", { x: 350, y: yPosition, size: tableFontSize, font, color: rgb(0.2, 0.2, 0.2) });
            yPosition -= lineSpacing;

            Object.entries(question.responses).forEach(([answerText, { count, percentage }]) => {
                page.drawText(answerText, { x: 50, y: yPosition, size: tableFontSize, font });
                page.drawText(count.toString(), { x: 250, y: yPosition, size: tableFontSize, font });
                page.drawText(percentage, { x: 350, y: yPosition, size: tableFontSize, font });
                yPosition -= lineSpacing;

                if (yPosition < 50) {
                    yPosition = 750;
                    page = pdfDoc.addPage([600, 800]);
                }
            });

            yPosition -= 20;
        });

        const pdfBytes = await pdfDoc.save();
        sendPDF({
            pdfBytes,
            receiverEmail: feedbackReport[0].feedback.trainer.email,
            receiverName: feedbackReport[0].feedback.trainer.trainerName,
        });
    };



    if (loading) return <Loading />
    if (error) return <div className="text-center text-red-500">{error}</div>;

    return (
        <div className="max-w-3xl mx-auto p-4">
            <ToastContainer />
            {/* Message if the feedback report is not available */}
            {feedbackReport.length === 0 && (
                <div className="text-center text-gray-500">
                    Feedback report is not available for this Feedback
                </div>
            )}


            {/* Display feedback details only if the report is available */}
            {feedbackReport.length > 0 && (
                <div className="mb-6 bg-gray-100 p-4 rounded-lg shadow-md">
                    <h1 className="text-4xl font-semibold mb-6">Feedback Report</h1>
                    <p><strong>Trainer:</strong> {feedbackReport[0].feedback.trainer.trainerName}</p>
                    <p><strong>Course:</strong> {feedbackReport[0].feedback.trainer.course.courseName}</p>
                    <p><strong>Module:</strong> {feedbackReport[0].feedback.module.moduleName}</p>
                    <p><strong>Intake:</strong> {feedbackReport[0].feedback.intake.intakeName} - {feedbackReport[0].feedback.intake.intakeYear}</p>
                    <p><strong>Class Time:</strong> {feedbackReport[0].feedback.classTime.classTime}</p>
                </div>
            )}

            {/* Render each question and its responses */}
            {questions.map((question) => (
                <div key={question.id} className="mb-8">
                    <h2 className="text-xl font-semibold mb-2">Question: {question.questionText}</h2>
                    <table className="min-w-full border border-gray-300 text-left text-sm">
                        <thead className="bg-gray-200">
                            <tr>
                                <th className="p-3 border-b border-gray-300">Answer</th>
                                <th className="p-3 border-b border-gray-300">Responses</th>
                                <th className="p-3 border-b border-gray-300">Percentage</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Object.entries(question.responses).map(([answerText, { count, percentage }]) => (
                                <tr key={answerText} className="hover:bg-gray-50">
                                    <td className="p-3 border-b border-gray-300">{answerText}</td>
                                    <td className="p-3 border-b border-gray-300">{count}</td>
                                    <td className="p-3 border-b border-gray-300">{percentage}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ))}

            {/* Conditionally render buttons only if feedback report is available */}
            {feedbackReport.length > 0 && (
                <div className="flex space-x-6">
                    <button
                        onClick={downloadPDF}
                        className="px-4 py-2 mt-4 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-500 focus:outline-none"
                    >
                        Download PDF
                    </button>

                    <button
                        onClick={generatePDF}
                        type="submit"
                        className={` flex font-semibold justify-center px-4 py-2 mt-4 border border-transparent rounded-md shadow-sm text-sm text-white bg-blue-600 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <div className="flex items-center">
                                <svg
                                    className="animate-spin h-4 w-4 mr-2 text-white"
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
                                Sending...
                            </div>
                        ) : (
                            'Send Feedback'
                        )}
                    </button>

                </div>
            )}
        </div>

    );
}
