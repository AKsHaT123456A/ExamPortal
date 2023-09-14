const { User } = require("../Models/user");

const verify = async ({ params }, res) => {
    try {
        const { id } = params;
        console.log(id);
        const newUser = await User.findByIdAndUpdate({ _id: id }, { $set: { isVerified: true } });
        console.log(newUser);
        return res.redirect(`https://cine2023.netlify.app/${id}`);
    }
    catch (err) {
        res.status(400).json("!");
        console.log(err.message);
    }
}
module.exports = verify;