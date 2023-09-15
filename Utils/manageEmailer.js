const nodemailer = require("nodemailer");
const fs = require("fs");
const csv = require("csv-parser");

// Function to send a single email
const sendEmail = async (to, name, uniqueKey) => {
    try {
        // Create a transporter using your email service details
        let transporter = nodemailer.createTransport({
            service: "gmail",
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
                user: process.env.TEST_EMAIL,
                pass: process.env.PASSWORD, // Replace with your Gmail password
            },
        });

        // Compose the email message
        let info = await transporter.sendMail({
            from: process.env.TEST_EMAIL,
            to: to,
            subject: "Mail for Managerial Domain",
            text: `Dear ${name}`,
            html: `<!DOCTYPE html>
        <html>
       
        </html>
        `,
        });

        console.log(`Message sent to ${to}: %s`, info.messageId);

        return null; // Indicate success
    } catch (error) {
        console.error(`Error sending email to ${to}:`, error);
        return { to, name, uniqueKey }; // Return the data for emails that were not sent
    }
};

// Function to send emails to recipients from a CSV file
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
            const result = await sendEmail(row.to, row.name, row.uniqueKey);

            if (result) {
                failedEmails.push(result);
            }
        }

        console.log("All emails sent");

        if (failedEmails.length > 0) {
            // Write failed emails to a new CSV file
            const failedCsvFilePath = "path/to/new/csv/file.csv";
            fs.writeFileSync(failedCsvFilePath, "to,name,uniqueKey\n");

            for (const emailData of failedEmails) {
                fs.appendFileSync(
                    failedCsvFilePath,
                    `${emailData.to},${emailData.name},${emailData.uniqueKey}\n`
                );
            }

            console.log(`Failed emails written to ${failedCsvFilePath}`);
        }
    } catch (error) {
        console.error("Error reading CSV:", error);
    }
};

// Replace with the path to your CSV file
const csvFilePath = "path/to/your/csv/file.csv";
sendEmailsFromCSV(csvFilePath);
