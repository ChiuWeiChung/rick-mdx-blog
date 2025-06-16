// app/upload/action.ts
'use server';

import s3 from '@/lib/s3';
import { PutObjectCommand } from '@aws-sdk/client-s3';
// import { revalidatePath } from 'next/cache';

export async function uploadImage(request: { file: File; fileName: string; folder: string }) {
	const { file, fileName, folder } = request;
	if (!file || file.size === 0) {
		throw new Error('No file uploaded');
	}

	const arrayBuffer = await file.arrayBuffer();
	const buffer = Buffer.from(arrayBuffer);

	// 你可以自訂 folder name，這裡以 "blog-images/" 為例
	// const folder = 'blog-images';
	const fileExt = file.name.split('.').pop();
	const fileNameWithExt = `${fileName}.${fileExt}`;
	const objectKey = `${folder}/${fileNameWithExt}`;

	const command = new PutObjectCommand({
		Bucket: process.env.S3_BUCKET_NAME!,
		Key: objectKey,
		Body: buffer,
		ContentType: file.type,
	});

	// console.log('command', command);
	await s3.send(command);
	return objectKey;
}
