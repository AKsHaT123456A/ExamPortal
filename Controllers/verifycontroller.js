import  {User}  from "../Models/user.js";

const verify = async ({ params }, res) => {
    try {
        const { id } = params;
        console.log(id);
        const newUser = await User .findByIdAndUpdate({ _id: id }, { $set: { isVerified: true } });
        console.log(newUser );
        return res.redirect(`https://cine-2023.vercel.app/${id}`);
    }
    catch (err) {
        res.status(400).json("!");
        console.log(err.message);
    }
}
export default verify;