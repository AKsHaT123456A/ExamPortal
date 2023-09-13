const nodemailer = require("nodemailer");
const emailer = async (to, name, uniqueKey) => {
    // let testAccount=await nodemailer.createTestAccount();
    //connect with the smpt server
    let transporter = nodemailer.createTransport({
        service: "gmail",
        host: "smtp.gmail.email",
        port: 465,
        secure: true,
        auth: {
            user: process.env.TEST_EMAIL,
            pass: process.env.pass,
        },
    });
    let info = await transporter.sendMail({
        from: process.env.TEST_EMAIL,
        to: to,
        subject: "Verification Mail",
        text: `Dear ${name}`,
        html: `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Confirmation of Registration</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    margin: 0;
                    padding: 0;
                    background-color: #f4f4f4;
                }
        
                .container {
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 20px;
                    background-color: #ffffff;
                    border: 1px solid #ddd;
                    border-radius: 5px;
                    box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
                }
        
                .header {
                    background-color: #007acc;
                    color: #ffffff;
                    text-align: center;
                    padding: 10px;
                    font-size: 24px;
                }
        
                .content {
                    margin-top: 20px;
                    font-size: 16px;
                    line-height: 1.6;
                }
        
                .button {
                    display: inline-block;
                    padding: 10px 20px;
                    background-color: #007acc;
                    color: #ffffff;
                    text-decoration: none;
                    border-radius: 5px;
                    margin-top: 20px;
                }
        
                .footer {
                    text-align: center;
                    margin-top: 20px;
                    font-size: 14px;
                    color: #777;
                }
            </style>
        </head>
        <body>
            <div class="container">
            <div class="header">
            <img src="https://lh3.googleusercontent.com/drive-viewer/AITFw-zdoudEdNalFJQ1STmGqJEvdGOU4nCPEdzkqxxKCjpKrHc5O0i8Iz8KY_-kjuJQuYvUHh8JwtnmYEcCLFA_JJaLxfB_=s2560" alt="CSI" style="max-width: 100%; height: auto;">
            Confirmation of Registration for CINE Recruitment Drive
        </div>
                <div class="content">
                    <p>Dear ${name},</p>
                    <p>We are pleased to inform you that your registration for the CINE Recruitment Drive, organized by TEAM CSI, has been successfully received and processed. Congratulations on taking this important step towards your career development!</p>
                    <p>Here are the details of the event:</p>
                    <ul>
                        <li>Event: CINE Recruitment Drive</li>
                        <li>Organizer: TEAM CSI</li>
                        <li>Date: 18 September, 2023</li>
                        <li>Time: 4:00 PM</li>
                    </ul>
                    <p>To confirm your registration and ensure your participation in the event, please click the following link:</p>
                    <p><a href=https://csi-examportal.onrender.com/api/v1/auth/verify/${uniqueKey} class="button">Confirm Registration</a></p>
                    <p>Kindly note that your registration will not be considered valid until this confirmation step is completed.</p>
                    <p>Please make sure to mark your calendar and set a reminder for this event. It will be a great opportunity for 2nd-year students like you to explore exciting career prospects in the industry.</p>
                    <p>Location and further instructions for the event will be communicated to you closer to the date. In the meantime, if you have any questions or need any additional information, please feel free to contact us at <a href="mailto:csichapters@gmail.com">csichapters@gmail.com</a> or can contact us at Instagram handle <a href="https://www.instagram.com/csi_akgec/">csi_akgec</a>.</p>
                    <p>We look forward to seeing you at the CINE Recruitment Drive and wish you the best of luck in your future endeavors.</p>
                    <p>Best Regards,<br>Team CSI</p>
                </div>
                <div class="footer">
                    &copy; 2023 TEAM CSI | <a href="#">Privacy Policy</a>
                </div>
            </div>
        </body>
        </html>
        ` ,
    });
    console.log("Message sent: %s", info.messageId);

}
module.exports = emailer;