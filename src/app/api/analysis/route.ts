export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { Session } from "@/db/models/Session";
import { cookies } from "next/headers";
import { decrypt } from "../authToken/createToken";

export async function GET() {
  try {
    const sessionCookie = cookies().get("session");

    if (!sessionCookie) {
      return NextResponse.json({ error: "No session found" }, { status: 400 });
    }

    const decryptedSession = await decrypt(sessionCookie.value);
    const userId = decryptedSession.id;

    if (!userId) {
      return NextResponse.json(
        { error: "Invalid session data" },
        { status: 400 }
      );
    }

    const sessions = await Session.findAll({
      where: { userId },
      order: [["loginTime", "DESC"]],
    });

    const completedSessions = sessions.filter(
      (session) => session.logoutTime !== null
    );
    const usageData = completedSessions.map((session) => {
      const loginTime = new Date(session.loginTime);
      const logoutTime = new Date(session.logoutTime);
      const duration = Math.floor(
        (logoutTime.getTime() - loginTime.getTime()) / 1000
      );
      return { loginTime, logoutTime, duration };
    });

    return NextResponse.json({ usageData });
  } catch (error) {
    console.error("Error fetching session data:", error);
    return NextResponse.json(
      { error: "Failed to fetch session data" },
      { status: 500 }
    );
  }
}
