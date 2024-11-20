import { Feedback } from "@/db/models/Feedback";
import { Permission } from "@/db/models/Permission";
import { RolePermission } from "@/db/models/RolePermissions";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { Op, Sequelize } from "sequelize";

export async function GET(
  request: NextRequest,
  { params }: { params: { feedbackToken: string } }
) {
  try {
    const { feedbackToken } = params; // Destructure params from the context

    // Find the token and check that it's within the valid time range
    const token = await Feedback.findOne({
      where: {
        studentToken: feedbackToken,
        tokenStartTime: { [Op.lte]: Sequelize.literal("CURRENT_TIMESTAMP") }, // Start time must be in the past or now
        tokenExpiration: { [Op.gt]: Sequelize.literal("CURRENT_TIMESTAMP") }, // Expiration must be in the future
      },
    });

    if (!token) {
      return NextResponse.json(
        { message: "Feedback token not found or expired" },
        { status: 404 }
      );
    }

    // Fetch role permissions
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

    // Map permissions to their names
    const permissions = rolePermissions.map(
      (rp) => rp.permission?.permissionName || ""
    );

    return NextResponse.json({
      token,
      permissions: permissions,
      role: "student",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to retrieve token" },
      { status: 500 }
    );
  }
}
