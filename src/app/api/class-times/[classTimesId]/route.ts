// src/app/api/roles/[roleId]/route.ts
import { ClassTime } from '@/db/models/ClassTime';
import { Course } from '@/db/models/Course';
import { NextRequest, NextResponse } from 'next/server';

interface Context {
  params: { classTimesId: string };
}

// GET /api/class-Times/[classTimesId] - Fetch a class-Times by ID
export async function GET(req: NextRequest, context: Context) {
  try {
    const { classTimesId } = context.params;
    const course = await ClassTime.findByPk(classTimesId);

    if (!course) {
      return NextResponse.json({ message: 'Class Time not found' }, { status: 404 });
    }

    return NextResponse.json({ course });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ message: 'Error fetching Class Time', error: errorMessage }, { status: 500 });
  }
}

// PUT /api/class-Times/[classTimesId] - Update a class-Times by ID
export async function PUT(req: NextRequest, context: Context) {
  try {
    const { classTimesId } = context.params;
    const { classTime } = await req.json();

    const course = await ClassTime.findByPk(classTimesId);

    if (!course) {
      return NextResponse.json({ message: 'class Time not found' }, { status: 404 });
    }

    course.classTime = classTime;
    await course.save();

    return NextResponse.json({ message: 'Class Time updated successfully', course });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ message: 'Error updating Class Times', error: errorMessage }, { status: 500 });
  }
}

// DELETE /api/class-Times/[classTimesId] - Delete a class-Times by ID
export async function DELETE(req: NextRequest, context: Context) {
  try {
    const { classTimesId } = context.params;
    const course = await Course.findByPk(classTimesId);

    if (!course) {
      return NextResponse.json({ message: 'class Times not found' }, { status: 404 });
    }

    await course.destroy();

    return NextResponse.json({ message: 'class Times deleted successfully' });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ message: 'Error deleting Class Times', error: errorMessage }, { status: 500 });
  }
}
