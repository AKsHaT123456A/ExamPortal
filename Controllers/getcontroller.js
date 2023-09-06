const questionResponse = require("../Models/questionResponse");
const { User } = require("../Models/user");

const userResponseSend = async (req, res) => {
    const { id } = req.params;
    console.log(id);
    try {
        const user = await User.findOne({ studentNo: id });
console.log(user);
        const questionPromises = user.responses.map(async (response) => {
            const question = await questionResponse.findById(response);
            return question;
        });

        const questions = await Promise.all(questionPromises);

        return res.status(200).json({ questions });
    } catch (error) {
        return res.status(500).json({ error: "Internal Server Error", message: error.message });
    }
};

module.exports = userResponseSend;
