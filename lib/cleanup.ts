import { readdir, stat, rm } from 'node:fs/promises';
import path from 'node:path';

const UPLOADS_DIR = path.join(process.cwd(), 'uploads');
const MAX_AGE_MS = 24 * 60 * 60 * 1000; // 24 hours

export async function cleanupOldFiles() {
  try {
    const sessions = await readdir(UPLOADS_DIR);
    const now = Date.now();
    let deletedCount = 0;

    for (const sessionId of sessions) {
      const sessionPath = path.join(UPLOADS_DIR, sessionId);
      
      try {
        const stats = await stat(sessionPath);
        
        // Delete if older than MAX_AGE_MS
        if (now - stats.mtimeMs > MAX_AGE_MS) {
          await rm(sessionPath, { recursive: true, force: true });
          deletedCount++;
          console.log(`Deleted old session: ${sessionId}`);
        }
      } catch (error) {
        console.error(`Failed to process session ${sessionId}:`, error);
      }
    }

    if (deletedCount > 0) {
      console.log(`Cleanup complete: deleted ${deletedCount} old sessions`);
    }
    
    return { deletedCount };
  } catch (error) {
    console.error('Cleanup error:', error);
    return { deletedCount: 0, error };
  }
}

// Run cleanup every hour
export function startCleanupSchedule() {
  // Run immediately on start
  cleanupOldFiles();
  
  // Then every hour
  setInterval(() => {
    cleanupOldFiles();
  }, 60 * 60 * 1000);
}
