// src/app/api/roles/[roleId]/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { Role } from '@/db/models/Role';
import { RolePermission } from '@/db/models/RolePermissions';
import { Permission } from '@/db/models/Permission';

interface Context {
  params: { roleId: string };
}

// GET /api/roles/[roleId] - Fetch a role by ID and the permissions 
export async function GET(req: NextRequest, context: Context) {
  try {
    const { roleId } = context.params;
    const role = await Role.findByPk(roleId);

    const permissions = await RolePermission.findAll({
      where: {
        roleId: roleId, 
      },
      include: [
        {
          model: Permission, 
          as: "permission", 
          attributes: ["id", "permissionName"], 
        },
      ],
    });

    if (!role) {
      return NextResponse.json({ message: "Role not found" }, { status: 404 });
    }

    return NextResponse.json({ role, permissions });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { message: "Error fetching role", error: errorMessage },
      { status: 500 }
    );
  }
}

// PUT /api/roles/[roleId] - Update a role by ID
export async function PUT(req: NextRequest, context: Context) {
  try {
    const { roleId } = context.params;
    const { roleName, multiSelectField } = await req.json();
    console.log(roleName, multiSelectField);

    // Fetch the role by ID
    const role = await Role.findByPk(roleId);

    if (!role) {
      return NextResponse.json({ message: 'Role not found' }, { status: 404 });
    }

    // Update the role name if provided
    if (roleName) {
      role.roleName = roleName;
      await role.save();
    }

    // Update permissions only if provided
    if (multiSelectField.length > 0) {
      // Clear existing permissions
      await RolePermission.destroy({
        where: {
          roleId: roleId
        }
      });

      // Add new permissions
      for (const permission of multiSelectField) {
        await RolePermission.create({
          roleId: role.id,
          permissionId: permission
        });
      }
    }

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
    await RolePermission.destroy({
      where: {
        roleId: roleId
      }
    });

    return NextResponse.json({ message: 'Role deleted successfully' });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ message: 'Error deleting role', error: errorMessage }, { status: 500 });
  }
}
