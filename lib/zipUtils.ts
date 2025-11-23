import JSZip from 'jszip';
import { ConversionResult } from './converterInMemory';

export async function createZipFromResults(
  results: ConversionResult[]
): Promise<Blob> {
  const zip = new JSZip();

  // Add each file to the zip from base64 data
  for (const result of results) {
    try {
      // Extract base64 data from data URL
      const base64Data = result.data.split(',')[1];
      zip.file(result.filename, base64Data, { base64: true });
    } catch (error) {
      console.error(`Failed to add ${result.filename} to zip:`, error);
    }
  }

  // Generate the zip file
  return await zip.generateAsync({ type: 'blob' });
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
