import { NextRequest, NextResponse } from 'next/server';
import { Trainer } from '@/db/models/Trainer';
import { Course } from '@/db/models/Course';
import { User } from '../../../db/models/User';
import { Role } from '@/db/models/Role';

// GET /api/trainer - Fetch all roles
export async function GET(req:NextRequest) {
  try {
    // Retrieve headers
    const userRole = req.headers.get("user-role");
    const userId = req.headers.get("user-id");

    console.log(userRole,userId);

    let trainers;

    if (userRole === "trainer") {
      // If the user is a trainer, return only their details
      trainers = await User.findOne({
        where: { id: userId }, // Filter by user ID
        include: [
          {
            model: Role,
            as: "roleUsers",
            where: { roleName: "trainer" },
            attributes: ["id", "roleName"],
          },
          {
            model: Course,
            as: "course",
            attributes: ["id", "courseName"],
          },
        ],
      });
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
            model: Course,
            as: "course",
            attributes: ["id", "courseName"],
          },
        ],
      });
    }

    return NextResponse.json({ trainers });
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
    const { trainerName,course,email  } = await req.json();
    const trainer = await Trainer.create({ trainerName:trainerName,email:email, courseId:course });
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
