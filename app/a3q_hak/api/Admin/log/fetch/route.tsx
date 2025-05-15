import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const logFilePath = path.join(process.cwd(), "logs", "combined.log"); 
    // Apne log file ka path yahan update kar le

    if (!fs.existsSync(logFilePath)) {
      return res.status(404).json({ error: "Log file not found" });
    }

    const data = fs.readFileSync(logFilePath, "utf8");
    const lines = data.split("\n").filter(Boolean); // blank lines hata di

    res.status(200).json({ logs: lines });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    res.status(500).json({ error: "Failed to read log file", details: errorMessage });
  }
}
