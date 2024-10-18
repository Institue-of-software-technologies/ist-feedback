import { Intake } from "@/db/models/Intake";
import { NextRequest, NextResponse } from "next/server";

// GET /api/intakes - Fetch all intakes
export async function GET() {
  try {
    const intake = await Intake.findAll();
    return NextResponse.json({ intake });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { message: "Error fetching intakes", error: errorMessage },
      { status: 500 }
    );
  }
}

// POST /api/intakes - Create a new intake
export async function POST(req: NextRequest) {
  try {
    const { intakeName , intakeYear } = await req.json();
    const intake = await Intake.create({ intakeName , intakeYear });
    return NextResponse.json(
      { message: "Intake created successfully", intake },
      { status: 201 }
    );
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { message: "Error creating Intake", error: errorMessage },
      { status: 500 }
    );
  }
}
