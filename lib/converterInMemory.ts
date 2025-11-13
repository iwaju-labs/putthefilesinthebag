import ffmpeg from "fluent-ffmpeg";
import sharp from "sharp";
import { writeFile, unlink } from "node:fs/promises";
import path from "node:path";
import os from "node:os";

export interface ConversionResult {
  format: string;
  filename: string;
  size: number;
  data: string; // base64 encoded data URL
  codeSnippet: {
    html: string;
    react: string;
    markdown: string;
  };
}

// Generate code snippets for embedding
function generateCodeSnippets(filename: string, format: string, isVideo: boolean): {
  html: string;
  react: string;
  markdown: string;
} {
  const baseUrl = `https://putthefilesinthebag.xyz/media/${filename}`;
  
  if (isVideo) {
    return {
      html: `<video controls width="640" height="360">\n  <source src="${baseUrl}" type="video/${format}">\n  Your browser does not support the video tag.\n</video>`,
      react: `<video controls width={640} height={360}>\n  <source src="${baseUrl}" type="video/${format}" />\n  Your browser does not support the video tag.\n</video>`,
      markdown: `![Video](${baseUrl})`,
    };
  } else {
    return {
      html: `<img src="${baseUrl}" alt="Image" loading="lazy" />`,
      react: `<img src="${baseUrl}" alt="Image" loading="lazy" />`,
      markdown: `![Image](${baseUrl})`,
    };
  }
}

// Convert image formats in memory
async function convertImage(
  inputBuffer: Buffer,
  format: string,
  isPremium: boolean
): Promise<Buffer> {
  let sharpImage = sharp(inputBuffer);

  // Add watermark for free tier
  if (!isPremium) {
    const watermarkSvg = Buffer.from(`
      <svg width="200" height="50">
        <text x="10" y="30" font-family="Arial" font-size="16" fill="rgba(255,255,255,0.5)">
          putthefilesinthebag.xyz
        </text>
      </svg>
    `);
    
    sharpImage = sharpImage.composite([{
      input: watermarkSvg,
      gravity: 'southeast',
    }]);
  }

  // Convert to desired format
  switch (format) {
    case "webp":
      return sharpImage.webp({ quality: 90 }).toBuffer();
    case "avif":
      return sharpImage.avif({ quality: 90 }).toBuffer();
    case "png":
      return sharpImage.png({ quality: 90 }).toBuffer();
    case "jpg":
    case "jpeg":
      return sharpImage.jpeg({ quality: 90 }).toBuffer();
    default:
      throw new Error(`Unsupported image format: ${format}`);
  }
}

// Convert video using FFmpeg (requires temp files)
async function convertVideo(
  inputBuffer: Buffer,
  originalName: string,
  format: string,
  isPremium: boolean
): Promise<Buffer> {
  // Create temp input file
  const tempDir = os.tmpdir();
  const tempInput = path.join(tempDir, `input-${Date.now()}${path.extname(originalName)}`);
  const tempOutput = path.join(tempDir, `output-${Date.now()}.${format}`);

  await writeFile(tempInput, inputBuffer);

  return new Promise((resolve, reject) => {
    let command = ffmpeg(tempInput);

    // Format-specific settings
    if (format === "mp4") {
      command = command
        .videoCodec("libx264")
        .audioCodec("aac")
        .outputOptions(["-preset faster", "-crf 23"]);
      
      // Add watermark for free tier (with black background box)
      if (!isPremium) {
        command = command.complexFilter([
          `drawtext=text='putthefilesinthebag.xyz':fontfile=/usr/share/fonts/ttf-dejavu/DejaVuSans.ttf:x=10:y=H-th-10:fontsize=18:fontcolor=white:box=1:boxcolor=black@0.7:boxborderw=5`,
        ]);
      }
    } else if (format === "webm") {
      command = command
        .videoCodec("libvpx-vp9")
        .audioCodec("libopus")
        .outputOptions(["-crf 30", "-b:v 0", "-deadline realtime", "-cpu-used 8"]);
      
      // Add watermark for free tier (with black background box)
      if (!isPremium) {
        command = command.complexFilter([
          `drawtext=text='putthefilesinthebag.xyz':fontfile=/usr/share/fonts/ttf-dejavu/DejaVuSans.ttf:x=10:y=H-th-10:fontsize=18:fontcolor=white:box=1:boxcolor=black@0.7:boxborderw=5`,
        ]);
      }
    } else if (format === "gif") {
      // For GIF, chain filters properly
      command = command.noAudio();
      
      if (!isPremium) {
        // Scale, adjust FPS, and add watermark in one filter chain
        command = command.complexFilter(
          `fps=15,scale=640:-1:flags=lanczos,drawtext=text='putthefilesinthebag.xyz':fontfile=/usr/share/fonts/ttf-dejavu/DejaVuSans.ttf:x=10:y=H-th-10:fontsize=18:fontcolor=white:box=1:boxcolor=black@0.7:boxborderw=5`
        );
      } else {
        // Premium users get better quality GIF without watermark
        command = command.complexFilter('fps=15,scale=640:-1:flags=lanczos');
      }
      
      command = command.outputOptions(["-f gif"]);
    }

    command
      .output(tempOutput)
      .on("end", async () => {
        try {
          const outputBuffer = await readFile(tempOutput);
          // Cleanup temp files
          await unlink(tempInput).catch(() => {});
          await unlink(tempOutput).catch(() => {});
          resolve(outputBuffer);
        } catch (err) {
          reject(err);
        }
      })
      .on("error", async (err) => {
        // Cleanup temp files on error
        await unlink(tempInput).catch(() => {});
        await unlink(tempOutput).catch(() => {});
        reject(err);
      })
      .run();
  });
}

async function readFile(filePath: string): Promise<Buffer> {
  const fs = await import('node:fs/promises');
  return fs.readFile(filePath);
}

// Main processing function
export async function processFileInMemory(
  fileBuffer: Buffer,
  originalName: string,
  fileType: "video" | "image",
  formats: string[],
  isPremium: boolean = false
): Promise<ConversionResult[]> {
  const results: ConversionResult[] = [];
  const baseName = path.parse(originalName).name;

  for (const format of formats) {
    try {
      let outputBuffer: Buffer;
      const filename = `${baseName}.${format}`;

      if (fileType === "video") {
        outputBuffer = await convertVideo(fileBuffer, originalName, format, isPremium);
      } else {
        outputBuffer = await convertImage(fileBuffer, format, isPremium);
      }

      // Convert to base64 data URL
      const mimeType = fileType === "video" 
        ? `video/${format}` 
        : `image/${format === 'jpg' ? 'jpeg' : format}`;
      const dataUrl = `data:${mimeType};base64,${outputBuffer.toString('base64')}`;

      results.push({
        format,
        filename,
        size: outputBuffer.length,
        data: dataUrl,
        codeSnippet: generateCodeSnippets(filename, format, fileType === "video"),
      });
    } catch (error) {
      console.error(`Failed to convert to ${format}:`, error);
      // Continue with other formats even if one fails
    }
  }

  return results;
}
