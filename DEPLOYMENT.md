# Put The Files In The Bag 💼

A modern media conversion tool that outputs multiple optimized formats with ready-to-embed code snippets.

## Features

- 🎥 **Video Conversion**: MP4, WebM, GIF
- 🖼️ **Image Conversion**: WebP, AVIF, PNG, JPG
- 📦 **Bulk Download**: Get all formats in a single ZIP
- 💻 **Code Snippets**: HTML, React, and Markdown embed codes
- 🎨 **Dark/Light Mode**: Seamless theme switching
- ⚡ **Fast Processing**: Instant conversions with FFmpeg & Sharp

## Setup

### Prerequisites

1. **Node.js** (v18 or higher)
2. **FFmpeg** installed on your system:
   - Windows: `choco install ffmpeg` or download from https://ffmpeg.org
   - Mac: `brew install ffmpeg`
   - Linux: `sudo apt install ffmpeg`

### Installation

```bash
# Install dependencies
npm install

# Install additional packages for conversion
npm install fluent-ffmpeg sharp jszip
npm install --save-dev @types/fluent-ffmpeg

# Run development server
npm run dev
```

Visit http://localhost:3000

### Environment Setup

No environment variables required for MVP! Everything runs locally.

## Usage

1. Navigate to `/convert`
2. Upload a video or image (max 400MB)
3. Get multiple optimized formats + embed code
4. Download individually or as a ZIP bundle

## Tech Stack

- **Frontend**: Next.js 15, React, TypeScript, Tailwind CSS
- **Conversion**: FFmpeg (video), Sharp (images)
- **Styling**: Custom animated Squares background, glassmorphism UI

## Pricing

- **Free**: 3 conversions/day with watermarks
- **Lifetime**: €3.29 - Unlimited conversions, no watermarks, priority processing

## Development Status

✅ Landing page with animated background  
✅ File upload UI  
✅ Conversion API (video & image)  
✅ Result page with code snippets  
✅ Download endpoints  
✅ ZIP bundle creation  
⏳ Authentication & payment (Stripe)  
⏳ Rate limiting  
⏳ File cleanup cron job  

## License

MIT
