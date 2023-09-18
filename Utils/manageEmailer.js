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
            subject: "Mail for Slots",
            html: `
            <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Recruitment Drive Test Confirmation</title>
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
        <h1>Recruitment Drive Test Confirmation</h1>
        <p>Dear Participants,</p>
        <p>We hope this message finds you in high spirits.</p>
        <p>In the event that you missed today's recruitment drive test, thoughtfully organized by the Computer Society of India (CSI), we wish to extend a special opportunity for you to partake in the same test tomorrow.</p>
        <p>For those of you who are eager to confirm your participation in tomorrow's test without any need for further adjustments to your assigned slots, kindly utilize the provided link below:</p>
        <a class="button" href="">Confirm Participation</a>
        <p>Should you have already completed the test today, we kindly request you to disregard this correspondence.</p>
        <p>We genuinely appreciate your understanding and cooperation.</p>
        <p>With warm regards, <br>Team CSI</p>
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

// //Function to send emails to recipients from a CSV file
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
//             const { email, name, _id } = row;

//             const result = await sendEmail(email, name, _id);

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
//                     `${emailData.email},${emailData.name},${emailData._id}\n`
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
