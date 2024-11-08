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
    const { feedbackToken } = params; // Correctly destructure the params from the context

   const token = await Feedback.findOne({
     where: {
       studentToken: feedbackToken,
       tokenExpiration: { [Op.gt]: Sequelize.literal("CURRENT_TIMESTAMP") },
     },
   });


    if (!token) {
      return NextResponse.json(
        { message: "Feedback token not found or expired" },
        { status: 404 }
      );
    }

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
      permissions: permissions,
      role: "student",
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Failed to retrieve token" },
      { status: 500 }
    );
  }
}
