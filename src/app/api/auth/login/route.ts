import { User } from "@/db/models/User";
import bcrypt from "bcrypt";
import { cookies } from "next/headers";
import { encrypt } from "../../authToken/createToken";
import { NextResponse } from "next/server";
import { Role } from "@/db/models/Role";
import { Permission } from "@/db/models/Permission";
import { RolePermission } from "@/db/models/RolePermissions";
import { Session } from "@/db/models/Session";

export async function POST(req: Request) {
  const body = await req.json();
  const { email, password, rememberMe } = body;

  try {
    const findUser = await User.findOne({
      where: {
        email: email,
      },
    });

    if (!findUser) {
      return NextResponse.json(
        { message: "Invalid login credentials" },
        { status: 401 }
      );
    }
    if (!findUser.acceptInvite) {
      return NextResponse.json({ message: 'Please accept the invitation sent to your email.' }, { status: 400 });
    }

    const passwordValidation = await bcrypt.compare(
      password,
      findUser.password
    );
    if (!passwordValidation) {
      return NextResponse.json(
        { message: "Invalid login credentials" },
        { status: 401 }
      );
    }

    const role = await Role.findOne({
      where: {
        id: findUser.roleId,
      },
    });

    const rolePermissions = await RolePermission.findAll({
      where: { roleId: findUser.roleId },
      include: [
        {
          model: Permission,
          as: "permission",
          attributes: ["permissionName"],
        },
      ],
    });

    const permissions = rolePermissions.map(
      (rp) => rp.permission?.permissionName || ""
    );

    // Determine session expiration time
    const expires = new Date(
      Date.now() + (rememberMe ? 30 * 24 * 60 * 60 * 1000 : 1 * 60 * 60 * 1000)
    );

    // Create a custom payload
    const payLoad = {
      id: findUser.id, 
      username: findUser.username,
      email: findUser.email,
      roleId: findUser.roleId,
      permissions: permissions,
      expires: expires,
    };

    // Return the user role and permission to the client
    const client = {
      id: findUser.id,
      username: findUser.username,
      role: role?.roleName,
      permissions: permissions,
    };

    // Create session in the database
    const loginTime = new Date();
    await Session.create({
      userId: findUser.id,
      loginTime: loginTime,
    });

    const sessionToken = await encrypt(payLoad);

    // Set cookie with secure flag
    cookies().set("session", sessionToken, {
      expires, 
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Use secure flag in production
      sameSite: "strict", // Prevent CSRF attacks
    });

    return NextResponse.json(
      {
         message: "login successful",
         client
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
