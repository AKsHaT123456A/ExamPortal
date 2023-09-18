const nodemailer = require("nodemailer");
const fs = require("fs");
const csv = require("csv-parser");

// Function to send a single email
const sendEmail = async (to, name, uniqueKey) => {
    try {
        // Create a transporter using your email service details
        let transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.TEST_EMAIL,
                pass: process.env.pass,
            },
        });

        // Compose the email message
        let info = await transporter.sendMail({
            from: process.env.TEST_EMAIL,
            to: to,
            subject: "Confirmation of Participation in CINE'23 Recruitment Drive",
            html: `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Confirmation of Participation in CINE'23 Recruitment Drive</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        margin: 0;
                        padding: 0;
                        background-color: #f7f7f7;
                    }
            
                    .container {
                        max-width: 600px;
                        margin: 0 auto;
                        padding: 20px;
                        background-color: #ffffff;
                        border-radius: 5px;
                        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                    }
            
                    h1 {
                        color: #333;
                    }
            
                    p {
                        color: #666;
                        line-height: 1.5;
                    }
            
                    a {
                        color: #007bff;
                        text-decoration: none;
                    }
            
                    .button {
                        display: inline-block;
                        background-color: #007bff;
                        color: #fff;
                        padding: 10px 20px;
                        margin-top: 20px;
                        border-radius: 5px;
                        text-decoration: none;
                    }
            
                    .button:hover {
                        background-color: #0056b3;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>Important: Confirmation of Participation in CINE'23 Recruitment Drive</h1>
                    <p>Dear CINE'23 Recruitment Drive Participants,</p>
                    <p>We hope this message finds you well. We understand that unforeseen circumstances can sometimes disrupt plans. If you were unable to attend the test for the TEAM CSI recruitment drive today, or if your designated slot is scheduled for 19th September and you are willing to give the test, we kindly request you to take a moment to confirm your interest and secure your chance to be a part of CINE'23.</p>
                    <a class="button" href="https://portaltest.onrender.com/api/v1/auth/managerial/${uniqueKey}">Click Here to Confirm Your Participation</a>
                    <p>This step is crucial to ensure that we have an accurate headcount and can accommodate all interested participants during the recruitment drive. If you have already attended the test, please disregard this message.</p>
                    <p>Your participation is highly valued, and we look forward to your continued engagement with TEAM CSI and CINE'23. Should you have any questions or require further assistance, please feel free to reach out to us at [Your Contact Information].</p>
                    <p>Best Regards,<br>TEAM CSI</p>
                </div>
            </body>
            </html>
            
`
        });

        console.log(`Message sent to ${to}: %s`, info.messageId);

        return null; // Indicate success
    } catch (error) {
        console.error(`Error sending email to ${to}:`, error);
        return { to, name, uniqueKey }; // Return the data for emails that were not sent
    }
};

module.exports = sendEmail;

//Function to send emails to recipients from a CSV file
const sendEmailsFromCSV = async (csvFilePath) => {
    const failedEmails = [];

    try {
        const data = await new Promise((resolve, reject) => {
            const data = [];

            fs.createReadStream(csvFilePath)
                .pipe(csv())
                .on("data", (row) => {
                    data.push(row);
                })
                .on("end", () => {
                    resolve(data);
                })
                .on("error", (error) => {
                    reject(error);
                });
        });

        for (const row of data) {
            const { email, name, _id } = row;

            const result = await sendEmail(email, name, _id);

            if (result) {
                failedEmails.push(result);
            }
        }

        console.log("All emails sent");

        if (failedEmails.length > 0) {
            // Write failed emails to a new CSV file
            const failedCsvFilePath = "./Utils/data1.csv";
            fs.writeFileSync(failedCsvFilePath, "to,name,uniqueKey\n");

            for (const emailData of failedEmails) {
                fs.appendFileSync(
                    failedCsvFilePath,
                    `${emailData.email},${emailData.name},${emailData._id}\n`
                );
            }

            console.log(`Failed emails written to ${failedCsvFilePath}`);
        }
    } catch (error) {
        console.error("Error reading CSV:", error);
    }
};
// Replace with the path to your CSV file
const csvFilePath = "./Utils/data.csv";
sendEmailsFromCSV(csvFilePath);
