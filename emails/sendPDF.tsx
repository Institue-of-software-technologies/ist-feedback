import {
  Body,
  Container,
  Column,
  Head,
  Html,
  Img,
  Preview,
  Row,
  Section,
  Text
} from "@react-email/components";
import * as React from "react";

interface ReportEmailTemplateProps {
  trainerName: string;
  reportDate: Date;
}

export const ReportEmail = ({
  trainerName,
  reportDate
}: ReportEmailTemplateProps) => {
  const formattedDate = new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "medium",
  }).format(reportDate);

  return (
    <Html>
      <Head />
      <Preview>Feedback Report from Institute of Software Technologies</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={logo}>
            <Img width={100} src={`https://raw.githubusercontent.com/Institue-of-software-technologies/ist-feedback/refs/heads/main/public/assets/image/logo.png`} />
          </Section>
          <Section style={sectionsBorders}>
            <Row>
              <Column style={sectionBorder} />
              <Column style={sectionCenter} />
              <Column style={sectionBorder} />
            </Row>
          </Section>
          <Section style={content}>
            <Text style={paragraph}>Hello {trainerName},</Text>
            <Text style={paragraph}>
              We hope this message finds you well.

              We have send a feedback report for the recent feedback done, this report was sent on {formattedDate}. This report includes valuable insights and feedback collected from your participants, aiming to support your continuous impact and growth as a trainer.

              Please find the report attached to this email. You can view and download it for a detailed review of the feedback.

              Thank you for your dedication to providing quality instruction, and we look forward to your continued success.

              Warm regards,
              Institute of Software Technologies


            </Text>
            <Text style={paragraph}>
              Thank you for your dedication and commitment to teaching. If you have any
              questions regarding the report, feel free to contact us.
            </Text>
            <Text style={paragraph}>
              Best regards,
              <br />
              Institute of Software Technologies Support Team
            </Text>
          </Section>
        </Container>

        <Section style={footer}>
          <Row>
            <Text style={{ textAlign: "center", color: "#706a7b" }}>
              © 2024 Institute of Software Technologies. All rights reserved. <br />
              Mpaka Rd, 6th floor West Point Building, 6th Floor, Parklands
            </Text>
          </Row>
        </Section>
      </Body>
    </Html>
  );
};

ReportEmail.PreviewProps = {
  trainerName: "John Doe",
  reportDate: new Date(),
  reportLink: "http://example.com/download-report",
} as ReportEmailTemplateProps;

export default ReportEmail;

// Styling as in your original template
const fontFamily = "HelveticaNeue,Helvetica,Arial,sans-serif";
const main = {
  backgroundColor: "#efeef1",
  fontFamily,
};
const paragraph = {
  lineHeight: 1.5,
  fontSize: 14,
};
const container = {
  maxWidth: "580px",
  margin: "40px auto",
  backgroundColor: "#ffffff",
};
const footer = {
  maxWidth: "580px",
  margin: "0 auto",
};
const content = {
  padding: "5px 20px 10px 20px",
};
const logo = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: 20,
};
const sectionsBorders = {
  width: "100%",
  display: "flex",
};
const sectionBorder = {
  borderBottom: "1px solid #82929",
  width: "249px",
};
const sectionCenter = {
  borderBottom: "1px solid #E82929",
  width: "102px",
};
