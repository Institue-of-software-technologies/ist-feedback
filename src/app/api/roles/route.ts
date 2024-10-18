import { NextRequest, NextResponse } from 'next/server';
import { Role } from '@/db/models/Role';
import { RolePermission } from '@/db/models/RolePermissions';

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

// POST /api/roles - Create a new role with the role to be assigned
export async function POST(req: NextRequest) {
  try {
    const { roleName, multiSelectField} = await req.json(); 
    const role = await Role.create({ roleName });
    

    //insert into the RolePermission table with the needed ids
    for (const permission of multiSelectField) {
      await RolePermission.create({
        roleId: role.id,
        permissionId: permission
      });
    }

    return NextResponse.json(
      { message: "Role created and permissions assigned successfully", role },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { message: "Error creating role", error: errorMessage },
      { status: 500 }
    );
  }
}

