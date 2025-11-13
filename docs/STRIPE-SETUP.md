# Stripe Payment Integration Setup

## What's Been Added

✅ **Stripe Checkout API** (`app/api/stripe/checkout/route.ts`)
- Creates checkout session for €3.29 lifetime tier
- Redirects to Stripe-hosted checkout page

✅ **Stripe Webhook** (`app/api/stripe/webhook/route.ts`)
- Handles successful payments
- Updates user metadata in Clerk with `tier: 'lifetime'`

✅ **Pricing Page Updated** (`app/pricing/page.tsx`)
- "Get Lifetime Access" button triggers checkout
- Loading state during redirect
- Uses Stripe.js for secure payment processing

## Setup Steps

### 1. Get Stripe API Keys

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/test/apikeys)
2. Get your **Publishable key** (starts with `pk_test_`)
3. Get your **Secret key** (starts with `sk_test_`)
4. Add to `.env.local`:

```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_KEY
STRIPE_SECRET_KEY=sk_test_YOUR_KEY
```

### 2. Test Payment Flow

1. Start your dev server: `npm run dev`
2. Go to `/pricing`
3. Click "Get Lifetime Access"
4. Use test card: `4242 4242 4242 4242`
5. Any future expiry date, any CVC

### 3. Set Up Webhook (For Production)

When you deploy, you need to set up the webhook:

1. Go to [Stripe Webhooks](https://dashboard.stripe.com/test/webhooks)
2. Click "Add endpoint"
3. Enter your URL: `https://yourdomain.com/api/stripe/webhook`
4. Select event: `checkout.session.completed`
5. Copy the webhook secret (starts with `whsec_`)
6. Add to `.env.local`:

```env
STRIPE_WEBHOOK_SECRET=whsec_YOUR_SECRET
```

### 4. Test Webhook Locally (Optional)

```bash
# Install Stripe CLI
# Windows: scoop install stripe
# Mac: brew install stripe/stripe-cli/stripe

# Login
stripe login

# Forward webhooks to local server
stripe listen --forward-to localhost:3000/api/stripe/webhook

# Use the webhook secret from the CLI output
```

## How It Works

### Payment Flow

1. User clicks "Get Lifetime Access" on `/pricing`
2. Frontend calls `/api/stripe/checkout`
3. Backend creates Stripe checkout session
4. User redirected to Stripe-hosted checkout
5. User enters card details
6. On success, redirected to `/convert?success=true`

### Upgrade Flow

1. Stripe sends webhook to `/api/stripe/webhook`
2. Webhook verifies signature
3. Updates user in Clerk: `publicMetadata.tier = 'lifetime'`
4. User now has unlimited conversions, no watermarks

## Check User Tier in Code

```typescript
import { auth } from '@clerk/nextjs/server';

const { userId } = await auth();
const user = await clerkClient.users.getUser(userId);
const tier = user.publicMetadata?.tier || 'free';

if (tier === 'lifetime') {
  // No rate limits
  // No watermarks
}
```

## Update Rate Limiting

You'll need to update `lib/rateLimitStore.ts` to check user tier:

```typescript
// Skip rate limiting for lifetime users
if (tier === 'lifetime') {
  return { allowed: true, remaining: Infinity };
}
```

## Update Converter

You'll need to update `lib/converterInMemory.ts` to skip watermarks:

```typescript
const isPremium = tier === 'lifetime';
// Pass isPremium to conversion functions
```

## Production Checklist

- [ ] Add Stripe keys to production environment
- [ ] Set up production webhook endpoint
- [ ] Test with real card (use small amount first)
- [ ] Update success/cancel URLs
- [ ] Add receipt email in Stripe Dashboard
- [ ] Set up billing portal (for receipts)
- [ ] Add terms & privacy policy links to checkout

## Cost Breakdown

**Stripe Fees (per transaction):**
- €3.29 payment = €0.21 fee (2.9% + €0.30)
- You get: €3.08 per lifetime user

**With 100 users:**
- Revenue: €329
- Stripe fees: €21
- Net: €308

## Next Steps

1. ✅ Get Stripe test keys
2. ✅ Test checkout flow
3. 🔄 Update rate limiting to check tier
4. 🔄 Update converter to skip watermarks for lifetime
5. 🔄 Add success message on convert page
6. 🔄 Show tier badge in UI

## Support

- [Stripe Docs](https://stripe.com/docs)
- [Stripe Test Cards](https://stripe.com/docs/testing)
- [Clerk Metadata](https://clerk.com/docs/users/metadata)
