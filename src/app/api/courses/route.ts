import { Course } from "@/db/models/Course";
import { NextRequest, NextResponse } from "next/server";

// GET /api/Course - Fetch all Courses
export async function GET() {
  try {
    const course = await Course.findAll();
    return NextResponse.json({ course });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { message: "Error fetching course", error: errorMessage },
      { status: 500 }
    );
  }
}

// POST /api/Course - Create a new Course
export async function POST(req: NextRequest) {
  try {
    const { courseName } = await req.json();
    const course = await Course.create({ courseName });
    return NextResponse.json(
      { message: "Course created successfully", course },
      { status: 201 }
    );
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { message: "Error creating Course", error: errorMessage },
      { status: 500 }
    );
  }
}
