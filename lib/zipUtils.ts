import JSZip from 'jszip';
import { ConversionResult } from './converter';

export async function createZipFromResults(
  results: ConversionResult[]
): Promise<Blob> {
  const zip = new JSZip();

  // Fetch and add each file to the zip
  for (const result of results) {
    try {
      const response = await fetch(result.url);
      const blob = await response.blob();
      zip.file(result.path, blob);
    } catch (error) {
      console.error(`Failed to add ${result.path} to zip:`, error);
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
