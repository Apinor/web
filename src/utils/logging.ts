// utils/logging.ts

// Function to write logs to a file
async function WriteLog(level: string, text: string) {
  const date = new Date().toLocaleString();
  const logMessage = `(${date}) [${level.toUpperCase()}] ${text}\n`;

  try {
    // Ensure the logs directory exists
    await Deno.mkdir("src/logs", { recursive: true });

    // Append the log message to the file
    await Deno.writeTextFile("./src/logs/server.log", logMessage, {
      append: true,
    });
    // console.info(`✅ Log written to file: ${logMessage.trim()}`);
  } catch (err) {
    console.error("❌ Error writing to log file", err);
  }
}

// Colorize log messages for different levels
function colorizeLog(level: string, message: string) {
  switch (level) {
    case "success":
      return `\x1b[32m${message}\x1b[0m`; // Green for success
    case "warn":
      return `\x1b[33m${message}\x1b[0m`; // Yellow for warn
    case "error":
      return `\x1b[31m${message}\x1b[0m`; // Red for error
    case "fatal":
      return `\x1b[41m\x1b[37m${message}\x1b[0m`; // Red background, white text for fatal
    default:
      return message; // Default color for info (no change)
  }
}

// Custom logging function that includes levels
async function log(level: string, ...args: unknown[]) {
  const currentTime = new Date();
  const formattedTime = currentTime.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  // Format the log message
  const message = args.map((arg) => String(arg)).join(" ");

  // Log to console with colorized message
  console.info(
    `${formattedTime} [${level.toUpperCase()}]: ${colorizeLog(level, message)}`
  );

  // Write the message to the log file
  await WriteLog(level, message);
}

// Define log levels
const logger = {
  success: (...args: unknown[]) => log("success", ...args),
  info: (...args: unknown[]) => log("info", ...args),
  warn: (...args: unknown[]) => log("warn", ...args),
  error: (...args: unknown[]) => log("error", ...args),
  fatal: (...args: unknown[]) => log("fatal", ...args),
};

// Export logger for use in other modules
export default logger;
