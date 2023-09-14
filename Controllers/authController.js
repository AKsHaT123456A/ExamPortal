// const { User, validateUser } = require("../Models/user");
// const constants = require("../Connections/constants");
// const CryptoJS = require("crypto-js");
// const axios = require("axios");
const emailer = require("../Utils/emailer");

// // const register = async (req, res) => {
// //   try {
// //     const encryptedData = req.body.encryptedData;
// //     const secretKey = constants.CRYPTO_SECRET_KEY;
// //     const bytes = CryptoJS.AES.decrypt(encryptedData, secretKey);
// //     const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
// //     console.log(decryptedData);
// //     if (!decryptedData) {
// //       return res.status(400).json({ message: "Decryption failed" });
// //     }
// //     // Validate user data
// //     const validationError = await validateUser(decryptedData);
// //     if (validationError) {
// //       return res.status(400).json({ message: "Validation failed", error: validationError.details });
// //     }

// //     const {
// //       name,
// //       email,
// //       branch,
// //       gender,
// //       isHosteler,
// //       studentNo,
// //       mobileNo,
// //       recaptchaToken
// //     } = decryptedData;

// //     // Generate a secure password with the first letter capitalized
// //     const firstName = name.split(" ")[0];
// //     const capitalizedFirstName =
// //       firstName.charAt(0).toUpperCase() + firstName.slice(1);
// //     const password = `${capitalizedFirstName}@${studentNo}`;

// //     // Create the user
// //     const newUser = await User.create({
// //       name,
// //       email,
// //       gender,
// //       branch,
// //       isHosteler,
// //       studentNo,
// //       password,
// //       mobileNo,
// //     });

// //     // Validate reCAPTCHA
// //     const recaptchaResponse = await axios.post(
// //       "https://www.google.com/recaptcha/api/siteverify",
// //       null,
// //       {
// //         params: {
// //           secret: constants.RECAPTCHA_SECRET_KEY,
// //           response: recaptchaToken,
// //         },
// //       }
// //     );

// //     if (!recaptchaResponse.data.success) {
// //       // Optionally, you can delete the newly created user here to rollback the registration
// //       await User.findByIdAndDelete(newUser._id);
// //       return res.status(400).json({ message: "reCAPTCHA verification failed" });
// //     }

// //     res.status(201).json({ message: "Registered" });
// //   } catch (err) {
// //     console.error("Registration Error:", err);
// //     res.status(500).json({ message: "Registration failed", error: err.message });
// //   }
// // };

// // module.exports = register;

// const register = async (req, res) => {
//   try {
//     const {
//       name,
//       email,
//       branch,
//       gender,
//       isHosteler,
//       studentNo,
//       mobileNo,
//       recaptchaToken
//     } = req.body;
//     //  Validate reCAPTCHA
//     const recaptchaSecretKey = process.env.RECAPTCHA_SECRET_KEY;
//     console.log(recaptchaSecretKey);
//     const recaptchaVerificationURL = `https://www.google.com/recaptcha/api/siteverify?secret=${recaptchaSecretKey}&response=${recaptchaToken}`;
//     const recaptchaResponse = await axios.post(recaptchaVerificationURL);
//     console.log(recaptchaResponse);
//     if (!recaptchaResponse.data.success) {
//       return res.status(400).json({ message: "reCAPTCHA verification failed" });
//     }
//     // Generate a secure password with the first letter capitalized
//     const firstName = name.split(" ")[0];
//     const capitalizedFirstName =
//       firstName.charAt(0).toUpperCase() + firstName.slice(1);
//     const password = `${capitalizedFirstName}@${studentNo}`;
//     const newUser = await User.create({ name, email, password, branch, gender, isHosteler, studentNo, mobileNo });

//     if (!recaptchaResponse.data.success) {
//       // Optionally, you can delete the newly created user here to rollback the registration
//       await User.findByIdAndDelete(newUser._id);
//       return res.status(400).json({ message: "reCAPTCHA verification failed" });
//     }
//     const id = newUser._id;
//     emailer(email, name, id);
//     res.status(201).json({ message: "Registered" });
//   } catch (err) {
//     console.error("Registration Error:", err);
//     res.status(500).json({ message: "Registration failed", error: err.message });
//   }
// };


// module.exports = register 
const CryptoJS = require('crypto-js'); // Add this import
const axios = require('axios');
const { User } = require('../Models/user');

const registerDecrypt = async (req, res) => {
  try {
    const {
      encryptedData, // Assuming the encrypted data is passed in the request body
      recaptchaToken,
    } = req.body;

    // Decrypt the data using your secret key
    const secretKey = 'b5c1f7e190de3e88ca462b3f98b41c76a88f8a6ab82be52c75e1871cc653b37'; // Replace with your actual secret key
    const decryptedData = decryptData(encryptedData, secretKey);

    if (!decryptedData) {
      return res.status(400).json({ message: "Decryption failed" });
    }

    const {
      name,
      email,
      branch,
      gender,
      isHosteler,
      studentNo,
      mobileNo,
    } = JSON.parse(decryptedData);

    // Validate reCAPTCHA
    const recaptchaSecretKey = process.env.RECAPTCHA_SECRET_KEY;
    const recaptchaVerificationURL = `https://www.google.com/recaptcha/api/siteverify?secret=${recaptchaSecretKey}&response=${recaptchaToken}`;
    const recaptchaResponse = await axios.post(recaptchaVerificationURL);

    if (!recaptchaResponse.data.success) {
      return res.status(400).json({ message: "reCAPTCHA verification failed" });
    }

    // Generate a secure password with the first letter capitalized
    const firstName = name.split(" ")[0];
    const capitalizedFirstName =
      firstName.charAt(0).toUpperCase() + firstName.slice(1);
    const password = `${capitalizedFirstName}@${studentNo}`;

    const newUser = await User.create({
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
    res.status(201).json({ message: "Registered" });
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
