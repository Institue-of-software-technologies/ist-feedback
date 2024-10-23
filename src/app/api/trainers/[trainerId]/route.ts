import { NextRequest, NextResponse } from 'next/server';
import { Trainer } from '@/db/models/Trainer';

interface Context {
  params: { id: number };
}

// GET /api/trainers/[trainerId] - Fetch a trainer by ID
export async function GET(req: NextRequest, context: Context) {
  try {
    const { id } = context.params;
    const trainer = await Trainer.findByPk(id);

    if (!trainer) {
      return NextResponse.json(
        { message: 'Trainer not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ trainer });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { message: 'Error fetching trainer', error: errorMessage },
      { status: 500 }
    );
  }
}

// PUT /api/trainers/[trainerId] - Update a trainer by ID
export async function PUT(req: NextRequest, context: Context) {
  try {
    const { id } = context.params;
    const { name } = await req.json();

    const trainer = await Trainer.findByPk(id);

    if (!trainer) {
      return NextResponse.json({ message: 'Trainer not found' }, { status: 404 });
    }

    trainer.name = name;
    await trainer.save();

    return NextResponse.json({
      message: 'Trainer updated successfully',
      trainer,
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { message: 'Error updating trainer', error: errorMessage },
      { status: 500 }
    );
  }
}

// DELETE /api/trainers/[trainerId] - Delete a trainer by ID
export async function DELETE(req: NextRequest, context: Context) {
  try {
    const { id } = context.params;
    const trainer = await Trainer.findByPk(id);

    if (!trainer) {
      return NextResponse.json(
        { message: 'Trainer not found' },
        { status: 404 }
      );
    }

    await trainer.destroy();

    return NextResponse.json({ message: 'Trainer deleted successfully' });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { message: 'Error deleting trainer', error: errorMessage },
      { status: 500 }
    );
  }
}
