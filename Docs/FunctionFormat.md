# Function format is as follows

All functions return either a sucess response of a error response, these are created in the types.ts file and currently looks like this:


```typescript
// types.ts

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
```

## Generic function results

All functions return result, which is either Error or Success, this standardizes the return of all functions

```typescript
// utils/result.ts

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
    } else {
      this.error = error;
    }
  }

  public static ok<U>(data: U): Result<U> {
    return new Result<U>(true, data);
  }

  public static fail<U>(error: ErrorResponse["error"]): Result<U> {
    return new Result<U>(false, undefined, error);
  }
}
```


# Example function using the predefined types

```typescript
// controllers/productController.ts

import { Result } from "../utils/result.ts";
import { getProductById, updateProduct } from "../services/productService.ts";
import { ErrorLevel } from "../types.ts";

export async function increasePrice(productId: string, increment: number): Promise<Result<void>> {
  const productResult = await getProductById(productId);

  if (!productResult.success) {
    return Result.fail({
      code: productResult.error?.code || 500,
      message: `Failed to retrieve product: ${productResult.error?.message}`,
      level: productResult.error?.level || ErrorLevel.Error,
      details: productResult.error?.details,
    });
  }

  const updatedPrice = productResult.data.price + increment;
  const updateResult = await updateProduct(productId, { price: updatedPrice });

  if (!updateResult.success) {
    return Result.fail({
      code: updateResult.error?.code || 500,
      message: `Failed to update product ${productId}: ${updateResult.error?.message}`,
      level: updateResult.error?.level || ErrorLevel.Error,
      details: updateResult.error?.details,
    });
  }

  return Result.ok(undefined);
}

```