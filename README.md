# Put The Files In The Bag 🎥 → 📦

A modern media conversion tool that outputs multiple optimized formats with ready-to-embed code snippets.

## Features

- 🎬 **Video conversion**: MP4, WebM, GIF
- 🖼️ **Image optimization**: WebP, AVIF, PNG, JPEG
- 📋 **Code snippets**: HTML, React, Markdown (ready to copy)
- ⚡ **In-memory processing**: Fast and secure
- 🔒 **Privacy-first**: No files stored on disk
- ✅ **Format selection**: Only convert what you need

## How It Works

1. **Upload**: Drop your video or image file
2. **Select**: Choose which output formats you want
3. **Convert**: Everything processes in-memory (nothing saved)
4. **Download**: Get your files with embed code immediately
5. **Done**: Nothing persists on our servers

## Pricing

### Free Tier
- 3 conversions per day
- Includes watermark on outputs
- All formats available

### Lifetime ($3.29)
- Unlimited conversions
- No watermarks
- Priority processing

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

## Tech Stack

- **Frontend**: Next.js 15 (App Router), TypeScript, Tailwind CSS
- **Processing**: FFmpeg (video), Sharp (images) - all in-memory
- **Auth**: Clerk for user management
- **Rate Limiting**: File-based storage (`.rate-limit/store.json`)
- **Data Transfer**: Base64-encoded data URLs

## Architecture

- ✅ All file processing happens in memory
- ✅ Converted files returned as base64 data URLs
- ✅ Rate limiting persists via JSON file (survives restarts)
- ✅ No database needed for MVP
- ✅ No permanent file storage

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
