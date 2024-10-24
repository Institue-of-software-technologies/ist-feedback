import { ClassTime } from '@/db/models/ClassTime';
import { NextRequest, NextResponse } from 'next/server';

// GET /api/class-Times - Fetch all class-Times
export async function GET() {
  try {
    const classTime = await ClassTime.findAll();
    return NextResponse.json({ classTime });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ message: 'Error fetching class Time', error: errorMessage }, { status: 500 });
  }
}

// POST /api/class-Times - Create a new class-Times
export async function POST(req: NextRequest) {
  try {
    const { classTime } = await req.json();
    const course = await ClassTime.create({ classTime });
    return NextResponse.json({ message: 'class Time created successfully', course }, { status: 201 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ message: 'Error creating class Time', error: errorMessage }, { status: 500 });
  }
}

