// src/app/api/roles/[roleId]/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { Role } from '@/db/models/Role';

interface Context {
  params: { roleId: string };
}

// GET /api/roles/[roleId] - Fetch a role by ID
export async function GET(req: NextRequest, context: Context) {
  try {
    const { roleId } = context.params;
    const role = await Role.findByPk(roleId);

    if (!role) {
      return NextResponse.json({ message: 'Role not found' }, { status: 404 });
    }

    return NextResponse.json({ role });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ message: 'Error fetching role', error: errorMessage }, { status: 500 });
  }
}

// PUT /api/roles/[roleId] - Update a role by ID
export async function PUT(req: NextRequest, context: Context) {
  try {
    const { roleId } = context.params;
    const { roleName } = await req.json();

    const role = await Role.findByPk(roleId);

    if (!role) {
      return NextResponse.json({ message: 'Role not found' }, { status: 404 });
    }

    role.roleName = roleName;
    await role.save();

    return NextResponse.json({ message: 'Role updated successfully', role });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ message: 'Error updating role', error: errorMessage }, { status: 500 });
  }
}

// DELETE /api/roles/[roleId] - Delete a role by ID
export async function DELETE(req: NextRequest, context: Context) {
  try {
    const { roleId } = context.params;
    const role = await Role.findByPk(roleId);

    if (!role) {
      return NextResponse.json({ message: 'Role not found' }, { status: 404 });
    }

    await role.destroy();

    return NextResponse.json({ message: 'Role deleted successfully' });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ message: 'Error deleting role', error: errorMessage }, { status: 500 });
  }
}
