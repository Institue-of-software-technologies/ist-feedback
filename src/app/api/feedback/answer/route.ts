import { FeedbackAnswer } from '@/db/models/FeedbackAnswer';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

interface FeedbackAnswerCreateRequest {
    questionId: number;
    answer: string;
    feedbackId: string;
}


export async function POST(req: Request) {
    const { formData } = await req.json();
    
    try {
        await Promise.all(formData.map(async (answer: FeedbackAnswerCreateRequest) => {
            await FeedbackAnswer.create({
                feedbackId: answer.feedbackId,
                questionId: answer.questionId,
                answerText: answer.answer,
            });
        }));

        const expires = new Date(Date.now() +(1 * 60 * 60 * 1000));

        cookies().set('feedMe', 'true', { expires, httpOnly: true });

        const response = NextResponse.json({
            message: "Feedback submitted successfully",
        });
        return response;
        
    } catch (error) {
        console.error("Error saving feedback answers:", error);
        return NextResponse.json({
            message: "Failed to submit feedback",
            error: error,
        }, { status: 500 }); // Return a 500 status code on error
    }
}

export async function GET() {
    const cookieStore = cookies();
    const myCookie = cookieStore.get('feedMe')?.value === 'true';
  
    return NextResponse.json({
      myCookie
    });
  }
  