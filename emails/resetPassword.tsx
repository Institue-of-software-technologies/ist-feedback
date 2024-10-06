import {
  Body,
  Container,
  Column,
  Head,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Text,
  Button,
} from "@react-email/components";
import * as React from "react";

interface EmailTemplateProps {
  username?: string;
  updatedDate?: Date;
  resetPasswordLink?: string;
}

const baseUrl = process.env.URL
  ? `http://localhost:3000/`
  : "";

export const ResetPasswordEmail = ({
  username,
  updatedDate,
  resetPasswordLink
}: EmailTemplateProps) => {
  const formattedDate = new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "medium",
  }).format(updatedDate);

  return (
    <Html>
      <Head />
      <Preview>Reset password for your Institute of Software Technologies Feed back management account</Preview>
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
            <Text style={paragraph}>Hi {username},</Text>
            <Text style={paragraph}>
              Click the button below to update the password for your Institute of Software Technologies Feed back management account on{" "}
              {formattedDate}. If this was you, then no further action is
              required.
            </Text>
            <Section>
              <Row style={rowStyle}>
                <Button style={button} href={resetPasswordLink}>
                  Reset password
                </Button>
              </Row>
            </Section>

            <Text style={paragraph}>
              However if you did NOT perform this password change, please{" "}
              <Link href="#" style={link}>
                reset your account password
              </Link>{" "}
              immediately.
            </Text>
            <Text style={paragraph}>
              Remember to use a password that is both strong and unique to your
              account. To learn more about how to create a strong and
              unique password,{" "}
            </Text>
            <Text style={paragraph}>
              Thanks,
              <br />
              Institute of Software Technologies Support Team
            </Text>
          </Section>
        </Container>

        <Section style={footer}>
          {/* <Row>
            <Column align="right" style={{ width: "50%", paddingRight: "8px" }}>
              <Img src={`${baseUrl}/assets/image/instagram.png`} />
            </Column>
            <Column align="left" style={{ width: "50%", paddingLeft: "8px" }}>
              <Img src={`${baseUrl}/assets/image/twitter.png`} />
            </Column>
          </Row> */}
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

ResetPasswordEmail.PreviewProps = {
  username: "alanturing",
  updatedDate: new Date("June 23, 2022 4:06:00 pm UTC"),
} as EmailTemplateProps;

export default ResetPasswordEmail;

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
  alingItems: "center",
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

const link = {
  textDecoration: "underline",
};

const button = {
  backgroundColor: "#E82929",
  borderRadius: "4px",
  color: "#fff",
  fontFamily: "'Open Sans', 'Helvetica Neue', Arial",
  fontSize: "15px",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block", // Ensures the button takes full width
  width: "210px",
  padding: "14px 7px",
  margin: "20px auto", // Adds vertical margin and centers button
  cursor: "pointer",
};

const rowStyle = {
  display: "flex",
  justifyContent: "center", // Horizontally centers the button
  alignItems: "center", // Vertically centers content (optional)
  width: "100%", // Ensures full width of the row container
};
