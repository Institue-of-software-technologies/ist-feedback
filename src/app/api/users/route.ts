import { NextResponse } from 'next/server';
import { User } from '@/db/models/User';
import { Role } from '@/db/models/Role';
import '@/db/models/associations'; // Import the associations file after both models
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { PasswordReset } from '@/db/models/PasswordReset';
import nodemailer from 'nodemailer';
import InviteUserEmail from '../../../../emails/inviteUser';
import { render } from '@react-email/components';

const user = process.env.MAIL_USERNAME;
const pass = process.env.MAIL_PASSWORD;
const URL = process.env.URL;

// GET: Fetch all users
export async function GET() {
  try {
    const users = await User.findAll({ include: [{ model: Role, as: 'role' }] });
    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching users', error }, { status: 500 });
  }
}

// POST: Create a new user
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { username, email, password, roleId } = body;

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      roleId,
    });

    // Generate a secure reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const tokenExpiration = Date.now() + 5 * 60 * 1000;
    await PasswordReset.create({
       email:email,
       token:resetToken,
       expires:tokenExpiration
    })

    const customLink = `${URL}/reset-password?token=${resetToken}&email=${email}`;
    
    // Create transport for Gmail
    const transporter = nodemailer.createTransport({
      host: 'smtp.googlemail.com',
      port: 587,
      secure: false, // Use TLS with port 587
      auth: {
          user,
          pass,
      },
      tls: {
          rejectUnauthorized: false, // Allows self-signed certificates (use with caution)
      },
  });
  const emailHtml = await render(InviteUserEmail({
      username: username,
      inviteLink: customLink
  }));

  const options = {
      from: user,
      to: email,
      subject: 'Invite user',
      html: emailHtml,
  };

await transporter.sendMail(options);
    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Error creating user', error }, { status: 500 });
  }
}
