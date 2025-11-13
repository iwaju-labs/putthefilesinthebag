import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { clerkClient } from '@clerk/nextjs/server';

function getStripe() {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY not configured');
  }
  return new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2025-10-29.clover',
  });
}

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature')!;

  let event: Stripe.Event;

  try {
    const stripe = getStripe();
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;
    
    if (!webhookSecret) {
      throw new Error('STRIPE_WEBHOOK_SECRET not configured');
    }
    
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 400 }
    );
  }

  // Handle the event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.metadata?.userId;
    const tier = session.metadata?.tier;

    if (userId && tier === 'lifetime') {
      try {
        // Update user metadata in Clerk
        const client = await clerkClient();
        await client.users.updateUserMetadata(userId, {
          publicMetadata: {
            tier: 'lifetime',
            purchasedAt: new Date().toISOString(),
          },
        });

        console.log(`User ${userId} upgraded to lifetime tier`);
      } catch (error) {
        console.error('Failed to update user metadata:', error);
        return NextResponse.json(
          { error: 'Failed to update user' },
          { status: 500 }
        );
      }
    }
  }

  return NextResponse.json({ received: true });
}
