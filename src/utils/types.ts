// utils/types.ts

export interface SuccessResponse<T> {
    success: true;
    data: T;
  }
  
  export interface ErrorResponse {
    success: false;
    error: {
      code: number;
      message: string;
      details?: any;
    };
  }
  
  export type Response<T> = SuccessResponse<T> | ErrorResponse;
  