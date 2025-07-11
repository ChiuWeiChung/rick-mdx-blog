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
  return <ProfileEditor markdown={markdown} />;
}
