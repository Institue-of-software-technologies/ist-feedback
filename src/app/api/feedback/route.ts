import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Your logic to handle the request
    return NextResponse.json({ message: "Feedback retrieved successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to retrieve feedback" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    console.log(data)
    // Your logic to handle the POST request
    return NextResponse.json({ message: "Feedback submitted successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to submit feedback" },
      { status: 500 }
    );
  }
}
