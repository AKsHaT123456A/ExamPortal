import nodemailer from "nodemailer";
import * as fs from "fs";
import { KafkaService } from "../queue/kafka-queue";
import constants from "../config/constants";

export async function sendEmail(emailData: {
  email: string;
  studentNo: string;
  filename: string;
  status: string;
}) {
  const { email, studentNo, filename, status } = emailData;

  // Create a Nodemailer transporter
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: constants.TEST_EMAIL,
      pass: constants.pass,
    },
  });

  // Prepare the email options
  const mailOptions = {
    from: '"Csi AKGEC" <csichapters@gmail.com>',
    to: email,
    subject: `Your Report for Student No: ${studentNo}`,
    text: `Dear Student,\n\nYour report has been generated. You have ${status.toUpperCase()} the test. Please find the attached report.\n\nBest regards,\Team CSI`,
    attachments: [
      {
        filename: filename,
        path: `./${filename}`,
      },
    ],
  };

  try {
    // Send the email
    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${email}`);

    // Delete the file after sending
    fs.unlink(`./${filename}`, (err) => {
      if (err) {
        console.error(`Failed to delete file ${filename}:`, err);
      } else {
        console.log(`File ${filename} deleted successfully`);
      }
    });
  } catch (err) {
    console.error(`Failed to send email to ${email}:`, err);
  }
}

export async function startEmailConsumer() {
  const kafkaService = KafkaService.getInstance();
  await kafkaService.getTopic("email-group", "email-notifications");

  console.log(
    "Kafka consumer started and listening for email notifications..."
  );
}
