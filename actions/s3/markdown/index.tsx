'use server';
import { DeleteObjectCommand, GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import s3 from '@/lib/s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

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

/** 取得 Markdown 檔案的 S3 資源 */
const getMarkdownResource = async (filePath: string) => {
  const command = new GetObjectCommand({
    Bucket: process.env.S3_BUCKET_NAME!,
    Key: filePath,
  });
  try{
    const signedUrl = await getSignedUrl(s3, command, { expiresIn: 60 * 60 * 6 }); // 有效 6 小時
    return signedUrl;
  } catch (error) {
    console.error('Error getting markdown resource:', error);
    throw error;
  }
};

/** 取得 Markdown 檔案的內容 */
const getMarkdownContent = async (resource: string) => {
  const res = await fetch(resource);
  const markdown = await res.text();
  return markdown;
};

const deleteMarkdownFile = async (filePath: string) => {
    const command = new DeleteObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME!,
      Key: filePath, // 例如 'markdown/test/hello.md'
    });

    try {
      await s3.send(command);
    } catch (error) {
      console.error('❌ 刪除失敗:', error);
      return { success: false, message: 'Failed to delete markdown file' };
    }
};

export { saveMarkdownFile, getMarkdownResource, getMarkdownContent, deleteMarkdownFile };
