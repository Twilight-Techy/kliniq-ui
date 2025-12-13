// app/api/recordings/upload/route.ts
// Vercel Blob upload route for audio recordings

import { put } from '@vercel/blob'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData()
        const file = formData.get('file') as File | null
        const filename = formData.get('filename') as string | null

        if (!file) {
            return NextResponse.json(
                { error: 'No file provided' },
                { status: 400 }
            )
        }

        // Generate unique filename with timestamp
        const timestamp = Date.now()
        const safeName = filename || `recording-${timestamp}.webm`
        const blobPath = `recordings/${timestamp}-${safeName}`

        // Upload to Vercel Blob
        const blob = await put(blobPath, file, {
            access: 'public',
            addRandomSuffix: true,
        })

        return NextResponse.json({
            success: true,
            url: blob.url,
            size: file.size,
        })
    } catch (error) {
        console.error('Upload error:', error)
        return NextResponse.json(
            { error: 'Failed to upload file' },
            { status: 500 }
        )
    }
}
