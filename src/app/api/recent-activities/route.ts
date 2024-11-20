import { NextResponse } from "next/server";
import RecentActivities from "@/db/models/RecentActivities";

export async function GET() {
  try {
    const activities = await RecentActivities.findAll({
      order: [['timestamp', 'DESC']],
      limit: 20,
    });

    return NextResponse.json(activities, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch recent activities:", error);
    return NextResponse.json({ message: "Error fetching recent activities", error }, { status: 500 });
  }
}
