# FFmpeg.wasm Client-Side Video Conversion Setup

## Overview
Successfully implemented client-side video conversion using FFmpeg.wasm to enable deployment on Vercel without server-side FFmpeg dependencies.

## Architecture

### Split Processing Strategy
- **Videos (MP4, WebM, GIF)**: Processed client-side using FFmpeg.wasm
- **Images (WebP, AVIF, PNG, JPG)**: Processed server-side using Sharp (faster)

### Key Benefits
✅ **No server dependencies** - Works on Vercel/Netlify/any static host
✅ **Scales infinitely** - Processing happens on user's device
✅ **Built-in watermarking** - Free tier gets watermarks, lifetime tier doesn't
✅ **Progress indicators** - Real-time feedback during conversion

## Files Created/Modified

### New Files
- `lib/videoConverterClient.ts` - Client-side FFmpeg.wasm wrapper
  - `loadFFmpeg()` - Lazy-loads FFmpeg.wasm from CDN
  - `convertVideoClient()` - Converts videos without watermark
  - `addWatermarkClient()` - Converts videos with watermark overlay
  - Progress callbacks for real-time UI updates

### Modified Files
- `app/convert/page.tsx`
  - Added hybrid conversion logic (client video + server image)
  - Added progress bar UI component
  - Added `hasLifetimeTier` state (ready for Stripe integration)
  - Split format processing by type

- `next.config.ts`
  - Added CORS headers for SharedArrayBuffer support
  - Required for FFmpeg.wasm to function

## Technical Details

### FFmpeg.wasm Configuration
```typescript
const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd';
await ffmpeg.load({
  coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
  wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
});
```

### Conversion Commands

**MP4 (H.264 + AAC)**
```bash
-i input -c:v libx264 -preset fast -crf 23 -c:a aac -movflags +faststart output.mp4
```

**WebM (VP9 + Opus)**
```bash
-i input -c:v libvpx-vp9 -crf 30 -b:v 0 -c:a libopus output.webm
```

**GIF (2-pass with palette)**
```bash
# Pass 1: Generate palette
-i input -vf fps=10,scale=640:-1:flags=lanczos,palettegen palette.png

# Pass 2: Apply palette
-i input -i palette.png -filter_complex fps=10,scale=640:-1:flags=lanczos[x];[x][1:v]paletteuse output.gif
```

### Watermark Implementation
```typescript
const drawtext = `drawtext=text='putthefilesinthebag.xyz':x=10:y=H-th-10:fontsize=16:fontcolor=white@0.5`;
```
Applied to bottom-left corner with 50% opacity white text.

## File Size Limits

- **Images**: 50MB (processed server-side)
- **Videos**: 100MB (processed client-side)

Limits set to accommodate browser memory constraints while allowing reasonable video lengths.

## Rate Limiting

Free tier users:
- 3 conversions per day
- Videos get watermark overlay
- Reset at midnight UTC

Lifetime tier users (€3.29):
- Unlimited conversions
- No watermarks
- Priority support

## Next Steps

### Immediate (Stripe Integration)
1. Install `@stripe/stripe-js`
2. Create checkout session endpoint
3. Add webhook for payment confirmation
4. Store user tier in Clerk metadata
5. Update `hasLifetimeTier` state from Clerk
6. Remove "Coming Soon" from pricing page

### Testing Checklist
- [ ] Test video conversion (MP4, WebM, GIF)
- [ ] Verify progress indicators work
- [ ] Confirm watermarks appear for free users
- [ ] Test 100MB video file limit
- [ ] Verify client-side processing doesn't block UI
- [ ] Test download functionality for all formats
- [ ] Test "Download All as ZIP" with videos

### Deployment
- [ ] Verify CORS headers in production
- [ ] Test on Vercel preview deployment
- [ ] Monitor client-side memory usage
- [ ] Add error handling for unsupported browsers

## Browser Compatibility

FFmpeg.wasm requires:
- SharedArrayBuffer support
- WebAssembly support
- Modern browser (Chrome 92+, Firefox 90+, Safari 15.2+)

Edge cases to handle:
- Older browsers → Show upgrade message
- Mobile devices → May be slower, consider warnings
- Low-memory devices → Enforce stricter file size limits

## Performance Notes

**First conversion:**
- ~2-3 seconds to load FFmpeg.wasm (one-time)
- Then conversion proceeds

**Subsequent conversions:**
- FFmpeg.wasm stays loaded in memory
- Faster startup time

**Expected conversion speeds:**
- 1 minute video → ~30-60 seconds
- Depends on user's device CPU
- Progress bar provides feedback

## Cost Analysis

**Before (server-side FFmpeg):**
- ❌ Requires FFmpeg binary on server
- ❌ Can't deploy to Vercel/serverless
- ❌ CPU costs scale with users
- ❌ Need video processing infrastructure

**After (client-side FFmpeg.wasm):**
- ✅ Zero server costs for video conversion
- ✅ Deploy anywhere (Vercel, Netlify, Cloudflare Pages)
- ✅ Infinite scalability
- ✅ Only pay for API routes (rate limiting, etc.)

## Docker Deployment (Recommended)

Since FFmpeg.wasm is too slow for production use, we're using server-side FFmpeg in a Docker container:

### Files Created:
- `Dockerfile` - Node.js 20 Alpine with FFmpeg installed
- `.dockerignore` - Excludes unnecessary files from build
- `docker-compose.yml` - Easy local testing and deployment

### Local Testing:
```bash
# Build and run
docker-compose up --build

# Access at http://localhost:3000
```

### Deploy to Any Platform:
- **Railway** - Supports Docker, auto-detects Dockerfile
- **Fly.io** - Docker-first platform, great for media apps
- **DigitalOcean App Platform** - Docker support with CDN
- **AWS ECS/Fargate** - Enterprise-grade container hosting
- **Google Cloud Run** - Serverless containers

### Why Docker?
✅ FFmpeg binary included in image
✅ Fast server-side conversion (vs slow browser WASM)
✅ Deploy anywhere that supports containers
✅ Consistent environment (dev = prod)
✅ Easy scaling and updates

## Status

✅ Server-side FFmpeg ready (fluent-ffmpeg)
✅ Docker setup complete
✅ Watermark system ready
✅ Rate limiting with persistence
⏳ Deploy to Railway/Fly.io
⏳ Stripe integration pending
⏳ Production testing pending

**Ready to deploy and add Stripe payments!**
