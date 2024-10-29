import { NextRequest, NextResponse } from 'next/server';
import { Trainer } from '@/db/models/Trainer';
import { Course } from '@/db/models/Course';

interface Context {
  params: { trainerId: number };
}

// GET: Fetch user by ID
export async function GET(req: Request, context: Context) {
  try {
    const { trainerId } = context.params;
    const trainer = await Trainer.findOne({
      where: { id: trainerId },
      include: [
        {
          model: Course,
          as: 'course',
          attributes: ['id', 'courseName'],
        },
      ],
    });
    if (trainer) {
      return NextResponse.json(trainer, { status: 200 });
    } else {
      return NextResponse.json(
        { message: 'Trainer not found - *' },
        { status: 404 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { message: 'Error fetching Trainer', error },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest, context: Context) {
  try {
    const { trainerId } = context.params;
    const { trainerName, course } = await req.json();

    const trainer = await Trainer.findByPk(trainerId);

    if (!trainer) {
      return NextResponse.json(
        { message: 'Trainer not found' },
        { status: 404 }
      );
    }

    // Only update the trainerName if provided
    if (trainerName) {
      trainer.trainerName = trainerName;
    }

    // Only update the course if provided
    if (course) {
      trainer.courseId = course;
    }

    await trainer.save();

    return NextResponse.json({
      message: 'Trainer updated successfully',
      trainer,
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { message: 'Error updating Trainer', error: errorMessage },
      { status: 500 }
    );
  }
}

// DELETE: Delete user by ID
export async function DELETE(req: NextRequest, context: Context) {
  try {
    const { trainerId } = context.params;
    const trainer = await Trainer.findByPk(trainerId);

    if (!trainer) {
      return NextResponse.json(
        { message: 'Trainer not found' },
        { status: 404 }
      );
    }

    await trainer.destroy();

    return NextResponse.json({ message: 'Trainer deleted successfully' });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { message: 'Error deleting trainer', error: errorMessage },
      { status: 500 }
    );
  }
}
