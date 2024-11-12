import { AnswerOption } from "@/db/models/AnswerOption";
import { ClassTime } from "@/db/models/ClassTime";
import { Course } from "@/db/models/Course";
import { Feedback } from "@/db/models/Feedback";
import { FeedbackAnswer } from "@/db/models/FeedbackAnswer";
import { FeedbackQuestion } from "@/db/models/FeedbackQuestion";
import { Intake } from "@/db/models/Intake";
import { Module } from "@/db/models/Module";
import { Trainer } from "@/db/models/Trainer";
import { NextRequest, NextResponse } from "next/server";

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
              model: Trainer,
              as: "trainer",
              attributes: ["trainerName","email"],
              include: [
                {
                  model: Course,
                  as: "course",
                  attributes: ["courseName"],
                },
              ],
            },
            {
              model: Module,
              as: "module",
              attributes: ["moduleName"],
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
          where: { questionType: "closed-ended" },
          include: [
            {
              model: AnswerOption,
              as: "answerOption",
              attributes: ["id", "optionText","description"],
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

