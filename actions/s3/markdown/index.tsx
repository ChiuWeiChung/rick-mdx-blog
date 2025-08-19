'use server';
import { DeleteObjectCommand, GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import s3 from '@/lib/s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { CloudFrontClient, CreateInvalidationCommand } from '@aws-sdk/client-cloudfront';
import { BUCKET_NAME } from '@/constants/environment';

// Note: CloudFront 是「全球服務」(global service)，所以 region 固定為 us-east-1
const cf = new CloudFrontClient({ region: 'us-east-1' });
const DIST_ID = process.env.CF_DISTRIBUTION_ID!;

type SaveMarkdownFileRequest =
  | { content: string; category: string; fileName: string }
  | { file: File; category: string; fileName: string };

/** 儲存 Markdown 檔案 */
const saveMarkdownFile = async (request: SaveMarkdownFileRequest, isUpdate: boolean = false) => {
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
    Bucket: BUCKET_NAME,
    Key: filePath,
    Body: buffer,
    ContentType: 'text/markdown',
  });

  try {
    await s3.send(command);

    // 如果是更新，則需要清除 CDN 的快取
    if (isUpdate) {
      const command = new CreateInvalidationCommand({
        DistributionId: DIST_ID,
        InvalidationBatch: {
          CallerReference: Date.now().toString(),
          Paths: { Quantity: 1, Items: [`/${filePath}`] },
        },
      });
      await cf.send(command);
    }

    return filePath;
  } catch (error) {
    console.error('Error uploading markdown file:', error);
    throw error;
  }
};

/** 取得 Markdown 檔案的 S3 資源 */
const getMarkdownResource = async (filePath: string) => {
  const command = new GetObjectCommand({
    Bucket: BUCKET_NAME,
    Key: filePath,
  });
  try {
    // 如果有 CF_DOMAIN 則直接回傳 URL（CDN 模式），否則使用 S3 的簽名 URL
    if (process.env.CF_DOMAIN && process.env.NODE_ENV !== 'development') {
      return `https://${process.env.CF_DOMAIN}/${filePath}`;
    }
    return await getSignedUrl(s3, command, { expiresIn: 60 * 60 * 6 }); // 有效 6 小時
  } catch (error) {
    console.error('Error getting markdown resource:', error);
    throw error;
  }
};

/** 取得 Markdown 檔案的內容 */
const getMarkdownContent = async (resource: string) => {
  const res = await fetch(resource);
  if (!res.ok) {
    console.error('Error getting markdown content:', res.statusText);
    throw new Error('Failed to get markdown content');
  }
  const markdown = await res.text();
  return markdown;
};

/** 刪除 Markdown 檔案 */
const deleteMarkdownFile = async (filePath: string) => {
  const command = new DeleteObjectCommand({
    Bucket: BUCKET_NAME,
    Key: filePath, // 例如 'markdown/test/hello.md'
  });

  try {
    await s3.send(command);
  } catch (error) {
    console.error('❌ 刪除失敗:', error);
    return { success: false, message: 'Failed to delete markdown file' };
  }
};

/** 儲存 Profile 檔案 */
const saveProfileFile = async (request: { content: string }) => {
  const { content } = request;

  const blob = new Blob([content], { type: 'text/markdown' });
  const arrayBuffer = await blob.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const filePath = `profile/profile.md`;

  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: filePath,
    Body: buffer,
    ContentType: 'text/markdown',
  });

  try {
    await s3.send(command);
    const cfCommand = new CreateInvalidationCommand({
      DistributionId: DIST_ID,
      InvalidationBatch: {
        CallerReference: Date.now().toString(),
        Paths: { Quantity: 1, Items: [`/${filePath}`] },
      },
    });
    await cf.send(cfCommand);
    return filePath;
  } catch (error) {
    console.error('Error uploading markdown file:', error);
    throw error;
  }
};

export {
  saveMarkdownFile,
  getMarkdownResource,
  getMarkdownContent,
  deleteMarkdownFile,
  saveProfileFile,
};
