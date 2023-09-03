const jwt = require("jsonwebtoken");
const { User, validateUser } = require("../Models/user");
const constants = require("../Connections/constants");
const CryptoJS = require("crypto-js");



const register = async (req, res) => {
  try {
    // Decrypt the request body
    const encryptedData = req.body.encryptedData;
    const decryptedBytes = CryptoJS.AES.decrypt(encryptedData, constants.CRYPTO_SECRET_KEY);
    const decryptedData = JSON.parse(decryptedBytes.toString(CryptoJS.enc.Utf8));

    const {
      name,
      email,
      branch,
      gender,
      isHosteler,
      studentNo,
      mobileNo,
    } = decryptedData;

    // Generate a secure password with the first letter capitalized
    const firstName = name.split(" ")[0];
    const capitalizedFirstName = firstName.charAt(0).toUpperCase() + firstName.slice(1);
    const password = `${capitalizedFirstName}@${studentNo}`;

    // Create the user
    const newUser = await User.create({
      name,
      email,
      gender,
      branch,
      isHosteler,
      studentNo,
      password,
      mobileNo,
    });
    const recaptchaResponse = await axios.post(
      "https://www.google.com/recaptcha/api/siteverify",
      null,
      {
        params: {
          secret: constants.RECAPTCHA_SECRET_KEY,
          response: token,
        },
      }
    );
    console.log(recaptchaResponse.data);
    if (!recaptchaResponse.data.success) {
      return res.status(400).json({ message: "reCAPTCHA verification failed" });
    }
    const payload = {
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
    };

    const token = jwt.sign(payload, constants.JWT_SECRET_KEY, {
      expiresIn: "10d",
    });

    res.status(201).json({ message: "Registered", token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Registration failed", error: err.message });
  }
};

module.exports = register;
