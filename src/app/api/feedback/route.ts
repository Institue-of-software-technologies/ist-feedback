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
    // Extract user information
    const userRole = req.headers.get("user-role");
    const userId = req.headers.get("user-id");

    let feedbacks;

    if (userRole === "trainer") {
      feedbacks = await Feedback.findAll({
        include: [
          {
            model: TrainerCourses,
            as: "courseTrainer",
            where: { trainerId: userId },
            required: true,
          },
          {
            model: TrainerCourses,
            as: "courseTrainer",
            include: [
              {
                model: User,
                as: "trainers_users",
                attributes: ["username"],
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
            model: ClassTime,
            as: "classTime",
            attributes: ["classTime"],
          },
          {
            model: Intake,
            as: "intake",
            attributes: ["intakeName", "intakeYear"],
          },
        ],
      });
    } else {
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
          { model: ClassTime, as: "classTime", attributes: ["classTime"] },
          {
            model: Intake,
            as: "intake",
            attributes: ["intakeName", "intakeYear"],
          },
        ],
      });
    }

    // Format the feedback data and determine token status
    const now = new Date();
    const formattedFeedbacks = feedbacks.map((feedback) => {
      const tokenStartTime = new Date(feedback.tokenStartTime);
      const tokenExpiration = new Date(feedback.tokenExpiration);

      let tokenStatus;
      let statusColor;
      if (now < tokenStartTime) {
         statusColor = "yellow";
        tokenStatus = `Will open on ${tokenStartTime.toLocaleString("en-KE", {
          weekday: "long",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
          timeZoneName: "short",
        })}`;
      } else if (now >= tokenStartTime && now <= tokenExpiration) {
        tokenStatus = "Active";
        statusColor = "green"; 
      } else {
        tokenStatus = "Expired";
        statusColor = "red";
      }

      return {
        ...feedback.toJSON(),
        tokenStartTime: tokenStartTime.toLocaleString("en-KE", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
          timeZoneName: "short",
        }),
        tokenExpiration: tokenExpiration.toLocaleString("en-KE", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
          timeZoneName: "short",
        }),
        tokenStatus,
        statusColor,
      };
    });

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


