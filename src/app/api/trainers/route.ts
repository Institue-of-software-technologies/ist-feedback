import { NextRequest, NextResponse } from 'next/server';
import { Trainer } from '@/db/models/Trainer';
import { Course } from '@/db/models/Course';

// GET /api/trainer - Fetch all roles
export async function GET() {
  try {
    const trainer = await Trainer.findAll({
      include: [
        {
          model: Course,
          as: 'course',
          attributes: ['id', 'courseName'],
        },
      ],
    });
    return NextResponse.json({ trainer });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { message: 'Error fetching trainer', error: errorMessage },
      { status: 500 }
    );
  }
}

// POST /api/trainer - Create a new trainer
export async function POST(req: NextRequest) {
  try {
    const { trainerName,course  } = await req.json();
    const trainer = await Trainer.create({ trainerName:trainerName, courseId:course });
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
