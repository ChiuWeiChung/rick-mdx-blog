import { getProfile } from '@/actions/profile';
import { getMarkdownContent, getMarkdownResource } from '@/actions/s3/markdown';
import ProfileEditor from '@/features/admin/profile/editor-form';
import React from 'react';

export default async function ProfileManagementPage() {
  let markdown: string | null = null;
  const profile = await getProfile();
  if (profile) {
    const resource = await getMarkdownResource(profile.profilePath);
    markdown = await getMarkdownContent(resource);
  }
  return (
    <div className="relative mx-4 flex flex-col gap-4">
      <h1 className="border-b-2 border-neutral-200 pb-2 text-3xl font-bold">自我介紹管理</h1>
      <ProfileEditor markdown={markdown} />
    </div>
  );
}
