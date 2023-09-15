
// module.exports = register 
const CryptoJS = require('crypto-js'); // Add this import
const axios = require('axios');
// const { User } = require('../Models/user');
const emailer = require('../Utils/emailer');
const { testingUser } = require('../Models/testingUser');

const registerDecrypt = async (req, res) => {
  try {
    // const {
    //   encryptedData,
    //   recaptchaToken,
    // } = req.body;
    // const secretKey = process.env.secretKey; 
    // const decryptedData = decryptData(encryptedData, secretKey);

    // if (!decryptedData) {
    //   return res.status(400).json({ message: "Decryption failed" });
    // }

    const {
      name,
      email,
      branch,
      gender,
      isHosteler,
      studentNo,
      mobileNo,
    } = req.body;

    // // Validate reCAPTCHA
    // const recaptchaSecretKey = process.env.RECAPTCHA_SECRET_KEY;
    // const recaptchaVerificationURL = `https://www.google.com/recaptcha/api/siteverify?secret=${recaptchaSecretKey}&response=${recaptchaToken}`;
    // const recaptchaResponse = await axios.post(recaptchaVerificationURL);

    // if (!recaptchaResponse.data.success) {
    //   return res.status(400).json({ message: "reCAPTCHA verification failed" });
    // }

    // Generate a secure password with the first letter capitalized
    const firstName = name.split(" ")[0];
    const capitalizedFirstName =
      firstName.charAt(0).toUpperCase() + firstName.slice(1);
    const password = `${capitalizedFirstName}@${studentNo}`;

    const newUser = await testingUser.create({
      name,
      email,
      password,
      branch,
      gender,
      isHosteler,
      studentNo,
      mobileNo,
    });

    const id = newUser._id;
    emailer(email, name, id);
    return res.status(201).json({ message: "Registered" });
  } catch (err) {
    if (err.code === 11000) {
      // Duplicate key error, check which field is duplicated
      if (err.keyPattern.email) {
        return res.status(401).json({ message: "Email already exists" });
      } else if (err.keyPattern.studentNo) {
        return res.status(401).json({ message: "Student number already exists" });
      }
    }

    console.error("Registration Error:", err);
    res.status(500).json({ message: "Registration failed", error: err.message });
  }
};

// Function to decrypt the data using CryptoJS
const decryptData = (encryptedData, secretKey) => {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedData, secretKey);
    const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
    return decryptedData;
  } catch (error) {
    console.error('Decryption error:', error);
    return null; // Handle the error as needed
  }
};

module.exports = registerDecrypt;
