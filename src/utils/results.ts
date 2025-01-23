import { ErrorResponse, SuccessResponse, Response } from "../types.ts";
import console from "../utils/logging.ts"; // Assuming logging.ts is imported

export class Result<T> {
  public success: boolean;
  public data?: T;
  public error?: {
    code: number;
    message: string;
    details?: any;
  };

  private constructor(success: boolean, data?: T, error?: ErrorResponse["error"]) {
    this.success = success;
    if (success) {
      this.data = data;
      // Log success
      console.success(`Operation succeeded: ${JSON.stringify(data)}`);
    } else {
      this.error = error;
      // Log error
      console.error(`Operation failed with error: ${JSON.stringify(error)}`);
    }
  }

  public static ok<U>(data: U): Result<U> {
    return new Result<U>(true, data);
  }

  public static fail<U>(error: ErrorResponse["error"]): Result<U> {
    return new Result<U>(false, undefined, error);
  }
}
