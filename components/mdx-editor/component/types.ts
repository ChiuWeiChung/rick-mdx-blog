import { z } from 'zod/v4';

export const imageDialogSchema = z
	.object({
		uploadedImage: z.instanceof(File).nullable(),
		src: z.string(),
		title: z.string('請輸入圖片標題').min(1, '請輸入圖片標題'),
	})
	.refine(
		data => {
			const hasUploadedImage = data.uploadedImage !== null;
			const hasSrc = data.src !== '' && data.src !== undefined;
			return (hasUploadedImage && !hasSrc) || (!hasUploadedImage && hasSrc);
		},
		{
			message: '請選擇上傳圖片或輸入圖片連結，但不能同時使用兩者',
			path: ['uploadedImage'],
		}
	);

export type ImageDialogSchema = z.infer<typeof imageDialogSchema>;
export const imageDialogKeys = imageDialogSchema.keyof().enum;
// export const imageDialogDefaultValues = getDefaultValues(imageDialogSchema);
