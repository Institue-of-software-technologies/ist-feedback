// src/app/api/roles/[roleId]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { Permission } from '@/db/models/Permission';

interface Context {
  params: { permissionId: string };
}

// GET /api/permissions/[permissionId] - Fetch a permission by ID
export async function GET(req: NextRequest, context: Context) {
  try {
    const { permissionId } = context.params;
    const permission = await Permission.findByPk(permissionId);

    if (!permission) {
      return NextResponse.json({ message: 'Permission not found' }, { status: 404 });
    }

    return NextResponse.json({ permission });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ message: 'Error fetching permission', error: errorMessage }, { status: 500 });
  }
}

// PUT /api/permissions/[permissionId] - Update a permission by ID
export async function PUT(req: NextRequest, context: Context) {
  try {
    const { permissionId } = context.params;
    const { permissionName } = await req.json();

    const permission = await Permission.findByPk(permissionId);

    if (!permission) {
      return NextResponse.json({ message: 'Role not found' }, { status: 404 });
    }

    permission.permissionName = permissionName;
    await permission.save();

    return NextResponse.json({ message: 'Permission updated successfully', permission });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ message: 'Error updating permission', error: errorMessage }, { status: 500 });
  }
}

// DELETE /api/permissions/[permissionId] - Delete a permission by ID
export async function DELETE(req: NextRequest, context: Context) {
  try {
    const { permissionId } = context.params;
    const permission = await Permission.findByPk(permissionId);

    if (!permission) {
      return NextResponse.json({ message: 'Permission not found' }, { status: 404 });
    }

    await permission.destroy();

    return NextResponse.json({ message: 'Permission deleted successfully' });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ message: 'Error deleting permission', error: errorMessage }, { status: 500 });
  }
}
