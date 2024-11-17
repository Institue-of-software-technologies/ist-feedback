import { NextResponse } from 'next/server';
import { User } from '@/db/models/User';
import bcrypt from 'bcrypt';

// GET: Fetch user by ID
export async function GET(req: Request, { params }: { params: { userId: string } }) {
  
  try {
    const user = await User.findByPk(params.userId);
    if (user) {
      return NextResponse.json(user, { status: 200 });
    } else {
      return NextResponse.json({ message: 'User not found - *' }, { status: 404 });
    }
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching user', error }, { status: 500 });
  }
}

// PUT: Update user by ID
export async function PUT(req: Request, { params }: { params: { userId: string } }) {
  try {
    const body = await req.json();
    const { username, email, password, roleId } = body;

    const user = await User.findByPk(params.userId);

    if (user) {
      const updatedUser = await user.update({
        username: username || user.username,
        email: email || user.email,
        password: password ? await bcrypt.hash(password, 10) : user.password,
        roleId: roleId || user.roleId,
      });

      return NextResponse.json(updatedUser, { status: 200 });
    } else {
      return NextResponse.json({ message: 'User not found - here' }, { status: 404 });
    }
  } catch (error) {
    return NextResponse.json({ message: 'Error updating user', error }, { status: 500 });
  }
}

// DELETE: Delete user by ID
export async function DELETE(req: Request, { params }: { params: { userId: string } }) {
  try {
    // Log the incoming userId
    console.log("Received userId for deletion:", params.userId);

    const user = await User.findByPk(params.userId);
    console.log("Backend delete user:", user); // Log the user object

    if (user) {
      await user.destroy();
      // Return a response without content
      return new Response(null, { status: 204 }); // Correctly return 204 No Content
    } else {
      console.log("User not found for id:", params.userId); // Log when user is not found
      return NextResponse.json({ message: 'User not found - backend' }, { status: 404 });
    }
  } catch (error) {
    console.error("Error deleting user:", error); // Log the error object
    return NextResponse.json({ message: 'Error deleting user', error }, { status: 500 });
  }
}