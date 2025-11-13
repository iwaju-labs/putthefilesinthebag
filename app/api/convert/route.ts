import { NextRequest, NextResponse } from 'next/server';
import { processFileInMemory } from '@/lib/converterInMemory';
import { checkRateLimit } from '@/lib/rateLimitStore';
import { auth, clerkClient } from '@clerk/nextjs/server';

const MAX_FILE_SIZE_IMAGE = 50 * 1024 * 1024;  // 50MB for images
const MAX_FILE_SIZE_VIDEO = 100 * 1024 * 1024; // 100MB for videos

export async function POST(request: NextRequest) {
    try {
        // Get user from Clerk
        const { userId } = await auth();
        
        if (!userId) {
            return NextResponse.json(
                { error: 'Unauthorized. Please sign in to continue.' },
                { status: 401 }
            );
        }
        
        // Check user tier
        const client = await clerkClient();
        const user = await client.users.getUser(userId);
        const tier = (user.publicMetadata?.tier as string) || 'free';
        const isPremium = tier === 'lifetime';
        
        // Check rate limit (skip for lifetime users)
        let rateLimitResult = null;
        if (!isPremium) {
            rateLimitResult = await checkRateLimit(userId, 3);
            
            if (!rateLimitResult.allowed) {
                const resetDate = new Date(rateLimitResult.resetAt);
                return NextResponse.json(
                    { 
                        error: 'Rate limit exceeded',
                        message: `You've reached your daily limit of 3 conversions. Resets at ${resetDate.toLocaleString()}`,
                        resetAt: rateLimitResult.resetAt
                    },
                    { status: 429 }
                );
            }
        }

        const formData = await request.formData();
        const file = formData.get('file') as File;
        const formatsJson = formData.get('formats') as string;

        if (!file) {
            return NextResponse.json(
                { error: 'No file uploaded'},
                { status: 400 }
            );
        }

        if (!formatsJson) {
            return NextResponse.json(
                { error: 'No formats specified'},
                { status: 400 }
            );
        }

        const formats = JSON.parse(formatsJson) as string[];

        if (formats.length === 0) {
            return NextResponse.json(
                { error: 'At least one format must be selected'},
                { status: 400 }
            );
        }

        // Validate file type
        const isVideo = file.type.startsWith('video/');
        const isImage = file.type.startsWith('image/');

        if (!isVideo && !isImage) {
            return NextResponse.json(
                { error: 'Invalid file type. Only images and videos are supported' },
                { status: 400 }
            );
        }

        // Validate file size based on type
        const maxSize = isVideo ? MAX_FILE_SIZE_VIDEO : MAX_FILE_SIZE_IMAGE;
        const maxSizeMB = Math.round(maxSize / 1024 / 1024);
        
        if (file.size > maxSize) {
            return NextResponse.json(
                { error: `File too large. Maximum size for ${isVideo ? 'videos' : 'images'} is ${maxSizeMB}MB` },
                { status: 400 }
            );
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const fileType = isVideo ? 'video' : 'image';
        const results = await processFileInMemory(buffer, file.name, fileType, formats, isPremium);

        return NextResponse.json({
            success: true,
            results,
            rateLimit: {
                remaining: isPremium ? 999999 : rateLimitResult?.remaining ?? 0,
                resetAt: isPremium ? null : rateLimitResult?.resetAt ?? null,
            },
        });

    } catch (error) {
        console.error("Conversion error:", error);
        return NextResponse.json(
            { error: 'Conversion failed', details: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}