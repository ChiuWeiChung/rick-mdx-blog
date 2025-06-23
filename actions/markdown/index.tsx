'use server';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import s3 from '@/lib/s3';

// TODO 應該與 .../actions/image/index.tsx 合併 並且將 saveMarkdownFile 改名為 saveFile

const saveMarkdownFile = async (request: { content: string; title: string; category: string }) => {
  const { content, title, category } = request;
  // Process the markdown content
  // const processedContent = content.replace(/<!-- internal-note: (.*) -->/g, '**$1**');

  // Create a Blob from the content
  const blob = new Blob([content], { type: 'text/markdown' });

  // Convert Blob to Buffer
  const arrayBuffer = await blob.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const filePath = `markdown/${category}/${title}.md`;
  // // Upload to S3
  const command = new PutObjectCommand({
    Bucket: process.env.S3_BUCKET_NAME!,
    Key: filePath, // TODO: change to the correct path
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

const saveUploadedMarkdownFile = async (request: {
  file: File;
  title: string;
  category: string;
}) => {
  const { file, title, category } = request;
  // const blob = new Blob([file], { type: 'text/markdown' });

  // Convert Blob to Buffer
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const filePath = `markdown/${category}/${title}.md`;
  // // Upload to S3
  const command = new PutObjectCommand({
    Bucket: process.env.S3_BUCKET_NAME!,
    Key: filePath, // TODO: change to the correct path
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

export { saveMarkdownFile, saveUploadedMarkdownFile };
