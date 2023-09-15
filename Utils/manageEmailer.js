const nodemailer = require("nodemailer");

const manageEmailer = async (to, name, uniqueKey) => {
    // Create a transporter using your email service details
    let transporter = nodemailer.createTransport({
        service: "gmail",
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: process.env.TEST_EMAIL,
            pass: process.env.pass,
        },
    });

    // Compose the email message
    let info = await transporter.sendMail({
        from: process.env.TEST_EMAIL,
        to: to,
        subject: "Verification Mail",
        text: `Dear ${name}`,
        html: `<!DOCTYPE html>
        <html>
        <head>
            <title>Explore Your Potential in CINE'23</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f4f4f4;
                    margin: 0;
                    padding: 0;
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
                    padding: 20px;
                    font-size: 24px;
                }
        
                .content {
                    padding: 20px;
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
                    <h1>Explore Your Potential in CINE'23</h1>
                </div>
                <div class="content">
                    <p>Dear ${name},</p>
        
                    <p>We hope this message finds you well. We are excited to introduce the diverse domains available in our upcoming recruitment drive, CINE'23. In addition to our Technical and Designer domains, we are thrilled to announce the Management Domain.</p>
        
                    <p>If you're interested in honing your managerial skills, seize this opportunity! Click the link below to express your interest and join us on the path to success:</p>
        
                    <p><a class="button" href="[Insert Link]">Join CINE'23</a></p>
        
                    <p>Unlock your potential in CINE'23 - choose the domain that best aligns with your passion and aspirations. We look forward to your active participation.</p>
        
                    <p>Best regards,<br>TEAM CSI</p>
                </div>
                <div class="footer">
                    &copy; 2023 TEAM CSI | <a href="#">Privacy Policy</a>
                </div>
            </div>
        </body>
        </html>
        `,
    });

    console.log("Message sent: %s", info.messageId);
}

module.exports = manageEmailer;
