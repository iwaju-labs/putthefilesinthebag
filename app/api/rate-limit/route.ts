import { NextResponse } from 'next/server';
import { getRemainingConversions } from '@/lib/rateLimitStore';
import { auth, clerkClient } from '@clerk/nextjs/server';

export async function GET() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({
        remaining: 0,
        total: 3,
        tier: 'free',
        authenticated: false,
      });
    }
    
    // Check user tier
    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    const tier = (user.publicMetadata?.tier as string) || 'free';
    
    // Lifetime users have unlimited conversions
    if (tier === 'lifetime') {
      return NextResponse.json({
        remaining: 999999,
        total: 999999,
        tier: 'lifetime',
        authenticated: true,
      });
    }
    
    const remaining = await getRemainingConversions(userId, 3);
    
    return NextResponse.json({
      remaining,
      total: 3,
      tier: 'free',
      authenticated: true,
    });
  } catch (error) {
    console.error('Rate limit check error:', error);
    return NextResponse.json(
      { error: 'Failed to check rate limit' },
      { status: 500 }
    );
  }
}
