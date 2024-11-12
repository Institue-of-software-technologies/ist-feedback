import sequelize from "@/db/db_connection";
import { FeedbackAnswer } from "@/db/models/FeedbackAnswer";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

interface FeedbackAnswerCreateRequest {
  questionId: number;
  answer: string;
  feedbackId: string;
  description: string;
}

export async function POST(req: Request) {
  const { formData } = await req.json();
  console.log("Form Data Submitted:", formData);
  const transaction = await sequelize.transaction();

  try {
    await Promise.all(
      formData.map(async (answer: FeedbackAnswerCreateRequest) => {
        await FeedbackAnswer.create(
          {
            feedbackId: answer.feedbackId,
            questionId: answer.questionId,
            answerText: answer.answer,
            description: answer.description, // Ensure description saves to the correct column
          },
          { transaction }
        );
      })
    );

    await transaction.commit();

    const expires = new Date(Date.now() + 1 * 60 * 60 * 1000);
    cookies().set("feedMe", "true", { expires, httpOnly: true });

    return NextResponse.json({
      message: "Feedback submitted successfully",
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Error saving feedback answers:", error);
    return NextResponse.json(
      {
        message: "Failed to submit feedback",
        error: error,
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  const cookieStore = cookies();
  const myCookie = cookieStore.get("feedMe")?.value === "true";

  return NextResponse.json({
    myCookie,
  });
}
