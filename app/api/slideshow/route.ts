import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const SLIDESHOW_DIR = path.join(process.cwd(), "public", "slideshow");
const SUPPORTED_EXTENSIONS = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg"];

export async function GET() {
  try {
    // Ensure the directory exists
    if (!fs.existsSync(SLIDESHOW_DIR)) {
      fs.mkdirSync(SLIDESHOW_DIR, { recursive: true });
      return NextResponse.json({ images: [] });
    }

    // Read all files in the slideshow directory
    const files = fs.readdirSync(SLIDESHOW_DIR);

    // Filter for supported image extensions and map to URLs
    const images = files
      .filter((file) => {
        const ext = path.extname(file).toLowerCase();
        return SUPPORTED_EXTENSIONS.includes(ext);
      })
      .sort() // Sort alphabetically for consistent order
      .map((file) => `/slideshow/${file}`);

    return NextResponse.json({ images });
  } catch (error) {
    console.error("Error reading slideshow directory:", error);
    return NextResponse.json({ images: [] });
  }
}
