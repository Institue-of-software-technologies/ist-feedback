import { FeedbackQuestion } from "@/db/models/FeedbackQuestion";
import { AnswerOption } from "@/db/models/AnswerOption";
import { NextRequest, NextResponse } from "next/server";

interface Context {
  params: { questionId: string };
}

// GET /api/feedback-questions/[questionId] - Fetch a feedback question by ID
export async function GET(req: NextRequest, context: Context) {
  try {
    const { questionId } = context.params;
    const question = await FeedbackQuestion.findOne({
      where: { id: questionId },
      include: [
        {
          model: AnswerOption,
          as: "answerOption",
          attributes: ["id", "optionText", "description"],
        },
      ],
      attributes: [
        "id",
        "questionText",
        "questionType",
        "minRating",
        "maxRating",
        "required",
      ],
    });

    if (!question) {
      return NextResponse.json(
        { message: "Feedback question not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ question });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { message: "Error fetching feedback question", error: errorMessage },
      { status: 500 }
    );
  }
}

// PUT /api/feedback-questions/[questionId] - Update a feedback question by ID
export async function PUT(req: NextRequest, context: Context) {
  try {
    const { questionId } = context.params;
    const {
      questionText,
      questionType,
      options,
      minRating,
      maxRating,
      required,
    } = await req.json();

    // Validate questionType if provided
    const validTypes = ["open-ended", "closed-ended", "rating"];
    if (questionType && !validTypes.includes(questionType)) {
      return NextResponse.json(
        {
          message:
            "Invalid questionType. Must be one of: open-ended, closed-ended, or rating.",
        },
        { status: 400 }
      );
    }

    // Validate ratings if question type is 'rating'
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

    // Find the question and include associated answer options
    const question = await FeedbackQuestion.findByPk(questionId, {
      include: [{ model: AnswerOption, as: "answerOption" }],
    });

    if (!question) {
      return NextResponse.json(
        { message: "Feedback question not found" },
        { status: 404 }
      );
    }

    // Update the question details
    question.questionText = questionText ?? question.questionText;
    question.questionType = questionType ?? question.questionType;
    question.minRating = questionType === "rating" ? minRating : null;
    question.maxRating = questionType === "rating" ? maxRating : null;
    question.required = required ?? question.required; // Update the required field

    // If it's a closed-ended question, update the answer options
    if (questionType === "closed-ended" && Array.isArray(options)) {
      // Remove existing options
      await AnswerOption.destroy({ where: { feedbackQuestionId: questionId } });

      // Prepare new options with descriptions
      const newOptions = options.map(
        (option: { optionText: string; description: boolean }) => ({
          optionText: option.optionText,
          description: option.description || false,
          feedbackQuestionId: question.id,
        })
      );

      // Bulk create new options
      await AnswerOption.bulkCreate(newOptions);
    }

    // Save the updated question
    await question.save();

    return NextResponse.json({
      message: "Feedback question updated successfully",
      question,
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { message: "Error updating Feedback Question", error: errorMessage },
      { status: 500 }
    );
  }
}

// DELETE /api/feedback-questions/[questionId] - Delete a feedback question by ID
export async function DELETE(req: NextRequest, context: Context) {
  try {
    const { questionId } = context.params;
    const question = await FeedbackQuestion.findByPk(questionId);

    if (!question) {
      return NextResponse.json(
        { message: "Feedback question not found" },
        { status: 404 }
      );
    }

    await question.destroy();

    return NextResponse.json({
      message: "Feedback question deleted successfully",
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { message: "Error deleting feedback question", error: errorMessage },
      { status: 500 }
    );
  }
}
