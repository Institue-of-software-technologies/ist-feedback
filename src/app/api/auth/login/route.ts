import { User } from "@/db/models/User";
import bcrypt from 'bcrypt';
import { cookies, headers } from "next/headers";
import { encrypt } from "../../authToken/createToken";
import { NextResponse } from "next/server";
import { Role } from "@/db/models/Role";
import { Permission } from "@/db/models/Permission";
import { RolePermission } from "@/db/models/RolePermissions";

export async function POST(req: Request) {
  const body = await req.json();
  const { email, password, rememberMe} = body;

  try {

    // Find user in database
    const findUser = await User.findOne({
      where: {
        email: email
      },
    });

    if (!findUser) {
      return NextResponse.json(
        { message: 'Invalid login credentials' },
        { status: 401 }
      );
    }

    // Validate password
    const passwordValidation = await bcrypt.compare(password, findUser.password);
    if (!passwordValidation) {
      return NextResponse.json(
        { message: 'Invalid login credentials' },
        { status: 401 },
      );
    }

    // Fetch the user's role
    const role = await Role.findOne({
       where: {
         id: findUser.roleId 
        }
    });

    //get the permissions from the rolePermissions table
    const rolePermissions = await RolePermission.findAll({
      where: { roleId: findUser.roleId },
      include: [
        { 
          model: Permission,
          as: 'permission', 
          attributes: ['permissionName'] 
        }
      ],
    });
    

    const permissions = rolePermissions.map((rp) => rp.permission?.permissionName || '');

    //create a custom payload
    const payLoad = {
        id: findUser.id,
        username: findUser.username,
        email: findUser.email,
        roleId: findUser.roleId,
        permissions:permissions
    }

    //return the user role and permission to the client
    const client = {
      id: findUser.id,
      username: findUser.username,
      role: role?.roleName,
      permissions:permissions
    }

    // Create session
    // expires session if true 30 days if false 1 hour 
    const expires = new Date(Date.now() +(rememberMe ? 30 * 24 * 60 * 60 * 1000 :1 * 60 * 60 * 1000));
    const session = await encrypt({ payLoad, expires });

    // Set cookie with secure flag (optional but recommended)
    cookies().set('session', session, { expires, httpOnly: true });

    return NextResponse.json(
      {
         message: "login successfull",
         client
      },
      { status: 200 },
    );
  }
  catch (error) {

    console.error(error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 },
    );
  }
}