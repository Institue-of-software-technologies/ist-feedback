import { Token } from "@/db/models/Token";
import { NextResponse } from "next/server";
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest, { params }: { params: { feedbackToken: string } }) {
    try {
        const { feedbackToken } = params;  // Correctly destructure the params from the context
        console.log(feedbackToken);

        const token = await Token.findOne({
            where: {
                tokenValue: feedbackToken
            }
        });

        if (!token) {
            return NextResponse.json({ message: 'Feedback token not found' }, { status: 404 });
        }

        return NextResponse.json({ token });
    } catch (error) {
        console.log(error);
        return NextResponse.json(
            { error: "Failed to retrieve token" },
            { status: 500 }
        );
    }
}
