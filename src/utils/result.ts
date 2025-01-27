import { SuccessResponse, ErrorResponse, Response } from "./types.ts";
import console from "./logging.ts"; // Assuming logging.ts is imported

export class Result<T> {
  private response: Response<T>;

  private constructor(response: Response<T>) {
    this.response = response;

    // Log the result
    if (this.response.success) {
      console.success(
        `Operation succeeded: ${JSON.stringify(this.response.data)}`
      );
    } else {
      console.error(
        `Operation failed with error: ${JSON.stringify(this.response.error)}`
      );
    }
  }

  public static ok<U>(data: U): Result<U> {
    const successResponse: SuccessResponse<U> = { success: true, data };
    return new Result<U>(successResponse);
  }

  public static fail<U>(error: ErrorResponse["error"]): Result<U> {
    const errorResponse: ErrorResponse = { success: false, error };
    return new Result<U>(errorResponse);
  }

  public getResponse(): Response<T> {
    return this.response;
  }
}
