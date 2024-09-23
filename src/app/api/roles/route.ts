// import { NextResponse } from 'next/server';
// import { Role } from '@/db/models/Role';

// // CREATE a new role
// export async function POST(req: Request) {
//   try {
//     const { roleName } = await req.json();
//     const role = await Role.create({ roleName });
//     return NextResponse.json({ message: 'Role created successfully', role });
//   } catch (error) {
//     const errorMessage = error instanceof Error ? error.message : 'Unknown error';
//     return NextResponse.json({ message: 'Error creating role', error: errorMessage }, { status: 500 });
//   }
// }

// // READ (get all roles)
// export async function GET() {
//   try {
//     const roles = await Role.findAll();
//     return NextResponse.json({ roles });
//   } catch (error) {
//     const errorMessage = error instanceof Error ? error.message : 'Unknown error';
//     return NextResponse.json({ message: 'Error fetching roles', error: errorMessage }, { status: 500 });
//   }
// }

// // UPDATE a role
// export async function PUT(req: Request) {
//   try {
//     const { id, roleName } = await req.json();
//     const role = await Role.findByPk(id);

//     if (!role) {
//       return NextResponse.json({ message: 'Role not found' }, { status: 404 });
//     }

//     role.roleName = roleName;
//     await role.save();

//     return NextResponse.json({ message: 'Role updated successfully', role });
//   } catch (error) {
//     const errorMessage = error instanceof Error ? error.message : 'Unknown error';
//     return NextResponse.json({ message: 'Error updating role', error: errorMessage }, { status: 500 });
//   }
// }

// // DELETE a role
// export async function DELETE(req: Request) {
//   try {
//     const { id } = await req.json();
//     const role = await Role.findByPk(id);

//     if (!role) {
//       return NextResponse.json({ message: 'Role not found' }, { status: 404 });
//     }

//     await role.destroy();
//     return NextResponse.json({ message: 'Role deleted successfully' });
//   } catch (error) {
//     const errorMessage = error instanceof Error ? error.message : 'Unknown error';
//     return NextResponse.json({ message: 'Error deleting role', error: errorMessage }, { status: 500 });
//   }
// }
// src/app/api/roles/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { Role } from '@/db/models/Role';

// GET /api/roles - Fetch all roles
export async function GET(req: NextRequest) {
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

