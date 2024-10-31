import { FeedbackAnswer } from '@/db/models/FeedbackAnswer';
import { NextResponse } from 'next/server';

interface FeedbackAnswerCreateRequest {
    questionId: number;
    answer: string;
    feedbackId: string;
}


export async function POST(req: Request) {
    const { formData } = await req.json();
    let ipAddress = 'Unknown IP';
    await fetch("https://api.ipify.org?format=json")
        .then(response => response.json())
        .then(data => {
            ipAddress = data.ip;
        })
        .catch(error => {
            console.error("Error fetching IP address:", error);
        });


    try {
        await Promise.all(formData.map(async (answer: FeedbackAnswerCreateRequest) => {
            await FeedbackAnswer.create({
                feedbackId: answer.feedbackId,
                questionId: answer.questionId,
                answerText: answer.answer,
                userIp: ipAddress
            });
        }));

        return NextResponse.json({
            message: "Feedback submitted successfully",
        });
    } catch (error) {
        console.error("Error saving feedback answers:", error);
        return NextResponse.json({
            message: "Failed to submit feedback",
            error: error,
        }, { status: 500 }); // Return a 500 status code on error
    }
}
