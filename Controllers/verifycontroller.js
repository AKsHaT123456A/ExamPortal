const verify = async ({ params }, res) => {
    try {
        const { id } = params;
        await User.findByIdAndUpdate({ _id: id }, { $set: { isVerified: true } });
        return res.redirect(`cine-2023.vercel.app/:${id}`)
    }
    catch (err) {
        res.status(400).json("!")
    }
}
module.exports = verify;