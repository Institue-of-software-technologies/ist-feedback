import { NextResponse } from 'next/server';
import { User } from '@/db/models/User';
import { Role } from '@/db/models/Role';
import '@/db/models/associations'; // Import the associations file after both models
import bcrypt from 'bcrypt';

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

    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Error creating user', error }, { status: 500 });
  }
}
