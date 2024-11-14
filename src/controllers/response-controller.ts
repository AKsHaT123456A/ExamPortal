import { Request, Response } from "express";
import ResponseService from "../services/response-service";

class ResponseController {
  private responseService: ResponseService;

  constructor() {
    this.responseService = ResponseService.getInstance();
  }

  // Handle the response (create or update)
  //@ts-ignore
  public async handleResponse(req, res) {
    try {
      const { id } = req.params;
      const { status, quesId, ansId } = req.query;

      if (!id || !status || !quesId || !ansId) {
        res.status(400).json({ message: "Missing required parameters" });
        return;
      }

      const result = await this.responseService.handleResponse(
        id,
        status,
        quesId,
        ansId
      );
      
      res.status(200).json({
        message: result.message,
        userResponses: result.user,
        category: result.category,
      });
    } catch (error) {
      //@ts-ignore
      let err: Error = error;
      res
        .status(500)
        .json({
          message:
            err.message || "An error occurred while handling the response",
        });
    }
  }

  // Fetch the user responses
  public async userResponse(req: Request, res: Response): Promise<void> {
    try {
      const { studentNo } = req.params;

      const result = await this.responseService.userResponse(studentNo);

      res.status(200).json(result);
    } catch (error) {
      //@ts-ignore
      res
        .status(500)
        .json({
          message:
                //@ts-ignore

            error.message || "An error occurred while fetching user responses",
        });
    }
  }
  
}

export default ResponseController;
