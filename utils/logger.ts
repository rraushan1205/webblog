import { createLogger, format, transports } from "winston";

const { combine, timestamp, printf, errors, colorize } = format;

// Custom log format for console (dev)
const consoleFormat = combine(
  colorize(),
  timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  errors({ stack: true }),  // stack trace include karo
  printf(({ timestamp, level, message, stack }) => {
    return stack
      ? `[${timestamp}] ${level}: ${message}\nStack: ${stack}`
      : `[${timestamp}] ${level}: ${message}`;
  })
);

// JSON format for file (prod)
const fileFormat = combine(
  timestamp(),
  errors({ stack: true }),
  format.json()
);

const logger = createLogger({
  level: "info",
  format: fileFormat,  // default to json for files
  transports: [
    new transports.Console({
      format: consoleFormat,
    }),
    new transports.File({ filename: "logs/error.log", level: "error" }),
    new transports.File({ filename: "logs/combined.log" }),
  ],
});

export default logger;
