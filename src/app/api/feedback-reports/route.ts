import { ClassTime } from "@/db/models/ClassTime";
import { Course } from "@/db/models/Course";
import { Feedback } from "@/db/models/Feedback";
import { Intake } from "@/db/models/Intake";
import { Module } from "@/db/models/Module";
import { NextResponse } from "next/server";
import { TrainerCourses, User } from "@/db/models/index";

export async function GET() {
  try {
    // Fetch feedbacks with associated trainer, module, course, classTime, and intake details
    const feedbacks = await Feedback.findAll({
      // find if the feedback has answers

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
        { model: ClassTime, as: "classTime", attributes: ["classTime"] },
        {
          model: Intake,
          as: "intake",
          attributes: ["intakeName", "intakeYear"],
        }
      ],
    });

    return NextResponse.json({
      message: "Feedback retrieved successfully",
      feedbacks,
    });
  } catch (error) {
    console.error("Error retrieving feedback:", error);
    return NextResponse.json(
      { error: "Failed to retrieve feedback" },
      { status: 500 }
    );
  }
}
