import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { recordLogout } from "../../session-time/recordLogout"; // Import your service function
import { decrypt } from "../../authToken/createToken";

export async function POST() {
  try {
    const sessionCookie = cookies().get("session");

    if (!sessionCookie) {
      // If no session cookie is found, consider it already logged out
      return NextResponse.json(
        { message: "You have successfully logged out (no active session)." },
        { status: 200 }
      );
    }

    try {
      // Decrypt the session cookie to get the payload, which includes userId
      const decryptedSession = await decrypt(sessionCookie.value);
      const { id: userId } = decryptedSession;

      if (userId) {
        // Call the recordLogout function with the userId
        await recordLogout(userId);
      }
    } catch (decryptionError) {
      // If the token decryption fails (e.g., expired token), log the issue and proceed
      console.warn("Decryption failed or session expired:", decryptionError);
    }

    // Delete the session cookie regardless
    cookies().delete("session");

    return NextResponse.json(
      { message: "You have successfully logged out." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json({ error: "Failed to log out" }, { status: 500 });
  }
}
