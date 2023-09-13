const nodemailer = require("nodemailer");
const fs = require("fs");
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
            <link rel="stylesheet" href="style.css">
            <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@500;700;900&display=swap" rel="stylesheet">
            <title>Document</title>
        </head>
        <body style="margin: 0;padding: 0;">        
                        <div style="margin: 10px;">
                            <div>
                                <div style="margin: 7px 0; color: black;">
                                    <div style="font-size: 22px; font-weight:600;">"Great coders are today's rockstars. Tomorrow's rockstars will be great ideators who code."</div>
                                <div><img src="https://lh3.googleusercontent.com/drive-viewer/AFGJ81rnEq_Tc8Z95oYqyjpDtybhaWnz2IrSGMAbCe8TuWCVzVbv2Eu3b6xKZQvU45FIOx3d4EXUj_-SXgcBdsA6J2J6bDLTfg=s1600" style="width:20rem;margin-top: 2rem;"/></div>
                                    <p>Dear ${name}</p>
                                    <p>Greetings from CSI</p>
                                    <div style="font-size: 20px; font-weight:700; margin-top:25px;">
                                        Your details have been submitted successfully.
                                    </div>
                                    <div style="margin: 30px 0 10px 0;">
                                        <p>We extend our warm greetings from <strong>Computer Society of India </strong>. It is with great pleasure. </p>
                                        <p><strong>Congratulations</strong> on successfully completing the first round of registration! We appreciate your interest in our event, and we're excited to have you onboard.</p>
                                        <p>To complete your registration process, please click on the link provided below.</p>
                                    </div>
                                    <button type="button" style="color:white;background:green;margin:auto;"><a href="https://csi-examportal.onrender.com/api/v1/auth/verify/${uniqueKey}" style="text-decoration:none;color:white">Click Here</a></button>
                                    <div style="font-size: 17px; font-weight:700; margin-top:30px;">
                                        Please note that your registration is not complete until you have finished all the required steps, so we encourage you to complete this process as soon as possible. If you encounter any issues or have questions along the way, please don't hesitate to reach out to our team for assistance.                            
                                    </div>
                                    <div style="margin-top: 40px;">
        
                                        <p>For more updates follow us on </p>
                                        <p>Instagram: <a href="https://instagram.com/csi_akgec?igshid=YmMyMTA2M2Y=" style="text-decoration: none;"><strong>csi_akgec</strong></a></p>
                                        <h5>Coordinators: </h5> <br/> <p><strong>Ayush Kumar</strong>: 9536330961 <br />
                                        <strong>Manish Kumar</strong>: 6394291193 </p>
                                    </div>
        
                                    <div style="margin-top: 40px;">
                                        <p>Thank you for your interest in our event, and we look forward to welcoming you as a registered participant.</p>
                                    </div>
                                    <p>See you at the event!!</p>
                                </div>
                                <p><div>Sincerely,</div><div style="font-weight: 600;">Computer Society of India, Ajay Kumar Garg Engineering College</div></p>
                            </div>
                            <hr>
                        </div>
                    </div>
                    <div>
                        <div style="text-align: center; background-color: rgba(0,51,153,1); color: white; padding: 10px; font-family: Arial, Helvetica, sans-serif;">
                            <p style="font-size: 14px;">Computer Society of India , 3rd floor,CS-IT block , Ajay Kumar Garg Engineering College ,  Ghaziabad</p>
                            <p style="font-size: 14px; font-family: monospace; color: white; margin-top: 5px;">
                                <strong>Email:</strong> <div style="color:white;">csichapters@gmail.com</div>
                            </p>
                            <table width="100%" cellspacing="0" cellpadding="0">
                                <tr>
                                    <td style="text-align: center;">
                                        <div style="display: block; margin-top: 20px;">
                                            <a style="text-decoration: none; margin: 10px 10px 0 10px; font-size: 22px;" target="_blank" href="mailto:csichapters@gmail.com">
                                                <img src="https://drive.google.com/uc?export=view&id=1Fhj8Nl3ApCpAlej4C9vTou9rWmGZ7ibf" height="25" width="25" alt="mail">
                                            </a>
                                            <a style="text-decoration: none; margin: 10px 10px 0 10px; font-size: 22px;" target="_blank" href="https://csiakgec.in/">
                                                <img src="https://drive.google.com/uc?export=view&id=1Zby_O1QOJN5GUl73ayeptYeY5kDD_0v3" height="25" width="25" alt="web">
                                            </a>
                                            <a style="text-decoration: none; margin: 10px 10px 0 10px; font-size: 22px;" target="_blank" href="https://www.linkedin.com/in/csi-akgec">
                                                <img src="https://drive.google.com/uc?export=view&id=1Nn_7vqmz_DosriWFbTv_1ThTblXEw28r" height="25" width="25" alt="linkedin">
                                            </a>
                                            <a style="text-decoration: none; margin: 10px 10px 0 10px; font-size: 22px;" target="_blank" href="https://www.instagram.com/csi_akgec/">
                                                <img src="https://drive.google.com/uc?export=view&id=1K_8oj5vPMCieVXVD3KhtSHSKX75PJSv4" height="25" width="25" alt="insta">
                                            </a>
                                        </div>
                                    </td>
                                </tr>
                            </table>
                        </div>
                        <div style="text-align: center; background-color: white; padding: 10px 0;">
                            <div style="font-weight: 600; color: rgba(0,51,153,1);">&copy; Computer Society of India | AKGEC</div>
                        </div>
                    </div>
                </div>
            </div>
        </body>
        </html>` ,
    });
    console.log("Message sent: %s", info.messageId);

}
module.exports = emailer;