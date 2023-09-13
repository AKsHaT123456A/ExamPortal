const fetch = require("isomorphic-fetch");

const SECRET = process.env.SECRETS;
const axios = require('axios')

const getReCaptcha = async (reCaptcha) => {

    try {

        const data = await fetch(
            `https://www.google.com/recaptcha/api/siteverify`,
            {
                method: "post",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/x-www-form-urlencoded; charset=utf-8",
                },
                body: `secret=${SECRET}&response=${reCaptcha}`,
            }
        ).then((res) => res.json())
            .then((json) => json.success)
            .catch((err) => {
                throw new Error(`Error in Google Siteverify API. ${err.message}`);
            });
        if (data) {
            return true;
        } else {
            return false
        }

    } catch (error) {
        console.log(error)
        return res.status(400).json(error.message)
    }
};

module.exports = getReCaptcha;