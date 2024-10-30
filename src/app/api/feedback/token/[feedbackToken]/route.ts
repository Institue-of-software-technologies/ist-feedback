import { Feedback } from "@/db/models/Feedback";
import { FeedbackAnswer } from "@/db/models/FeedbackAnswer";
import { NextResponse } from "next/server";
import { NextRequest } from 'next/server';
import { Op } from "sequelize";

export async function GET(request: NextRequest, { params }: { params: { feedbackToken: string } }) {
    try {
        const { feedbackToken } = params;  // Correctly destructure the params from the context

        const token = await Feedback.findOne({
            where: {
                studentToken: feedbackToken,
                tokenExpiration: { [Op.gt]: new Date() }
            }
        });

        if (!token) {
            return NextResponse.json({ message: 'Feedback token not found or expired' }, { status: 404 });
        }

        let ipAddress = 'Unknown IP';
        await fetch("https://api.ipify.org?format=json")
            .then(response => response.json())
            .then(data => {
                ipAddress = data.ip;
            })
            .catch(error => {
                console.error("Error fetching IP address:", error);
            });

        const ipCheck = await FeedbackAnswer.findOne({
            where: {
                userIp: ipAddress,
            }
        });

        if (ipCheck) {
            return NextResponse.json(
                { 
                    message: 'It seems you have already submitted your feedback. If you need to make changes, please contact support.' 
                }, 
                { status: 409 }
            );
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
