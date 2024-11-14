import questionResponse from "../models/question-response-model";
import User_Test from "../models/user-model";

const userResponseSend = async (
  //@ts-ignore
  req,
  //@ts-ignore
  res
) => {
  const { id } = req.params;
  try {
    const user = await User_Test.findOne({ studentNo: id });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const questionPromises = user.responses.map(async (response) => {
      const question = await questionResponse.findById(response);
      return question;
    });

    const questions = await Promise.all(questionPromises);

    return res.status(200).json({ questions });
  } catch (error) {
    return res
      .status(500)
        //@ts-ignore
      .json({ error: "Internal Server Error", message: err.message });
  }
};

export default userResponseSend;
