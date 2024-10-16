import { NextRequest, NextResponse } from 'next/server';
import { Permission } from '@/db/models/Permission';

// GET /api/permission - Fetch all roles
export async function GET() {
  try {
    const permission = await Permission.findAll();
    return NextResponse.json({ permission });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ message: 'Error fetching permission', error: errorMessage }, { status: 500 });
  }
}

// POST /api/permission - Create a new permission
export async function POST(req: NextRequest) {
  try {
    const { permissionName } = await req.json();
    const permission = await Permission.create({ permissionName });
    return NextResponse.json({ message: 'Permission created successfully', permission }, { status: 201 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ message: 'Error creating role', error: errorMessage }, { status: 500 });
  }
}

