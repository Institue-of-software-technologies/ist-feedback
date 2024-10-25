// src/app/api/roles/[roleId]/route.ts
import { Intake } from "@/db/models/Intake";
import { NextRequest, NextResponse } from "next/server";

interface Context {
  params: { intakeId: string };
}

// GET /api/intake/[intakeId] - Fetch a intake by ID
export async function GET(req: NextRequest, context: Context) {
  try {
    const { intakeId } = context.params;
    const intake = await Intake.findByPk(intakeId);

    if (!intake) {
      return NextResponse.json(
        { message: "Intake not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ intake });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { message: "Error fetching Intake", error: errorMessage },
      { status: 500 }
    );
  }
}

// PUT /api/intake/[intakeId] - Update a intake by ID
export async function PUT(req: NextRequest, context: Context) {
  try {
    const { intakeId } = context.params;
    const { intakeName , intakeYear } = await req.json();

    const intake = await Intake.findByPk(intakeId,);

    if (!intake) {
      return NextResponse.json(
        { message: "Intake not found" },
        { status: 404 }
      );
    }

    intake.intakeName = intakeName;
    intake.intakeYear = intakeYear;
    await intake.save();

    return NextResponse.json({
      message: "Intake updated successfully",
      intake,
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { message: "Error updating Intake", error: errorMessage },
      { status: 500 }
    );
  }
}

// DELETE /api/intake/[intakeId] - Delete a intake by ID
export async function DELETE(req: NextRequest, context: Context) {
  try {
    const { intakeId } = context.params;
    const intake = await Intake.findByPk(intakeId);

    if (!intake) {
      return NextResponse.json(
        { message: "Intake not found" },
        { status: 404 }
      );
    }

    await intake.destroy();

    return NextResponse.json({ message: "Intake deleted successfully" });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { message: "Error deleting intake", error: errorMessage },
      { status: 500 }
    );
  }
}
