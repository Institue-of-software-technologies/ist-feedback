import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import crypto from 'crypto';
import { User } from '@/db/models';
import { PasswordReset } from '@/db/models/PasswordReset';
import { render } from '@react-email/components';
import InviteUserEmail from '../../../../../emails/inviteUser';

const users = process.env.MAIL_USERNAME;
const pass = process.env.MAIL_PASSWORD;
const URL = process.env.URL;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email } = body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    await PasswordReset.destroy({
      where: { email },
    });

    const resetToken = crypto.randomBytes(32).toString('hex');
    const tokenExpiration = Date.now() + 5 * 60 * 1000;

    await PasswordReset.upsert({
      email,
      token: resetToken,
      expires: tokenExpiration,
    });

    const customLink = `${URL}/reset-password-invite?token=${resetToken}&email=${email}&user=${user.id}`;

    const transporter = nodemailer.createTransport({
      host: 'smtp.googlemail.com',
      port: 587,
      secure: false, // Use TLS with port 587
      auth: {
        user: users, // Corrected property
        pass,        // Correct password
      },
      tls: {
        rejectUnauthorized: false, // Allows self-signed certificates (use with caution)
      },
    });

    const view = await render(
      InviteUserEmail({ username: user.username, inviteLink: customLink })
    );

    await transporter.sendMail({
      from: users,
      to: email,
      subject: 'Resend Invitation Token',
      html: view,
    });

    return NextResponse.json(
      { message: 'Invitation token resent successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error(error); // Log error for debugging
    return NextResponse.json(
      { message: 'Error resending invitation token', error: error },
      { status: 500 }
    );
  }
}
