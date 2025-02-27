import { TrainerCourses } from "@/db/models/TrainerCourses";
import { AnswerOption } from "@/db/models/AnswerOption";
import { ClassTime } from "@/db/models/ClassTime";
import { Course } from "@/db/models/Course";
import { Feedback } from "@/db/models/Feedback";
import { FeedbackAnswer } from "@/db/models/FeedbackAnswer";
import { FeedbackQuestion } from "@/db/models/FeedbackQuestion";
import { Intake } from "@/db/models/Intake";
import { Module } from "@/db/models/Module";
import { NextResponse } from "next/server";
import { User } from "@/db/models/index";

export async function GET() {
  try {
    const feedbackReports = await FeedbackAnswer.findAll({
      include: [
        {
          model: Feedback,
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
                  attributes: ["username", "email"],
                },
              ],
             
            },
            {
              model: Module,
              as: "module",
              attributes: ["moduleName"],
              include: [
                {
                  model: Course,
                  as: "course",
                  attributes: ["courseName"],
                },
              ],
            },
            {
              model: Intake,
              as: "intake",
              attributes: ["intakeName", "intakeYear"],
            },
            {
              model: ClassTime,
              as: "classTime",
              attributes: ["classTime"],
            },
          ],
        },
        {
          model: FeedbackQuestion,
          as: "question",
          attributes: ["id", "questionText", "questionType"],
          include: [
            {
              model: AnswerOption,
              as: "answerOption",
              attributes: ["id", "optionText"],
            },
          ],
        },
      ],
    });

    if (!feedbackReports || feedbackReports.length === 0) {
      return NextResponse.json(
        { message: "No feedback reports found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ feedbackReports });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { message: "Error fetching feedback reports", error: errorMessage },
      { status: 500 }
    );
  }
}
