import { Course } from './../../../../db/models/Course';
import { ClassTime } from "@/db/models/ClassTime";
import { Feedback } from "@/db/models/Feedback";
import { Intake } from "@/db/models/Intake";
import { Module } from "@/db/models/Module";
import { NextRequest, NextResponse } from "next/server";
import { AnswerOption } from '@/db/models/AnswerOption';
import { FeedbackQuestion } from "@/db/models/FeedbackQuestion";
import { FeedbackSelectQuestions } from "@/db/models/FeedbackSelectQuestions";  
import { TrainerCourses, User } from "@/db/models/index";

interface Context {
  params: { feedbackId: number };
}
export async function GET(req: NextRequest, context: Context) {
  try {
    const { feedbackId } = context.params;
    const feedback = await Feedback.findOne({
      where: { id: feedbackId },
      include: [
        {
          model: TrainerCourses,
          as: "courseTrainer",
          include: [
            {
              model: User,
              as: "trainers_users",
              attributes: ["username"],
            }
          ]
        },
        {
          model: ClassTime,
          as: "classTime",
          attributes: ["id", "classTime"],
        },
        {
          model: Module,
          as: "module",
          attributes: ["moduleName"],
          include: [
            {
              model: Course,
              as: "course",
              attributes: ["id","courseName"],
            },
          ],
        },
        {
          model: Intake,
          as: "intake",
          attributes: ["id", "intakeName","intakeYear"],  
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
          include: [
            {
              model: AnswerOption,
              as: "answerOption",
              attributes: ["id", "optionText","description"],
            },
          ]
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
    const { trainerId, intakeId, classTimeId, tokenExpiration ,tokenStartTime,multiSelectField } =
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

    if (tokenStartTime) {
      feedback.tokenStartTime = new Date(tokenStartTime);
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
