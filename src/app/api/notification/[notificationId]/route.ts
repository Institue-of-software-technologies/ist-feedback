import Notification from "@/db/models/Notification";
import { NextRequest, NextResponse } from "next/server";

interface Context {
  params: { notificationId: number };
}

// DELETE /api/class-Times/[classTimesId] - Delete a class-Times by ID
export async function DELETE(req: NextRequest, context: Context) {
  try {
    const { notificationId } = context.params;
    const notification = await Notification.findByPk(notificationId);

    if (!notification) {
      return NextResponse.json({ message: 'notification not found' }, { status: 404 });
    }

    await notification.destroy();

    return NextResponse.json({ message: 'class Times deleted successfully' });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ message: 'Error deleting Class Times', error: errorMessage }, { status: 500 });
  }
}
export async function PUT(req: NextRequest, context: Context) {
  try {
    const { notificationId } = context.params;
    const { status } = await req.json(); // Assume that status is passed in the request body

    // Validate status input (e.g., "read" or "unread")
    if (status !== 'read' && status !== 'unread') {
      return NextResponse.json(
        { message: 'Invalid status value. Use "read" or "unread".' },
        { status: 400 }
      );
    }

    // Find the notification by ID
    const notification = await Notification.findByPk(notificationId);

    if (!notification) {
      return NextResponse.json({ message: 'Notification not found' }, { status: 404 });
    }

    // Update the status of the notification
    notification.status = status;
    await notification.save();

    return NextResponse.json({ message: 'Notification status updated successfully' });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ message: 'Error updating notification status', error: errorMessage }, { status: 500 });
  }
}