// src/app/api/roles/[roleId]/route.ts
import { Course } from '@/db/models/Course';
import { NextRequest, NextResponse } from 'next/server';

interface Context {
  params: { courseId: string };
}

// GET /api/course/[courseId] - Fetch a course by ID
export async function GET(req: NextRequest, context: Context) {
  try {
    const { courseId } = context.params;
    const course = await Course.findByPk(courseId);

    if (!course) {
      return NextResponse.json({ message: 'Course not found' }, { status: 404 });
    }

    return NextResponse.json({ course });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ message: 'Error fetching Course', error: errorMessage }, { status: 500 });
  }
}

// PUT /api/course/[courseId] - Update a course by ID
export async function PUT(req: NextRequest, context: Context) {
  try {
    const { courseId } = context.params;
    const { courseName } = await req.json();

    const course = await Course.findByPk(courseId);

    if (!course) {
      return NextResponse.json({ message: 'Course not found' }, { status: 404 });
    }

    course.courseName = courseName;
    await course.save();

    return NextResponse.json({ message: 'Course updated successfully', course });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ message: 'Error updating Course', error: errorMessage }, { status: 500 });
  }
}

// DELETE /api/course/[courseId] - Delete a course by ID
export async function DELETE(req: NextRequest, context: Context) {
  try {
    const { courseId } = context.params;
    const course = await Course.findByPk(courseId);

    if (!course) {
      return NextResponse.json({ message: 'Course not found' }, { status: 404 });
    }

    await course.destroy();

    return NextResponse.json({ message: 'Course deleted successfully' });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ message: 'Error deleting Course', error: errorMessage }, { status: 500 });
  }
}
