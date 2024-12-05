"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { PDFDocument, PDFFont, StandardFonts, rgb } from "pdf-lib";
import Loading from '../../loading'
import axios from "../../../../../lib/axios";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { showToast } from "@/components/ToastMessage";

interface FeedbackAnswer {
    id: number;
    questionId: number;
    answerText: string;
    description: string;
    feedback: {
        id: number;
        courseTrainer: {
            id: number,
            trainerId: number,
            courseId: number,
            trainers_users: {
                username: string
                email: string
            }
        },
        module: {
            moduleName: string;
            course: {
                courseName: string;
            };
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
                    console.log(err)
                    setError("Failed to fetch feedback question");
                } finally {
                    setLoading(false);
                }
            };
            fetchFeedbackData();
        }
    }, [feedbackId]);
    // Common function to generate the PDF content
    const generatePDFContent = async (feedbackReport: FeedbackAnswer[], questions: FeedbackQuestion[]) => {
        const pdfDoc = await PDFDocument.create();
        let page = pdfDoc.addPage([850, 842]);
        const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
        const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
        let yPosition = 800;

        const headerFontSize = 12;
        const titleFontSize = 18;
        const questionFontSize = 15;
        const tableFontSize = 13;
        const descriptionFontSize = 11;
        const lineSpacing = 20;
        const pageMargin = 50;
        const maxWidth = 650; // Max width for text before wrapping or breaking

        const feedbackDetails = feedbackReport[0].feedback;
        // Customizable variables for logo
        const logoUrl = "https://raw.githubusercontent.com/Institue-of-software-technologies/ist-feedback/refs/heads/main/public/assets/image/logo.png";
        const logoScaleFactor = 0.1;
        const logoVerticalPadding = 0;
        const logoHorizontalPadding = 0;

        // Embed the logo image from URL
        const logoBytes = await fetch(logoUrl).then((res) => res.arrayBuffer());
        const logoImage = await pdfDoc.embedPng(logoBytes);

        const logoWidth = logoImage.width * logoScaleFactor;
        const logoHeight = logoImage.height * logoScaleFactor;

        const logoXPosition = (pdfDoc.getPage(0).getWidth() - logoWidth) / 2 + logoHorizontalPadding;

        page.drawImage(logoImage, {
            x: logoXPosition,
            y: yPosition - logoHeight - logoVerticalPadding,
            width: logoWidth,
            height: logoHeight,
        });


        // Update yPosition after the logo
        yPosition -= logoHeight + logoVerticalPadding + 20;

        const addNewPageIfNeeded = () => {
            if (yPosition < pageMargin) {
                page = pdfDoc.addPage([850, 842]);
                yPosition = 800;
            }
        };

        // Draw general information about the feedback
        page.drawText(`Trainer: ${feedbackDetails.courseTrainer.trainers_users.username}`, { x: pageMargin, y: yPosition, size: headerFontSize, font });
        yPosition -= lineSpacing;
        addNewPageIfNeeded();

        page.drawText(`Course: ${feedbackDetails.module.course.courseName}`, { x: pageMargin, y: yPosition, size: headerFontSize, font });
        yPosition -= lineSpacing;
        addNewPageIfNeeded();

        page.drawText(`Module: ${feedbackDetails.module.moduleName}`, { x: pageMargin, y: yPosition, size: headerFontSize, font });
        yPosition -= lineSpacing;
        addNewPageIfNeeded();

        page.drawText(`Intake: ${feedbackDetails.intake.intakeName} - ${feedbackDetails.intake.intakeYear}`, { x: pageMargin, y: yPosition, size: headerFontSize, font });
        yPosition -= lineSpacing;
        addNewPageIfNeeded();

        page.drawText(`Class Time: ${feedbackDetails.classTime.classTime}`, { x: pageMargin, y: yPosition, size: headerFontSize, font });
        yPosition -= lineSpacing * 2;
        addNewPageIfNeeded();

        page.drawText("Feedback Report", {
            x: pageMargin,
            y: yPosition,
            size: titleFontSize,
            font: boldFont,
            color: rgb(0, 0.53, 0.7),
        });
        yPosition -= 40;
        addNewPageIfNeeded();

        // Separate open-ended and close-ended questions
        const openEndedQuestions = questions.filter(q => q.questionType === 'open-ended');
        const closeEndedQuestions = questions.filter(q => q.questionType === 'closed-ended');

        yPosition -= 20;

        // Draw Close-ended questions first
        if (closeEndedQuestions.length > 0) {
            page.drawText("Closed-ended Questions", {
                x: pageMargin,
                y: yPosition,
                size: titleFontSize,
                font: boldFont,
                color: rgb(0, 0.53, 0.7),
            });
            yPosition -= 40;
            addNewPageIfNeeded();

            closeEndedQuestions.forEach((question) => {
                page.drawText(question.questionText, {
                    x: pageMargin + 60,
                    y: yPosition,
                    size: questionFontSize,
                    font: boldFont,
                    color: rgb(0, 0, 0),
                });
                yPosition -= 20;
                addNewPageIfNeeded();

                page.drawText("Answer", { x: pageMargin, y: yPosition, size: tableFontSize, font, color: rgb(0.2, 0.2, 0.2) });
                page.drawText("Responses", { x: 300, y: yPosition, size: tableFontSize, font, color: rgb(0.2, 0.2, 0.2) });
                page.drawText("Percentage", { x: 500, y: yPosition, size: tableFontSize, font, color: rgb(0.2, 0.2, 0.2) });
                yPosition -= lineSpacing;
                addNewPageIfNeeded();

                Object.entries(question.responses).forEach(([answerText, response]) => {
                    const { count, percentage } = response as { count: number; percentage: string };
                    page.drawText(answerText, { x: pageMargin, y: yPosition, size: tableFontSize, font });
                    page.drawText(count.toString(), { x: 300, y: yPosition, size: tableFontSize, font });
                    page.drawText(percentage, { x: 500, y: yPosition, size: tableFontSize, font });
                    yPosition -= lineSpacing;
                    addNewPageIfNeeded();

                    // Handle Descriptions for Closed-ended Answers
                    const descriptions = feedbackReport
                        .filter((answer) => answer.answerText === answerText)
                        .map((filteredAnswer) => filteredAnswer.description)
                        .filter(Boolean);

                    descriptions.forEach((description, index) => {
                        if (description.trim()) {
                            page.drawText(`Description for Response ${index + 1}:`, {
                                x: pageMargin + 10,
                                y: yPosition,
                                size: descriptionFontSize,
                                font,
                                color: rgb(1, 0, 0),
                            });
                            yPosition -= lineSpacing;
                            addNewPageIfNeeded();

                            // Wrap and draw the long description text
                            const wrappedDescription = wrapText(description, font, descriptionFontSize, maxWidth);
                            wrappedDescription.forEach((line) => {
                                page.drawText(line, { x: pageMargin + 10, y: yPosition, size: descriptionFontSize, font });
                                yPosition -= lineSpacing;
                                addNewPageIfNeeded();
                            });
                        }
                    });
                });

                yPosition -= 20;
                addNewPageIfNeeded();
            });
        }

        // Draw Open-ended questions
        if (openEndedQuestions.length > 0) {
            page.drawText("Open-ended Questions", {
                x: pageMargin,
                y: yPosition,
                size: titleFontSize,
                font: boldFont,
                color: rgb(0, 0.53, 0.7),
            });
            yPosition -= 40;
            addNewPageIfNeeded();

            openEndedQuestions.forEach((question) => {
                page.drawText(question.questionText, {
                    x: pageMargin + 60,
                    y: yPosition,
                    size: questionFontSize,
                    font: boldFont,
                    color: rgb(0, 0, 0),
                });
                yPosition -= 20;
                addNewPageIfNeeded();

                // Handle Descriptions for Open-ended Responses
                feedbackReport
                    .filter((answer) => answer.questionId === question.id)
                    .forEach((filteredAnswer, index) => {
                        const description = filteredAnswer.answerText;

                        if (description && description.trim()) {
                            page.drawText(`Response ${index + 1}:`, {
                                x: pageMargin + 10,
                                y: yPosition,
                                size: descriptionFontSize,
                                font,
                                color: rgb(1, 0, 0),
                            });
                            yPosition -= lineSpacing;
                            addNewPageIfNeeded();

                            // Wrap and draw the long description text
                            const wrappedDescription = wrapText(description, font, descriptionFontSize, maxWidth);
                            wrappedDescription.forEach((line) => {
                                page.drawText(line, { x: pageMargin + 10, y: yPosition, size: descriptionFontSize, font });
                                yPosition -= lineSpacing;
                                addNewPageIfNeeded();
                            });
                        }
                    });

                // Line separator after open-ended responses
                page.drawLine({
                    start: { x: pageMargin, y: yPosition },
                    end: { x: 550, y: yPosition },
                    thickness: 2,
                    color: rgb(0.2, 0.2, 0.2),
                });
                yPosition -= lineSpacing;
                addNewPageIfNeeded();
            });
        }


        // Ratings Feedback Section
        page.drawText("Ratings Summary", {
            x: pageMargin,
            y: yPosition,
            size: titleFontSize,
            font: boldFont,
            color: rgb(0, 0.53, 0.7),
        });
        yPosition -= 40;

        // Aggregate and display ratings
        const ratingQuestions = questions.filter(q => q.questionType === 'rating');
        ratingQuestions.forEach((question) => {
            const relatedAnswers = feedbackReport.filter(a => a.questionId === question.id);

            // Calculate rating statistics
            const ratings = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]; // Adjust to actual rating scale
            const ratingCounts = ratings.map(rating =>
                relatedAnswers.filter(answer => parseInt(answer.answerText) === rating).length
            );
            const totalRatings = ratingCounts.reduce((acc, count) => acc + count, 0);
            const averageRating = totalRatings
                ? (ratingCounts.reduce((sum, count, idx) => sum + count * ratings[idx], 0) / totalRatings).toFixed(2)
                : "No ratings";

            // Display question text and average rating
            page.drawText(`${question.questionText}: Average Rating - ${averageRating}`, {
                x: pageMargin,
                y: yPosition,
                size: tableFontSize,
                font: boldFont,
            });
            yPosition -= lineSpacing;
            addNewPageIfNeeded();

            // Table Header
            page.drawText("Rating", { x: pageMargin, y: yPosition, size: tableFontSize, font });
            page.drawText("Count", { x: 300, y: yPosition, size: tableFontSize, font });
            page.drawText("Percentage", { x: 500, y: yPosition, size: tableFontSize, font });
            yPosition -= lineSpacing;
            addNewPageIfNeeded();

            // Table Data
            ratingCounts.forEach((count, idx) => {
                const rating = ratings[idx];
                const percentage = totalRatings ? ((count / totalRatings) * 100).toFixed(2) + "%" : "0%";

                // Add a colored background for the rating section
                page.drawRectangle({
                    x: pageMargin - 10,
                    y: yPosition - lineSpacing - 0,
                    width: maxWidth + 20,
                    height: lineSpacing + 20,
                    color: rgb(0.9, 0.9, 0.9),
                    opacity: 0.8,
                });

                // Display Rating Details with a clear header
                page.drawText(`Rating: ${rating}`, { x: pageMargin, y: yPosition, size: tableFontSize + 2, font: boldFont, color: rgb(0, 0.53, 0.7) });
                page.drawText(`Count: ${count}`, { x: pageMargin + 200, y: yPosition, size: tableFontSize, font });
                page.drawText(`Percentage: ${percentage}`, { x: pageMargin + 400, y: yPosition, size: tableFontSize, font });
                yPosition -= lineSpacing * 2;

                const descriptions = feedbackReport
                    .filter(answer => parseInt(answer.answerText) === rating)
                    .map(answer => answer.description)
                    .filter(Boolean); // Remove empty descriptions

                if (descriptions.length > 0) {
                    // Add a header for descriptions
                    page.drawText("Descriptions:", {
                        x: pageMargin,
                        y: yPosition,
                        size: descriptionFontSize + 2,
                        font: boldFont,
                        color: rgb(0.2, 0.2, 0.2),
                    });
                    yPosition -= lineSpacing;

                    descriptions.forEach((description) => {
                        // Wrap and display the description
                        const wrappedDescription = wrapText(description, font, descriptionFontSize, maxWidth - 40);
                        wrappedDescription.forEach((line) => {
                            page.drawText(`- ${line}`, {
                                x: pageMargin + 20,
                                y: yPosition,
                                size: descriptionFontSize,
                                font,
                            });
                            yPosition -= lineSpacing;
                            addNewPageIfNeeded();
                        });
                    });
                }

                // Add a separator line between ratings
                // page.drawLine({
                //     start: { x: pageMargin, y: yPosition + lineSpacing },
                //     end: { x: maxWidth, y: yPosition + lineSpacing },
                //     thickness: 0,
                //     color: rgb(0.8, 0.8, 0.8),
                // });

                // Add extra spacing between rating sections
                yPosition -= lineSpacing * 2;
                addNewPageIfNeeded();
            });



            // Add space after each question
            yPosition -= lineSpacing;
            addNewPageIfNeeded();
        });


        return pdfDoc.save();
    };




    const downloadPDF = async () => {
        if (feedbackReport.length === 0) {
            alert("Feedback report is not available for this ID.");
            return;
        }

        const pdfBytes = await generatePDFContent(feedbackReport, questions);

        const blob = new Blob([pdfBytes], { type: "application/pdf" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `feedback_report_${feedbackId}.pdf`;
        link.click();
        URL.revokeObjectURL(url);
    };

    // Function to generate PDF and send as email
    const generatePDF = async () => {
        if (feedbackReport.length === 0) {
            alert("Feedback report is not available for this ID.");
            return;
        }

        const pdfBytes = await generatePDFContent(feedbackReport, questions);

        // Send PDF as an email attachment
        sendPDF({
            pdfBytes,
            receiverEmail: feedbackReport[0].feedback.courseTrainer.trainers_users.email,
            receiverName: feedbackReport[0].feedback.courseTrainer.trainers_users.username,
        });
    };

    // Helper function to wrap text into multiple lines
    function wrapText(text: string, font: PDFFont, fontSize: number, maxWidth: number) {
        const lines = [];
        const words = text.replace(/\n/g, " ").split(" ");  // Remove newlines and split by space
        let currentLine = "";
        let currentWidth = 0;

        words.forEach((word) => {
            const wordWidth = font.widthOfTextAtSize(word, fontSize);

            // If adding the word exceeds the max width, push the current line and start a new one
            if (currentWidth + wordWidth > maxWidth) {
                lines.push(currentLine);
                currentLine = word;
                currentWidth = wordWidth;
            } else {
                currentLine += (currentLine ? " " : "") + word;
                currentWidth += wordWidth;
            }
        });

        if (currentLine) {
            lines.push(currentLine);
        }

        return lines;
    }





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
                showToast.success('PDF report sent successfully!');
            } else {
                alert();
                showToast.error("Failed to send PDF report.")
            }
        } catch (error) {
            console.error("Error sending PDF:", error);
            showToast.error("An error occurred while sending the PDF report.")
        } finally {
            setIsLoading(false);
        }
    };



    if (loading) {
        return <Loading />;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="max-w-7xl mx-auto p-4">
            <ToastContainer />
            {feedbackReport.length === 0 && (
                <div className="text-center text-gray-500">
                    Feedback report is not available for this Feedback
                </div>
            )}


            {/* Display feedback details only if the report is available */}
            {feedbackReport.length > 0 && (
                <div className="mb-6 bg-gray-100 p-4 rounded-lg shadow-md">
                    <h1 className="text-4xl font-semibold mb-6">Feedback Report</h1>
                    <p><strong>Trainer:</strong> {feedbackReport[0].feedback.courseTrainer.trainers_users.username}</p>
                    <p><strong>Course:</strong> {feedbackReport[0].feedback.module.course.courseName}</p>
                    <p><strong>Module:</strong> {feedbackReport[0].feedback.module.moduleName}</p>
                    <p><strong>Intake:</strong> {feedbackReport[0].feedback.intake.intakeName} - {feedbackReport[0].feedback.intake.intakeYear}</p>
                    <p><strong>Class Time:</strong> {feedbackReport[0].feedback.classTime.classTime}</p>
                </div>
            )}

            {/* Render each question and its responses, grouped by question type */}
            {questions.length > 0 &&
                <div>
                    {['open-ended', 'closed-ended', 'rating'].map(questionType => (
                        <div key={questionType} className="mb-8">
                            <h2 className="text-xl font-semibold mb-2">{questionType} Questions</h2>
                            {questions.filter(question => question.questionType === questionType).map(question => (
                                <div key={question.id} className="mb-4">
                                    <h3 className="text-lg font-semibold mb-2">Question: {question.questionText}</h3>

                                    {/* If it's an open-ended question */}
                                    {question.questionType === "open-ended" && (
                                        <div className="p-3 border border-gray-300">
                                            <strong>Open-Ended Responses:</strong>
                                            <ul>
                                                {feedbackReport
                                                    .filter(answer => answer.questionId === question.id)
                                                    .map((answer, index) => (
                                                        <li key={index}>
                                                            <strong>Response {index + 1}:</strong> {answer.answerText}
                                                            {answer.description && answer.description.trim() && (
                                                                <div className="ml-4">
                                                                    <strong>Description:</strong> {answer.description}
                                                                </div>
                                                            )}
                                                        </li>
                                                    ))}
                                            </ul>
                                        </div>
                                    )}

                                    {/* For regular (non-open-ended) questions */}
                                    {question.questionType !== "open-ended" && (
                                        <table className="border border-gray-300 text-left text-sm">
                                            <thead className="bg-gray-200">
                                                <tr>
                                                    <th className="p-3 border-b border-gray-300 w-1/4">Answer</th>
                                                    <th className="p-3 border-b border-gray-300 w-1/6">Responses</th>
                                                    <th className="p-3 border-b border-gray-300 w-1/6">Percentage</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {Object.entries(question.responses).map(([answerText, { count, percentage }]) => {
                                                    // Filter descriptions for the current answer
                                                    feedbackReport
                                                        .filter(answer => answer.answerText === answerText)
                                                        .map(filteredAnswer => filteredAnswer.description);

                                                    return (
                                                        <>
                                                            {/* Row for Answer, Responses, and Percentage */}
                                                            <tr key={answerText} className="hover:bg-gray-50">
                                                                <td className="p-3 border-b border-gray-300">{answerText}</td>
                                                                <td className="p-3 border-b border-gray-300">{count}</td>
                                                                <td className="p-3 border-b border-gray-300">{percentage}</td>
                                                            </tr>

                                                            {/* Row for Description, displayed only if there are descriptions */}
                                                            {feedbackReport
                                                                .filter(answer => answer.answerText === answerText)
                                                                .map(filteredAnswer => (
                                                                    <>
                                                                        {/* Check if there are descriptions for the answer */}
                                                                        {filteredAnswer.description && filteredAnswer.description.trim() !== "" && (
                                                                            <tr key={`${answerText}-desc`} className="hover:bg-gray-50">
                                                                                <td colSpan={3} className="p-3 border-b border-gray-300 break-words">
                                                                                    <strong>Description:</strong> {filteredAnswer.description}
                                                                                </td>
                                                                            </tr>
                                                                        )}
                                                                    </>
                                                                ))}
                                                        </>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                    )}
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            }


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

