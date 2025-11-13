# Quick Deployment Guide

## Docker Build Successful! 🐳

Your app is now ready to deploy anywhere that supports Docker.

## Deploy to Railway (Easiest)

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Add Docker support and Stripe payments"
   git push
   ```

2. **Deploy on Railway:**
   - Go to [railway.app](https://railway.app)
   - Click "New Project" → "Deploy from GitHub repo"
   - Select `putthefilesinthebag`
   - Railway auto-detects Dockerfile ✅

3. **Add Environment Variables:**
   ```
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
   CLERK_SECRET_KEY=sk_test_...
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
   STRIPE_SECRET_KEY=sk_test_...
   STRIPE_WEBHOOK_SECRET=whsec_...
   NODE_ENV=production
   ```

4. **Set up Stripe Webhook:**
   - Go to [Stripe Webhooks](https://dashboard.stripe.com/webhooks)
   - Add endpoint: `https://your-app.railway.app/api/stripe/webhook`
   - Select event: `checkout.session.completed`
   - Copy webhook secret and add to Railway env vars

5. **Deploy!** 🚀

## Deploy to Fly.io (Free Tier)

1. **Install Fly CLI:**
   ```bash
   # Already installed, just login
   fly auth login
   ```

2. **Launch:**
   ```bash
   fly launch
   # Say YES to Dockerfile
   # Choose region
   # Say NO to database
   ```

3. **Set Secrets:**
   ```bash
   fly secrets set NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
   fly secrets set CLERK_SECRET_KEY=sk_test_...
   fly secrets set NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
   fly secrets set STRIPE_SECRET_KEY=sk_test_...
   fly secrets set STRIPE_WEBHOOK_SECRET=whsec_...
   fly secrets set NODE_ENV=production
   ```

4. **Deploy:**
   ```bash
   fly deploy
   ```

5. **Set up Stripe webhook** (same as Railway)

## Test Locally with Docker

```bash
# Build and run
docker-compose up --build

# Access at http://localhost:3000

# Stop
docker-compose down
```

## What's Included

✅ **FFmpeg** - For video conversion (MP4, WebM, GIF)
✅ **Sharp** - For image conversion (WebP, AVIF, PNG, JPG)
✅ **Next.js Production Build** - Optimized and minified
✅ **Rate Limiting** - Persists via volume mount
✅ **Stripe Payments** - €3.29 lifetime tier
✅ **Clerk Auth** - User management

## Cost Estimates

**Railway:**
- ~$5-10/month with light traffic
- Scales automatically

**Fly.io:**
- Free tier available (3 VMs)
- ~$0-5/month to start

**DigitalOcean:**
- $5/month App Platform
- Simple and reliable

## Production Checklist

- [ ] Push code to GitHub
- [ ] Deploy to Railway/Fly.io
- [ ] Add all environment variables
- [ ] Set up Stripe production webhook
- [ ] Test a real payment (small amount first!)
- [ ] Test video conversion
- [ ] Test image conversion
- [ ] Verify rate limiting works
- [ ] Check that lifetime tier bypasses limits

## Next Steps

1. ✅ Docker build complete
2. 🔄 Push to GitHub
3. 🔄 Deploy to Railway or Fly.io
4. 🔄 Add production environment variables
5. 🔄 Set up production Stripe webhook
6. 🔄 Test everything in production

## MVP Complete! 🎉

You now have:
- ✅ Media conversion (videos + images)
- ✅ Rate limiting (3/day free)
- ✅ Stripe payments (€3.29 lifetime)
- ✅ Docker deployment ready
- ✅ No server FFmpeg dependency issues

Ready to launch! 🚀
