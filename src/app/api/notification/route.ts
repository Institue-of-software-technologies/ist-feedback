import { User } from '@/db/models';
import Notification from '@/db/models/Notification';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    // Parse the request body
    const { title, message, priority, expiresAt,email } = await req.json();

    const userRecipient = await User.findOne({where:{roleId:1}})
    const userSender = await User.findOne({where:{email:email}})

    if (!title || typeof title !== 'string') {
      return NextResponse.json(
        { message: 'Invalid input: title is required and must be a string.' },
        { status: 400 }
      );
    }
    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { message: 'Invalid input: message is required and must be a string.' },
        { status: 400 }
      );
    }
    if (priority && !['low', 'normal', 'high'].includes(priority)) {
      return NextResponse.json(
        { message: 'Invalid input: priority must be one of "low", "normal", or "high".' },
        { status: 400 }
      );
    }

    // Create the notification
    const notification = await Notification.create({
      userId:userRecipient?.id,
      title,
      message,
      link:`/dashboard/users/edit/${userSender?.id}`,
      priority: priority || 'normal', // Default to 'normal' if not provided
      expiresAt: expiresAt ? new Date(expiresAt) : null, // Parse expiresAt to a date or set it null
    });

    // Return a success response
    return NextResponse.json(
      { message: 'Notification created successfully', notification },
      { status: 201 }
    );
  } catch (error) {
    // Handle errors
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json(
      { message: 'Error creating notification', error: errorMessage },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  const userId = req.headers.get("user-id");
  try {
    // Fetch all notifications from the database
    const notifications = await Notification.findAll({where:{userId:userId}});

    // Return the notifications in the response
    return NextResponse.json(
      { message: 'Notifications fetched successfully', notifications },
      { status: 200 }
    );
  } catch (error) {
    // Handle errors
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json(
      { message: 'Error fetching notifications', error: errorMessage },
      { status: 500 }
    );
  }
}
