import { NextRequest, NextResponse } from "next/server";
import nodemailer from 'nodemailer';
import ReportEmail from "../../../../../emails/sendPDF";
import { render } from '@react-email/components';

const user = process.env.MAIL_USERNAME;
const pass = process.env.MAIL_PASSWORD;

export async function POST(req: NextRequest) {
    // Create buffer of the request body
    const formData = await req.formData();
  
    // Get PDF blob from formData
    const pdfBlob = formData.get("pdf");
    const receiverEmail = formData.get("email");
    const receiverName = formData.get("name");
  
    if (!pdfBlob) {
        return NextResponse.json({ error: "No PDF file uploaded." }, { status: 400 });
    }
  
    try {
        // Convert blob to Buffer
        const pdfBuffer = Buffer.from(await (pdfBlob as Blob).arrayBuffer());
  
        // Send email with PDF attached
        await sendEmailWithAttachment(pdfBuffer, receiverEmail as string, receiverName as string);
  
        return NextResponse.json({ message: "Email sent successfully!" }, { status: 200 });
    } catch (error) {
        console.error("Error sending email:", error);
        return NextResponse.json({ error: "Failed to send email." }, { status: 500 });
    }
  }
  const sendEmailWithAttachment = async (pdfBuffer: Buffer, receiverEmail: string, receiverName: string) => {
    const transporter = nodemailer.createTransport({
        host: "smtp.googlemail.com",
        port: 587,
        secure: false,
        auth: {
            user,
            pass,
        },
        tls: {
            rejectUnauthorized: false, // Allows self-signed certificates (use with caution)
        },
    });
    const now = new Date();

    const view  = await render(ReportEmail({
        trainerName: receiverName,
        reportDate: now,
    }));

  
    const mailOptions = {
        from: "Institute of software Technologies",

        to: receiverEmail,
        subject: "Feedback Report",
        html: view ,
        attachments: [
            {
                filename: "feedback_report.pdf",
                content: pdfBuffer,
                contentType: "application/pdf",
            },
        ],
    }; 
  
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully!");
  } 