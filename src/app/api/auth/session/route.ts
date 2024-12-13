import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../../../../../lib/auth";

export async function GET() {
  // Get the session
  const session = await getServerSession(authOptions);

  if (session) {
    // If a session exists, return it
    return NextResponse.json(
        { session },
        { status: 200 }
      );
  } else {
    // If no session exists, return a 404 or an appropriate error response
    return NextResponse.json(
        { message: 'No active session found' },
        { status: 400 }
      );
  }
}
