import {
  Body,
  Container,
  Head,
  Html,
  Img,
  Preview,
  Row,
  Section,
  Text,
  Button,
} from "@react-email/components";
import * as React from "react";

interface EmailTemplateProps {
  username?: string;
  inviteLink?: string;
}

export const InviteUserEmail = ({
  username,
  inviteLink,
}: EmailTemplateProps) => {
  return (
    <Html>
      <Head />
      <Preview>You&apos;ve been invited to join the Institute of Software Technologies!</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Centered Logo */}
         
            <Section style={logo}>
              <Row style={icon}>
                <Img
                  style={{display:"inline-block"}}
                  width={100}
                  src={`https://raw.githubusercontent.com/Institue-of-software-technologies/ist-feedback/refs/heads/main/public/assets/image/logo.png`}
                  alt="Institute of Software Technologies Logo"
                />
              </Row>
            </Section>
          

          {/* Email Content */}
          <Section style={content}>
            <Text style={paragraph}>Hi {username},</Text>
            <Text style={paragraph}>
              We are excited to invite you to join the Institute of Software Technologies. Click the button below to accept your invitation and get started!
            </Text>

            {/* Centered Button */}
            <Section>
              <Row style={rowStyle}>
                <Button style={button} href={inviteLink}>
                  Accept Invitation
                </Button>
              </Row>
            </Section>

            <Text style={paragraph}>
              If you have any questions, feel free to reach out to our support team.
            </Text>
            <Text style={paragraph}>
              Thanks,
              <br />
              Institute of Software Technologies Support Team
            </Text>
          </Section>
        </Container>

        {/* Footer */}
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

InviteUserEmail.PreviewProps = {
  username: "alanturing",
  inviteLink: "http://example.com/invite", // Placeholder link
} as EmailTemplateProps;

export default InviteUserEmail;

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
  borderRadius: "8px", // Added rounded corners for better design
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", // Subtle shadow for better contrast
};

const footer = {
  maxWidth: "580px",
  margin: "20px auto 0",
  textAlign: "center" as const,
};

const content = {
  padding: "20px",
};

const logo = {
  display: "flex",
  justifyContent: "center", // Centers the logo horizontally
  alignItems: "center", // Centers the logo vertically
  padding: "20px",
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

const icon = {
  display: "flex",
  justifyContent: "center",/* Centers items horizontally */
  alignItems: "center", /* Centers items vertically */
};
