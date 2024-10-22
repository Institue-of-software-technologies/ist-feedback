import { FeedbackQuestion } from '@/db/models/FeedbackQuestion';
import { NextRequest, NextResponse } from 'next/server';

// GET /api/feedback-questions - Fetch all Feedback Questions
export async function GET() {
  try {
    const question = await FeedbackQuestion.findAll();
    return NextResponse.json({ question });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ message: 'Error fetching feedback question', error: errorMessage }, { status: 500 });
  }
}

// POST /api/feedback-questions - Create a new Feedback Question
export async function POST(req: NextRequest) {
  try {
    const { Question } = await req.json();
    const question = await FeedbackQuestion.create({ questionText: Question });
    return NextResponse.json({ message: 'Feedback Question created successfully', question }, { status: 201 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ message: 'Error creating feedback question', error: errorMessage }, { status: 500 });
  }
}

