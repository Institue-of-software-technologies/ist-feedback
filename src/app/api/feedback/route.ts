import { ClassTime } from "@/db/models/ClassTime";
import { Course } from "@/db/models/Course";
import { Feedback } from "@/db/models/Feedback";
import { FeedbackSelectQuestions } from "@/db/models/FeedbackSelectQuestions";
import { Intake } from "@/db/models/Intake";
import { Module } from "@/db/models/Module";
import { Trainer } from "@/db/models/Trainer";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Fetch feedbacks with associated trainer, module, course, classTime, and intake details
    const feedbacks = await Feedback.findAll({
      include: [
        {
          model: Trainer,
          as: "trainer",
          attributes: ["trainerName"],
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

    // Format the tokenExpiration dates and send formatted feedback data to the client
    const formattedFeedbacks = feedbacks.map((feedback) => {
      // Convert the tokenExpiration to a formatted string (e.g., using toLocaleString)
      const formattedExpiration = new Date(
        feedback.tokenExpiration
      ).toLocaleString("en-KE", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      });

      return {
        ...feedback.toJSON(), // Spread the rest of the feedback fields
        tokenExpiration: formattedExpiration, // Replace tokenExpiration with the formatted value
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
    ) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Parse tokenExpiration date from input
    const Expiration = new Date(tokenExpiration);

    if (isNaN(Expiration.getTime())) {
      return NextResponse.json(
        { error: "Invalid token expiration date" },
        { status: 400 }
      );
    }

    const studentToken = await generateUniqueToken();

    const feedback = await Feedback.create({
      trainerId,
      intakeId,
      classTimeId,
      moduleId,
      studentToken,
      tokenExpiration: Expiration,
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
