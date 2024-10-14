import { NextRequest, NextResponse } from 'next/server';
import { Role } from '@/db/models/Role';

// GET /api/roles - Fetch all roles
export async function GET() {
  try {
    const roles = await Role.findAll();
    return NextResponse.json({ roles });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ message: 'Error fetching roles', error: errorMessage }, { status: 500 });
  }
}

// POST /api/roles - Create a new role
export async function POST(req: NextRequest) {
  try {
    const { roleName } = await req.json();
    const role = await Role.create({ roleName });
    return NextResponse.json({ message: 'Role created successfully', role }, { status: 201 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ message: 'Error creating role', error: errorMessage }, { status: 500 });
  }
}

