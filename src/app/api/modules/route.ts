import { Module } from '@/db/models/Module';
import { NextRequest, NextResponse } from 'next/server';

// GET /api/Module - Fetch all Modules
export async function GET() {
  try {
    const courseModule = await Module.findAll(); // Keep the name as courseModule
    return NextResponse.json(courseModule); // Return the courseModule directly as an array
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ message: 'Error fetching modules', error: errorMessage }, { status: 500 });
  }
}

// POST /api/Module - Create a new Module
export async function POST(req: NextRequest) {
  try {
    const { moduleName, courseId } = await req.json();
    const courseModule = await Module.create({ moduleName, courseId }); // Keep the name as courseModule
    return NextResponse.json({ message: 'Module created successfully', courseModule }, { status: 201 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ message: 'Error creating module', error: errorMessage }, { status: 500 });
  }
}