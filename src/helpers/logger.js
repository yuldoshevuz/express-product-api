import fs from "fs/promises";
import path from "path";

// Function to get the log file path
const getLogFilePath = (fileName = "errors.log") => {
    return path.join(process.cwd(), fileName);
}

// Function to check if a file exists
const fileExists = async (filePath) => {
    try {
        await fs.access(filePath);
        return true;
    } catch {
        return false;
    }
}

// Function to initialize the log file if it doesn't exist
const initLogFile = async (filePath) => {
    const exists = await fileExists(filePath);
    if (!exists) {
        await fs.writeFile(filePath, "");
    }
}

// Logger function
const logger = async (error) => {
    try {
        const filePath = getLogFilePath();
        await initLogFile(filePath);
        const logEntry = `${new Date().toISOString()} | ${error}\n`;
        await fs.appendFile(filePath, logEntry);
    } catch (logError) {
        console.error("Failed to write to log file:", logError);
    }
}

export default logger;