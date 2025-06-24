// app/upload/action.ts
'use server';

import s3 from '@/lib/s3';
import { HeadObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
// import { revalidatePath } from 'next/cache';

// TODO 應該與 .../actions/markdown/index.tsx 合併 並且將 uploadImage 改名為 saveFile
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

export async function checkFileExists(filePath: string) {
  try {
    const command = new HeadObjectCommand({ Bucket: process.env.S3_BUCKET_NAME!, Key: filePath });
    await s3.send(command);
    return true; // 檔案存在
  } catch (error) {
    console.error(error);
    // if (err instanceof NotFound) return false; // 檔案不存在
    return false;
  }
}
