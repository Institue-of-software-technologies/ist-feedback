import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Logic to retrieve trainers, for example, fetching from a database
    const trainers = [
      { id: 1, name: "John Doe", expertise: "JavaScript" },
      { id: 2, name: "Jane Smith", expertise: "React" },
    ];

    // Return the list of trainers as a JSON response
    return NextResponse.json(trainers);
  } catch (error) {
    // Return an error response if something goes wrong
    return NextResponse.json(
      { error: "Failed to retrieve trainers" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();

    // Logic to add a new trainer, e.g., save to a database
    const newTrainer = {
      id: 3, // This should come from the database or generated dynamically
      name: data.name,
      expertise: data.expertise,
    };

    // Return the newly created trainer as a JSON response
    return NextResponse.json(newTrainer, { status: 201 });
  } catch (error) {
    // Return an error response if something goes wrong
    return NextResponse.json(
      { error: "Failed to add trainer" },
      { status: 500 }
    );
  }
}
