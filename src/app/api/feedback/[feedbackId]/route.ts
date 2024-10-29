import { ClassTime } from "@/db/models/ClassTime";
import { Feedback } from "@/db/models/Feedback";
import { Intake } from "@/db/models/Intake";
import { Module } from "@/db/models/Module";
import { Trainer } from "@/db/models/Trainer";
import { NextRequest, NextResponse } from "next/server";
import { FeedbackQuestion } from "@/db/models/FeedbackQuestion";
import { FeedbackSelectQuestions } from "@/db/models/FeedbackSelectQuestions";  

interface Context {
  params: { feedbackId: number };
}
export async function GET(request: NextRequest, context: Context) {
  try {
    const { feedbackId } = context.params;
    const feedback = await Feedback.findOne({
      where: { id: feedbackId },
      include: [
        {
          model: Trainer,
          as: "trainer",
          attributes: ["id", "trainerName"],
        },
        {
          model: ClassTime,
          as: "classTime",
          attributes: ["id", "classTime"],
        },
        {
          model: Module,
          as: "module",
          attributes: ["id", "moduleName"],
        },
        {
          model: Intake,
          as: "intake",
          attributes: ["id", "intakeName"],
        },
      ],
    });

    const feedbackQuestions = await FeedbackSelectQuestions.findAll({
      where: {
        feedbackId: feedbackId,
      },
      include: [
        {
          model: FeedbackQuestion,
          as: "feedbackQuestion",
          attributes: ["id", "questionText", "questionType"],
        },
      ],
    });

    if (!feedback) {
      return NextResponse.json(
        { message: "Feedback not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ feedback ,feedbackQuestions});
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { message: "Error fetching Feedback", error: errorMessage },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest, context: Context) {
  try {
    const { feedbackId } = context.params;
    const { trainerId, intakeId, classTimeId, tokenExpiration ,multiSelectField } =
      await req.json();

    const feedback = await Feedback.findByPk(feedbackId);
    await FeedbackSelectQuestions.destroy({
      where: {
        feedbackId : feedbackId
      }
    });


    if (!feedback) {
      return NextResponse.json(
        { message: "Feedback not found" },
        { status: 404 }
      );
    }

    // Update feedback fields if the values are provided (null means no change)
    if (trainerId !== null) {
      feedback.trainerId = trainerId;
    }
    if (intakeId !== null) {
      feedback.intakeId = intakeId;
    }
    if (classTimeId !== null) {
      feedback.classTimeId = classTimeId;
    }

    if (tokenExpiration) {
      feedback.tokenExpiration = new Date(tokenExpiration);
    }

    await feedback.save();

    for(const feedbackQuestion of multiSelectField) {
      await FeedbackSelectQuestions.create({
        feedbackId : feedback.id,
        feedbackQuestionsId : feedbackQuestion
      })
    }

    return NextResponse.json({
      message: "Feedback updated successfully",
      feedback,
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { message: "Error updating feedback", error: errorMessage },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest, context: Context) {
  try {
    const { feedbackId } = context.params;
    const feedback = await Feedback.findByPk(feedbackId);

    if (!feedback) {
      return NextResponse.json(
        { message: "Feedback Not Found" },
        { status: 404 }
      );
    }

    await feedback.destroy();

    return NextResponse.json({ message: "Feedback Deleted Successfully" });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { message: "Error deleting Feedback", error: errorMessage },
      { status: 500 }
    );
  }
}
