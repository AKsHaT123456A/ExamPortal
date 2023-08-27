const jwt = require('jsonwebtoken');
const User = require('../Models/user');
const constants = require('../Connections/constants');
const register = async (req, res) => {
    try {
        // Validate and sanitize input data
        const { name, email, branch, gender, isHosteler, studentNo, recaptchaResponse } = req.body;

        // ReCAPTCHA verification logic goes here
        // const isRecaptchaValid = await recaptchaVerification.verify(recaptchaResponse);
        // if (!isRecaptchaValid) {
        //     return res.status(400).json({ message: 'ReCAPTCHA verification failed' });
        // }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User with this email already exists' });
        }
        const firstName = name.split(' ')[0];
        const password = `${firstName.toLowerCase()}@${studentNo}`;
        await User.create({
            name,
            email,
            gender,
            branch,
            isHosteler,
            studentNo,
            // recaptchaResponse,
            password,
        });

        // Assuming registration is successful, generate JWT token
        const payload = {
            name,
            email,
            studentNo,
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: '2h' });

        // Return the token to the client
        res.status(201).json({ message: 'Registered', token });
    } catch (err) {
        // Handle registration error
        console.error(err);
        res.status(500).json({ message: 'Registration failed', error: err.stack });
    }
};

module.exports = register;
