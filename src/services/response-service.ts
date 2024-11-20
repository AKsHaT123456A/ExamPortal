import { RedisCache } from "../cache/redis-cache";
import constants from "../config/constants";
import { CustomError } from "../error/custom-error";
import { createChartFromEntries } from "../utils/chart-Image-util";
import Question from "../models/question-model";
import questionResponse from "../models/question-response-model";
import User_Test from "../models/user-model";
import { KafkaService } from "../queue/kafka-queue";
import leaderBoardQueue from "../services/queue-service";
interface AnsStatus {
  [key: number]: number;
}
const kafkaService = KafkaService.getInstance();
class ResponseService {
  private static instance: ResponseService;

  private constructor() {}

  public static getInstance(): ResponseService {
    if (!ResponseService.instance) {
      ResponseService.instance = new ResponseService();
    }
    return ResponseService.instance;
  }

  public async handleResponse(
    id: any,
    status: any,
    quesId: any,
    ansId: string
  ) {
    const ques = await Question.findOne({ quesId });
    if (!ques) {
      throw new Error("Question not found!");
    }

    const { correctId } = ques;
    const ansStatusMapping: AnsStatus = {
      0: ansId === correctId ? 2 : -1,
      1: ansId === correctId ? 3 : -2,
    };

    const ansStatus = ansStatusMapping[status] || 0;
    const score = ansStatus === 2 || ansStatus === 3 ? 1 : 0;

    let existingResponse = await questionResponse.findOne({
      quesId,
      userId: id,
    });
    const user = await User_Test.findById(id);

    if (!existingResponse) {
      existingResponse = await questionResponse.create({
        ansStatus,
        score,
        quesId,
        ansId,
        category: ques.category,
        userId: id,
      });

      if (user) {
        user.responses = [...user.responses, existingResponse.id];
        if (
          user.calculatedTotalScore !== undefined &&
          user.codingPoints !== -1
        ) {
          user.calculatedTotalScore += score + user.codingPoints;
        } else if (user.calculatedTotalScore !== undefined) {
          user.calculatedTotalScore += score;
        } else {
          user.calculatedTotalScore = score;
        }
        await user.save();
      }
    } else {
      const oldScore =
        user?.codingPoints !== undefined
          ? existingResponse.score
          : existingResponse.score + (user?.codingPoints ?? 0);
      const scoreChange = score - oldScore;
      existingResponse.score = score;
      existingResponse.ansStatus = ansStatus;
      existingResponse.ansId = ansId;
      if (user) {
        user.calculatedTotalScore += scoreChange;
      }

      await existingResponse.save();
      if (user) {
        await user.save();
      }
    }

    const userWithResponses = await User_Test.findById(id).populate({
      path: "responses",
      select: "ansStatus score quesId ansId category -_id",
    });

    if (!userWithResponses) {
      throw new Error("User with responses not found!");
    }
    const users = [userWithResponses];
    const userType = "admin";
    await leaderBoardQueue.add({
      users,
      userType,
    });
    return {
      message: existingResponse._id
        ? "Response updated successfully"
        : "Response recorded successfully",
      user: userWithResponses.responses,
      category: userWithResponses.category,
    };
  }

  // Add the userResponse method to the ResponseService class
  public async userResponse(studentNo: any) {
    try {
      const user = await User_Test.findOne({ studentNo }).populate({
        path: "responses",
        select: "ansStatus score quesId ansId -_id",
      });
      const redisCache = RedisCache.getInstance(constants.REDIS_URL);
      const cache = await redisCache.get(user?._id.toString() || "");

      if (cache) {
        return {
          //@ts-ignore
          responses: cache,
        };
      }
      await redisCache.set(user?.responses || [], user?._id.toString() || "");
      if (!user) {
        throw new Error("User not found");
      }

      return {
        responses: user.responses,
      };
    } catch (error) {
      console.log(error);

      throw new CustomError(`Error fetching user responses:`, 500);
    }
  }
  public async submittedReport(studentNo: string,email:string) {
    try {
      
      const user = await User_Test.findOne({ studentNo }).populate({
        path: "responses",
        select: "ansStatus score quesId ansId _id",
      });
      if (!user) {
        throw new CustomError("User not found", 400);
      }
      //2 for correct answers
      //3 for marked correct answers
      //-2 for marked wrong answers
      //-1 for wrong answers
      const correctAnswers = user.responses.filter(
        (response) => response.ansStatus === 2
      );
      const wrongAnswers = user.responses.filter(
        (response) => response.ansStatus === -1
      );
      const markedCorrectAnswers = user.responses.filter(
        (response) => response.ansStatus === 3
      );
      const markedWrongAnswers = user.responses.filter(
        (response) => response.ansStatus === -2
      );
      const dataForChart = [
        correctAnswers.length,
        wrongAnswers.length,
        markedCorrectAnswers.length,
        markedWrongAnswers.length,
      ];
      const total =
        correctAnswers.length +
        markedCorrectAnswers.length +
        wrongAnswers.length +
        markedWrongAnswers.length;
      const filename = `${studentNo}-report.png`;
      createChartFromEntries(dataForChart, filename);
      const status =
        correctAnswers.length + markedCorrectAnswers.length > total / 2
          ? "passed"
          : "failed";

      // Produce Kafka message
      kafkaService.run(
        "email-notifications",
        JSON.stringify({
          email: email,
          studentNo,
          filename,
          status,
        }),
        user._id.toString()
      );
    } catch (error) {
      console.log(error);
      throw new CustomError(`Error fetching user responses:`, 500);
    }
  }
}
export default ResponseService;
