import { PasswordReset } from "@/db/models/PasswordReset";
import { User } from "@/db/models/User";
import { NextRequest, NextResponse } from "next/server";
import { Op } from "sequelize";
import bcrypt from 'bcrypt';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { token, newPassword, email } = body;

  try {
    // Find the token and check if it is still valid (not expired)
    const passwordReset = await PasswordReset.findOne({
      where: {
        token,
        expires: { [Op.gt]: new Date() }  // Ensure the token hasn't expired
      }
    });
    
    if (!passwordReset) {
      return NextResponse.json({ message: 'Expired token' }, { status: 401 });
    }

    // Find the user by email
    const user = await User.findOne({
      where: { email }
    });

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    // Update the user's password
    user.password = hashedPassword;
    await user.save();

    // Delete the password reset token once the password is updated
    await passwordReset.destroy();

    // Return a success response after updating the password
    return NextResponse.json({ message: 'Password reset successful' }, { status: 200 });
  
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Failed to reset password' }, { status: 500 });
  }
}