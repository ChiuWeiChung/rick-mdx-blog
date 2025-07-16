// app/api/get-image-url/route.ts
import { GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import s3 from '@/lib/s3';
import { NextRequest, NextResponse } from 'next/server';
import { unstable_cache } from 'next/cache';



export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const key = searchParams.get('key'); // 圖片路徑，例如：images/photo.jpg

  if (!key) {
    return NextResponse.json({ error: 'Missing key' }, { status: 400 });
  }

  const command = new GetObjectCommand({
    Bucket: process.env.S3_BUCKET_NAME!,
    Key: key,
  });

  try {
    const getCachedSignedUrl = unstable_cache(
      async () => {
        const signedUrl = await getSignedUrl(s3, command, { expiresIn: 60 * 60 * 6 }); // 有效 6 小時
        return signedUrl;
      },
      [key],
      {
        tags: [key],
        revalidate: 60 * 60 * 4,
      }
    );
    const signedUrl = await getCachedSignedUrl();
    // const signedUrl = await getSignedUrl(s3, command, { expiresIn: 60 * 60 * 6 }); // 有效 6 小時
    return NextResponse.redirect(signedUrl);
  } catch (error) {
    console.error('Error generating signed URL:', error);
    return NextResponse.json({ error: 'Failed to generate signed URL' }, { status: 500 });
  }
}
