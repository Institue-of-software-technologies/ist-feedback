import { Course } from '@/db/models/Course';
import { Module } from '@/db/models/Module';
import { NextRequest, NextResponse } from 'next/server';

interface Context {
  params: { moduleId: string };
}

// GET /api/module/[moduleId] - Fetch a module by ID
export async function GET(req: NextRequest, context: Context) {
  try {
    const { moduleId } = context.params;
    const courseModule = await Module.findOne({
      where: {
        id: moduleId, 
      },
      include: [
          {
            model: Course, 
            as: "course", 
            attributes: ["id", "courseName"], 
          },
        ],
    });

    if (!courseModule) {
      return NextResponse.json({ message: 'Module not found' }, { status: 404 });
    }

    return NextResponse.json({ courseModule });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ message: 'Error fetching Module', error: errorMessage }, { status: 500 });
  }
}

// PUT /api/module/[moduleId] - Update a module by ID
export async function PUT(req: NextRequest, context: Context) {
  try {
    const { moduleId } = context.params;
    const { moduleName,course } = await req.json();

    const courseModule = await Module.findByPk(moduleId);

    if (!courseModule) {
      return NextResponse.json({ message: 'Module not found' }, { status: 404 });
    }

    courseModule.moduleName = moduleName;
    courseModule.courseId = course;
    await courseModule.save();

    return NextResponse.json({ message: 'Module updated successfully', courseModule });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ message: 'Error updating Module', error: errorMessage }, { status: 500 });
  }
}

// DELETE /api/module/[moduleId] - Delete a module by ID
export async function DELETE(req: NextRequest, context: Context) {
  try {
    const { moduleId } = context.params;
    const courseModule = await Module.findByPk(moduleId);

    if (!courseModule) {
      return NextResponse.json({ message: 'Module not found' }, { status: 404 });
    }

    await courseModule.destroy();

    return NextResponse.json({ message: 'Module deleted successfully' });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ message: 'Error deleting Module', error: errorMessage }, { status: 500 });
  }
}
