# Docker Deployment Guide

This application requires FFmpeg for video conversion. We use Docker to package everything together.

## Quick Deploy Options

### Option 1: Railway (Recommended - Easiest)
1. Push code to GitHub
2. Go to [railway.app](https://railway.app)
3. Click "Deploy from GitHub repo"
4. Select your repo - Railway auto-detects Dockerfile
5. Add environment variables:
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - `CLERK_SECRET_KEY`
6. Deploy! ✅

**Cost**: ~$5/month, scales automatically

### Option 2: Fly.io (Great Performance)
```bash
# Install Fly CLI
curl -L https://fly.io/install.sh | sh

# Login and launch
fly auth login
fly launch

# Add secrets
fly secrets set NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_xxx
fly secrets set CLERK_SECRET_KEY=sk_xxx

# Deploy
fly deploy
```

**Cost**: Free tier available, ~$3/month after

### Option 3: DigitalOcean App Platform
1. Push to GitHub
2. Create new App in DO dashboard
3. Select GitHub repo
4. App Platform detects Dockerfile automatically
5. Add environment variables
6. Deploy

**Cost**: $5/month starter tier

### Option 4: Docker Compose (Any VPS)
```bash
# On your server
git clone your-repo
cd putthefilesinthebag

# Create .env file
cat > .env << EOF
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_xxx
CLERK_SECRET_KEY=sk_xxx
NODE_ENV=production
EOF

# Deploy
docker-compose up -d
```

## Environment Variables Required

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NODE_ENV=production
```

## Local Testing with Docker

```bash
# Build and run
docker-compose up --build

# Access at http://localhost:3000

# View logs
docker-compose logs -f

# Stop
docker-compose down
```

## Build Docker Image Manually

```bash
# Build
docker build -t putthefilesinthebag .

# Run
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_xxx \
  -e CLERK_SECRET_KEY=sk_xxx \
  putthefilesinthebag
```

## What's Included in Docker Image

- ✅ Node.js 20 Alpine (lightweight)
- ✅ FFmpeg binary (for video conversion)
- ✅ Sharp (for image conversion)
- ✅ All npm dependencies
- ✅ Built Next.js app

## Performance

- **Images (Sharp)**: ~1-2 seconds per conversion
- **Videos (FFmpeg)**: ~5-30 seconds depending on length
- **Memory**: ~512MB recommended minimum
- **CPU**: 1 vCPU sufficient for MVP

## File Size Limits

- Images: 50MB max
- Videos: 100MB max

Set in `app/api/convert/route.ts` if you need to adjust.

## Rate Limiting Persistence

Rate limit data is stored in `.rate-limit/store.json` and persists via Docker volume mount in `docker-compose.yml`.

## Troubleshooting

### FFmpeg not found
```bash
# Test FFmpeg in container
docker-compose exec app ffmpeg -version
```

If missing, rebuild:
```bash
docker-compose down
docker-compose build --no-cache
docker-compose up
```

### Out of memory
Increase container memory:
```yaml
# In docker-compose.yml
services:
  app:
    deploy:
      resources:
        limits:
          memory: 1G
```

### Slow conversions
- Check CPU allocation
- Consider using faster instance type
- Enable hardware acceleration if available

## Next Steps After Deployment

1. ✅ Test all conversion formats
2. ✅ Verify rate limiting works
3. ✅ Test with max file sizes (50MB/100MB)
4. 🔄 Add Stripe payment integration
5. 🔄 Implement watermark for free tier
6. 🔄 Add lifetime tier activation
7. 🔄 Set up custom domain
8. 🔄 Configure CDN for downloads

## Production Checklist

- [ ] Environment variables set
- [ ] Test video conversion (MP4, WebM, GIF)
- [ ] Test image conversion (WebP, AVIF, PNG, JPG)
- [ ] Verify rate limiting (3/day free tier)
- [ ] Test ZIP download
- [ ] Check memory usage under load
- [ ] Set up monitoring/alerts
- [ ] Configure backup strategy for rate limit data

## Recommended Setup

**For MVP**: Railway or Fly.io (easiest, auto-scales)  
**For Scale**: DigitalOcean + CDN or AWS ECS  
**For Budget**: VPS with Docker Compose ($5/month)
