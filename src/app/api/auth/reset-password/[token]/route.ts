import { PasswordReset } from '@/db/models/PasswordReset';
import { NextResponse } from 'next/server';
import { Op } from 'sequelize'; // Import Sequelize operators

export async function GET(request: Request, { params }: { params: { token: string } }) {
  try {
    console.log('Received token:', params.token);

    // Ensure `params.token` exists
    if (!params.token) {
      return NextResponse.json({ message: 'Token is missing' }, { status: 400 });
    }

    // Check the token in the database
    const passwordReset = await PasswordReset.findOne({
      where: {
        token: params.token,
        expires: { [Op.gt]: new Date() }, // Ensure the token hasn't expired
      },
    });

    if (!passwordReset) {
      return NextResponse.json({ message: 'Expired or invalid token' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Token is valid' }, { status: 200 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error in GET handler:', errorMessage);
    return NextResponse.json({ message: 'Server error', error: errorMessage }, { status: 500 });
  }
}
