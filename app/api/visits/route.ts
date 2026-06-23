import { readFile, writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { NextResponse } from "next/server";

const VISITS_FILE = join(process.cwd(), "data", "visits.json");

async function ensureVisitsFile() {
  try {
    await readFile(VISITS_FILE);
  } catch {
    // File doesn't exist, create it
    const dataDir = join(process.cwd(), "data");
    // Create data directory if it doesn't exist
    await mkdir(dataDir, { recursive: true });
    // Create the visits file
    await writeFile(VISITS_FILE, JSON.stringify({ count: 0 }));
  }
}

export async function POST() {
  try {
    await ensureVisitsFile();
    const data = JSON.parse(await readFile(VISITS_FILE, "utf-8"));
    data.count = (data.count || 0) + 1;
    await writeFile(VISITS_FILE, JSON.stringify(data, null, 2));
    return NextResponse.json({ count: data.count });
  } catch (error) {
    console.error("Error updating visits:", error);
    return NextResponse.json({ count: 0 }, { status: 500 });
  }
}

export async function GET() {
  try {
    await ensureVisitsFile();
    const data = JSON.parse(await readFile(VISITS_FILE, "utf-8"));
    return NextResponse.json({ count: data.count || 0 });
  } catch (error) {
    console.error("Error reading visits:", error);
    return NextResponse.json({ count: 0 }, { status: 500 });
  }
}
