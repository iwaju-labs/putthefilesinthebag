import sharp from "sharp";
import path from "node:path";

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

// Generate code snippets for embedding images
function generateCodeSnippets(filename: string): {
  html: string;
  react: string;
  markdown: string;
} {
  const baseUrl = `https://putthefilesinthebag.xyz/media/${filename}`;
  
  return {
    html: `<img src="${baseUrl}" alt="Image" loading="lazy" />`,
    react: `<img src="${baseUrl}" alt="Image" loading="lazy" />`,
    markdown: `![Image](${baseUrl})`,
  };
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

// Main processing function - images only
export async function processFileInMemory(
  fileBuffer: Buffer,
  originalName: string,
  formats: string[],
  isPremium: boolean = false
): Promise<ConversionResult[]> {
  const results: ConversionResult[] = [];
  const baseName = path.parse(originalName).name;

  for (const format of formats) {
    try {
      const outputBuffer = await convertImage(fileBuffer, format, isPremium);
      const filename = `${baseName}.${format}`;

      // Convert to base64 data URL
      const mimeType = format === 'jpg' ? 'image/jpeg' : `image/${format}`;
      const dataUrl = `data:${mimeType};base64,${outputBuffer.toString('base64')}`;

      results.push({
        format,
        filename,
        size: outputBuffer.length,
        data: dataUrl,
        codeSnippet: generateCodeSnippets(filename),
      });
    } catch (error) {
      console.error(`Failed to convert to ${format}:`, error);
      // Continue with other formats even if one fails
    }
  }

  return results;
}
