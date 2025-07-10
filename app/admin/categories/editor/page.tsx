import React from 'react';
import { Category } from '@/actions/categories/types';
import CategoryEditor from '@/features/admin/categories/category-editor';
import { getCategoryById } from '@/actions/categories';

interface CategoryEditorPageProps {
  searchParams: Promise<{
    categoryId?: string;
  }>;
}

const CategoryEditorPage = async ({ searchParams }: CategoryEditorPageProps) => {
  const { categoryId } = await searchParams;
  // 如果有 categoryId ，則獲取筆記資訊，並且獲取筆記的 markdown 內容
  let category: Category | null | undefined = undefined;
  if (categoryId) {
    category = await getCategoryById(Number(categoryId));
    if (!category) throw new Error('Category not found');
  }

  return <CategoryEditor category={category} />;
};

export default CategoryEditorPage;
