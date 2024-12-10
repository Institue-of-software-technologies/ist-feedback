import { Feedback } from "@/db/models/Feedback";
import { Permission } from "@/db/models/Permission";
import { RolePermission } from "@/db/models/RolePermissions";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";


export async function GET(
  request: NextRequest,
  { params }: { params: { feedbackToken: string } }
) {
  try {
    const { feedbackToken } = params;

    // Find the token and check its time status
    const token = await Feedback.findOne({
      where: {
        studentToken: feedbackToken,
      },
    });

    if (!token) {
      return NextResponse.json(
        { message: "Token not found", status: "not_found" },
        { status: 404 }
      );
    }

    const now = new Date();

    if (token.tokenExpiration < now) {
      return NextResponse.json(
        { message: "Token has expired", status: "expired" },
        { status: 400 }
      );
    }

    if (token.tokenStartTime > now) {
      return NextResponse.json(
        {
          message: `Token will be active on ${token.tokenStartTime.toLocaleString(
            "en-KE",
            {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
              timeZoneName: "short",
            }
          )}`,
          status: "upcoming",
        },
        { status: 400 }
      );
    }

    // Fetch role permissions if token is active
    const rolePermissions = await RolePermission.findAll({
      where: { roleId: 3 },
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

    return NextResponse.json({
      token,
      permissions,
      role: "student",
      status: "active",
      message: "Token is active",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to retrieve token", status: "error" },
      { status: 500 }
    );
  }
}

