'use server';
import pool from '@/lib/db';
import { toCamelCase } from '@/utils/format-utils';
import { CreatePortfolioRequest, Portfolio } from './types';
import { revalidatePath } from 'next/cache';

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
    const portfolio = toCamelCase<Portfolio>(rows);

    const result = {
      ...portfolio[0],
      startDate: new Date(portfolio[0].startDate).getTime(),
      endDate: portfolio[0].endDate ? new Date(portfolio[0].endDate).getTime() : null,
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

    const { rows } = await pool.query(
      'INSERT INTO portfolios (project_name, github_url, readme_url, start_date, end_date) VALUES ($1, $2, $3, $4, $5)',
      [portfolio.projectName, portfolio.githubUrl, portfolio.readmeUrl, startDate, endDate]
    );
    revalidatePath('/admin/portfolios');
    return rows;
  } catch (error) {
    console.error(error);
    return { success: false, message: 'Failed to create portfolio' };
  }
};

/** 更新作品集 */
export const updatePortfolio = async (portfolio: CreatePortfolioRequest & { id: number }) => {
  const sql = `
    UPDATE portfolios
    SET project_name = $1, github_url = $2, readme_url = $3, start_date = $4, end_date = $5
    WHERE id = $6
  `;

  const startDate = new Date(portfolio.startDate).toISOString();
  const endDate = portfolio.endDate ? new Date(portfolio.endDate).toISOString() : null;

  try {
    const { rows } = await pool.query(sql, [
      portfolio.projectName,
      portfolio.githubUrl,
      portfolio.readmeUrl,
      startDate,
      endDate,
      portfolio.id,
    ]);
    revalidatePath('/admin/portfolios');
    return rows;
  } catch (error) {
    console.error(error);
    return { success: false, message: 'Failed to update portfolio' };
  }
};

/** 刪除作品集 */
export const deletePortfolioById = async (id: number) => {
  try {
    const { rows } = await pool.query('DELETE FROM portfolios WHERE id = $1', [id]);
    return rows;
  } catch (error) {
    console.error(error);
    return { success: false, message: 'Failed to delete portfolio' };
  }
};
