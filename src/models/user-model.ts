import { Schema, model } from "mongoose";
import { IUser } from "../interfaces/user-interface";

const userSchema = new Schema<IUser>(
    {
        name: { type: String, required: true },
        studentNo: { type: String, unique: true, required: true },
        responses: [{
            type: Schema.Types.ObjectId,
            ref: "questionResponse",
            default: [],
        }],
        password: { type: String, required: true },
        logintime: { type: Number, default: 0 },
        isRelogin: { type: Boolean, default: false },
        isSubmit: { type: Boolean, default: false },
        category: { type: String },
    },
    { versionKey: false,timestamps:true }
);

userSchema.virtual('calculatedTotalScore').get(function () {
    return this.responses.reduce((total: any, response: { score: any; }) => total + (response.score || 0), 0);
});



const User_Test = model("User_Test", userSchema);
export default User_Test;
