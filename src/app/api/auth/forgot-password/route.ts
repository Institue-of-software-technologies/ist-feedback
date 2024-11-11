import { User } from "@/db/models/User";
import { NextRequest, NextResponse } from "next/server";
import ResetPasswordEmail from "../../../../../emails/resetPassword";
import { render } from '@react-email/components';
import nodemailer from 'nodemailer';
import crypto from 'crypto';
import { PasswordReset } from "@/db/models/PasswordReset";

const user = process.env.MAIL_USERNAME;
const pass = process.env.MAIL_PASSWORD;
const URL = process.env.URL;

export async function POST(request: NextRequest) {
    const body = await request.json();
    const { email } = body;
    const now = new Date();
    
    try {
        // Find user in database
        const findUser = await User.findOne({ where: { email } });
        
        if (!findUser) {
            return NextResponse.json(
              { message: 'Email not found' },
              { status: 401 }
            );
        }
         // Generate a secure reset token
         const resetToken = crypto.randomBytes(32).toString('hex');
         const tokenExpiration = Date.now() + 5 * 60 * 1000;
         await PasswordReset.create({
            email:email,
            token:resetToken,
            expires:tokenExpiration
         })
 
         // Send the email with reset link including the token
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

        const view  = await render(ResetPasswordEmail({
            username: findUser.username,
            updatedDate: now,
            resetPasswordLink: customLink
        }));

        const options = {
            from: user,
            to: email,
            subject: 'Password Reset',
            html: view ,
        };

        await transporter.sendMail(options);

        return NextResponse.json(
            { message: 'Email sent successfully' },
            { status: 200 }
        );
        
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'Failed to send email' }, { status: 500 });
    }
}


// option 2 for sending email
        // const { data, error } = await resend.emails.send({
        //   from: 'Institute of Software Technologies <onboarding@resend.dev>',
        //   to: [email],
        //   subject: 'Password Reset',
        //   react: Email({
        //     username:findUser.username,
        //     updatedDate:now,
        //     resetPasswordLink:customLink
        //   }),
        // });