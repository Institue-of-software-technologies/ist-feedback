import { Session } from "@/db/models/Session";
import { cookies } from "next/headers";
import { decrypt } from "../authToken/createToken";

export async function recordLogout(userId: string | number): Promise<void> {
  try {
    const sessionToken = cookies().get("session")?.value;
    if (!sessionToken) {
      throw new Error("Session token not found. User is not logged in.");
    }

    const { id: decryptedUserId } = await decrypt(sessionToken); // Extract the userId from the token

    if (!decryptedUserId) {
      throw new Error("Invalid session token. Cannot retrieve userId.");
    }

    // Use userId passed into the function (for example, log or validate it)
    if (userId !== decryptedUserId) {
      throw new Error("User ID mismatch. The user trying to log out does not match the token.");
    }

    // Find the active session for this user
    const session = await Session.findOne({
      where: { userId: decryptedUserId, logoutTime: null },
      order: [["loginTime", "DESC"]],
    });

    if (!session) {
      throw new Error("No active session found for this user.");
    }

    // Calculate duration and update session
    const logoutTime = new Date();
    const duration = Math.floor(
      (logoutTime.getTime() - session.loginTime.getTime()) / 1000
    );

    session.logoutTime = logoutTime;
    session.duration = duration;

    await session.save();
  } catch (error) {
    console.error("Error recording logout:", error);
    throw new Error("Failed to record logout in the database.");
  }
}
