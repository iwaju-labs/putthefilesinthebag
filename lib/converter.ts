import ffmpeg from "fluent-ffmpeg";
import sharp from "sharp";
import path from "node:path";
import { stat } from "node:fs/promises";

export interface ConversionResult {
  format: string;
  path: string;
  size: number;
  url: string;
}

export async function processFile(
  inputPath: string,
  fileType: "video" | "image",
  sessionId: string,
  isPremium: boolean = false
): Promise<ConversionResult[]> {
  const results: ConversionResult[] = [];
  const outputDir = path.join(process.cwd(), "uploads", sessionId);
  const baseName = path.parse(inputPath).name;

  if (fileType === "video") {
    const outputName = `${baseName}-converted`;
    
    // Convert to MP4
    await convertVideo(inputPath, outputDir, outputName, "mp4", isPremium);
    results.push(await createResult(sessionId, outputName, "mp4", "MP4"));

    // Convert to WebM
    await convertVideo(inputPath, outputDir, outputName, "webm", isPremium);
    results.push(await createResult(sessionId, outputName, "webm", "WebM"));

    // Generate GIF
    await convertToGif(inputPath, outputDir, outputName, isPremium);
    results.push(await createResult(sessionId, outputName, "gif", "GIF"));
  } else {
    // Image conversions
    const formats = ["webp", "avif", "png", "jpg"];

    for (const format of formats) {
      const outputName = `${baseName}-converted`;
      await convertImage(inputPath, outputDir, outputName, format, isPremium);
      results.push(
        await createResult(sessionId, outputName, format, format.toUpperCase())
      );
    }
  }

  return results;
}

async function createResult(
  sessionId: string,
  baseName: string,
  extension: string,
  format: string
): Promise<ConversionResult> {
  const filePath = path.join(
    process.cwd(),
    "uploads",
    sessionId,
    `${baseName}.${extension}`
  );
  const stats = await stat(filePath);

  return {
    format,
    path: `${baseName}.${extension}`,
    size: stats.size,
    url: `/api/download/${sessionId}/${baseName}.${extension}`,
  };
}

async function convertVideo(
  input: string,
  outputDir: string,
  baseName: string,
  format: string,
  isPremium: boolean
): Promise<void> {
  return new Promise((resolve, reject) => {
    const output = path.join(outputDir, `${baseName}.${format}`);

    const command = ffmpeg(input);

    if (format === "mp4") {
      command
        .outputOptions("-c:v libx264")
        .outputOptions("-crf", isPremium ? "20" : "23")
        .outputOptions("-preset medium")
        .outputOptions("-movflags +faststart");
    } else if (format === "webm") {
      command
        .outputOptions("-c:v libvpx-vp9")
        .outputOptions("-crf", isPremium ? "28" : "30")
        .outputOptions("-b:v 0");
    }

    // Add watermark for free tier
    if (!isPremium) {
      command.outputOptions([
        "-vf",
        "drawtext=text='putthefilesinthebag.xyz':x=10:y=10:fontsize=24:fontcolor=white@0.7",
      ]);
    }

    command
      .output(output)
      .on("end", () => resolve())
      .on("error", (err) => reject(err))
      .run();
  });
}

async function convertToGif(
  input: string,
  outputDir: string,
  baseName: string,
  isPremium: boolean
): Promise<void> {
  return new Promise((resolve, reject) => {
    const output = path.join(outputDir, `${baseName}.gif`);

    const command = ffmpeg(input)
      .outputOptions(
        "-vf",
        `fps=10,scale=${isPremium ? "640" : "480"}:-1:flags=lanczos`
      )
      .outputOptions("-f gif");

    // Add watermark for free tier
    if (!isPremium) {
      command.outputOptions([
        "-vf",
        "fps=10,scale=480:-1:flags=lanczos,drawtext=text='putthefilesinthebag.xyz':x=5:y=5:fontsize=16:fontcolor=white@0.7",
      ]);
    }

    command
      .output(output)
      .on("end", () => resolve())
      .on("error", (err) => reject(err))
      .run();
  });
}

async function convertImage(
  input: string,
  outputDir: string,
  baseName: string,
  format: string,
  isPremium: boolean
): Promise<void> {
  const output = path.join(outputDir, `${baseName}.${format}`);

  let image = sharp(input);

  // Add watermark for free tier
  if (!isPremium) {
    const watermarkSvg = Buffer.from(`
      <svg width="200" height="30">
        <text x="5" y="20" font-family="Arial" font-size="14" fill="white" fill-opacity="0.7">
          putthefilesinthebag.xyz
        </text>
      </svg>
    `);

    image = image.composite([
      {
        input: watermarkSvg,
        gravity: "northwest",
      },
    ]);
  }

  const quality = isPremium ? 90 : 85;

  switch (format) {
    case "webp":
      await image.webp({ quality }).toFile(output);
      break;
    case "avif":
      await image.avif({ quality: quality - 5 }).toFile(output);
      break;
    case "png":
      await image.png({ compressionLevel: isPremium ? 6 : 8 }).toFile(output);
      break;
    case "jpg":
      await image.jpeg({ quality }).toFile(output);
      break;
  }
}
