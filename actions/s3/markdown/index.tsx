'use server';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import s3 from '@/lib/s3';

// TODO 應該與 .../actions/image/index.tsx 合併 並且將 saveMarkdownFile 改名為 saveFile

type SaveMarkdownFileRequest =
  | { content: string; category: string; fileName: string }
  | { file: File; category: string; fileName: string };

const saveMarkdownFile = async (request: SaveMarkdownFileRequest) => {
  const { category, fileName } = request;

  let buffer: Buffer;

  // 根據不同的參數類型處理數據來源
  if ('content' in request) {
    // 從字符串內容創建文件
    const blob = new Blob([request.content], { type: 'text/markdown' });
    const arrayBuffer = await blob.arrayBuffer();
    buffer = Buffer.from(arrayBuffer);
  } else {
    // 從 File 對象讀取內容
    const arrayBuffer = await request.file.arrayBuffer();
    buffer = Buffer.from(arrayBuffer);
  }

  const filePath = `markdown/${category}/${fileName}.md`;

  const command = new PutObjectCommand({
    Bucket: process.env.S3_BUCKET_NAME!,
    Key: filePath,
    Body: buffer,
    ContentType: 'text/markdown',
  });

  try {
    await s3.send(command);
    return filePath;
  } catch (error) {
    console.error('Error uploading markdown file:', error);
    throw error;
  }
};

export { saveMarkdownFile };
