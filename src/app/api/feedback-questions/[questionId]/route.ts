import { FeedbackQuestion } from '@/db/models/FeedbackQuestion';
import { AnswerOption } from '@/db/models/AnswerOption';
import { NextRequest, NextResponse } from 'next/server';

interface Context {
  params: { questionId: string };
}

// GET /api/feedback-questions/[questionId] - Fetch a feedback question by ID
export async function GET(req: NextRequest, context: Context) {
  try {
    const { questionId } = context.params;
    const question = await FeedbackQuestion.findByPk(questionId);

    if (!question) {
      return NextResponse.json({ message: 'Feedback question not found' }, { status: 404 });
    }

    return NextResponse.json({ question });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ message: 'Error fetching feedback question', error: errorMessage }, { status: 500 });
  }
}

// PUT /api/feedback-questions/[questionId] - Update a feedback question by ID
export async function PUT(req: NextRequest, context: Context) {
  try {
    const { questionId } = context.params;
    const { questionText, questionType, options } = await req.json();

    // Validate questionType if provided
    const validTypes = ['open-ended', 'closed-ended', 'rating'];
    if (questionType && !validTypes.includes(questionType)) {
      return NextResponse.json(
        { message: 'Invalid questionType. Must be one of: open-ended, closed-ended, or rating.' },
        { status: 400 }
      );
    }

    // Find the question and include associated answer options
    const question = await FeedbackQuestion.findByPk(questionId, {
      include: AnswerOption,
    });

    if (!question) {
      return NextResponse.json({ message: 'Feedback question not found' }, { status: 404 });
    }

    question.questionText = questionText ?? question.questionText;
    question.questionType = questionType ?? question.questionType;

    // If it's a closed-ended question, update the answer options
    if (questionType === 'closed-ended' && Array.isArray(options)) {
      await AnswerOption.destroy({ where: { feedbackQuestionId: questionId } });

      const newOptions = options.map((optionText: string) => ({
        optionText,
        feedbackQuestionId: question.id,
      }));

      await AnswerOption.bulkCreate(newOptions);
    }

    await question.save();

    return NextResponse.json({ message: 'Feedback question updated successfully', question });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ message: 'Error updating Feedback Question', error: errorMessage }, { status: 500 });
  }
}

// DELETE /api/feedback-questions/[questionId] - Delete a feedback question by ID
export async function DELETE(req: NextRequest, context: Context) {
  try {
    const { questionId } = context.params;
    const question = await FeedbackQuestion.findByPk(questionId);

    if (!question) {
      return NextResponse.json({ message: 'Feedback question not found' }, { status: 404 });
    }

    await question.destroy();

    return NextResponse.json({ message: 'Feedback question deleted successfully' });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ message: 'Error deleting feedback question', error: errorMessage }, { status: 500 });
  }
}