import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

interface FeedbackQuestion {
  id: number;
  questionText: string;
  questionType: string;
  responses: { [answerText: string]: { count: number; percentage: string } };
}

export async function generatePDFReport(questions: FeedbackQuestion[]) {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([600, 800]);
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  let yPosition = 750;

  page.drawText("Feedback Report", {
    x: 50,
    y: yPosition,
    size: 20,
    font,
    color: rgb(0, 0.53, 0.71),
  });
  yPosition -= 40;

  questions.forEach((question) => {
    // Question title
    page.drawText(question.questionText, {
      x: 50,
      y: yPosition,
      size: 14,
      font,
      color: rgb(0, 0, 0),
    });
    yPosition -= 20;

    // Table headers
    page.drawText("Answer", { x: 50, y: yPosition, size: 10, font });
    page.drawText("Responses", { x: 250, y: yPosition, size: 10, font });
    page.drawText("Percentage", { x: 350, y: yPosition, size: 10, font });
    yPosition -= 15;

    // Table rows
    Object.entries(question.responses).forEach(
      ([answerText, { count, percentage }]) => {
        page.drawText(answerText, { x: 50, y: yPosition, size: 10, font });
        page.drawText(count.toString(), {
          x: 250,
          y: yPosition,
          size: 10,
          font,
        });
        page.drawText(percentage, { x: 350, y: yPosition, size: 10, font });
        yPosition -= 15;

        // Add a new page if the content exceeds the page height
        if (yPosition < 50) {
          yPosition = 750;
          pdfDoc.addPage([600, 800]);
        }
      }
    );

    yPosition -= 20; // Extra space between questions
  });

  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
}
