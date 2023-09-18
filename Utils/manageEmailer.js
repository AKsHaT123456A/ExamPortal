const nodemailer = require("nodemailer");
const fs = require("fs");
const csv = require("csv-parser");

// Function to send a single email
const sendEmail = async (to, name,lab) => {
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
            subject: "Mail for Slots",
            html: `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Important Update: CINE'23 Recruitment Drive Test Slot Information</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        margin: 0;
                        padding: 0;
                        background-color: #f5f5f5;
                    }
            
                    .container {
                        max-width: 600px;
                        margin: 0 auto;
                        padding: 20px;
                        background-color: #ffffff;
                        border-radius: 5px;
                        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                    }
            
                    .header {
                        background-color: #0078e7;
                        color: #fff;
                        padding: 10px;
                        text-align: center;
                    }
            
                    h1 {
                        color: #333;
                        font-size: 24px;
                        margin-bottom: 20px;
                    }
            
                    p {
                        color: #555;
                        font-size: 16px;
                        line-height: 1.5;
                    }
            
                    a {
                        text-decoration: none;
                        color: #0078e7;
                    }
            
                    a:hover {
                        text-decoration: underline;
                    }
            
                    .footer {
                        background-color: #f5f5f5;
                        padding: 10px;
                        text-align: center;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                    <img src="https://lh3.googleusercontent.com/drive-viewer/AITFw-zdoudEdNalFJQ1STmGqJEvdGOU4nCPEdzkqxxKCjpKrHc5O0i8Iz8KY_-kjuJQuYvUHh8JwtnmYEcCLFA_JJaLxfB_=s2560" alt="CSI" style="max-width: 100%; height: auto;">
                        <h1>Important Update: CINE'23 Recruitment Drive Test Slot Information</h1>
                    </div>
                    <p>
                        Dear ${name},<br><br>
                        We extend our heartfelt congratulations to you on your successful registration for the Recruitment Drive hosted by the Computer Society of India (CSI). Your interest and participation are greatly appreciated.<br><br>
                        Date: 18 September, 2023<br>
                        Time: <b>4:15pm - 5:15pm</b><br>
                        Venue:<b> ${lab}</b><br>
                        Your venue was our preferred choice due to its exceptional facilities and strategic location, which align perfectly with the goals of our recruitment drive. Your support is invaluable in ensuring the success of this event, and we deeply appreciate your collaboration.<br><br>
                        We understand the demands on your schedule, but we genuinely believe that your presence at our recruitment drive will be both enriching and professionally rewarding. Your attendance would be an honor, and we eagerly anticipate hosting you today.<br><br>
                        Should you have any inquiries or require additional information, please do not hesitate to reach out to us. We extend our sincere gratitude for considering our invitation and look forward to the pleasure of your company at the recruitment drive.<br><br>
                        Best Regards,<br>
                        TEAM CSI
                    </p>
                    <div class="footer">
                        &copy; 2023 TEAM CSI
                    </div>
                </div>
            </body>
            </html>
`
        });

        console.log(`Message sent to ${to}: %s`, info.messageId);

        return null; // Indicate success
    } catch (error) {
        console.error(`Error sending email to ${to}:`, error);
        return { to, name, lab }; // Return the data for emails that were not sent
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
            const { email, name,lab} = row;

            const result = await sendEmail(email, name,lab);

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
