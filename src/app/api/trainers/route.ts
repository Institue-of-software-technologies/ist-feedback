import { NextRequest, NextResponse } from 'next/server';
import {User} from '@/db/models/index';
import { Trainer } from '@/db/models/Trainer';
import { Role } from '@/db/models/Role';
import { TrainerCourses } from '@/db/models/TrainerCourses';
import { Course } from '@/db/models/Course';

// GET /api/trainer - Fetch all roles
export async function GET(req: NextRequest) {
  try {
    // Retrieve headers
    const userRole = req.headers.get("user-role");
    const userId = req.headers.get("user-id");

    let trainers;
    let trainersCourse;

    if (userRole === "trainer") {
      // If the user is a trainer, fetch only their details
      trainers = await User.findOne({
        where: { id: userId },
        include: [
          {
            model: Role,
            as: "roleUsers",
            where: { roleName: "trainer" },
            attributes: ["id", "roleName"],
          },
          {
            model: TrainerCourses,
            as: "trainer_courses",
            include: [
              {
                model: Course,
                as: "course",
                attributes: ["id", "courseName"], // Adjust attributes as needed
              },
            ],
          },
        ],
      });
      trainersCourse = await TrainerCourses.findAll({
        where: { trainerId: userId },
      })
    } else {
      // If the user is not a trainer, return all trainers
      trainers = await User.findAll({
        include: [
          {
            model: Role,
            as: "roleUsers",
            where: { roleName: "trainer" },
            attributes: ["id", "roleName"],
          },
          {
            model: TrainerCourses,
            as: "trainer_courses",
            include: [
              {
                model: Course,
                as: "course",
                attributes: ["id", "courseName",], // Adjust attributes as needed
              },
            ],
          },
        ],
      });
    }

    return NextResponse.json({ trainers,trainersCourse }, { status: 200 });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { message: "Error fetching trainer", error: errorMessage },
      { status: 500 }
    );
  }
}


// POST /api/trainer - Create a new trainer
export async function POST(req: NextRequest) {
  try {
    const { trainerName, course, email } = await req.json();
    const trainer = await Trainer.create({ trainerName: trainerName, email: email, courseId: course });
    return NextResponse.json(
      { message: 'Trainer created successfully', trainer },
      { status: 201 }
    );
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { message: 'Error creating trainer', error: errorMessage },
      { status: 500 }
    );
  }
}
