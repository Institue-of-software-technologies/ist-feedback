import { ClassTime } from "@/db/models/ClassTime";
import { Course } from "@/db/models/Course";
import { Feedback } from "@/db/models/Feedback";
import { FeedbackSelectQuestions } from "@/db/models/FeedbackSelectQuestions";
import { Intake } from "@/db/models/Intake";
import { Module } from "@/db/models/Module";
import { TrainerCourses, User } from "@/db/models/index";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    // Extract user information (e.g., role and ID) from request headers or a session token
    const userRole = req.headers.get("user-role");
    const userId = req.headers.get("user-id");

    let feedbacks;

    // Filter feedbacks based on the user's role
    if (userRole === "trainer") {
      // Fetch only feedbacks associated with the trainer
      feedbacks = await Feedback.findAll({
        include: [
          {
            model: TrainerCourses, // The model representing the trainer_courses table
            as: 'courseTrainer',
            where: { trainerId: userId }, // Filter where the trainerId matches the provided userId
            required: true // This ensures that only feedbacks with a matching trainerId in the trainer_courses table are included
          },
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
          {
            model: ClassTime,
            as: "classTime",
            attributes: ["classTime"]
          },
          {
            model: Intake,
            as: "intake",
            attributes: ["intakeName", "intakeYear"],
          }
        ],
      });
    } else {
      // Fetch all feedbacks for other roles
      feedbacks = await Feedback.findAll({
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
    }

    // Format the tokenExpiration dates and send formatted feedback data to the client
    const formattedFeedbacks = feedbacks.map((feedback) => ({
      ...feedback.toJSON(),
      tokenStartTime: new Date(feedback.tokenStartTime).toLocaleString(
        "en-KE",
        {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
          timeZoneName: "short",
        }
      ),
      tokenExpiration: new Date(feedback.tokenExpiration).toLocaleString(
        "en-KE",
        {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
          timeZoneName: "short",
        }
      ),
    }));

    return NextResponse.json({
      message: "Feedback retrieved successfully",
      feedbacks: formattedFeedbacks,
    });
  } catch (error) {
    console.error("Error retrieving feedback:", error);
    return NextResponse.json(
      { error: "Failed to retrieve feedback" },
      { status: 500 }
    );
  }
}

async function generateUniqueToken() {
  const characters = "abcdefghijklmnopqrstuvwxyz0123456789";
  let token;
  let isUnique = false;

  while (!isUnique) {
    token = Array.from({ length: 5 }, () =>
      characters.charAt(Math.floor(Math.random() * characters.length))
    ).join("");

    const existingToken = await Feedback.findOne({
      where: {
        studentToken: token,
        tokenExpiration: { $gt: Date.now() },
      },
    });

    if (!existingToken) {
      isUnique = true;
    }
  }

  return token;
}

export async function POST(req: Request) {
  try {
    const {
      trainerId,
      intakeId,
      classTimeId,
      moduleId,
      tokenStartTime,
      tokenExpiration,
      multiSelectField,
    } = await req.json();

    // Validate required fields
    if (
      !trainerId ||
      !intakeId ||
      !classTimeId ||
      !moduleId ||
      !tokenExpiration
      // !tokenStartTime
    ) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Parse and validate tokenStartTime and tokenExpiration
    const startTime = new Date(tokenStartTime);
    const expirationTime = new Date(tokenExpiration);

    if (isNaN(startTime.getTime()) || isNaN(expirationTime.getTime())) {
      return NextResponse.json(
        { error: "Invalid date for tokenStartTime or tokenExpiration" },
        { status: 400 }
      );
    }

    if (startTime >= expirationTime) {
      return NextResponse.json(
        { error: "tokenStartTime must be earlier than tokenExpiration" },
        { status: 400 }
      );
    }

    // Convert dates to UTC
    const utcStartTime = new Date(startTime.toISOString());
    const utcExpiration = new Date(expirationTime.toISOString());

    const studentToken = await generateUniqueToken();

    const feedback = await Feedback.create({
      courseTrainerId: trainerId,
      intakeId,
      classTimeId,
      moduleId,
      studentToken,
      tokenStartTime: utcStartTime,
      tokenExpiration: utcExpiration,
    });

    for (const feedbackSelectQuestion of multiSelectField) {
      await FeedbackSelectQuestions.create({
        feedbackId: feedback.id,
        feedbackQuestionsId: feedbackSelectQuestion,
      });
    }

    return NextResponse.json({
      message: "Feedback submitted successfully",
      feedback,
    });
  } catch (error) {
    console.error("Error submitting feedback:", error);
    return NextResponse.json(
      { error: "Failed to submit feedback" },
      { status: 500 }
    );
  }
}


