import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  try {
    const logFilePath = path.join(process.cwd(), "logs", "combined.log");

    if (!fs.existsSync(logFilePath)) {
      return NextResponse.json({ error: "Log file not found" }, { status: 404 });
    }

    const data = fs.readFileSync(logFilePath, "utf-8");
    const lines = data.split("\n").filter(Boolean);

    return NextResponse.json({ logs: lines });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to read log file", details: error.message }, { status: 500 });
  }
}
