import { ClassTime } from "@/db/models/ClassTime";
import { FeedbackAnswer } from "@/db/models/FeedbackAnswer";
import { Intake } from "@/db/models/Intake";
import { Module } from "@/db/models/Module";
import { NextRequest, NextResponse } from "next/server";
import { FeedbackQuestion } from "@/db/models/FeedbackQuestion";
import { AnswerOption } from "@/db/models/AnswerOption";
import { Feedback } from "@/db/models/Feedback";
import { Course, TrainerCourses, User } from "@/db/models/index";

interface Context {
  params: { feedbackReportId: string };
}
export async function GET(req: NextRequest, context: Context) {
  try {
    const { feedbackReportId } = context.params;
    const feedbackReport = await FeedbackAnswer.findAll({
      where: { feedbackId: feedbackReportId },
      include: [
        {
          model : Feedback,
          as: "feedback",
          attributes: ["id"],
          include: [
            {
              model: TrainerCourses,
              as: "courseTrainer",
              include: [
                {
                  model: User,
                  as: "trainers_users",
                  attributes: ["username","email"],
                }
              ]
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
              model:Intake,
              as: "intake",
              attributes: ["intakeName" , "intakeYear"],
            },
            {
              model: ClassTime,
              as: "classTime",
              attributes: ["classTime"],
            }
          ],
        },
        {
          model: FeedbackQuestion,
          as: "question",
          attributes: ["id", "questionText", "questionType"],
          // where: { questionType: "closed-ended" },
          include: [
            {
              model: AnswerOption,
              as: "answerOption",
              attributes: ["id", "optionText"],
            },
          ],
        }
      ],
    });

    if (!feedbackReport) {
      return NextResponse.json(
        { message: "Feedback report not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ feedbackReport });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { message: "Error fetching feedback reports", error: errorMessage },
      { status: 500 }
    );
  }
}

