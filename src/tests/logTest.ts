import { Result } from "../utils/result.ts";
import logger from "../utils/logging.ts";

// Simulate a function that fetches user data
function fetchUser(userId: number): Result<{ id: number; name: string }> {
  if (userId === 1) {
    // Success case
    return Result.ok({ id: 1, name: "John Doe" });
  } else {
    // Error case
    return Result.fail({ code: 404, message: "User not found" });
  }
}

// Test the function
const userResult1 = fetchUser(1); // Success case
const userResult2 = fetchUser(2); // Error case

// Log the results
logger.success("User 1 Response:", JSON.stringify(userResult1.getResponse()));
logger.error("User 2 Response:", JSON.stringify(userResult2.getResponse()));