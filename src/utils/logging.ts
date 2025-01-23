import path from "path";
import { fs } from "./loadmodules";
import { promisify } from "util";

const logPath = path.join(__dirname, "logs", 'server.log');

// Function to write logs to a file
function WriteLog(level: string, text: string) {
  const date = new Date().toLocaleString();
  const logMessage = `(${date}) [${level.toUpperCase()}] ${text}\n`;

  fs.appendFile(logPath, logMessage, (err: Error) => {
    if (err) {
      console.error('Error writing to log file', err);
    }
  });
}

// Colorize log messages for different levels
function colorizeLog(level: string, message: string) {
  switch (level) {
    case 'success':
      return `\x1b[32m${message}\x1b[0m`; // Green for success
    case 'warn':
      return `\x1b[33m${message}\x1b[0m`; // Yellow for warn
    case 'error':
      return `\x1b[31m${message}\x1b[0m`; // Red for error
    case 'fatal':
      return `\x1b[41m\x1b[37m${message}\x1b[0m`; // Red background, white text for fatal
    default:
      return message; // Default color for info (no change)
  }
}

// Custom logging function that includes levels
function log(level: string, ...args: any[]) {
  const currentTime = new Date();
  const formattedTime = currentTime.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  // Format the log message
  const message = args.join(' ');

  // Log to console with colorized message
  console.log(`${formattedTime} [${level.toUpperCase()}]: ${colorizeLog(level, message)}`);

  // Write the message to the log file
  WriteLog(level, message);
}

// Define log levels
const logger = {
  success: (...args: any[]) => log('success', ...args),
  info: (...args: any[]) => log('info', ...args),
  warn: (...args: any[]) => log('warn', ...args),
  error: (...args: any[]) => log('error', ...args),
  fatal: (...args: any[]) => log('fatal', ...args)
};

// Export logger for use in other modules
export default logger;
