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
          attributes: ["optionText", "description"],
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

// POST /api/feedback-questions - Create a new Feedback Question with options (if closed-ended) or custom rating range (if rating type)
export async function POST(req: NextRequest) {
  try {
    const {
      questionText,
      questionType,
      options,
      minRating,
      maxRating,
      required,
    } = await req.json();

    // Validate required field
    if (typeof required !== "boolean") {
      return NextResponse.json(
        { message: "'required' must be a boolean value." },
        { status: 400 }
      );
    }

    // Validate questionType
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

    // Validate ratings for 'rating' type
    if (questionType === "rating") {
      if (typeof minRating !== "number" || typeof maxRating !== "number") {
        return NextResponse.json(
          { message: "minRating and maxRating must be numbers." },
          { status: 400 }
        );
      }
      if (minRating < 1 || maxRating > 10 || minRating >= maxRating) {
        return NextResponse.json(
          {
            message:
              "Invalid rating range. minRating should be at least 1, maxRating should be up to 10, and minRating should be less than maxRating.",
          },
          { status: 400 }
        );
      }
    }

    const question = await FeedbackQuestion.create({
      questionText,
      questionType,
      required,
      minRating: questionType === "rating" ? minRating : null,
      maxRating: questionType === "rating" ? maxRating : null,
    });

    // Handle answer options for 'closed-ended' questions
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

      // Bulk create answer options
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

