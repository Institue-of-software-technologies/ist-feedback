import { NextResponse } from 'next/server';
import {User} from '@/db/models/index';
import { Role } from '@/db/models/Role';
import '@/db/models/associations'; // Import the associations file after both models
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { PasswordReset } from '@/db/models/PasswordReset';
import nodemailer from 'nodemailer';
import InviteUserEmail from '../../../../emails/inviteUser';
import { render } from '@react-email/components';
import { Course } from '../../../db/models/Course';
import { TrainerCourses } from '@/db/models/TrainerCourses';

const user = process.env.MAIL_USERNAME;
const pass = process.env.MAIL_PASSWORD;
const URL = process.env.URL;

// GET: Fetch all users
export async function GET() {
  try {
    const users = await User.findAll({
      include: [
        {
          model: Role,
          as: "roleUsers",
          attributes: ["id", "roleName"],
        },
        {
          model: TrainerCourses,
          as: "trainer_courses",
          include: [
            {
              model: Course,
              as: "course",
              attributes: ["id", "courseName",], // Adjust attributes as needed
            },
          ],
        },
      ],
    });
    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching users", error },
      { status: 500 }
    );
  }
}
// POST: Create a new user
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { username, email, password, roleId,multiSelectField } = body;

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      roleId,
    });

    for (const courses of multiSelectField) {
      await TrainerCourses.create({
        trainerId: newUser.id,
        courseId: courses
      });
    }

    // Generate a secure reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const tokenExpiration = Date.now() + 5 * 60 * 1000;
    await PasswordReset.create({
      email: email,
      token: resetToken,
      expires: tokenExpiration
    })

    const customLink = `${URL}/reset-password-invite?token=${resetToken}&email=${email}`;

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
    const view = await render(InviteUserEmail({
      username: username,
      inviteLink: customLink
    }));

    const options = {
      from: user,
      to: email,
      subject: 'Activate account',
      html: view,
    };

    await transporter.sendMail(options);
    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Error creating user', error }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  const body = await req.json();
  console.log(body);
  const { username, email, OldPassword, NewPassword, ConfirmNewPassword, userId } = body;

  // Define a regex for validating the password
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/;

  try {
    // Check if NewPassword meets the security criteria (only if NewPassword is provided)
    if (NewPassword && !passwordRegex.test(NewPassword)) {
      return NextResponse.json(
        { message: 'New password must be at least 8 characters long, contain a mix of letters, numbers, and special characters.' },
        { status: 400 }
      );
    }

    // Ensure that the new password and confirm password match (only if NewPassword is provided)
    if (NewPassword && NewPassword !== ConfirmNewPassword) {
      return NextResponse.json(
        { message: 'New password and confirm password do not match' },
        { status: 400 }
      );
    }

    // Find the user by userId
    const user = await User.findByPk(userId);
    if (user) {
      // Check if the OldPassword matches the stored hash (only if NewPassword is provided)
      if (NewPassword && !OldPassword) {
        return NextResponse.json(
          { message: 'Old password is required when updating the password' },
          { status: 400 }
        );
      }

      if (NewPassword && OldPassword) {
        const passwordValidation = await bcrypt.compare(OldPassword, user.password ?? '');
        if (!passwordValidation) {
          return NextResponse.json(
            { message: 'Invalid password credentials' },
            { status: 400 }
          );
        }
      }

      // Update user details, only modify the values that are provided
      const updatedUser = await user.update({
        username: username || user.username,
        email: email || user.email,
        password: NewPassword ? await bcrypt.hash(NewPassword, 10) : user.password,
      });

      return NextResponse.json(updatedUser, { status: 200 });
    } else {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }
  } catch (error) {
    console.error("Error updating user:", error); // Log the error object
    return NextResponse.json({ message: 'Error updating user', error }, { status: 500 });
  }
}