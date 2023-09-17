const manage = require("../Models/managerial");
const { testingUser } = require("../Models/testingUser");
const { User } = require("../Models/user");
// const sendEmail = require("../Utils/manageEmailer");
// const sendEmail = require("../Utils/manageEmailer");

const managerial = async (req, res) => {
    const { id } = req.params;
    try {
        console.log(id);
        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Extract user properties
        const { name, email, studentNo, mobileNo, gender, branch, isVerified, isHosteler } = user;

        const newManagerial = await manage.create({
            name,
            email,
            studentNo,
            mobileNo,
            gender,
            branch,
            isVerified,
            isHosteler,
        });
        console.log(newManagerial);

        return res.status(201).redirect("https://cine-2023.vercel.app/managerial");
    } catch (err) {
        console.error("Error:", err);
        if (err.code === 11000) {
            // Duplicate key error, check which field is duplicated
            if (err.keyPattern.email) {
                return res.status(201).redirect("https://cine-2023.vercel.app/alreadyRegistered");
            } else if (err.keyPattern.studentNo) {
                return res.status(201).redirect("https://cine-2023.vercel.app/alreadyRegistered");
            }
        }

        return res.status(500).json({ error: "Internal Server Error", message: err.message });
    }
};

module.exports = managerial;
