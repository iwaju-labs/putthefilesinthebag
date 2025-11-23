# Vercel Deployment Guide

## Prerequisites
- GitHub account
- Vercel account (free tier works)
- Clerk account for authentication
- Stripe account for payments

## Environment Variables

Set these in your Vercel project settings:

### Clerk (Authentication)
```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...
CLERK_SECRET_KEY=sk_live_...
```

### Stripe (Payments)
```
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### Node Environment
```
NODE_ENV=production
```

## Deployment Steps

### 1. Push to GitHub
```bash
git add .
git commit -m "Remove video functionality, prepare for Vercel"
git push origin main
```

### 2. Import to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Import your GitHub repository
4. Vercel will auto-detect Next.js

### 3. Configure Environment Variables
1. In Vercel project settings → Environment Variables
2. Add all the environment variables listed above
3. Make sure to add them for Production, Preview, and Development

### 4. Configure Clerk
1. Go to Clerk Dashboard → Configure → Domains
2. Add your Vercel domain (e.g., `your-app.vercel.app`)
3. Set authorized redirect URIs:
   - `https://your-app.vercel.app`
   - `https://your-domain.com` (if using custom domain)

### 5. Configure Stripe Webhook
1. Go to Stripe Dashboard → Developers → Webhooks
2. Add endpoint: `https://your-app.vercel.app/api/stripe/webhook`
3. Select event: `checkout.session.completed`
4. Copy webhook signing secret to Vercel env vars

### 6. Deploy
Click "Deploy" in Vercel - it will automatically:
- Install dependencies
- Build the Next.js app
- Deploy to global edge network

## Custom Domain (Optional)

### Add Domain to Vercel
1. Vercel Project → Settings → Domains
2. Add your domain (e.g., `putthefilesinthebag.xyz`)
3. Follow DNS instructions

### Update Clerk
Add the custom domain to Clerk authorized URLs

### Update Stripe Webhook
Add webhook endpoint with custom domain

## What Changed from Fly.io

### Removed:
- ❌ FFmpeg and all video processing
- ❌ Docker container
- ❌ Fly.io configuration
- ❌ 100MB request limits
- ❌ Video formats (MP4, WebM, GIF)

### Kept:
- ✅ Sharp for image processing
- ✅ Clerk authentication
- ✅ Stripe payments
- ✅ Rate limiting
- ✅ All image formats (WebP, AVIF, PNG, JPG)

### Benefits:
- 🚀 Faster deployments
- 💰 Free hosting tier
- 📈 Auto-scaling
- 🌍 Global CDN
- 🔄 Zero-downtime updates
- 📊 Built-in analytics

## Monitoring

Vercel provides:
- Real-time logs
- Error tracking
- Performance metrics
- Deployment history

Access at: `https://vercel.com/your-username/your-project`

## Troubleshooting

### Build Fails
- Check Node version (should be 20+)
- Verify all dependencies in package.json
- Check build logs in Vercel dashboard

### Runtime Errors
- Verify environment variables are set
- Check function logs in Vercel
- Ensure Clerk/Stripe webhooks are configured

### Rate Limiting Issues
- File-based storage persists between deployments
- Consider migrating to Redis/Upstash for production

## Cost Comparison

### Fly.io (Previous)
- ~$5-10/month for basic VM
- Manual scaling
- Docker complexity

### Vercel (Current)
- Free for hobby projects
- Pro: $20/month (if needed)
- Auto-scaling included
- Simpler deployment
