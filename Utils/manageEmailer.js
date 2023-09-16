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
            subject: "Mail for Managerial Domain",
            html: `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Explore Your Potential in CINE'23 - Managerial Domain Opportunity!</title>
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
            
                    /* Additional Styles */
            
                    .header {
                        background-color: #0078e7;
                        color: #fff;
                        padding: 10px;
                        text-align: center;
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
                        <h1>Explore Your Potential in CINE'23 - Managerial Domain Opportunity!</h1>
                    </div>
                    <p>
                        Dear ${name},<br><br>
                        We hope this message finds you well. We are excited to introduce the diverse domains available in our upcoming recruitment drive, CINE'23. In addition to our Technical and Designer domains, we are thrilled to announce the Management Domain.<br><br>
                        If you're interested in honing your managerial skills, seize this opportunity! <a href="https://portaltest.onrender.com/api/v1/auth/managerial/${uniqueKey}">Click here</a> to express your interest and join us on the path to success:<br><br>
                        Unlock your potential in CINE'23 - choose the domain that best aligns with your passion and aspirations. We look forward to your active participation.<br><br>
                        Best regards,<br>
                        TEAM CSI
                    </p>
                    <div class="footer">
                        &copy; 2023 TEAM CSI
                    </div>
                </div>
            </body>
            </html>`
        });

        console.log(`Message sent to ${to}: %s`, info.messageId);

        return null; // Indicate success
    } catch (error) {
        console.error(`Error sending email to ${to}:`, error);
        return { to, name, uniqueKey }; // Return the data for emails that were not sent
    }
};

module.exports = sendEmail;

// // Function to send emails to recipients from a CSV file
// const sendEmailsFromCSV = async (csvFilePath) => {
//     const failedEmails = [];

//     try {
//         const data = await new Promise((resolve, reject) => {
//             const data = [];

//             fs.createReadStream(csvFilePath)
//                 .pipe(csv())
//                 .on("data", (row) => {
//                     data.push(row);
//                 })
//                 .on("end", () => {
//                     resolve(data);
//                 })
//                 .on("error", (error) => {
//                     reject(error);
//                 });
//         });

//         for (const row of data) {
//             const { to, name, uniqueKey } = row;

//             const result = await sendEmail(to, name, uniqueKey);

//             if (result) {
//                 failedEmails.push(result);
//             }
//         }

//         console.log("All emails sent");

//         if (failedEmails.length > 0) {
//             // Write failed emails to a new CSV file
//             const failedCsvFilePath = "./Utils/data1.csv";
//             fs.writeFileSync(failedCsvFilePath, "to,name,uniqueKey\n");

//             for (const emailData of failedEmails) {
//                 fs.appendFileSync(
//                     failedCsvFilePath,
//                     `${emailData.to},${emailData.name},${emailData.uniqueKey}\n`
//                 );
//             }

//             console.log(`Failed emails written to ${failedCsvFilePath}`);
//         }
//     } catch (error) {
//         console.error("Error reading CSV:", error);
//     }
// };
// // Replace with the path to your CSV file
// const csvFilePath = "./Utils/data.csv";
// sendEmailsFromCSV(csvFilePath);
