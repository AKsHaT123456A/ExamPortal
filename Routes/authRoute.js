const csrf = require("csurf");
const register = require("../Controllers/authController");
const limiter = require("../middleware/limiter");
const browserOnlyMiddleware = require("../middleware/browserCheckMiddleware");
const CryptoJS = require('crypto-js');

const csrfProtection = csrf({ cookie: true });
const router = require("express").Router();
router.get("/preregistration", csrfProtection, (req, res) => {
    const csrfToken = req.csrfToken();
    res.json({ csrfToken });
});

router.post("/en", (req, res) => {

    // Your secret key in hexadecimal format
    const secretKey = 'b5c1f7e190de3e88ca462b3f98b41c76a88f8a6ab82be52c75e1871cc653b37';

    // Data to be encrypted
    const data = {
        "mobileNo": "9792344654",
        "email": "divyanshu21153090@akgec.ac.in",
        "gender": "Male",
        "name": "divyanshu",
        "studentNo": "22153090",
        "branch": "ECE"
    };

    // Convert the data to a JSON string
    const jsonData = JSON.stringify(data);

    // Encrypt the data using AES encryption
    const encryptedData = CryptoJS.AES.encrypt(jsonData, CryptoJS.enc.Hex.parse(secretKey), {
        mode: CryptoJS.mode.ECB, // Electronic Codebook (ECB) mode (not recommended for production, use a secure mode like CBC)
        padding: CryptoJS.pad.Pkcs7
    });

    // Get the encrypted data in hexadecimal format
    const encryptedHex = encryptedData.ciphertext.toString(CryptoJS.enc.Hex);

    console.log(encryptedHex);

})

router.post("/register", limiter, register);
module.exports = router;
