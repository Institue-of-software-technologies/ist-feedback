import { FeedbackQuestion } from "@/db/models/FeedbackQuestion";
import { AnswerOption } from "@/db/models/AnswerOption";
import { NextRequest, NextResponse } from "next/server";

// GET /api/feedback-questions - Fetch all Feedback Questions
export async function GET() {
  try {
    const questions = await FeedbackQuestion.findAll({
      include: [
        {
          model: AnswerOption,
          as: "answerOption",
          attributes: ["optionText","description"],
        },
      ],
    });
    return NextResponse.json({ questions });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { message: "Error fetching feedback questions", error: errorMessage },
      { status: 500 }
    );
  }
}

// POST /api/feedback-questions - Create a new Feedback Question with options (if closed-ended)
export async function POST(req: NextRequest) {
  try {
    const { questionText, questionType, options } = await req.json();

    // Validate the questionType to ensure it's one of the valid options
    const validTypes = ["open-ended", "closed-ended", "rating"];
    if (!validTypes.includes(questionType)) {
      return NextResponse.json(
        {
          message:
            "Invalid questionType. Must be one of: open-ended, closed-ended, or rating.",
        },
        { status: 400 }
      );
    }

    const question = await FeedbackQuestion.create({
      questionText,
      questionType,
    });

    // If the question type is 'closed-ended', handle answer options
    if (
      questionType === "closed-ended" &&
      Array.isArray(options) &&
      options.length > 0
    ) {
      const answerOptions = options.map(
        (optionText: { text: string; description: boolean }) => ({
          optionText: optionText.text,
          description: optionText.description,
          feedbackQuestionId: question.id,
        })
      );

      // Bulk create the answer options with description field
      await AnswerOption.bulkCreate(answerOptions);
    }

    return NextResponse.json(
      { message: "Feedback Question created successfully", question },
      { status: 201 }
    );
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { message: "Error creating feedback question", error: errorMessage },
      { status: 500 }
    );
  }
}
