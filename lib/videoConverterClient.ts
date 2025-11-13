import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';

let ffmpegInstance: FFmpeg | null = null;

export interface VideoConversionProgress {
  progress: number; // 0-100
  message: string;
}

// Initialize FFmpeg.wasm
export async function loadFFmpeg(
  onProgress?: (progress: VideoConversionProgress) => void
): Promise<FFmpeg> {
  if (ffmpegInstance) {
    return ffmpegInstance;
  }

  const ffmpeg = new FFmpeg();

  ffmpeg.on('log', ({ message }) => {
    console.log('[FFmpeg]', message);
  });

  ffmpeg.on('progress', ({ progress }) => {
    const percentage = Math.round(progress * 100);
    if (onProgress) {
      onProgress({
        progress: percentage,
        message: `Converting... ${percentage}%`,
      });
    }
  });

  onProgress?.({ progress: 0, message: 'Loading FFmpeg...' });

  const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd';
  await ffmpeg.load({
    coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
    wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
  });

  ffmpegInstance = ffmpeg;
  onProgress?.({ progress: 10, message: 'FFmpeg loaded' });
  
  return ffmpeg;
}

// Convert video to specific format
export async function convertVideoClient(
  file: File,
  format: 'mp4' | 'webm' | 'gif',
  onProgress?: (progress: VideoConversionProgress) => void
): Promise<Blob> {
  const ffmpeg = await loadFFmpeg(onProgress);

  const inputName = 'input' + file.name.substring(file.name.lastIndexOf('.'));
  const outputName = `output.${format}`;

  onProgress?.({ progress: 20, message: 'Preparing file...' });

  // Write input file
  await ffmpeg.writeFile(inputName, await fetchFile(file));

  onProgress?.({ progress: 30, message: 'Converting video...' });

  try {
    // Convert based on format
    if (format === 'mp4') {
    await ffmpeg.exec([
      '-i', inputName,
      '-c:v', 'libx264',
      '-preset', 'fast',
      '-crf', '23',
      '-c:a', 'aac',
      '-movflags', '+faststart',
      outputName
    ]);
  } else if (format === 'webm') {
    // Use simpler WebM settings for FFmpeg.wasm
    await ffmpeg.exec([
      '-i', inputName,
      '-c:v', 'libvpx',
      '-crf', '10',
      '-b:v', '1M',
      outputName
    ]);
  } else if (format === 'gif') {
    // Simple GIF conversion
    await ffmpeg.exec([
      '-i', inputName,
      '-vf', 'fps=10,scale=640:-1',
      outputName
    ]);
  }
  } catch (error) {
    console.error('FFmpeg conversion error:', error);
    throw new Error(`Failed to convert to ${format}: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }

  onProgress?.({ progress: 90, message: 'Finalizing...' });

  // Read output file BEFORE deleting
  const data = await ffmpeg.readFile(outputName);
  console.log(`Read ${format} file, size:`, data.length, 'bytes');
  
  if (!data || data.length === 0) {
    throw new Error(`Conversion produced empty file for ${format}`);
  }
  
  onProgress?.({ progress: 100, message: 'Complete!' });

  // Convert to Blob BEFORE cleanup
  const mimeType = format === 'gif' ? 'image/gif' : `video/${format}`;
  const uint8Array = new Uint8Array(data as Uint8Array);
  const blob = new Blob([uint8Array], { type: mimeType });
  console.log(`Created ${format} blob, size:`, blob.size, 'bytes');
  
  // Clean up after blob is created
  try {
    await ffmpeg.deleteFile(inputName);
    await ffmpeg.deleteFile(outputName);
  } catch (e) {
    console.warn('Failed to cleanup files:', e);
  }

  return blob;
}

// Add watermark to video (for free tier)
export async function addWatermarkClient(
  file: File,
  format: 'mp4' | 'webm' | 'gif',
  watermarkText: string = 'putthefilesinthebag.xyz',
  onProgress?: (progress: VideoConversionProgress) => void
): Promise<Blob> {
  const ffmpeg = await loadFFmpeg(onProgress);

  const inputName = 'input' + file.name.substring(file.name.lastIndexOf('.'));
  const outputName = `output.${format}`;

  onProgress?.({ progress: 20, message: 'Preparing file...' });

  await ffmpeg.writeFile(inputName, await fetchFile(file));

  onProgress?.({ progress: 30, message: 'Adding watermark...' });

  const drawtext = `drawtext=text='${watermarkText}':x=10:y=H-th-10:fontsize=16:fontcolor=white@0.5`;

  try {
    if (format === 'mp4') {
    await ffmpeg.exec([
      '-i', inputName,
      '-vf', drawtext,
      '-c:v', 'libx264',
      '-preset', 'fast',
      '-crf', '23',
      '-c:a', 'aac',
      '-movflags', '+faststart',
      outputName
    ]);
  } else if (format === 'webm') {
    // Use simpler WebM settings with watermark
    await ffmpeg.exec([
      '-i', inputName,
      '-vf', drawtext,
      '-c:v', 'libvpx',
      '-crf', '10',
      '-b:v', '1M',
      outputName
    ]);
  } else if (format === 'gif') {
    // Simple GIF conversion with watermark
    await ffmpeg.exec([
      '-i', inputName,
      '-vf', `fps=10,scale=640:-1,${drawtext}`,
      outputName
    ]);
  }
  } catch (error) {
    console.error('FFmpeg watermark error:', error);
    throw new Error(`Failed to add watermark to ${format}: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }

  onProgress?.({ progress: 90, message: 'Finalizing...' });

  const data = await ffmpeg.readFile(outputName);
  console.log(`Read ${format} file with watermark, size:`, data.length, 'bytes');
  
  if (!data || data.length === 0) {
    throw new Error(`Conversion with watermark produced empty file for ${format}`);
  }
  
  onProgress?.({ progress: 100, message: 'Complete!' });

  // Convert to Blob BEFORE cleanup
  const mimeType = format === 'gif' ? 'image/gif' : `video/${format}`;
  const uint8Array = new Uint8Array(data as Uint8Array);
  const blob = new Blob([uint8Array], { type: mimeType });
  console.log(`Created ${format} blob with watermark, size:`, blob.size, 'bytes');
  
  // Clean up after blob is created
  try {
    await ffmpeg.deleteFile(inputName);
    await ffmpeg.deleteFile(outputName);
  } catch (e) {
    console.warn('Failed to cleanup files:', e);
  }

  return blob;
}

// Clean up FFmpeg instance
export function unloadFFmpeg(): void {
  ffmpegInstance = null;
}
