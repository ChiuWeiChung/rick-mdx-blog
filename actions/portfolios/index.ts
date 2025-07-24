'use server';
import pool from '@/lib/db';
import { toCamelCase } from '@/utils/format-utils';
import { CreatePortfolioRequest, Portfolio } from './types';
import { revalidatePath } from 'next/cache';
import { deleteImagesByFolderNames, uploadImage } from '../s3/image';

/** 取得所有作品集 */
export const getPortfolios = async () => {
  try {
    const { rows } = await pool.query('SELECT * FROM portfolios ORDER BY start_date DESC');
    const portfolios = toCamelCase<Portfolio>(rows);
    return { data: portfolios, totalCount: portfolios.length };
  } catch (error) {
    console.error(error);
    throw new Error('Failed to get portfolios');
  }
};

/** 取得單一作品集 */
export const getPortfolioById = async (id: number) => {
  try {
    const { rows } = await pool.query('SELECT * FROM portfolios WHERE id = $1', [id]);
    const portfolios = toCamelCase<Portfolio>(rows);

    const result = {
      ...portfolios[0],
      startDate: new Date(portfolios[0].startDate).getTime(),
      endDate: portfolios[0].endDate ? new Date(portfolios[0].endDate).getTime() : null,
    };
    return result;
  } catch (error) {
    console.error(error);
    throw new Error('Failed to get portfolio');
  }
};

/** 新增作品集 */
export const createPortfolio = async (portfolio: CreatePortfolioRequest) => {
  try {
    const startDate = new Date(portfolio.startDate).toISOString();
    const endDate = portfolio.endDate ? new Date(portfolio.endDate).toISOString() : null;

    // 上傳檔案
    let coverPath = null;
    if (portfolio.coverFile) {
      coverPath = await uploadImage({
        file: portfolio.coverFile,
        fileName: 'cover',
        folder: `portfolios/${portfolio.projectName}`,
      });
    }

    const sql = `
    INSERT INTO
      portfolios (
        project_name,
        github_url,
        readme_url,
        description,
        start_date,
        end_date,
        cover_path
      )
    VALUES
      ($1, $2, $3, $4, $5, $6, $7)      
    `;

    await pool.query(sql, [
      portfolio.projectName,
      portfolio.githubUrl,
      portfolio.readmeUrl,
      portfolio.description,
      startDate,
      endDate,
      coverPath,
    ]);
    revalidatePath('/admin/portfolios');
    return { success: true, message: '新增成功' };
  } catch (error) {
    console.error(error);
    return { success: false, message: 'Failed to create portfolio' };
  }
};

/** 更新作品集 */
export const updatePortfolio = async (
  portfolio: CreatePortfolioRequest & { id: number; oldName: string }
) => {
  try {
    let coverPath = portfolio.coverPath;

    // 處理封面圖片
    if (portfolio.coverFile) {
      coverPath = await uploadImage({
        file: portfolio.coverFile,
        fileName: 'cover',
        folder: `portfolios/${portfolio.projectName}`,
      });
    }

    const sql = `
    UPDATE
      portfolios
    SET
      project_name = $1,
      github_url = $2,
      readme_url = $3,
      description = $4,
      start_date = $5,
      end_date = $6,
      cover_path = $7
    WHERE
      id = $8
    `;

    const startDate = new Date(portfolio.startDate).toISOString();
    const endDate = portfolio.endDate ? new Date(portfolio.endDate).toISOString() : null;

    await pool.query(sql, [
      portfolio.projectName,
      portfolio.githubUrl,
      portfolio.readmeUrl,
      portfolio.description,
      startDate,
      endDate,
      coverPath,
      portfolio.id,
    ]);
    revalidatePath('/admin/portfolios');
    return { success: true, message: '更新成功' };
  } catch (error) {
    console.error(error);
    return { success: false, message: 'Failed to update portfolio' };
  }
};

/** 刪除作品集 */
export const deletePortfolioById = async (id: number) => {
  try {
    const { rows } = await pool.query('DELETE FROM portfolios WHERE id = $1 RETURNING *', [id]);
    const [portfolio] = toCamelCase<Portfolio>(rows);
    // 如 coverPath 存在，則刪除該路徑的圖片
    if (portfolio.coverPath) await deleteImagesByFolderNames([portfolio.coverPath]);
    return rows;
  } catch (error) {
    console.error(error);
    return { success: false, message: 'Failed to delete portfolio' };
  }
};
