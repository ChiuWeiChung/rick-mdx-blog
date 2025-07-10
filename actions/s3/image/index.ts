'use server';
import { BUCKET_NAME } from '@/constants/environment';
import s3 from '@/lib/s3';
import {
  CopyObjectCommand,
  DeleteObjectCommand,
  //   DeleteObjectCommand,
  //   ListObjectsV2Command,
  DeleteObjectsCommand,
  HeadObjectCommand,
  ListObjectsV2Command,
  PutObjectCommand,
} from '@aws-sdk/client-s3';

/** 上傳圖片 */
async function uploadImage(request: { file: File; fileName: string; folder: string }) {
  const { file, fileName, folder } = request;
  if (!file || file.size === 0) {
    throw new Error('No file uploaded');
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  // 自訂 folder name
  const fileExt = file.name.split('.').pop();
  const fileNameWithExt = `${fileName}.${fileExt}`;
  const objectKey = `${folder}/${fileNameWithExt}`;

  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: objectKey,
    Body: buffer,
    ContentType: file.type,
  });

  await s3.send(command);
  return objectKey;
}

/** 檢查檔案是否存在 */
async function checkFileExists(filePath: string) {
  try {
    const command = new HeadObjectCommand({ Bucket: BUCKET_NAME, Key: filePath });
    await s3.send(command);
    return true; // 檔案存在
  } catch (error) {
    console.error(error);
    // if (err instanceof NotFound) return false; // 檔案不存在
    return false;
  }
}

/** 刪除某個資料夾底下所有物件 */
const deleteImagesByFolders = async (folders: string[]) => {
  try {
    const deleteCommand = new DeleteObjectsCommand({
      Bucket: BUCKET_NAME,
      Delete: {
        Objects: folders.map(folder => ({ Key: folder })),
      },
    });

    await s3.send(deleteCommand);
    console.log(`已刪除 ${folders.length} 個物件`);
  } catch (error) {
    console.error('刪除失敗:', error);
    return { success: false, message: 'Failed to delete markdown file' };
  }
};

const renameImages = async (request: { oldFolder: string; newFolder: string }) => {
  const { oldFolder, newFolder } = request;
  // 1. 列出所有以 oldPrefix 開頭的物件
  const listedObjects = await s3.send(
    new ListObjectsV2Command({
      Bucket: BUCKET_NAME,
      Prefix: oldFolder, // 例如 'categories/test'
    })
  );

  if (!listedObjects.Contents || listedObjects.Contents.length === 0) {
    console.log('無符合的檔案');
    return;
  }

  const copyResults = [];
  for (const object of listedObjects.Contents) {
    const oldKey = object.Key!;
    const newKey = oldKey.replace(oldFolder, newFolder);
	copyResults.push(newKey);
    // 2. 複製到新位置
    await s3.send(
      new CopyObjectCommand({
        Bucket: BUCKET_NAME,
        CopySource: `${BUCKET_NAME}/${encodeURIComponent(oldKey)}`,
        Key: newKey,
      })
    );    

    // 3. 刪除舊檔案
    await s3.send(
      new DeleteObjectCommand({
        Bucket: BUCKET_NAME,
        Key: oldKey,
      })
    );

    console.log(`搬移: ${oldKey} ➜ ${newKey}`);
  }
  return copyResults;
};

export { uploadImage, checkFileExists, deleteImagesByFolders, renameImages };
