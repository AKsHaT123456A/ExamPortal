const nodemailer = require("nodemailer");

// Function to send a single email
const sendEmail = async (to, name, lab) => {
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
            subject: "Email for venue and time",
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
                    <p>Dear ${name},</p>
                    <p>Time:4:15-5:15</p>
                    <p>Venue:${lab}</p>
                    <p>Your participation is highly valued, and we look forward to your continued engagement with TEAM CSI and CINE'23. Should you have any questions or require further assistance, please feel free to reach out to us at csichapters@gmail.com.</p>
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
//             const { email, name, lab } = row;

//             const result = await sendEmail(email, name, lab);

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
//                     `${emailData.email},${emailData.name},${emailData.lab}\n`
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
